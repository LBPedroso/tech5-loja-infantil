# Tech 5 - API Backend Loja

## 📋 Descrição

Backend completo para uma aplicação de Loja com autenticação JWT, 3 CRUDS (Categoria, Produto, Pedido) e validações robustas.

**Stack:**
- Node.js v22 + TypeScript
- Express.js (API REST)
- SQLite + Prisma ORM
- JWT para autenticação
- Bcrypt para criptografia de senha
- Zod para validações

---

## ✅ O que foi implementado

### Fase 1: Autenticação (0,5 + 1 + 1 = 2,5 pontos)
- ✅ **Login** com email e senha
- ✅ Senha criptografada com bcrypt
- ✅ Validação de email (regex via Zod)
- ✅ Retorno JWT com expiração 24h
- ✅ **Cadastro** com validações:
  - Nome (mínimo 3 caracteres)
  - Email (regex)
  - CPF (validação com biblioteca)
  - Senha forte (8+ caracteres, 1 letra maiúscula, 1 número, 1 caractere especial)
- ✅ **Edição de usuário** (rota autenticada):
  - Validação de CPF
  - Validação de nível de senha
  - Email não pode ser alterado

### Fase 2: 3 CRUDS Completos (1,5 pontos)
- ✅ **Categoria** (Create, Read, Update, Delete)
  - Criar categoria com nome único
  - Listar com paginação
  - Obter por ID
  - Editar nome/descrição
  - Deletar se não tiver produtos

- ✅ **Produto** (Create, Read, Update, Delete)
  - Criar com validação de preço > 0
  - Listar com paginação
  - Filtro por categoria
  - Obter por ID
  - Editar dados
  - Deletar

- ✅ **Pedido** (Create, Read, Update, Delete)
  - Criar com múltiplos itens
  - Validação de estoque
  - Atualizar estoque automaticamente
  - Listar pedidos do usuário com paginação
  - Atualizar status do pedido
  - Deletar restituir estoque

### Todas as rotas estão autenticadas (exceto categoria/produto GET)
### Paginação em todas as listagens (page, limit)
### Status HTTP corretos (201 para criação, 200, 400, 401, 404, 500)

---

## 🚀 Como rodar

### 1. Backend está já rodando
O servidor está em: `http://localhost:3000`

### 2. Testar as rotas

#### **Opção A: Usando Thunder Client (VS Code)**
Instale a extensão "Thunder Client" no VS Code e importe as requisições abaixo.

#### **Opção B: Usando cURL**

```bash
# 1. CADASTRO
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "senha": "Senha123!"
  }'

# Resposta:
# {
#   "success": true,
#   "data": {
#     "id": "abc123",
#     "email": "joao@email.com",
#     "token": "eyJhbGc..."
#   }
# }

# 2. LOGIN
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "Senha123!"
  }'

# Guarde o TOKEN da resposta!

# 3. CRIAR CATEGORIA (com token)
TOKEN="seu-token-aqui"
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos em geral"
  }'

# 4. LISTAR CATEGORIAS
curl http://localhost:3000/api/categorias

# 5. CRIAR PRODUTO (precisa de categoriaId obtido em 3)
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Notebook",
    "descricao": "Notebook 15 polegadas",
    "preco": 3500,
    "quantidade": 10,
    "categoriaId": "id-da-categoria"
  }'

# 6. LISTAR PRODUTOS
curl http://localhost:3000/api/produtos

# 7. CRIAR PEDIDO (com token)
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "itens": [
      {
        "produtoId": "id-do-produto",
        "quantidade": 2
      }
    ]
  }'

# 8. LISTAR PEDIDOS DO USUÁRIO
curl http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer $TOKEN"

# 9. EDITAR DADOS DO USUÁRIO
curl -X PUT http://localhost:3000/api/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "João Silva Novo",
    "cpf": "12345678901",
    "senha": "NovaSenha123!"
  }'
```

---

## 📁 Estrutura de pastas

```
backend/
├── src/
│   ├── app.ts              # Configuração Express
│   ├── server.ts           # Inicialização do servidor
│   ├── middleware/
│   │   └── auth.ts         # Middleware de autenticação JWT
│   ├── routes/
│   │   ├── auth.routes.ts   # Rotas de autenticação
│   │   ├── categoria.routes.ts
│   │   ├── produto.routes.ts
│   │   └── pedido.routes.ts
│   ├── services/
│   │   ├── auth.service.ts   # Lógica de autenticação
│   │   ├── categoria.service.ts
│   │   ├── produto.service.ts
│   │   └── pedido.service.ts
│   ├── types/
│   │   └── index.ts        # Tipos globais TypeScript
│   └── utils/
│       ├── validators.ts   # Validações Zod
│       └── errors.ts       # Tratamento de erros
├── prisma/
│   ├── schema.prisma       # Modelo do banco
│   ├── migrations/         # Histórico de migrações
│   └── dev.db             # Banco de dados SQLite
├── .env                   # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── npm run dev           # Rodar servidor
```

---

## 🔐 Autenticação

Todas as rotas de **edição/deleção** precisam de autenticação. Envie:

```
Authorization: Bearer seu-jwt-token-aqui
```

O token é obtido ao fazer **login** ou **signup**.

---

## ✨ Propriedades de código limpo

### ✅ Responsabilidade Única
- `services/` contêm a lógica
- `routes/` contêm apenas exposição HTTP
- `middleware/` contêm autenticação

### ✅ Nomes Significativos
- Variáveis: `categoriaId`, `quantidadeDisponivel`, etc.
- Funções: `createUser()`, `updateProductStock()`, etc.
- Métodos: `async signup()`, `async list()`, etc.

### ✅ Status HTTP Corretos
- 201: Criação bem-sucedida
- 200: Sucesso
- 400: Erro de validação
- 401: Não autenticado
- 403: Proibido (ex: tentar editar pedido de outro usuário)
- 404: Não encontrado
- 409: Conflito (ex: email já existe)
- 500: Erro interno

### ✅ TypeScript sem `any`
- Todos os tipos declarados
- Interfaces explícitas
- Validação Zod em cada rota

### ✅ Funções com máximo 10 linhas
- Cada função tem uma responsabilidade
- Controllers delegam para services

---

## 📊 Próximos passos

1. **Frontend React** - Telas de login, cadastro, CRUDs
2. **Deploy** - Backend em Render, Frontend em Vercel
3. **Testes** - Vitest para todas as funções

---

## 📞 Endpoints completos

| Método | Rota | Autenticado | Descrição |
|--------|------|-------------|-----------|
| POST | `/api/auth/signup` | ❌ | Cadastrar |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Dados do usuário |
| PUT | `/api/auth/me` | ✅ | Editar usuário |
| GET | `/api/categorias` | ❌ | Listar |
| POST | `/api/categorias` | ✅ | Criar |
| GET | `/api/categorias/:id` | ❌ | Obter |
| PUT | `/api/categorias/:id` | ✅ | Editar |
| DELETE | `/api/categorias/:id` | ✅ | Deletar |
| GET | `/api/produtos` | ❌ | Listar |
| POST | `/api/produtos` | ✅ | Criar |
| GET | `/api/produtos/:id` | ❌ | Obter |
| PUT | `/api/produtos/:id` | ✅ | Editar |
| DELETE | `/api/produtos/:id` | ✅ | Deletar |
| GET | `/api/pedidos` | ✅ | Listar seus pedidos |
| POST | `/api/pedidos` | ✅ | Criar |
| GET | `/api/pedidos/:id` | ✅ | Obter |
| PUT | `/api/pedidos/:id/status` | ✅ | Atualizar status |
| DELETE | `/api/pedidos/:id` | ✅ | Deletar |

---

## 🎯 Testes manuais recomendados

```javascript
// 1. Criar usuário
POST /api/auth/signup
// Senha fraca → erro
// Email duplicado → erro

// 2. CPF único
POST /api/auth/signup
// CPF inválido → erro
// CPF duplicado → erro

// 3. Paginação
GET /api/categorias?page=1&limit=5

// 4. Estoque de pedido
POST /api/pedidos
// Quantidade > estoque → erro
// Depois: GET /api/produtos → estoque diminuído

// 5. Pedido apenas do próprio usuário
GET /api/pedidos/outro-id
// 403 Forbidden se não for seu pedido
```

---

Tudo pronto para o **frontend em React**! 🚀
