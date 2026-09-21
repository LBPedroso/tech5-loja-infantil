# 03 - Requisitos Funcionais e Nao Funcionais

## 1. Requisitos Funcionais (RF)
### RF01 - Autenticacao
O sistema deve permitir login de usuario para acesso ao painel administrativo.

### RF02 - Cadastro de categorias
O sistema deve permitir criar, listar, editar e excluir categorias de produtos.

### RF03 - Cadastro de produtos
O sistema deve permitir criar, listar, editar e excluir produtos com os campos nome, preco, custo, quantidade, categoria e descricao.

### RF04 - Foto do produto
O sistema deve permitir anexar foto de produto por galeria ou camera e salvar a referencia da imagem.

### RF05 - Validacao de imagem
O sistema deve validar tipo de arquivo, tamanho maximo e tratar colisao de nome no upload.

### RF06 - Cadastro de pedidos
O sistema deve permitir criar pedido com pelo menos um item de produto e quantidade valida.

### RF07 - Listagem de pedidos
O sistema deve permitir listar pedidos, incluindo status, itens e informacoes basicas de acompanhamento.

### RF08 - Atualizacao de status de pedido
O sistema deve permitir alterar status do pedido para controle operacional.

### RF09 - Navegacao por modulos
O sistema deve disponibilizar navegacao entre Home, Clientes, Categorias, Produtos, Pedidos, Financeiro e Perfil.

### RF10 - Operacao em producao
O sistema deve operar em ambiente online para testes e demonstracao academica.

## 2. Requisitos Nao Funcionais (RNF)
### RNF01 - Usabilidade
A interface deve ser simples, com fluxo claro para uso em celular e notebook.

### RNF02 - Compatibilidade
A aplicacao deve funcionar em navegadores modernos e telas de diferentes tamanhos.

### RNF03 - Seguranca basica
As rotas sensiveis devem exigir autenticacao.

### RNF04 - Confiabilidade de upload
O upload de imagem deve tratar falhas com mensagens de erro compreensiveis ao usuario.

### RNF05 - Performance
A aplicacao deve responder em tempo adequado para operacoes de cadastro/listagem em ambiente de pequeno porte.

### RNF06 - Manutenibilidade
O projeto deve manter componentizacao no frontend e separacao de responsabilidades no backend.

### RNF07 - Qualidade de codigo
O projeto deve suportar build e testes automatizados para reduzir regressao.

### RNF08 - Rastreabilidade academica
A documentacao deve permitir mapear funcionalidades para os criterios da rubrica.

## 3. Matriz rapida de rastreio
- RF01 -> Auth
- RF02 -> Categorias
- RF03/RF04/RF05 -> Produtos + Upload
- RF06/RF07/RF08 -> Pedidos
- RF09 -> Dashboard/Navegacao
- RF10 -> Deploy Render/Vercel
- RNF01/RNF02 -> UX responsiva
- RNF03 -> Protecao por token
- RNF04 -> Validacoes de imagem
- RNF05 -> Operacao fluida
- RNF06/RNF07 -> Estrutura e testes
- RNF08 -> Pasta docs da entrega
