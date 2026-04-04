import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { PaginatedResponse, PedidoDto, PedidoItemInput } from "../types";

const prisma = new PrismaClient();

const PEDIDO_INCLUDE = {
  itens: { include: { produto: true } },
  user: { select: { id: true, email: true, name: true } },
} as const;

type PedidoWithUser = {
  id: string; userId: string; total: number; status: string;
  createdAt: Date; updatedAt: Date;
  itens: Array<{ id: string; pedidoId: string; produtoId: string; quantidade: number; preco: number; produto: unknown }>;
  user: { id: string; email: string; name: string };
};

const mapPedido = (pedido: PedidoWithUser): PedidoDto => ({
  ...(pedido as unknown as PedidoDto),
  user: { id: pedido.user.id, email: pedido.user.email, nome: pedido.user.name },
});

export class PedidoService {
  private async validarItem(item: PedidoItemInput): Promise<PedidoItemInput & { preco: number }> {
    const produto = await prisma.produto.findUnique({ where: { id: item.produtoId } });
    if (!produto) throw new AppError(404, `Produto ${item.produtoId} nÃ£o encontrado`);
    if (produto.quantidade < item.quantidade) throw new AppError(400, `Estoque insuficiente para ${produto.nome}`);
    return { ...item, preco: produto.preco };
  }

  private calcularTotal(itens: Array<{ preco: number; quantidade: number }>): number {
    return itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  }

  private async atualizarEstoque(itens: PedidoItemInput[], op: "decrement" | "increment"): Promise<void> {
    await Promise.all(
      itens.map((item) => prisma.produto.update({
        where: { id: item.produtoId },
        data: { quantidade: { [op]: item.quantidade } },
      }))
    );
  }

  private async buscarPedidoAutorizado(id: string, userId: string): Promise<PedidoWithUser> {
    const pedido = await prisma.pedido.findUnique({ where: { id }, include: PEDIDO_INCLUDE });
    if (!pedido) throw new AppError(404, "Pedido nÃ£o encontrado");
    if (pedido.userId !== userId) throw new AppError(403, "Acesso proibido");
    return pedido as unknown as PedidoWithUser;
  }

  // Criar pedido
  async create(userId: string, itens: PedidoItemInput[]): Promise<PedidoDto> {
    const itensValidados = await Promise.all(itens.map((i) => this.validarItem(i)));
    const total = this.calcularTotal(itensValidados);
    const pedido = await prisma.pedido.create({
      data: { userId, total, itens: { create: itensValidados } },
      include: PEDIDO_INCLUDE,
    });
    await this.atualizarEstoque(itens, "decrement");
    return mapPedido(pedido as unknown as PedidoWithUser);
  }

  // Listar pedidos do usuÃ¡rio com paginaÃ§Ã£o
  async list(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<PedidoDto>> {
    const skip = (page - 1) * limit;
    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({ where: { userId }, skip, take: limit, orderBy: { createdAt: "desc" }, include: PEDIDO_INCLUDE }),
      prisma.pedido.count({ where: { userId } }),
    ]);
    return { data: (pedidos as unknown as PedidoWithUser[]).map(mapPedido), total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Obter pedido por ID (apenas do prÃ³prio usuÃ¡rio)
  async getById(id: string, userId: string): Promise<PedidoDto> {
    return mapPedido(await this.buscarPedidoAutorizado(id, userId));
  }

  // Atualizar status do pedido
  async updateStatus(id: string, userId: string, status: string): Promise<PedidoDto> {
    await this.buscarPedidoAutorizado(id, userId);
    const atualizado = await prisma.pedido.update({ where: { id }, data: { status }, include: PEDIDO_INCLUDE });
    return mapPedido(atualizado as unknown as PedidoWithUser);
  }

  // Deletar pedido (apenas do prÃ³prio usuÃ¡rio)
  async delete(id: string, userId: string): Promise<PedidoDto> {
    const pedido = await prisma.pedido.findUnique({ where: { id }, include: { itens: true } });
    if (!pedido) throw new AppError(404, "Pedido nÃ£o encontrado");
    if (pedido.userId !== userId) throw new AppError(403, "Acesso proibido");
    await this.atualizarEstoque(pedido.itens, "increment");
    return await prisma.pedido.delete({ where: { id } }) as unknown as PedidoDto;
  }
}
