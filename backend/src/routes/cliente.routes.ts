import { Router, Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";
import { authMiddleware } from "../middleware/auth";
import { clienteSchema, paginationSchema } from "../utils/validators";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

const router = Router();
const clienteService = new ClienteService();

router.post("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = clienteSchema.parse(req.body);
    const cliente = await clienteService.create({
      nome: payload.nome,
      telefone: payload.telefone,
      email: payload.email || undefined,
      observacoes: payload.observacoes,
    });

    res.status(201).json({ success: true, data: cliente, message: "Cliente criado com sucesso" });
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

router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = paginationSchema.parse({
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    });

    const result = await clienteService.list(page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ success: false, error: "Erro de validação" });
    } else {
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const cliente = await clienteService.getById(String(req.params.id));
    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = clienteSchema.parse(req.body);
    const cliente = await clienteService.update(String(req.params.id), {
      nome: payload.nome,
      telefone: payload.telefone,
      email: payload.email || undefined,
      observacoes: payload.observacoes,
    });

    res.status(200).json({ success: true, data: cliente, message: "Cliente atualizado com sucesso" });
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

router.delete("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const cliente = await clienteService.delete(String(req.params.id));
    res.status(200).json({ success: true, data: cliente, message: "Cliente excluído com sucesso" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  }
});

export default router;