ENTREGA TECH 6 - LOJA INFANTIL LILI&GU
=========================================

EVOLUÇÃO DO PROJETO

Este projeto é uma evolução do Tech 5 (que já possuía backend em Node.js/TypeScript, frontend em React e autenticação JWT). 

Para atender à rubrica de Tech 6, reestruturei completamente a arquitetura, implementando:

---

RUBRICA SOLICITADA - PONTOS ATENDIDOS:

✅ SO/REDES/CYBERSEGURANÇA (5.0 pontos)
   - HTTPS com certificados válidos (mkcert)
   - Security Headers implementados (X-Frame-Options, X-Content-Type-Options, CSP, HSTS)
   - Variáveis de ambiente seguras (.env não commitado)
   - Isolamento de rede com Docker (network isolada)
   - Validação de entrada com Zod schemas
   - Autenticação JWT com tokens
   - CORS configurado

✅ DEVOPS/CLOUD (5.0 pontos)
   - Containerização com Docker (4 containers: MySQL, Backend, Frontend, Nginx)
   - Orquestração com docker-compose.yml
   - Health checks em todos os serviços
   - Dependencies configurados (Backend aguarda MySQL, Frontend aguarda Backend)
   - Volume mounts para persistência
   - Network isolada (app-network)
   - CI/CD local com Husky hooks (pre-commit, pre-push, commit-msg)
   - GitFlow com branches dev/main/feature/*

✅ TECH FORGE (2.0 pontos)
   - 18 testes E2E com Playwright (100% passando)
   - Testes cobrindo: autenticação, CRUD, validações, health check
   - Automação Git: pré-commit valida build, pré-push roda testes
   - Schema de banco documentado (database.sql)
   - Histórico git limpo com commits organizados

---

O QUE FOI FEITO

ARQUITETURA CONTAINERIZADA:
- Refatorei o projeto Tech 5 removendo dependência de Prisma (que causava erro com Docker)
- Implementei mock API em-memory para desacoplar de banco de dados
- Criei Dockerfile para backend (Node 18-bullseye-slim) e frontend (multi-stage Node+Nginx)
- Nginx Alpine como reverse proxy com certificados HTTPS

SEGURANÇA:
- Implementei HTTPS com mkcert (certificados válidos até 2028)
- Configurei security headers no nginx.conf (HSTS, CSP, X-Frame-Options)
- Variáveis de ambiente (.env) não commitadas no GitHub
- JWT para autenticação, validação com Zod

TESTES E AUTOMAÇÃO:
- Criei suite de 18 testes E2E com Playwright
- Configurei Husky com 3 hooks: pre-commit (valida build), pre-push (roda testes), commit-msg (valida formato)
- Testes rodam automaticamente antes de push (18/18 passando)

GIT/VERSIONAMENTO:
- Implementei GitFlow com branches main/dev/feature/*
- 7+ commits bem documentados com histórico limpo
- Todo código publicado no GitHub

---

COMO ESTÁ ESTRUTURADO

Repositório GitHub:
https://github.com/LBPedroso/tech5-loja-infantil

Branches:
- main: código de produção
- dev: desenvolvimento
- feature/fase-2-e2e-tests: testes E2E
- feature/fase-3-husky: automação git
- feature/fase-4-gitflow: estrutura gitflow
- feature/fase-5-sql-commit-msg: schema + commit hooks

---

FUNCIONALIDADES DO SISTEMA

Frontend (React + Vite):
- Login/Signup com autenticação JWT
- Dashboard com cards de status
- CRUD completo: Categorias, Produtos, Pedidos, Clientes
- Módulo Financeiro com transações
- Perfil do usuário (editar nome, CPF, senha)
- Validações em todos os formulários

Backend (Node.js + Express):
- API RESTful completa
- Mock API em-memory (pronto para conectar banco real)
- Endpoints: /api/auth, /api/categorias, /api/produtos, /api/pedidos, /api/clientes, /api/financeiro
- Health check em /health
- Validações com Zod
- Tratamento de erros HTTP (400, 401, 404, 500)

Docker:
- 4 serviços orquestrados
- MySQL 8.0 com health check
- Backend Node.js porta 3001
- Frontend React porta 5173
- Nginx HTTPS porta 443

---

COMO EXECUTAR LOCALMENTE

1. Clonar repositório:
   git clone https://github.com/LBPedroso/tech5-loja-infantil.git

2. Entrar na pasta:
   cd tech5-loja-infantil

3. Iniciar Docker:
   docker-compose up -d

4. Aguardar ~40 segundos para tudo inicializar

5. Acessar no navegador:
   http://localhost:5173

6. Fazer login:
   Email: admin@test.com
   Senha: Admin123!

7. Verificar health da API:
   http://localhost:3001/health

---

VALIDAÇÕES IMPLEMENTADAS

- CPF: cpf-cnpj-validator
- Email: regex validation
- Senha: mínimo 8 caracteres, maiúscula, número, caractere especial
- Campos obrigatórios: Zod schemas
- Preço do produto: obrigatório e numérico
- HTTP status corretos: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)

---

STATUS FINAL

✅ 4/4 containers UP
✅ 18/18 testes E2E PASSANDO
✅ API respondendo 200 OK
✅ Dashboard 100% funcional
✅ Autenticação JWT funcionando
✅ CRUD completo (5 módulos)
✅ Docker containerizado
✅ Git com histórico limpo
✅ Security headers implementados
✅ Husky hooks automatizados
✅ Rubrica 12/12 pontos atendidos

---

DOCUMENTAÇÃO

README.md - Instruções de execução
MANUAL_USO.md - Guia de uso do sistema
database.sql - Schema de referência
ENTREGA_TECH6.md - Documentação técnica detalhada

---

Repositório: https://github.com/LBPedroso/tech5-loja-infantil
Desenvolvido por: Lua
Data: 28/06/2026
