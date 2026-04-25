import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { ClienteDto, ClienteInputDto, PaginatedResponse } from "../types";

const prisma = new PrismaClient();

export class ClienteService {
  private async buscarPorId(id: string) {
    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new AppError(404, "Cliente não encontrado");
    return cliente;
  }

  async create(data: ClienteInputDto): Promise<ClienteDto> {
    return await prisma.cliente.create({ data }) as ClienteDto;
  }

  async list(page: number = 1, limit: number = 10): Promise<PaginatedResponse<ClienteDto>> {
    const skip = (page - 1) * limit;
    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.cliente.count(),
    ]);

    return { data: clientes as ClienteDto[], total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getById(id: string): Promise<ClienteDto> {
    return await this.buscarPorId(id) as ClienteDto;
  }

  async update(id: string, data: ClienteInputDto): Promise<ClienteDto> {
    await this.buscarPorId(id);
    return await prisma.cliente.update({ where: { id }, data }) as ClienteDto;
  }

  async delete(id: string): Promise<ClienteDto> {
    await this.buscarPorId(id);
    return await prisma.cliente.delete({ where: { id } }) as ClienteDto;
  }
}