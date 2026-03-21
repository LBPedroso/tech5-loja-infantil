import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, AuthRequest } from "../types/index";
import { errors } from "../utils/errors";

// Estender Express Request com propriedades de autenticação
declare global {
  namespace Express {
    interface Request {
      user?: AuthRequest;
    }
  }
}

// Middleware de autenticação
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const error = errors.unauthorized();
    res
      .status(error.statusCode)
      .json({ success: false, error: error.message });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    const error = errors.unauthorized();
    res
      .status(error.statusCode)
      .json({ success: false, error: error.message });
  }
};
