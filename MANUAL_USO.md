# Manual de Uso - Lili&Gu Moda Infantil

## 1. Objetivo
Este manual descreve como acessar e operar o sistema web da loja, incluindo login, cadastros e fluxo basico de vendas (pedidos).

## 2. Acesso ao sistema
- Frontend (site): https://tech5-loja-infantil.vercel.app/
- Backend (API): https://tech5-loja-infantil-api.onrender.com
- Health check da API: https://tech5-loja-infantil-api.onrender.com/health

## 3. Credenciais de administrador
- Email: admin@liligu.com
- Senha: Admin123!

## 4. Fluxo recomendado de uso
1. Acesse o frontend e faca login.
2. Cadastre categorias (ex.: Bodies, Conjuntos, Vestidos).
3. Cadastre produtos vinculando cada item a uma categoria.
4. Crie pedidos selecionando produto e quantidade.
5. Atualize status do pedido quando necessario.
6. Atualize dados no menu de perfil quando precisar.

## 5. Modulos disponiveis
- Home/Dashboard: visao geral e dados do usuario autenticado.
- Categorias: criar, listar, editar, excluir.
- Produtos: criar, listar, editar, excluir.
- Pedidos: criar, listar, atualizar status, excluir.
- Meu Perfil: editar nome, CPF e senha.

## 6. Regras importantes
- Produtos exigem categoria existente.
- Pedido so pode ser criado se houver estoque suficiente.
- Alteracoes de pedido impactam estoque.
- Rotas de escrita exigem token de autenticacao.

## 7. Solucao rapida de problemas
- Erro 401/403: fazer login novamente.
- Erro de CORS em producao: revisar CORS_ORIGIN no backend.
- Site fora do ar: verificar status de deploy no Render e no Vercel.

## 8. Referencias
- Repositorio: https://github.com/LBPedroso/tech5-loja-infantil.git
- Documento principal: README.md
