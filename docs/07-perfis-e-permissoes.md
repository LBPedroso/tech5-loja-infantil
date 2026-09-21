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

Permissoes aplicadas:
- Consultar informacoes operacionais necessarias.
- Criar pedidos sob regras definidas.
- Sem acesso a configuracoes criticas de administracao.

Restricoes aplicadas:
- Nao excluir categorias/produtos.
- Nao alterar configuracoes administrativas.
- Nao executar acoes sensiveis sem autorizacao.

## 2.3 Perfis operacionais aplicados
Para aproximar a realidade da loja, o sistema considera os perfis:

- ADMIN: controle total.
- ESTOQUE: gestao de categoria/produto/entrada de mercadoria.
- VENDEDOR: registro de pedidos e gestao de clientes.
- CAIXA: operacao financeira e fechamento de recebimentos.
- USER: perfil basico restrito.

## 3. Matriz de permissoes por modulo
| Modulo | ADMIN | ESTOQUE | VENDEDOR | CAIXA | USER |
|---|---|---|---|---|---|
| Usuarios e permissoes | Sim | Nao | Nao | Nao | Nao |
| Categorias | Sim | Sim | Nao | Nao | Nao |
| Produtos | Sim | Sim | Leitura | Leitura | Leitura |
| Pedidos | Sim | Leitura | Criar/Consultar | Consultar | Consultar |
| Atualizar status de pedido | Sim | Nao | Nao | Sim | Nao |
| Clientes | Sim | Nao | Sim | Nao | Nao |
| Financeiro | Sim | Nao | Nao | Sim | Nao |

## 4. Regra funcional aplicada
- O acesso as rotas protegidas depende de autenticacao valida.
- Operacoes de gestao devem ser registradas por usuario autenticado.
- Rotas sensiveis validam perfil antes de executar a acao.
- O menu do painel exibe modulos de acordo com o perfil logado.

## 5. Evidencias no sistema
- Fluxo de login validado em producao.
- Acesso a modulos condicionado a sessao autenticada.
- Endpoints de upload protegidos por token.
- Rotas de gestao de categorias e produtos protegidas para ADMIN.
- Usuario comum autenticado cria e consulta pedidos proprios.
- Atualizacao de status de pedidos restrita a ADMIN e CAIXA.
- Exclusao de pedidos restrita ao ADMIN.

## 6. Como o administrador controla o que cada funcionario pode fazer
1. O administrador acessa o modulo Usuarios e Permissoes.
2. Seleciona o perfil do funcionario (ESTOQUE, VENDEDOR, CAIXA, USER, ADMIN).
3. Salva a permissao.
4. A partir desse ponto, o sistema limita automaticamente menu e rotas para aquele perfil.

## 7. Evolucao recomendada pos-entrega
Para consolidar RBAC completo em fase comercial:
- Persistir papel de usuario no banco (ADMIN, OPERADOR).
- Aplicar middleware de autorizacao por perfil em cada rota.
- Bloquear acoes criticas no frontend e backend por role.
- Adicionar auditoria de operacoes sensiveis.

## 8. Conclusao
Para a entrega da disciplina, o projeto apresenta base funcional de controle de acesso com autenticacao e separacao de responsabilidades por papel. A evolucao para RBAC completo esta planejada como proxima etapa de maturidade do produto.
