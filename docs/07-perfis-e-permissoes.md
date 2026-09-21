# 07 - Perfis e Permissoes (Controle Funcional)

## 1. Objetivo
Documentar o controle funcional de acesso para demonstrar separacao de responsabilidades entre perfis de usuario na rubrica Tech7.

## 2. Perfis definidos
## 2.1 Administrador
Perfil com acesso completo aos modulos operacionais do sistema.

Permissoes:
- Acessar painel administrativo.
- Criar, listar, editar e excluir categorias.
- Criar, listar, editar e excluir produtos.
- Enviar foto de produto com validacoes de upload.
- Criar e acompanhar pedidos.
- Atualizar status e excluir pedidos.
- Acessar modulo financeiro.
- Gerenciar dados de perfil proprio.

## 2.2 Usuario operacional
Perfil com acesso restrito para operacao assistida.

Permissoes propostas para fase academica:
- Consultar informacoes operacionais necessarias.
- Criar pedidos sob regras definidas.
- Sem acesso a configuracoes criticas de administracao.

Restricoes propostas:
- Nao excluir categorias/produtos.
- Nao alterar configuracoes administrativas.
- Nao executar acoes sensiveis sem autorizacao.

## 3. Regra funcional minima aplicada
- O acesso as rotas protegidas depende de autenticacao valida.
- Operacoes de gestao devem ser registradas por usuario autenticado.

## 4. Evidencias no sistema
- Fluxo de login validado em producao.
- Acesso a modulos condicionado a sessao autenticada.
- Endpoints de upload protegidos por token.

## 5. Evolucao recomendada pos-entrega
Para consolidar RBAC completo em fase comercial:
- Persistir papel de usuario no banco (ADMIN, OPERADOR).
- Aplicar middleware de autorizacao por perfil em cada rota.
- Bloquear acoes criticas no frontend e backend por role.
- Adicionar auditoria de operacoes sensiveis.

## 6. Conclusao
Para a entrega da disciplina, o projeto apresenta base funcional de controle de acesso com autenticacao e separacao de responsabilidades por papel. A evolucao para RBAC completo esta planejada como proxima etapa de maturidade do produto.
