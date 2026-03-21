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
