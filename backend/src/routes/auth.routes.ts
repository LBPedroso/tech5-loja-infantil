import { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { authMiddleware } from "../middleware/auth";
import { loginSchema, signupSchema, editUserSchema } from "../utils/validators";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

const router = Router();
const authService = new AuthService();

// POST /auth/signup - Cadastro de usuário
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, cpf, senha } = signupSchema.parse(req.body);

    const result = await authService.signup(nome, email, cpf, senha);

    res.status(201).json({
      success: true,
      data: result,
      message: "Usuário cadastrado com sucesso",
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
});

// POST /auth/login - Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

    const result = await authService.login(email, senha);

    res.status(200).json({
      success: true,
      data: result,
      message: "Login realizado com sucesso",
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
});

// GET /auth/me - Obter dados do usuário autenticado
router.get("/me", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "Não autorizado");
    }

    const user = await authService.getUser(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
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
});

// PUT /auth/me - Editar dados do usuário autenticado
router.put("/me", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "Não autorizado");
    }

    const { nome, cpf, senha } = editUserSchema.parse(req.body);

    const user = await authService.editUser(req.user.id, nome, cpf, senha);

    res.status(200).json({
      success: true,
      data: user,
      message: "Usuário atualizado com sucesso",
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
});

export default router;
