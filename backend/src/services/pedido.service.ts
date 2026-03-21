import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { PaginatedResponse } from "../types";

const prisma = new PrismaClient();

const mapPedido = (pedido: {
  user: { id: string; email: string; name: string };
} & Record<string, unknown>) => ({
  ...pedido,
  user: {
    id: pedido.user.id,
    email: pedido.user.email,
    nome: pedido.user.name,
  },
});

export class PedidoService {
  // Criar pedido
  async create(
    userId: string,
    itens: Array<{ produtoId: string; quantidade: number }>
  ): Promise<any> {
    // Validar se todos os produtos existem e têm estoque
    let total = 0;

    const produtosValidados = await Promise.all(
      itens.map(async (item) => {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw new AppError(404, `Produto ${item.produtoId} não encontrado`);
        }

        if (produto.quantidade < item.quantidade) {
          throw new AppError(
            400,
            `Estoque insuficiente para ${produto.nome}`
          );
        }

        total += produto.preco * item.quantidade;

        return { ...item, preco: produto.preco };
      })
    );

    // Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        userId,
        total,
        itens: {
          create: produtosValidados,
        },
      },
      include: {
        itens: { include: { produto: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    // Atualizar estoque dos produtos
    await Promise.all(
      itens.map((item) =>
        prisma.produto.update({
          where: { id: item.produtoId },
          data: {
            quantidade: {
              decrement: item.quantidade,
            },
          },
        })
      )
    );

    return mapPedido(pedido);
  }

  // Listar pedidos do usuário com paginação
  async list(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          itens: { include: { produto: true } },
          user: { select: { id: true, email: true, name: true } },
        },
      }),
      prisma.pedido.count({ where: { userId } }),
    ]);

    return {
      data: pedidos.map(mapPedido),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  // Obter pedido por ID (apenas do próprio usuário)
  async getById(id: string, userId: string): Promise<any> {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: { include: { produto: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!pedido) {
      throw new AppError(404, "Pedido não encontrado");
    }

    if (pedido.userId !== userId) {
      throw new AppError(403, "Acesso proibido");
    }

    return mapPedido(pedido);
  }

  // Atualizar status do pedido
  async updateStatus(
    id: string,
    userId: string,
    status: string
  ): Promise<any> {
    const pedido = await prisma.pedido.findUnique({ where: { id } });

    if (!pedido) {
      throw new AppError(404, "Pedido não encontrado");
    }

    if (pedido.userId !== userId) {
      throw new AppError(403, "Acesso proibido");
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: { status },
      include: {
        itens: { include: { produto: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return mapPedido(pedidoAtualizado);
  }

  // Deletar pedido (apenas do próprio usuário)
  async delete(id: string, userId: string): Promise<any> {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!pedido) {
      throw new AppError(404, "Pedido não encontrado");
    }

    if (pedido.userId !== userId) {
      throw new AppError(403, "Acesso proibido");
    }

    // Devolver estoque dos produtos
    await Promise.all(
      pedido.itens.map((item) =>
        prisma.produto.update({
          where: { id: item.produtoId },
          data: {
            quantidade: {
              increment: item.quantidade,
            },
          },
        })
      )
    );

    return await prisma.pedido.delete({ where: { id } });
  }
}
