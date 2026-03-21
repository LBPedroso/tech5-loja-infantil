import { Router, Request, Response } from "express";
import { ProdutoService } from "../services/produto.service";
import { authMiddleware } from "../middleware/auth";
import { produtoSchema, paginationSchema } from "../utils/validators";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

const router = Router();
const produtoService = new ProdutoService();

// POST /produtos - Criar produto (autenticado)
router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, descricao, preco, quantidade, categoriaId } =
        produtoSchema.parse(req.body);

      const produto = await produtoService.create(
        nome,
        descricao,
        preco,
        quantidade,
        categoriaId
      );

      res.status(201).json({
        success: true,
        data: produto,
        message: "Produto criado com sucesso",
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

// GET /produtos - Listar produtos com paginação
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = paginationSchema.parse({
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    });

    const categoriaId = req.query.categoriaId as string | undefined;

    const result = await produtoService.list(page, limit, categoriaId);

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

// GET /produtos/:id - Obter produto por ID
router.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const produto = await produtoService.getById(String(req.params.id));

      res.status(200).json({
        success: true,
        data: produto,
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

// PUT /produtos/:id - Editar produto (autenticado)
router.put(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, descricao, preco, quantidade, categoriaId } =
        produtoSchema.parse(req.body);

      const produto = await produtoService.update(
        String(req.params.id),
        nome,
        descricao,
        preco,
        quantidade,
        categoriaId
      );

      res.status(200).json({
        success: true,
        data: produto,
        message: "Produto atualizado com sucesso",
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

// DELETE /produtos/:id - Deletar produto (autenticado)
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const produto = await produtoService.delete(String(req.params.id));

      res.status(200).json({
        success: true,
        data: produto,
        message: "Produto deletado com sucesso",
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
