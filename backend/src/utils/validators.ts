import { z } from "zod";

// Validação de email
export const emailSchema = z.string().email("Email inválido");

// Validação de CPF
export const cpfSchema = z
  .string()
  .min(11, "CPF deve ter 11 dígitos")
  .max(11, "CPF deve ter 11 dígitos")
  .regex(/^\d+$/, "CPF deve conter apenas números");

// Validação de senha (mínimo 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial)
export const passwordSchema = z
  .string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/\d/, "Senha deve conter pelo menos um número")
  .regex(/[!@#$%^&*]/, "Senha deve conter pelo menos um caractere especial (!@#$%^&*)");

// Schema de login
export const loginSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1, "Senha é obrigatória"),
});

// Schema de cadastro de usuário
export const signupSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: emailSchema,
  cpf: cpfSchema,
  senha: passwordSchema,
});

// Schema de edição de usuário
export const editUserSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: cpfSchema,
  senha: passwordSchema.optional(),
});

// Schema de categoria
export const categoriaSchema = z.object({
  nome: z.string().min(3, "Nome da categoria deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional(),
});

// Schema de produto
export const produtoSchema = z.object({
  nome: z.string().min(3, "Nome do produto deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional(),
  preco: z.number().positive("Preço deve ser maior que zero"),
  quantidade: z.number().int().nonnegative("Quantidade não pode ser negativa"),
  categoriaId: z.string().min(1, "Categoria é obrigatória"),
});

// Schema de pedido
export const pedidoSchema = z.object({
  itens: z.array(
    z.object({
      produtoId: z.string(),
      quantidade: z.number().int().positive(),
    })
  ),
});

// Schema de paginação
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});
