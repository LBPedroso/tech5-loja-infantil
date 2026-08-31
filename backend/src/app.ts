import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "15mb" }));

// Mock data in-memory
const users: any = [];
const products: any = [];
const categories: any = [];
const orders: any = [];

const ensureDefaultAdminUser = () => {
  const adminEmail = "admin@liligu.com";
  const exists = users.some((u: any) => u.email === adminEmail);

  if (!exists) {
    users.push({
      id: Date.now(),
      email: adminEmail,
      senha: "Admin123!",
      nome: "Administrador Lili&Gu",
      cpf: "52998224725",
    });
  }
};

ensureDefaultAdminUser();

// Auth endpoints
app.post("/api/auth/signup", (req: any, res: any) => {
  const email = req.body.email;
  const senha = req.body.senha || req.body.password;
  const nome = req.body.nome || req.body.name;
  const cpf = req.body.cpf || null;

  if (!email || !senha || !nome) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  const alreadyExists = users.some((u: any) => u.email === email);
  if (alreadyExists) {
    return res.status(409).json({ error: "Email já cadastrado" });
  }

  const user = { id: Date.now(), email, senha, nome, cpf };
  users.push(user);
  return res.status(201).json({
    success: true,
    data: { id: String(user.id), email: user.email },
    message: "Usuário cadastrado com sucesso",
  });
});

app.post("/api/auth/login", (req: any, res: any) => {
  const email = req.body.email;
  const senha = req.body.senha || req.body.password;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const user = users.find((u: any) => u.email === email && u.senha === senha);
  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  return res.json({
    success: true,
    data: {
      id: String(user.id),
      email: user.email,
      token: "mock-token-" + user.id,
    },
    message: "Login realizado com sucesso",
  });
});

app.get("/api/auth/me", (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const userId = Number(String(token).replace("mock-token-", ""));
  const user = users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Token inválido" });
  }

  return res.json({
    success: true,
    data: {
      id: String(user.id),
      email: user.email,
      nome: user.nome,
      cpf: user.cpf || "",
    },
  });
});

// Categorias endpoints
app.get("/api/categorias", (req: any, res: any) => {
  return res.json(categories);
});

app.post("/api/categorias", (req: any, res: any) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome obrigatório" });
  const categoria = { id: Date.now(), nome };
  categories.push(categoria);
  return res.status(201).json(categoria);
});

app.get("/api/categorias/:id", (req: any, res: any) => {
  const cat = categories.find((c: any) => c.id.toString() === req.params.id);
  if (!cat) return res.status(404).json({ error: "Categoria não encontrada" });
  return res.json(cat);
});

app.put("/api/categorias/:id", (req: any, res: any) => {
  const cat = categories.find((c: any) => c.id.toString() === req.params.id);
  if (!cat) return res.status(404).json({ error: "Categoria não encontrada" });
  cat.nome = req.body.nome || cat.nome;
  return res.json(cat);
});

app.delete("/api/categorias/:id", (req: any, res: any) => {
  const idx = categories.findIndex((c: any) => c.id.toString() === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Categoria não encontrada" });
  categories.splice(idx, 1);
  return res.json({ message: "Deletado" });
});

// Produtos endpoints
app.get("/api/produtos", (req: any, res: any) => {
  const busca = String(req.query.busca || "").trim().toLowerCase();
  if (!busca) {
    return res.json(products);
  }

  const filtered = products.filter((p: any) => String(p.nome || "").toLowerCase().includes(busca));
  return res.json(filtered);
});

app.post("/api/produtos", (req: any, res: any) => {
  const { nome, preco, custo, quantidade, categoriaId, descricao, imagemUrl } = req.body;
  if (!nome || !preco) return res.status(400).json({ error: "Nome e preço obrigatórios" });

  const categoria = categories.find((c: any) => c.id.toString() === String(categoriaId));
  const produto = {
    id: Date.now(),
    nome,
    descricao: descricao || null,
    imagemUrl: imagemUrl || null,
    preco,
    custo: custo ?? 0,
    quantidade: quantidade ?? 0,
    categoriaId: categoriaId || null,
    categoria: categoria || null,
  };
  products.push(produto);
  return res.status(201).json(produto);
});

app.get("/api/produtos/:id", (req: any, res: any) => {
  const prod = products.find((p: any) => p.id.toString() === req.params.id);
  if (!prod) return res.status(404).json({ error: "Produto não encontrado" });
  return res.json(prod);
});

app.put("/api/produtos/:id", (req: any, res: any) => {
  const prod = products.find((p: any) => p.id.toString() === req.params.id);
  if (!prod) return res.status(404).json({ error: "Produto não encontrado" });
  prod.nome = req.body.nome || prod.nome;
  prod.descricao = req.body.descricao ?? prod.descricao;
  prod.imagemUrl = req.body.imagemUrl ?? prod.imagemUrl;
  prod.preco = req.body.preco ?? prod.preco;
  prod.custo = req.body.custo ?? prod.custo;
  prod.quantidade = req.body.quantidade ?? prod.quantidade;
  prod.categoriaId = req.body.categoriaId ?? prod.categoriaId;

  if (req.body.categoriaId) {
    const categoria = categories.find((c: any) => c.id.toString() === String(req.body.categoriaId));
    prod.categoria = categoria || null;
  }

  return res.json(prod);
});

app.delete("/api/produtos/:id", (req: any, res: any) => {
  const idx = products.findIndex((p: any) => p.id.toString() === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produto não encontrado" });
  products.splice(idx, 1);
  return res.json({ message: "Deletado" });
});

// Pedidos endpoints
app.get("/api/pedidos", (req: any, res: any) => {
  return res.json(orders);
});

app.post("/api/pedidos", (req: any, res: any) => {
  const { clienteId, items } = req.body;
  if (!clienteId || !items) return res.status(400).json({ error: "Dados obrigatórios" });
  const order = { id: Date.now(), clienteId, items, status: "pendente" };
  orders.push(order);
  return res.status(201).json(order);
});

app.get("/api/pedidos/:id", (req: any, res: any) => {
  const order = orders.find((o: any) => o.id.toString() === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
  return res.json(order);
});

app.put("/api/pedidos/:id/status", (req: any, res: any) => {
  const order = orders.find((o: any) => o.id.toString() === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
  order.status = req.body.status || order.status;
  return res.json(order);
});

app.delete("/api/pedidos/:id", (req: any, res: any) => {
  const idx = orders.findIndex((o: any) => o.id.toString() === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Pedido não encontrado" });
  orders.splice(idx, 1);
  return res.json({ message: "Deletado" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404
app.use((req: any, res: any) => {
  return res.status(404).json({ success: false, error: "Rota não encontrada" });
});

export default app;
