// Tipos globais do projeto
export interface JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest {
  id: string;
  email: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Domain DTOs
export interface AuthTokenDto {
  id: string;
  email: string;
  token: string;
}

export interface UserDto {
  id: string;
  email: string;
  nome: string;
  cpf: string;
}

export interface CategoriaDto {
  id: string;
  nome: string;
  descricao: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProdutoDto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade: number;
  categoriaId: string;
  categoria?: CategoriaDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSummary {
  id: string;
  email: string;
  nome: string;
}

export interface PedidoItemDto {
  id: string;
  pedidoId: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  produto?: ProdutoDto;
}

export interface PedidoDto {
  id: string;
  userId: string;
  total: number;
  status: string;
  itens: PedidoItemDto[];
  user?: UserSummary;
  createdAt: Date;
  updatedAt: Date;
}

// Input DTOs — reduz número de parâmetros por função
export interface ProdutoInputDto {
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  categoriaId: string;
}

export interface PedidoItemInput {
  produtoId: string;
  quantidade: number;
}
