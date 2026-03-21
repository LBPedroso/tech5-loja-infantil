import { Router, Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";
import { authMiddleware } from "../middleware/auth";
import { pedidoSchema, paginationSchema } from "../utils/validators";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

const router = Router();
const pedidoService = new PedidoService();

// POST /pedidos - Criar pedido (autenticado)
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, "Não autorizado");
      }

      const { itens } = pedidoSchema.parse(req.body);

      const pedido = await pedidoService.create(req.user.id, itens);

      res.status(201).json({
        success: true,
        data: pedido,
        message: "Pedido criado com sucesso",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        res.status(400).json({
          success: false,
          error: "Erro de validação",
          errors,
        });
      } else if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }
);

// GET /pedidos - Listar pedidos do usuário com paginação (autenticado)
router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "Não autorizado");
    }

    const { page = 1, limit = 10 } = paginationSchema.parse({
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    });

    const result = await pedidoService.list(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: "Erro de validação",
      });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }
});

// GET /pedidos/:id - Obter pedido por ID (autenticado)
router.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, "Não autorizado");
      }

      const pedido = await pedidoService.getById(
        String(req.params.id),
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: pedido,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }
);

// PUT /pedidos/:id/status - Atualizar status do pedido (autenticado)
router.put(
  "/:id/status",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, "Não autorizado");
      }

      const { status } = req.body;

      if (!status) {
        throw new AppError(400, "Status é obrigatório");
      }

      const pedido = await pedidoService.updateStatus(
        String(req.params.id),
        req.user.id,
        status
      );

      res.status(200).json({
        success: true,
        data: pedido,
        message: "Pedido atualizado com sucesso",
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }
);

// DELETE /pedidos/:id - Deletar pedido (autenticado)
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, "Não autorizado");
      }

      const pedido = await pedidoService.delete(
        String(req.params.id),
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: pedido,
        message: "Pedido deletado com sucesso",
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  }
);

export default router;
