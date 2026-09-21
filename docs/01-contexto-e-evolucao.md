# 01 - Contexto e Evolucao do Produto

## 1. Contexto do problema
A loja Lili&Gu Moda Infantil precisava de um sistema unico para organizar operacoes basicas de venda e gestao diaria. Antes da aplicacao, o controle de produtos, pedidos e informacoes de clientes era descentralizado, gerando retrabalho e risco de erro.

Principais dores identificadas:
- Falta de controle padronizado de estoque e cadastro de produtos.
- Dificuldade para registrar e acompanhar pedidos.
- Baixa rastreabilidade das acoes operacionais no dia a dia.
- Falta de centralizacao em um painel unico para o administrador.

## 2. Persona/cliente
Cliente principal: pequeno comercio de roupas infantis, com operacao enxuta e foco em agilidade no atendimento.

Perfil do usuario principal:
- Papel: administrador da loja.
- Necessidade: registrar produtos, criar pedidos, acompanhar informacoes de operacao e manter o cadastro organizado.
- Restricao: pouco tempo para operacao; precisa de fluxo simples e direto no celular e no notebook.

## 3. Solucao proposta
Foi desenvolvido um sistema web fullstack com frontend em React + TypeScript e backend em Node.js + Express + TypeScript.

Capacidades principais:
- Autenticacao por login.
- Gestao de categorias.
- Gestao de produtos com foto.
- Registro e acompanhamento de pedidos.
- Estrutura para evolucao de regras de negocio de loja.

## 4. Evolucao por fases
### Fase inicial
- Estrutura base de frontend e backend.
- CRUDs nucleares (categorias, produtos, pedidos).
- Fluxo principal de autenticacao.

### Fase de estabilidade
- Ajustes de contrato entre frontend e backend.
- Correcao de fluxo de login e mensagens de erro.
- Validacao de build e testes automatizados.

### Fase de operacao mobile
- Melhoria no fluxo de foto de produto (galeria e camera).
- Upload real com validacao de tipo e tamanho.
- Ajustes para uso em celular e notebook.

### Fase atual (fechamento academico)
- Correcao de listagens e fluxo de pedidos.
- Publicacao e validacao em ambiente online.
- Consolidacao da documentacao para rubrica Tech7.

## 5. Estado atual
O sistema esta funcional para os fluxos principais da disciplina e pronto para consolidacao documental de entrega.

Pontos ja validados:
- Acesso e navegacao em producao.
- Cadastro de produto com foto.
- Criacao de pedido com fluxo estabilizado.

## 6. Proximos passos pos-entrega
Evolucoes planejadas para fase comercial:
- Persistencia robusta para evitar perda de dados em restart/deploy.
- Fluxo de venda completo com regras de recebimento.
- Fluxo de condicional com status e retorno.
- Relatorios gerenciais de operacao e caixa.
