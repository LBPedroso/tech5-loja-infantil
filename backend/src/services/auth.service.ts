import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { AppError } from "../utils/errors";

const prisma = new PrismaClient();

export class AuthService {
  // Registrar novo usuário
  async signup(
    nome: string,
    email: string,
    cpf: string,
    senha: string
  ): Promise<{ id: string; email: string; token: string }> {
    // Validar CPF
    if (!cpfValidator.isValid(cpf)) {
      throw new AppError(400, "CPF inválido");
    }

    // Verificar se email já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new AppError(409, "Email já cadastrado");
    }

    // Verificar se CPF já existe
    const cpfExists = await prisma.user.findUnique({ where: { cpf } });
    if (cpfExists) {
      throw new AppError(409, "CPF já cadastrado");
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: nome,
        email,
        cpf,
        password: senhaHash,
      },
    });

    // Gerar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

  // Login de usuário
  async login(
    email: string,
    senha: string
  ): Promise<{ id: string; email: string; token: string }> {
    // Buscar usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, "Email ou senha inválidos");
    }

    // Validar senha
    const senhaValida = await bcrypt.compare(senha, user.password);
    if (!senhaValida) {
      throw new AppError(401, "Email ou senha inválidos");
    }

    // Gerar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

  // Editar usuário (apenas dados próprios)
  async editUser(
    userId: string,
    nome: string,
    cpf: string,
    senha?: string
  ): Promise<{ id: string; email: string; nome: string; cpf: string }> {
    // Buscar usuário
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, "Usuário não encontrado");
    }

    // Validar CPF
    if (!cpfValidator.isValid(cpf)) {
      throw new AppError(400, "CPF inválido");
    }

    // Verificar se CPF já existe (e não é o dele)
    if (cpf !== user.cpf) {
      const cpfExists = await prisma.user.findUnique({ where: { cpf } });
      if (cpfExists) {
        throw new AppError(409, "CPF já cadastrado");
      }
    }

    // Preparar dados para atualizar
    const updateData: { name: string; cpf: string; password?: string } = {
      name: nome,
      cpf,
    };

    // Se forneceu nova senha, fazer hash
    if (senha) {
      updateData.password = await bcrypt.hash(senha, 10);
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      nome: updatedUser.name,
      cpf: updatedUser.cpf,
    };
  }

  // Obter dados do usuário
  async getUser(userId: string): Promise<{
    id: string;
    email: string;
    nome: string;
    cpf: string;
  }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, "Usuário não encontrado");
    }

    return {
      id: user.id,
      email: user.email,
      nome: user.name,
      cpf: user.cpf,
    };
  }
}
