# ERP/PDV Blueprint - Lili&Gu Moda Infantil

## Objetivo
Evoluir o painel administrativo atual para um ERP/PDV comercial e financeiro, mantendo simplicidade operacional para uso no celular e no notebook.

## Escopo Funcional

### 1) Vendas (PDV / Checkout)
- Fluxo de carrinho e fechamento de venda.
- Busca de produtos por nome, categoria, codigo de barras ou QR.
- Pagamentos: dinheiro, pix, debito e credito (1x a 12x).
- Calculo automatico de taxa e valor liquido por pagamento.
- Baixa automatica de estoque ao concluir venda.
- Emissao de recibo simples (impressao e compartilhamento).

### 2) Financeiro Automatizado
- Entrada de caixa automatica por venda concluida.
- Conta a receber quando meio de pagamento tiver prazo D+n.
- Cadastro de despesas fixas e variaveis.
- Recorrencia para custos fixos mensais.
- DRE simplificado mensal com faturamento bruto/liquido, CMV, despesas e lucro liquido.

### 3) Produtos e Estoque
- Produto pode existir sem categoria.
- Upload de imagem via camera, galeria ou URL.
- Campos: custo, preco de venda, estoque atual, estoque minimo.
- Historico de movimentacao de estoque por entrada/saida/ajuste/perda.

### 4) Configuracoes Financeiras
- Tabela de taxas por metodo e parcelamento.
- Prazo de recebimento por metodo.

### 5) Usuarios e Permissoes (RBAC)
- ADMIN: acesso total.
- OPERADOR: acesso a vendas, clientes, produtos e estoque sem visao de lucro/despesas sensiveis.

## Estrutura de Rotas da API

### Auth
- POST /api/auth/login
- POST /api/auth/signup
- GET /api/auth/me

### Usuarios / RBAC
- GET /api/users
- POST /api/users
- PATCH /api/users/:id/role
- GET /api/roles
- GET /api/permissions

### Categorias
- GET /api/categories
- POST /api/categories
- PATCH /api/categories/:id
- DELETE /api/categories/:id

### Produtos
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PATCH /api/products/:id
- PATCH /api/products/:id/category
- PATCH /api/products/:id/stock-min
- DELETE /api/products/:id

### Upload e Midia
- POST /api/uploads/product-image
- POST /api/products/:id/images
- DELETE /api/products/:id/images/:imageId
- PATCH /api/products/:id/images/:imageId/primary

### Estoque
- GET /api/stock/movements
- POST /api/stock/entries
- POST /api/stock/adjustments
- POST /api/stock/losses
- GET /api/stock/alerts

### Vendas / PDV
- POST /api/pos/carts/preview
- POST /api/sales
- GET /api/sales
- GET /api/sales/:id
- POST /api/sales/:id/cancel
- GET /api/sales/:id/receipt
- POST /api/sales/:id/receipt/whatsapp

### Financeiro
- GET /api/financial/cashflow
- GET /api/financial/receivables
- PATCH /api/financial/receivables/:id/confirm
- GET /api/financial/expenses
- POST /api/financial/expenses
- PATCH /api/financial/expenses/:id
- PATCH /api/financial/expenses/:id/pay
- GET /api/financial/dre?month=YYYY-MM

### Configuracoes
- GET /api/settings/payment-fees
- POST /api/settings/payment-fees
- PATCH /api/settings/payment-fees/:id
- DELETE /api/settings/payment-fees/:id

## Estrutura Frontend (Componentes/Paginas)

### Paginas
- LoginPage
- DashboardPage
- PosCheckoutPage
- SalesHistoryPage
- ProductsPage
- CategoriesPage
- StockPage
- CustomersPage
- FinancialCashflowPage
- FinancialExpensesPage
- FinancialDrePage
- FinancialSettingsPage
- UsersPermissionsPage

### Componentes de PDV
- PosSearchInput
- PosProductGrid
- PosCart
- PosPaymentPanel
- PosInstallmentsSelector
- PosSummary
- ReceiptModal
- WhatsAppShareButton

### Componentes de Produtos
- ProductForm
- ProductImagePicker
- ProductImagePreview
- ProductList
- ProductCard
- ProductFilters

### Componentes de Financeiro
- CashflowTable
- ReceivablesBoard
- ExpenseForm
- RecurrenceForm
- DreCards
- DreMonthlyChart

### Componentes de Estoque
- StockMovementTable
- StockAdjustmentForm
- StockAlertsPanel

## Fluxo Critico de Checkout (Transacional)
1. Validar carrinho e estoque disponivel.
2. Calcular total bruto e descontos.
3. Aplicar regras de taxa por metodo/parcelamento.
4. Persistir venda, itens e pagamentos.
5. Debitar estoque e registrar movimentacao.
6. Gerar caixa ou contas a receber.
7. Gerar recibo.
8. Retornar resumo completo para tela de confirmacao.

## Fluxo de Upload de Imagem (Celular + Notebook)
1. Operador escolhe camera/galeria/arquivo.
2. Frontend comprime para webp/jpeg com limite de tamanho.
3. Upload para storage externo (Cloudinary/S3/Supabase Storage).
4. API recebe URL final e vincula no produto.
5. Lista de produtos exibe miniatura automaticamente.

## Fases de Entrega (Sequencial)

### Fase 1 - Base Comercial
- Entidade de vendas (sales) substituindo pedidos.
- Checkout com baixa automatica de estoque.
- Produto sem categoria obrigatoria.
- Upload de imagem por camera/galeria/arquivo.

### Fase 2 - Regras de Pagamento
- Taxas por metodo e parcelamento.
- Prazos D+n e contas a receber.

### Fase 3 - Financeiro Operacional
- Despesas fixas/variaveis.
- Recorrencia mensal.
- Fluxo de caixa consolidado.

### Fase 4 - DRE e Gestao
- DRE simplificado mensal.
- Indicadores de margem e lucro liquido.
- Bloqueios RBAC por perfil.

### Fase 5 - Expansao
- Recibo em PDF.
- Compartilhamento WhatsApp.
- Performance, auditoria e refinamento de UX.

## KPIs Minimos
- Faturamento bruto x liquido.
- Taxa media de pagamento.
- CMV mensal.
- Margem bruta.
- Despesas operacionais.
- Lucro liquido.
- Giro de estoque.
- Produtos abaixo do estoque minimo.

## Referencias de Implementacao
- Schema de dados inicial: backend/prisma/schema.prisma
- APIs devem usar transacao atomica no checkout para consistencia.
- Upload de imagem deve ser assinado e armazenado fora da API.
