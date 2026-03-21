import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log("📚 Documentação das rotas:");
  console.log("  POST   /api/auth/signup - Cadastro");
  console.log("  POST   /api/auth/login - Login");
  console.log("  GET    /api/auth/me - Dados do usuário");
  console.log("  PUT    /api/auth/me - Editar usuário");
  console.log("  GET    /api/categorias - Listar categorias");
  console.log("  POST   /api/categorias - Criar categoria (autenticado)");
  console.log("  GET    /api/categorias/:id - Obter categoria");
  console.log("  PUT    /api/categorias/:id - Editar categoria (autenticado)");
  console.log("  DELETE /api/categorias/:id - Deletar categoria (autenticado)");
  console.log("  GET    /api/produtos - Listar produtos");
  console.log("  POST   /api/produtos - Criar produto (autenticado)");
  console.log("  GET    /api/produtos/:id - Obter produto");
  console.log("  PUT    /api/produtos/:id - Editar produto (autenticado)");
  console.log("  DELETE /api/produtos/:id - Deletar produto (autenticado)");
  console.log("  GET    /api/pedidos - Listar pedidos (autenticado)");
  console.log("  POST   /api/pedidos - Criar pedido (autenticado)");
  console.log("  GET    /api/pedidos/:id - Obter pedido (autenticado)");
  console.log("  PUT    /api/pedidos/:id/status - Atualizar pedido (autenticado)");
  console.log("  DELETE /api/pedidos/:id - Deletar pedido (autenticado)");
});
