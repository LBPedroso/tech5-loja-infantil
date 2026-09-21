# 08 - Planilha de Avaliacao da Rubrica Tech7

## Criterio de leitura
- **Atendido**: requisito implementado e evidenciado.
- **Parcial**: requisito existe, mas com ponto de melhoria para robustez maxima.
- **Estimativa**: previsao tecnica (a nota oficial depende da avaliacao do professor).

## Planilha (Item x Entrega x Nota Estimada)
| Bloco | Item da Rubrica | Peso | Status | Evidencia principal | Nota estimada no item |
|---|---|---:|---|---|---:|
| Desenvolvimento Mobile | Arquitetura e padronizacao de projeto | 0.5 | Atendido | Estrutura por modulos e componentes, separacao frontend/backend | 0.5 |
| Desenvolvimento Mobile | Componentizacao e boas praticas (clean code) | 1.0 | Atendido | Componentes por dominio e fluxo de manutencao por fases | 0.9 |
| Desenvolvimento Mobile | CRUD completo com app x API x banco | 1.0 | Parcial | CRUDs operacionais funcionando, com ponto de atencao em persistencia pos-restart | 0.7 |
| Desenvolvimento Mobile | Regra de negocio respeitada | 0.5 | Atendido | Validacoes em produto/pedido/upload e controle de estoque no pedido | 0.5 |
| Desenvolvimento Mobile | Usabilidade, funcionalidade, compatibilidade e seguranca | 1.0 | Parcial | Testes mobile/desktop, login e upload funcionando; pendencia de refinamento final | 0.8 |
| Eng. e Analise | Contextualizacao e evolucao do produto | 1.0 | Atendido | [docs/01-contexto-e-evolucao.md](docs/01-contexto-e-evolucao.md) | 1.0 |
| Eng. e Analise | Diagrama entidade relacionamento | 0.5 | Atendido | [docs/02-der.md](docs/02-der.md) | 0.5 |
| Eng. e Analise | Requisitos funcionais e nao funcionais | 1.0 | Atendido | [docs/03-requisitos.md](docs/03-requisitos.md) | 1.0 |
| Eng. e Analise | Minimo 2 casos de uso | 0.5 | Atendido | [docs/04-casos-de-uso.md](docs/04-casos-de-uso.md) | 0.5 |
| Eng. e Analise | Minimo 2 atividades | 0.5 | Atendido | [docs/05-atividades.md](docs/05-atividades.md) | 0.5 |
| Eng. e Analise | Minimo 2 sequencias | 0.5 | Atendido | [docs/06-sequencia.md](docs/06-sequencia.md) | 0.5 |
| Tech Forge | Receber e salvar imagem com Multer | 1.0 | Atendido | Endpoint de upload e fluxo de foto produto validado em producao | 1.0 |
| Tech Forge | Validar extensao, tamanho e colisao | 1.0 | Atendido | Validacoes de MIME, limite de tamanho e nome unico de arquivo | 1.0 |
| Tech Forge | Controle funcional admin e usuario | 2.0 | Parcial | Base funcional de autenticacao + documento de perfis; RBAC completo como evolucao | 1.3 |

## Resultado estimado
- **Total estimado (rubrica principal): 10.7 / 12.0**
- **Equivalencia aproximada na escala 0-10: 8.9 / 10.0**

## Observacao importante
A nota acima e uma **estimativa tecnica**. A nota oficial depende da leitura do professor, da apresentacao e das evidencias demonstradas no dia.

## Para aumentar chance de nota maxima
1. Demonstrar fluxo completo ao vivo (login -> produto com foto -> pedido).
2. Mostrar os 7 documentos da pasta [docs](docs).
3. Explicar claramente o que ja esta pronto e o que e roadmap pos-entrega.
