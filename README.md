# Lili&Gu Moda Infantil - Tech5

Projeto fullstack para gestao de loja de roupas infantis, inspirado nos nomes dos filhos do autor (Lili e Gu).

## Descricao
Aplicacao completa com backend em Node.js + TypeScript + Prisma e frontend em React + TypeScript, com autenticacao JWT e operacoes CRUD para categorias, produtos, pedidos e perfil do usuario.

## Objetivo Academico
Atender aos criterios da rubrica da disciplina Tech5:
- Autenticacao (signup, login, editar usuario autenticado)
- 3 CRUDs completos (Categoria, Produto, Pedido)
- Validacoes consistentes (Zod, CPF, senha forte)
- Paginacao nas listagens
- TypeScript com tipagem forte
- Testes automatizados

## Tecnologias
- Backend: Node.js, Express, TypeScript, Prisma, SQLite, JWT, bcrypt, Zod, Vitest
- Frontend: React, TypeScript, Vite, Axios, React Router

## Estrutura
- frontend/: interface web da loja
- backend/: API REST e banco SQLite

## Funcionalidades Implementadas
- Autenticacao:
  - Cadastro de usuario
  - Login com JWT
  - Edicao de perfil do usuario autenticado
- Categorias:
  - Criar, listar, editar, excluir
- Produtos:
  - Criar, listar, editar, excluir
  - Relacao com categoria
- Pedidos:
  - Criar pedido
  - Listar pedidos do usuario
  - Atualizar status
  - Excluir pedido
  - Controle de estoque automatico
- Perfil:
  - Atualizacao de nome, CPF e senha

## Como Executar
### 1) Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```
API em: http://localhost:3000

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
App em: http://localhost:5173

## Testes e Build
### Backend
```bash
cd backend
npm run build
npm test
```

### Frontend
```bash
cd frontend
npm run build
```

## Endpoints principais
- Auth: /api/auth/signup, /api/auth/login, /api/auth/me
- Categorias: /api/categorias
- Produtos: /api/produtos
- Pedidos: /api/pedidos

## Rubrica (resumo de evidencias)
- Autenticacao e seguranca: implementado
- CRUD Categoria: implementado
- CRUD Produto: implementado
- CRUD Pedido: implementado
- Validacoes: implementado
- Paginacao: implementado
- Testes backend: implementado
- Frontend com consumo da API: implementado

## Repositorio
https://github.com/LBPedroso/tech5-loja-infantil.git

## Deploy (Entrega Final)
### Backend no Render
1. No Render, crie um Web Service a partir do repositorio.
2. Configure o Root Directory como backend.
3. Use Build Command:
  npm install; npm run prisma:generate; npm run build; npm run prisma:deploy; npm run prisma:seed
4. Use Start Command:
  npm run start
5. Configure as variaveis de ambiente com base em backend/.env.example.

### Frontend no Vercel
1. No Vercel, importe o mesmo repositorio.
2. Configure Root Directory como frontend.
3. Configure VITE_API_URL com a URL publica do backend + /api.
4. O arquivo frontend/vercel.json ja inclui rewrite para rotas do React.

## Dados para Entrega Final
- URL do repositorio: https://github.com/LBPedroso/tech5-loja-infantil.git
- URL frontend online: preencher apos deploy
- URL backend online: preencher apos deploy
- Usuario admin: admin@liligu.com
- Senha admin: Admin123!

## Checklist de Envio Final
- ZIP do projeto (sem node_modules/dist/.git)
- Link do repositorio
- Link do site online
- Usuario e senha do administrador
- Texto de explicacao da elaboracao do projeto
