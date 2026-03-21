import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { PaginatedResponse } from "../types";

const prisma = new PrismaClient();

export class ProdutoService {
  // Criar produto
  async create(
    nome: string,
    descricao: string | undefined,
    preco: number,
    quantidade: number,
    categoriaId: string
  ): Promise<any> {
    // Verificar se categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoria) {
      throw new AppError(404, "Categoria não encontrada");
    }

    // Verificar se produto já existe
    const produtoExists = await prisma.produto.findUnique({
      where: { nome },
    });

    if (produtoExists) {
      throw new AppError(409, "Produto com este nome já existe");
    }

    return await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        quantidade,
        categoriaId,
      },
      include: { categoria: true },
    });
  }

  // Listar produtos com paginação
  async list(
    page: number = 1,
    limit: number = 10,
    categoriaId?: string
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;

    const where = categoriaId ? { categoriaId } : {};

    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { categoria: true },
      }),
      prisma.produto.count({ where }),
    ]);

    return {
      data: produtos,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  // Obter produto por ID
  async getById(id: string): Promise<any> {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { categoria: true },
    });

    if (!produto) {
      throw new AppError(404, "Produto não encontrado");
    }

    return produto;
  }

  // Editar produto
  async update(
    id: string,
    nome: string,
    descricao: string | undefined,
    preco: number,
    quantidade: number,
    categoriaId: string
  ): Promise<any> {
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new AppError(404, "Produto não encontrado");
    }

    // Verificar se categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoria) {
      throw new AppError(404, "Categoria não encontrada");
    }

    // Verificar se novo nome já existe
    if (nome !== produto.nome) {
      const nomeExists = await prisma.produto.findUnique({
        where: { nome },
      });
      if (nomeExists) {
        throw new AppError(409, "Produto com este nome já existe");
      }
    }

    return await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        preco,
        quantidade,
        categoriaId,
      },
      include: { categoria: true },
    });
  }

  // Deletar produto
  async delete(id: string): Promise<any> {
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new AppError(404, "Produto não encontrado");
    }

    return await prisma.produto.delete({ where: { id } });
  }
}
