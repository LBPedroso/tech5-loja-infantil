import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { AppError } from "../utils/errors";
import { AuthTokenDto, UserDto } from "../types";

const prisma = new PrismaClient();

export class AuthService {
  private validarCpf(cpf: string): void {
    if (!cpfValidator.isValid(cpf)) throw new AppError(400, "CPF inválido");
  }

  private async garantirEmailUnico(email: string): Promise<void> {
    if (await prisma.user.findUnique({ where: { email } }))
      throw new AppError(409, "Email já cadastrado");
  }

  private async garantirCpfUnico(cpf: string): Promise<void> {
    if (await prisma.user.findUnique({ where: { cpf } }))
      throw new AppError(409, "CPF já cadastrado");
  }

  private gerarToken(user: { id: string; email: string }): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );
  }

  private async buscarUsuario(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, "Usuário não encontrado");
    return user;
  }

  private async garantirCpfDisponivel(cpf: string, cpfAtual: string): Promise<void> {
    if (cpf === cpfAtual) return;
    if (await prisma.user.findUnique({ where: { cpf } }))
      throw new AppError(409, "CPF já cadastrado");
  }

  private async buildUpdateData(nome: string, cpf: string, senha?: string) {
    const data: { name: string; cpf: string; password?: string } = { name: nome, cpf };
    if (senha) data.password = await bcrypt.hash(senha, 10);
    return data;
  }

  // Registrar novo usuário
  async signup(nome: string, email: string, cpf: string, senha: string): Promise<AuthTokenDto> {
    this.validarCpf(cpf);
    await this.garantirEmailUnico(email);
    await this.garantirCpfUnico(cpf);
    const user = await prisma.user.create({
      data: { name: nome, email, cpf, password: await bcrypt.hash(senha, 10) },
    });
    return { id: user.id, email: user.email, token: this.gerarToken(user) };
  }

  // Login de usuário
  async login(email: string, senha: string): Promise<AuthTokenDto> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(senha, user.password)))
      throw new AppError(401, "Email ou senha inválidos");
    return { id: user.id, email: user.email, token: this.gerarToken(user) };
  }

  // Editar usuário (apenas dados próprios — email não pode ser alterado)
  async editUser(userId: string, nome: string, cpf: string, senha?: string): Promise<UserDto> {
    const user = await this.buscarUsuario(userId);
    this.validarCpf(cpf);
    await this.garantirCpfDisponivel(cpf, user.cpf);
    const updateData = await this.buildUpdateData(nome, cpf, senha);
    const updated = await prisma.user.update({ where: { id: userId }, data: updateData });
    return { id: updated.id, email: updated.email, nome: updated.name, cpf: updated.cpf };
  }

  // Obter dados do usuário
  async getUser(userId: string): Promise<UserDto> {
    const user = await this.buscarUsuario(userId);
    return { id: user.id, email: user.email, nome: user.name, cpf: user.cpf };
  }
}
