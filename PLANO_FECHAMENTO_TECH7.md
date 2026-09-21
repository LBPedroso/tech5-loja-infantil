# Plano de Fechamento - Tech7 (Prioridade Rubrica)

## Objetivo
Fechar a entrega com nota alta, mantendo o sistema estavel e funcional, sem abrir escopo de novas features grandes agora.

## Estrategia
1. Trancar escopo tecnico no que ja esta funcionando.
2. Fechar itens obrigatorios da rubrica.
3. Gerar evidencias de teste e apresentacao.
4. Somente depois da entrega, iniciar fase comercial (automacoes avancadas).

## Fase 1 - Prioridade 1 (Estabilidade funcional)
Status: EM ANDAMENTO

Checklist:
- [x] Login funcionando em producao
- [x] Cadastro de produto com foto funcionando
- [x] Pedido sem travar tela (hotfix aplicado)
- [ ] Validar fluxo completo no celular (login -> produto -> pedido)
- [ ] Validar fluxo completo no notebook

## Fase 1 - Prioridade 2 (Rubrica documental)
Status: INICIAR AGORA

### 1) Contextualizacao e evolucao do produto (1.00)
Entrega esperada:
- problema da loja
- persona/cliente
- evolucao por fases

Arquivo alvo sugerido:
- docs/01-contexto-e-evolucao.md

### 2) DER (0.50)
Entrega esperada:
- entidades principais e relacionamentos

Arquivo alvo sugerido:
- docs/02-der.md

### 3) Requisitos funcionais e nao funcionais (1.00)
Entrega esperada:
- lista RF e RNF rastreavel

Arquivo alvo sugerido:
- docs/03-requisitos.md

### 4) 2 casos de uso (0.50)
Entrega esperada:
- UC01 e UC02 com ator, pre-condicao, fluxo principal, excecoes

Arquivo alvo sugerido:
- docs/04-casos-de-uso.md

### 5) 2 diagramas de atividades (0.50)
Entrega esperada:
- fluxo de cadastro de produto
- fluxo de criacao/atualizacao de pedido

Arquivo alvo sugerido:
- docs/05-atividades.md

### 6) 2 diagramas de sequencia (0.50)
Entrega esperada:
- upload de foto do produto
- criacao de pedido

Arquivo alvo sugerido:
- docs/06-sequencia.md

### 7) Controle funcional admin e usuario (2.00)
Entrega esperada:
- regra clara por perfil
- evidencias de permissao/restricao

Arquivo alvo sugerido:
- docs/07-perfis-e-permissoes.md

## Fase 1 - Prioridade 3 (Fechamento da entrega)
Status: AGUARDANDO

Checklist:
- [ ] Revisao final README e MANUAL_USO
- [ ] Checklist de testes (mobile e desktop)
- [ ] Texto final para AVA
- [ ] Pacote final da entrega

## Ordem de execucao recomendada (rapida)
Hoje:
1. Prioridade 2: iniciar docs 01, 03 e 07
2. Validar fluxo no celular e notebook
3. Ajustes pequenos de bug, sem abrir escopo novo

Amanha:
1. Fechar docs 02, 04, 05 e 06
2. Revisao final de entrega
3. Material de apresentacao

## Regra de escopo ate entrega
Nao incluir agora:
- modulo condicional completo
- automacao avancada de recebimento
- grandes refactors de arquitetura

Esses itens entram no roadmap pos-entrega.
