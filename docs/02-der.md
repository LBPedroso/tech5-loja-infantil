# 02 - DER (Diagrama Entidade Relacionamento)

## 1. Visao geral
O modelo de dados da aplicacao foi organizado para suportar autenticacao, catalogo de produtos, fluxo de pedidos e apoio financeiro.

## 2. Entidades principais
- Usuario
- Categoria
- Produto
- Cliente
- Pedido
- ItemPedido
- TransacaoFinanceira

## 3. Relacionamentos
- Usuario 1:N Pedido
- Cliente 1:N Pedido (opcional no pedido)
- Categoria 1:N Produto
- Pedido 1:N ItemPedido
- Produto 1:N ItemPedido
- Usuario 1:N TransacaoFinanceira

## 4. DER em Mermaid
```mermaid
erDiagram
    USUARIO ||--o{ PEDIDO : cria
    CLIENTE ||--o{ PEDIDO : possui
    CATEGORIA ||--o{ PRODUTO : classifica
    PEDIDO ||--|{ ITEM_PEDIDO : contem
    PRODUTO ||--o{ ITEM_PEDIDO : participa
    USUARIO ||--o{ TRANSACAO_FINANCEIRA : registra

    USUARIO {
      string id
      string nome
      string email
      string cpf
      string senha
      string role
    }

    CATEGORIA {
      string id
      string nome
      string descricao
    }

    PRODUTO {
      string id
      string nome
      string descricao
      string imagemUrl
      decimal preco
      decimal custo
      int quantidade
      string categoriaId
    }

    CLIENTE {
      string id
      string nome
      string telefone
      string email
    }

    PEDIDO {
      string id
      string userId
      string clienteId
      string status
      decimal total
      datetime createdAt
    }

    ITEM_PEDIDO {
      string id
      string pedidoId
      string produtoId
      int quantidade
      decimal preco
    }

    TRANSACAO_FINANCEIRA {
      string id
      string userId
      string tipo
      decimal valor
      string descricao
      datetime data
    }
```

## 5. Regras de negocio associadas ao modelo
- Produto deve ter nome e preco validos.
- Item de pedido deve ter quantidade positiva.
- Criacao de pedido deve validar estoque do produto.
- Upload de foto deve validar extensao e tamanho.
