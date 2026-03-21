import { Router, Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service";
import { authMiddleware } from "../middleware/auth";
import { categoriaSchema, paginationSchema } from "../utils/validators";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

const router = Router();
const categoriaService = new CategoriaService();

// POST /categorias - Criar categoria (autenticado)
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, descricao } = categoriaSchema.parse(req.body);

      const categoria = await categoriaService.create(nome, descricao);

      res.status(201).json({
        success: true,
        data: categoria,
        message: "Categoria criada com sucesso",
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

// GET /categorias - Listar categorias com paginação
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = paginationSchema.parse({
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    });

    const result = await categoriaService.list(page, limit);

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
    } else {
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }
});

// GET /categorias/:id - Obter categoria por ID
router.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await categoriaService.getById(String(req.params.id));

      res.status(200).json({
        success: true,
        data: categoria,
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

// PUT /categorias/:id - Editar categoria (autenticado)
router.put(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, descricao } = categoriaSchema.parse(req.body);

      const categoria = await categoriaService.update(
        String(req.params.id),
        nome,
        descricao
      );

      res.status(200).json({
        success: true,
        data: categoria,
        message: "Categoria atualizada com sucesso",
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

// DELETE /categorias/:id - Deletar categoria (autenticado)
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await categoriaService.delete(String(req.params.id));

      res.status(200).json({
        success: true,
        data: categoria,
        message: "Categoria deletada com sucesso",
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
