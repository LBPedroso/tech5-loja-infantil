import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { PaginatedResponse } from "../types";

const prisma = new PrismaClient();

export class CategoriaService {
  // Criar categoria
  async create(nome: string, descricao?: string): Promise<any> {
    const categoriaExists = await prisma.categoria.findUnique({
      where: { nome },
    });

    if (categoriaExists) {
      throw new AppError(409, "Categoria com este nome já existe");
    }

    return await prisma.categoria.create({
      data: { nome, descricao },
    });
  }

  // Listar categorias com paginação
  async list(page: number = 1, limit: number = 10): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;

    const [categorias, total] = await Promise.all([
      prisma.categoria.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { produtos: true } } },
      }),
      prisma.categoria.count(),
    ]);

    return {
      data: categorias,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  // Obter categoria por ID
  async getById(id: string): Promise<any> {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { produtos: true },
    });

    if (!categoria) {
      throw new AppError(404, "Categoria não encontrada");
    }

    return categoria;
  }

  // Editar categoria
  async update(id: string, nome: string, descricao?: string): Promise<any> {
    const categoria = await prisma.categoria.findUnique({ where: { id } });
    if (!categoria) {
      throw new AppError(404, "Categoria não encontrada");
    }

    // Verificar se novo nome já existe
    if (nome !== categoria.nome) {
      const nomeExists = await prisma.categoria.findUnique({
        where: { nome },
      });
      if (nomeExists) {
        throw new AppError(409, "Categoria com este nome já existe");
      }
    }

    return await prisma.categoria.update({
      where: { id },
      data: { nome, descricao },
    });
  }

  // Deletar categoria
  async delete(id: string): Promise<any> {
    const categoria = await prisma.categoria.findUnique({ where: { id } });
    if (!categoria) {
      throw new AppError(404, "Categoria não encontrada");
    }

    return await prisma.categoria.delete({ where: { id } });
  }
}
