# Manual de Uso - Lili&Gu Moda Infantil

## 1. Objetivo
Este manual descreve o uso do sistema administrativo da loja, cobrindo autenticacao, cadastro de usuarios, clientes, categorias, produtos, pedidos e financeiro.

## 2. Ambientes
- Frontend: https://tech5-loja-infantil.vercel.app/
- Backend (API): https://tech5-loja-infantil-api.onrender.com
- Health check: https://tech5-loja-infantil-api.onrender.com/health

## 3. Credenciais de administrador
- Email: admin@liligu.com
- Senha: Admin123!

## 4. Fluxo recomendado de uso
1. Entrar no sistema com email e senha.
2. Cadastrar categorias.
3. Cadastrar produtos com preco, custo e estoque.
4. Cadastrar clientes (opcional, mas recomendado).
5. Criar pedidos e vincular cliente quando necessario.
6. Atualizar status dos pedidos para ENTREGUE quando finalizados.
7. Lancar entradas e saidas no modulo Financeiro.
8. Acompanhar Home/Relatorio Financeiro e conferir lucro do mes.

## 5. Modulos disponiveis
- Home: dados do usuario + relatorio financeiro mensal.
- Clientes: CRUD completo com paginacao.
- Categorias: CRUD completo com paginacao.
- Produtos: CRUD completo com paginacao, busca por nome e campo de custo.
- Pedidos: CRUD completo com paginacao, filtro por status e vinculo opcional a cliente.
- Financeiro: transacoes de ENTRADA/SAIDA, resumo geral e mensal.
- Meu Perfil: edicao de nome, CPF e senha.

## 6. Regras de negocio principais
- Autenticacao com JWT; rotas protegidas exigem token valido.
- Senha de usuario e armazenada criptografada.
- CPF e email sao validados no cadastro e edicao.
- Email nao pode ser alterado na edicao de perfil.
- Pedido so e criado com estoque suficiente.
- Estoque e atualizado automaticamente ao criar/excluir pedidos.
- Lucro liquido mensal considera:
  - faturamento mensal de pedidos ENTREGUES
  - menos custo dos produtos vendidos no mes
  - menos saidas lancadas no financeiro

## 7. Filtros e consultas uteis
- Produtos: busca por nome.
- Pedidos: filtro por status.
- Financeiro: filtro por tipo (ENTRADA/SAIDA).

## 8. Cadastro de foto do produto (galeria/camera)
- No formulario de produto, use os botoes:
  - `Escolher da galeria` para selecionar foto existente.
  - `Tirar foto` para abrir a camera.
- O sistema faz upload real no backend (multipart/form-data) e salva a URL da imagem no produto.
- Regras de validacao da imagem:
  - Extensoes aceitas: JPG, PNG, WEBP.
  - Tamanho maximo: 3MB.
  - Nome do arquivo: gerado automaticamente com identificador unico para evitar colisao.
- Se a imagem for invalida, o sistema exibe mensagem de erro antes de salvar o produto.

## 9. Solucao rapida de problemas
- Erro 401/403: entrar novamente para renovar sessao.
- Erro de CORS em producao: conferir CORS_ORIGIN no Render.
- Deploy sem refletir mudancas de banco: conferir migrations no repositorio e no deploy logs.
- Dados financeiros zerados: verificar se existem pedidos ENTREGUES no mes e transacoes cadastradas.

- Erro ao enviar foto:
  - confirme se o arquivo tem ate 3MB;
  - confirme se a extensao e JPG/PNG/WEBP;
  - em celular, tente novamente via `Escolher da galeria`.

## 10. Checklist de envio da atividade
1. Confirmar backend sem erros: `npx tsc --noEmit`.
2. Confirmar frontend buildando: `npm run build`.
3. Confirmar testes: `npm test` no backend.
4. Gerar ZIP sem `node_modules`, `.git` e `dist`.
5. Validar tamanho final do ZIP (limite 150 MB).
6. Enviar link do repositorio + ZIP da entrega.

## 11. Referencias
- Repositorio: https://github.com/LBPedroso/tech5-loja-infantil.git
- Guia tecnico: README.md
