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

export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
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
  clienteId?: string | null;
  status: string;
  total: number;
  itens: PedidoItem[];
  cliente?: Cliente | null;
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

export interface Transacao {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA';
  valor: number;
  descricao?: string | null;
  data: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceiroResumo {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  mesAtual: {
    entradas: number;
    saidas: number;
    saldo: number;
  };
}
