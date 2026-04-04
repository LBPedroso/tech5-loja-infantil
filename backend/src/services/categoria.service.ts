import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { CategoriaDto, PaginatedResponse } from "../types";

const prisma = new PrismaClient();

export class CategoriaService {
  private async buscarPorId(id: string) {
    const categoria = await prisma.categoria.findUnique({ where: { id } });
    if (!categoria) throw new AppError(404, "Categoria não encontrada");
    return categoria;
  }

  private async verificarNomeDisponivel(nome: string, idAtual: string): Promise<void> {
    const existe = await prisma.categoria.findUnique({ where: { nome } });
    if (existe && existe.id !== idAtual) throw new AppError(409, "Categoria com este nome já existe");
  }

  // Criar categoria
  async create(nome: string, descricao?: string): Promise<CategoriaDto> {
    await this.verificarNomeDisponivel(nome, "");
    return await prisma.categoria.create({ data: { nome, descricao } }) as CategoriaDto;
  }

  // Listar categorias com paginação
  async list(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CategoriaDto>> {
    const skip = (page - 1) * limit;
    const [categorias, total] = await Promise.all([
      prisma.categoria.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.categoria.count(),
    ]);
    return { data: categorias as CategoriaDto[], total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Obter categoria por ID
  async getById(id: string): Promise<CategoriaDto> {
    const categoria = await prisma.categoria.findUnique({ where: { id }, include: { produtos: true } });
    if (!categoria) throw new AppError(404, "Categoria não encontrada");
    return categoria as unknown as CategoriaDto;
  }

  // Editar categoria
  async update(id: string, nome: string, descricao?: string): Promise<CategoriaDto> {
    await this.buscarPorId(id);
    await this.verificarNomeDisponivel(nome, id);
    return await prisma.categoria.update({ where: { id }, data: { nome, descricao } }) as CategoriaDto;
  }

  // Deletar categoria
  async delete(id: string): Promise<CategoriaDto> {
    await this.buscarPorId(id);
    return await prisma.categoria.delete({ where: { id } }) as CategoriaDto;
  }
}

