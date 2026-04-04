import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { PaginatedResponse, ProdutoDto, ProdutoInputDto } from "../types";

const prisma = new PrismaClient();

export class ProdutoService {
  private async buscarPorId(id: string): Promise<ProdutoDto> {
    const produto = await prisma.produto.findUnique({ where: { id }, include: { categoria: true } });
    if (!produto) throw new AppError(404, "Produto não encontrado");
    return produto as unknown as ProdutoDto;
  }

  private async garantirCategoriaExiste(categoriaId: string): Promise<void> {
    const cat = await prisma.categoria.findUnique({ where: { id: categoriaId } });
    if (!cat) throw new AppError(404, "Categoria não encontrada");
  }

  private async verificarNomeDisponivel(nome: string, idAtual: string): Promise<void> {
    const existe = await prisma.produto.findUnique({ where: { nome } });
    if (existe && existe.id !== idAtual) throw new AppError(409, "Produto com este nome já existe");
  }

  // Criar produto
  async create(dto: ProdutoInputDto): Promise<ProdutoDto> {
    await this.garantirCategoriaExiste(dto.categoriaId);
    await this.verificarNomeDisponivel(dto.nome, "");
    return await prisma.produto.create({ data: dto, include: { categoria: true } }) as unknown as ProdutoDto;
  }

  // Listar produtos com paginação
  async list(page: number = 1, limit: number = 10, categoriaId?: string): Promise<PaginatedResponse<ProdutoDto>> {
    const skip = (page - 1) * limit;
    const where = categoriaId ? { categoriaId } : {};
    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: { categoria: true } }),
      prisma.produto.count({ where }),
    ]);
    return { data: produtos as unknown as ProdutoDto[], total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Obter produto por ID
  async getById(id: string): Promise<ProdutoDto> {
    return this.buscarPorId(id);
  }

  // Editar produto
  async update(id: string, dto: ProdutoInputDto): Promise<ProdutoDto> {
    await this.buscarPorId(id);
    await this.garantirCategoriaExiste(dto.categoriaId);
    await this.verificarNomeDisponivel(dto.nome, id);
    return await prisma.produto.update({ where: { id }, data: dto, include: { categoria: true } }) as unknown as ProdutoDto;
  }

  // Deletar produto
  async delete(id: string): Promise<ProdutoDto> {
    await this.buscarPorId(id);
    return await prisma.produto.delete({ where: { id } }) as unknown as ProdutoDto;
  }
}
