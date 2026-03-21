export interface User {
  id: string;
  email: string;
  nome: string;
  cpf: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  signup: (nome: string, email: string, cpf: string, senha: string) => Promise<void>;
  logout: () => void;
  editUser: (nome: string, cpf: string, senha?: string) => Promise<void>;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  categoriaId: string;
  categoria: Categoria;
  createdAt: string;
  updatedAt: string;
}

export interface PedidoItem {
  id: string;
  pedidoId: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  produto: Produto;
}

export interface Pedido {
  id: string;
  userId: string;
  status: string;
  total: number;
  itens: PedidoItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
