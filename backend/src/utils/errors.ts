// Classe de erro aplicado
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Função helper para criar erros comuns
export const createError = (
  statusCode: number,
  message: string,
  errors?: Array<{ field: string; message: string }>
) => {
  return new AppError(statusCode, message, errors);
};

// Erros específicos
export const errors = {
  unauthorized: () => createError(401, "Não autorizado"),
  forbidden: () => createError(403, "Acesso proibido"),
  notFound: (resource: string) => createError(404, `${resource} não encontrado`),
  conflict: (message: string) => createError(409, message),
  validationError: (errors: Array<{ field: string; message: string }>) =>
    createError(400, "Erro de validação", errors),
  serverError: () => createError(500, "Erro interno do servidor"),
};
