import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { PaginatedResponse, PedidoDto, PedidoItemInput } from "../types";

const prisma = new PrismaClient();

const PEDIDO_INCLUDE = {
  itens: { include: { produto: true } },
  user: { select: { id: true, email: true, name: true } },
  cliente: true,
} as const;

type PedidoWithUser = Prisma.PedidoGetPayload<{ include: typeof PEDIDO_INCLUDE }>;

const mapPedido = (pedido: PedidoWithUser): PedidoDto => ({
  id: pedido.id,
  userId: pedido.userId,
  clienteId: pedido.clienteId,
  total: pedido.total,
  status: pedido.status,
  createdAt: pedido.createdAt,
  updatedAt: pedido.updatedAt,
  itens: pedido.itens.map((item) => ({
    id: item.id,
    pedidoId: item.pedidoId,
    produtoId: item.produtoId,
    quantidade: item.quantidade,
    preco: item.preco,
    produto: {
      id: item.produto.id,
      nome: item.produto.nome,
      descricao: item.produto.descricao,
      preco: item.produto.preco,
      custo: item.produto.custo,
      quantidade: item.produto.quantidade,
      categoriaId: item.produto.categoriaId,
      createdAt: item.produto.createdAt,
      updatedAt: item.produto.updatedAt,
    },
  })),
  user: { id: pedido.user.id, email: pedido.user.email, nome: pedido.user.name },
  cliente: pedido.cliente
    ? {
        id: pedido.cliente.id,
        nome: pedido.cliente.nome,
        telefone: pedido.cliente.telefone,
        email: pedido.cliente.email,
        observacoes: pedido.cliente.observacoes,
        createdAt: pedido.cliente.createdAt,
        updatedAt: pedido.cliente.updatedAt,
      }
    : null,
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
    if (!pedido) throw new AppError(404, "Pedido nao encontrado");
    if (pedido.userId !== userId) throw new AppError(403, "Acesso proibido");
    return pedido;
  }

  private async validarCliente(clienteId?: string): Promise<void> {
    if (!clienteId) return;

    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) throw new AppError(404, "Cliente não encontrado");
  }

  // Criar pedido
  async create(userId: string, itens: PedidoItemInput[], clienteId?: string): Promise<PedidoDto> {
    const itensValidados = await Promise.all(itens.map((i) => this.validarItem(i)));
    await this.validarCliente(clienteId);
    const total = this.calcularTotal(itensValidados);
    const pedido = await prisma.pedido.create({
      data: { userId, clienteId, total, itens: { create: itensValidados } },
      include: PEDIDO_INCLUDE,
    });
    await this.atualizarEstoque(itens, "decrement");
    return mapPedido(pedido);
  }

  // Listar pedidos do usuário com paginação e filtro de status
  async list(userId: string, page: number = 1, limit: number = 10, status?: string): Promise<PaginatedResponse<PedidoDto>> {
    const skip = (page - 1) * limit;
    const where: Prisma.PedidoWhereInput = { userId };
    if (status) where.status = status;
    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: PEDIDO_INCLUDE }),
      prisma.pedido.count({ where }),
    ]);
    return { data: pedidos.map(mapPedido), total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Obter pedido por ID (apenas do proprio usuario)
  async getById(id: string, userId: string): Promise<PedidoDto> {
    return mapPedido(await this.buscarPedidoAutorizado(id, userId));
  }

  // Atualizar status do pedido
  async updateStatus(id: string, userId: string, status: string): Promise<PedidoDto> {
    await this.buscarPedidoAutorizado(id, userId);
    const atualizado = await prisma.pedido.update({ where: { id }, data: { status }, include: PEDIDO_INCLUDE });
    return mapPedido(atualizado);
  }

  // Deletar pedido (apenas do proprio usuario)
  async delete(id: string, userId: string): Promise<PedidoDto> {
    const pedido = await prisma.pedido.findUnique({ where: { id }, include: { itens: true } });
    if (!pedido) throw new AppError(404, "Pedido nao encontrado");
    if (pedido.userId !== userId) throw new AppError(403, "Acesso proibido");
    await this.atualizarEstoque(pedido.itens, "increment");

    const pedidoCompleto = await this.buscarPedidoAutorizado(id, userId);
    await prisma.pedido.delete({ where: { id } });
    return mapPedido(pedidoCompleto);
  }
}
