import { Router, Request, Response } from "express";
import { FinanceiroService } from "../services/financeiro.service";
import { authMiddleware } from "../middleware/auth";
import { transacaoSchema, paginationSchema } from "../utils/validators";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

const router = Router();
const financeiroService = new FinanceiroService();

// Resumo financeiro
router.get("/resumo", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const resumo = await financeiroService.resumo(req.user!.id);
    res.json({ success: true, data: resumo });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  }
});

// Criar transação
router.post("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = transacaoSchema.parse({
      ...req.body,
      valor: typeof req.body.valor === "string" ? parseFloat(req.body.valor) : req.body.valor,
    });
    const transacao = await financeiroService.create(req.user!.id, payload);
    res.status(201).json({ success: true, data: transacao, message: "Transação criada com sucesso" });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
      res.status(400).json({ success: false, error: "Erro de validação", errors });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  }
});

// Listar transações
router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = paginationSchema.parse({
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    });
    const tipo = req.query.tipo as string | undefined;
    const result = await financeiroService.list(req.user!.id, page, limit, tipo);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  }
});

// Deletar transação
router.delete("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await financeiroService.delete(req.user!.id, String(req.params.id));
    res.json({ success: true, message: "Transação excluída com sucesso" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  }
});

export default router;
