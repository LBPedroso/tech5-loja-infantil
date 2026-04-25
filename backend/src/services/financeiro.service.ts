import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import {
  FinanceiroResumoDto,
  PaginatedResponse,
  TransacaoDto,
  TransacaoInputDto,
} from "../types";

const prisma = new PrismaClient();

export class FinanceiroService {
  // Criar transação
  async create(userId: string, dto: TransacaoInputDto): Promise<TransacaoDto> {
    const data = dto.data ? new Date(dto.data) : new Date();
    return (await prisma.transacao.create({
      data: { tipo: dto.tipo, valor: dto.valor, descricao: dto.descricao, data, userId },
    })) as unknown as TransacaoDto;
  }

  // Listar transações com paginação e filtro de tipo
  async list(
    userId: string,
    page: number = 1,
    limit: number = 10,
    tipo?: string
  ): Promise<PaginatedResponse<TransacaoDto>> {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { userId };
    if (tipo) where.tipo = tipo;
    const [transacoes, total] = await Promise.all([
      prisma.transacao.findMany({ where, skip, take: limit, orderBy: { data: "desc" } }),
      prisma.transacao.count({ where }),
    ]);
    return {
      data: transacoes as unknown as TransacaoDto[],
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  // Resumo financeiro (total geral + mês atual)
  async resumo(userId: string): Promise<FinanceiroResumoDto> {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);

    const [entradasGeral, saidasGeral, entradasMes, saidasMes, vendasMes] = await Promise.all([
      prisma.transacao.aggregate({ where: { userId, tipo: "ENTRADA" }, _sum: { valor: true } }),
      prisma.transacao.aggregate({ where: { userId, tipo: "SAIDA" }, _sum: { valor: true } }),
      prisma.transacao.aggregate({
        where: { userId, tipo: "ENTRADA", data: { gte: inicioMes, lte: fimMes } },
        _sum: { valor: true },
      }),
      prisma.transacao.aggregate({
        where: { userId, tipo: "SAIDA", data: { gte: inicioMes, lte: fimMes } },
        _sum: { valor: true },
      }),
      prisma.pedido.aggregate({
        where: {
          userId,
          status: { in: ["ENTREGUE", "entregue"] },
          createdAt: { gte: inicioMes, lte: fimMes },
        },
        _sum: { total: true },
        _count: { _all: true },
      }),
    ]);

    const totalEntradas = entradasGeral._sum.valor ?? 0;
    const totalSaidas = saidasGeral._sum.valor ?? 0;
    const entMes = entradasMes._sum.valor ?? 0;
    const saiMes = saidasMes._sum.valor ?? 0;
    const faturamentoMensal = vendasMes._sum.total ?? 0;
    const totalVendasMensal = vendasMes._count._all;
    const ticketMedioMensal = totalVendasMensal > 0 ? faturamentoMensal / totalVendasMensal : 0;
    const lucroLiquidoMensal = faturamentoMensal - saiMes;

    return {
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
      faturamentoMensal,
      lucroLiquidoMensal,
      ticketMedioMensal,
      totalVendasMensal,
      mesAtual: { entradas: entMes, saidas: saiMes, saldo: entMes - saiMes },
    };
  }

  // Deletar transação
  async delete(userId: string, id: string): Promise<TransacaoDto> {
    const t = await prisma.transacao.findUnique({ where: { id } });
    if (!t) throw new AppError(404, "Transação não encontrada");
    if (t.userId !== userId) throw new AppError(403, "Sem permissão");
    return (await prisma.transacao.delete({ where: { id } })) as unknown as TransacaoDto;
  }
}
