# 04 - Casos de Uso

## UC01 - Cadastrar produto com foto
### Ator principal
Administrador

### Objetivo
Cadastrar um novo produto no catalogo, com dados comerciais e imagem.

### Pre-condicoes
- Usuario autenticado.
- Categoria disponivel ou opcao de categoria padrao.

### Fluxo principal
1. Administrador acessa modulo Produtos.
2. Clica em Novo Produto.
3. Informa nome, preco, custo, quantidade e descricao.
4. Seleciona foto (galeria ou camera).
5. Sistema valida formato/tamanho da imagem.
6. Sistema envia imagem e recebe URL.
7. Sistema grava produto com imagem.
8. Sistema apresenta confirmacao e retorna para listagem.

### Fluxos alternativos
- A1: imagem invalida
1. Sistema recusa envio e mostra mensagem de erro.
2. Administrador seleciona outra imagem e repete o processo.

- A2: sem categoria selecionada
1. Sistema utiliza categoria padrao Sem categoria.
2. Produto e salvo normalmente.

### Pos-condicoes
- Produto persistido e disponivel para consulta e venda.

## UC02 - Registrar pedido de venda
### Ator principal
Administrador (ou usuario operacional autorizado)

### Objetivo
Criar pedido com item de produto e quantidade valida para registrar venda.

### Pre-condicoes
- Usuario autenticado.
- Produto com estoque maior que zero.

### Fluxo principal
1. Ator acessa modulo Pedidos.
2. Clica em Novo Pedido.
3. Seleciona cliente (opcional).
4. Seleciona produto.
5. Informa quantidade.
6. Sistema valida quantidade e disponibilidade.
7. Sistema cria pedido com status inicial PENDENTE.
8. Sistema exibe pedido na listagem.

### Fluxos alternativos
- A1: quantidade invalida
1. Sistema exibe erro e bloqueia criacao.

- A2: estoque insuficiente
1. Sistema exibe erro de estoque.
2. Ator ajusta quantidade ou seleciona outro produto.

### Pos-condicoes
- Pedido registrado com itens e status inicial.
