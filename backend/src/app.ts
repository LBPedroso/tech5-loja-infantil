import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import { env } from "./config/env";

dotenv.config();

const app = express();

const uploadsRoot = path.resolve(__dirname, "../uploads");
const productUploadsDir = path.join(uploadsRoot, "produtos");
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSizeBytes = 3 * 1024 * 1024;

if (!fs.existsSync(productUploadsDir)) {
  fs.mkdirSync(productUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, productUploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : "";
    const uniqueId = `${Date.now()}-${crypto.randomUUID()}`;
    cb(null, `${uniqueId}${safeExt}`);
  },
});

const uploadProdutoImage = multer({
  storage,
  limits: { fileSize: maxImageSizeBytes },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Formato de imagem inválido. Use JPG, PNG ou WEBP."));
      return;
    }
    cb(null, true);
  },
});

// Middlewares
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: "15mb" }));
app.use("/uploads", express.static(uploadsRoot));

// Mock data in-memory
const users: any = [];
const products: any = [];
const categories: any = [];
const orders: any = [];
const clients: any = [];
const transactions: any = [];

const getPagination = (query: any) => {
  const page = Math.max(1, Number(query?.page) || 1);
  const limit = Math.max(1, Number(query?.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const toPaginatedResponse = (data: any[], page: number, limit: number) => {
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = data.slice(start, start + limit);

  return {
    success: true,
    data: {
      data: paged,
      total,
      page,
      limit,
      pages,
    },
  };
};

const ROLES = ["ADMIN", "ESTOQUE", "VENDEDOR", "CAIXA", "USER"] as const;
type RoleName = (typeof ROLES)[number];

const normalizeRole = (user: any): RoleName => {
  const role = String(user?.role || "USER").toUpperCase();
  return (ROLES as readonly string[]).includes(role) ? (role as RoleName) : "USER";
};

const isAdmin = (user: any) => normalizeRole(user) === "ADMIN";
const hasAnyRole = (user: any, allowedRoles: RoleName[]) => allowedRoles.includes(normalizeRole(user));

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
      role: "ADMIN",
    });
  }
};

ensureDefaultAdminUser();

const getUserByToken = (authorization?: string) => {
  const token = authorization?.split(" ")[1];
  if (!token) {
    return null;
  }

  const userId = Number(String(token).replace("mock-token-", ""));
  return users.find((u: any) => u.id === userId) || null;
};

const requireAuth = (req: any, res: any, next: any) => {
  const user = getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Não autorizado" });
  }

  req.authUser = user;
  return next();
};

const requireAdmin = (req: any, res: any, next: any) => {
  const user = req.authUser;
  if (!user || !isAdmin(user)) {
    return res.status(403).json({ success: false, error: "Acesso restrito ao administrador" });
  }

  return next();
};

const requireRoles = (allowedRoles: RoleName[]) => (req: any, res: any, next: any) => {
  const user = req.authUser;
  if (!user || !hasAnyRole(user, allowedRoles)) {
    return res.status(403).json({ success: false, error: "Acesso restrito para este perfil" });
  }

  return next();
};

const sanitizeUserForAdmin = (user: any) => ({
  id: String(user.id),
  nome: user.nome,
  email: user.email,
  cpf: user.cpf || "",
  role: normalizeRole(user),
});

app.post("/api/uploads/produtos", requireAuth, requireRoles(["ADMIN", "ESTOQUE"]), (req: any, res: any) => {

  uploadProdutoImage.single("imagem")(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, error: "Imagem maior que 3MB" });
      }
      return res.status(400).json({ success: false, error: "Falha no upload da imagem" });
    }

    if (err instanceof Error) {
      return res.status(400).json({ success: false, error: err.message });
    }

    const uploadedFile = req.file as Express.Multer.File | undefined;
    if (!uploadedFile) {
      return res.status(400).json({ success: false, error: "Arquivo de imagem não enviado" });
    }

    const url = `${req.protocol}://${req.get("host")}/uploads/produtos/${uploadedFile.filename}`;

    return res.status(201).json({
      success: true,
      data: {
        url,
        fileName: uploadedFile.filename,
        size: uploadedFile.size,
        mimeType: uploadedFile.mimetype,
      },
      message: "Upload realizado com sucesso",
    });
  });
});

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

  const user = { id: Date.now(), email, senha, nome, cpf, role: "USER" };
  users.push(user);
  return res.status(201).json({
    success: true,
    data: { id: String(user.id), email: user.email, role: user.role },
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
      role: normalizeRole(user),
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
      role: normalizeRole(user),
    },
  });
});

app.get("/api/admin/users", requireAuth, requireAdmin, (_req: any, res: any) => {
  return res.json({
    success: true,
    data: users.map(sanitizeUserForAdmin),
  });
});

app.patch("/api/admin/users/:id/role", requireAuth, requireAdmin, (req: any, res: any) => {
  const role = String(req.body?.role || "").toUpperCase();
  if (!(ROLES as readonly string[]).includes(role)) {
    return res.status(400).json({ success: false, error: "Perfil inválido" });
  }

  const targetUser = users.find((u: any) => String(u.id) === String(req.params.id));
  if (!targetUser) {
    return res.status(404).json({ success: false, error: "Usuário não encontrado" });
  }

  const authUser = req.authUser;
  if (String(authUser.id) === String(targetUser.id) && role !== "ADMIN") {
    return res.status(400).json({ success: false, error: "Não é permitido remover o próprio perfil ADMIN" });
  }

  targetUser.role = role;

  return res.json({
    success: true,
    data: sanitizeUserForAdmin(targetUser),
    message: "Perfil atualizado com sucesso",
  });
});

// Categorias endpoints
app.get("/api/categorias", requireAuth, (req: any, res: any) => {
  return res.json(categories);
});

app.post("/api/categorias", requireAuth, requireRoles(["ADMIN", "ESTOQUE"]), (req: any, res: any) => {
  const { nome, descricao } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome obrigatório" });
  const categoria = { id: Date.now(), nome, descricao: descricao || null };
  categories.push(categoria);
  return res.status(201).json(categoria);
});

app.get("/api/categorias/:id", (req: any, res: any) => {
  const cat = categories.find((c: any) => c.id.toString() === req.params.id);
  if (!cat) return res.status(404).json({ error: "Categoria não encontrada" });
  return res.json(cat);
});

app.put("/api/categorias/:id", requireAuth, requireRoles(["ADMIN", "ESTOQUE"]), (req: any, res: any) => {
  const cat = categories.find((c: any) => c.id.toString() === req.params.id);
  if (!cat) return res.status(404).json({ error: "Categoria não encontrada" });
  cat.nome = req.body.nome || cat.nome;
  cat.descricao = req.body.descricao ?? cat.descricao;
  return res.json(cat);
});

app.delete("/api/categorias/:id", requireAuth, requireRoles(["ADMIN", "ESTOQUE"]), (req: any, res: any) => {
  const idx = categories.findIndex((c: any) => c.id.toString() === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Categoria não encontrada" });
  categories.splice(idx, 1);
  return res.json({ message: "Deletado" });
});

// Produtos endpoints
app.get("/api/produtos", requireAuth, (req: any, res: any) => {
  const busca = String(req.query.busca || "").trim().toLowerCase();
  if (!busca) {
    return res.json(products);
  }

  const filtered = products.filter((p: any) => String(p.nome || "").toLowerCase().includes(busca));
  return res.json(filtered);
});

app.post("/api/produtos", requireAuth, requireRoles(["ADMIN", "ESTOQUE"]), (req: any, res: any) => {
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

app.get("/api/produtos/:id", requireAuth, (req: any, res: any) => {
  const prod = products.find((p: any) => p.id.toString() === req.params.id);
  if (!prod) return res.status(404).json({ error: "Produto não encontrado" });
  return res.json(prod);
});

app.put("/api/produtos/:id", requireAuth, requireRoles(["ADMIN", "ESTOQUE"]), (req: any, res: any) => {
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

app.delete("/api/produtos/:id", requireAuth, requireRoles(["ADMIN", "ESTOQUE"]), (req: any, res: any) => {
  const idx = products.findIndex((p: any) => p.id.toString() === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produto não encontrado" });
  products.splice(idx, 1);
  return res.json({ message: "Deletado" });
});

// Pedidos endpoints
app.get("/api/pedidos", requireAuth, (req: any, res: any) => {
  const user = req.authUser;
  if (isAdmin(user)) {
    return res.json(orders);
  }

  const ownOrders = orders.filter((order: any) => String(order.userId) === String(user.id));
  return res.json(ownOrders);
});

app.post("/api/pedidos", requireAuth, requireRoles(["ADMIN", "VENDEDOR"]), (req: any, res: any) => {
  const user = req.authUser;
  const clienteId = req.body.clienteId ?? null;
  const rawItems = req.body.itens ?? req.body.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return res.status(400).json({ error: "Itens do pedido são obrigatórios" });
  }

  const itens = rawItems
    .map((item: any) => {
      const produtoId = String(item?.produtoId || "");
      const quantidade = Number(item?.quantidade);
      const produto = products.find((p: any) => p.id.toString() === produtoId);

      if (!produto || !Number.isInteger(quantidade) || quantidade <= 0) {
        return null;
      }

      if (Number(produto.quantidade) < quantidade) {
        return { error: `Estoque insuficiente para ${produto.nome}` };
      }

      return {
        produtoId,
        quantidade,
        preco: Number(produto.preco),
        produto: {
          id: produto.id,
          nome: produto.nome,
        },
      };
    })
    .filter((item: any) => item !== null);

  const invalidItem = itens.find((item: any) => item?.error);
  if (invalidItem?.error) {
    return res.status(400).json({ error: invalidItem.error });
  }

  if (itens.length === 0) {
    return res.status(400).json({ error: "Itens do pedido inválidos" });
  }

  for (const item of itens as any[]) {
    const produto = products.find((p: any) => p.id.toString() === item.produtoId);
    if (produto) {
      produto.quantidade = Number(produto.quantidade) - Number(item.quantidade);
    }
  }

  const total = itens.reduce((acc: number, item: any) => acc + item.preco * item.quantidade, 0);
  const order = {
    id: Date.now(),
    userId: user.id,
    clienteId,
    total,
    status: "PENDENTE",
    itens,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return res.status(201).json(order);
});

app.get("/api/pedidos/:id", requireAuth, (req: any, res: any) => {
  const order = orders.find((o: any) => o.id.toString() === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido não encontrado" });

  const user = req.authUser;
  if (!isAdmin(user) && String(order.userId) !== String(user.id)) {
    return res.status(403).json({ success: false, error: "Acesso restrito ao pedido do próprio usuário" });
  }

  return res.json(order);
});

app.put("/api/pedidos/:id/status", requireAuth, requireRoles(["ADMIN", "CAIXA"]), (req: any, res: any) => {
  const order = orders.find((o: any) => o.id.toString() === req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
  order.status = req.body.status || order.status;
  return res.json(order);
});

app.delete("/api/pedidos/:id", requireAuth, requireRoles(["ADMIN"]), (req: any, res: any) => {
  const idx = orders.findIndex((o: any) => o.id.toString() === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Pedido não encontrado" });
  orders.splice(idx, 1);
  return res.json({ message: "Deletado" });
});

// Clientes endpoints
app.get("/api/clientes", requireAuth, requireRoles(["ADMIN", "VENDEDOR"]), (req: any, res: any) => {
  const { page, limit } = getPagination(req.query);
  return res.json(toPaginatedResponse(clients, page, limit));
});

app.post("/api/clientes", requireAuth, requireRoles(["ADMIN", "VENDEDOR"]), (req: any, res: any) => {
  const nome = String(req.body?.nome || "").trim();
  if (nome.length < 3) {
    return res.status(400).json({ success: false, error: "Nome do cliente deve ter pelo menos 3 caracteres" });
  }

  const cliente = {
    id: Date.now(),
    nome,
    telefone: req.body?.telefone || null,
    email: req.body?.email || null,
    observacoes: req.body?.observacoes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  clients.push(cliente);
  return res.status(201).json({ success: true, data: cliente });
});

app.put("/api/clientes/:id", requireAuth, requireRoles(["ADMIN", "VENDEDOR"]), (req: any, res: any) => {
  const cliente = clients.find((c: any) => String(c.id) === String(req.params.id));
  if (!cliente) {
    return res.status(404).json({ success: false, error: "Cliente não encontrado" });
  }

  const nome = String(req.body?.nome || cliente.nome).trim();
  if (nome.length < 3) {
    return res.status(400).json({ success: false, error: "Nome do cliente deve ter pelo menos 3 caracteres" });
  }

  cliente.nome = nome;
  cliente.telefone = req.body?.telefone ?? cliente.telefone;
  cliente.email = req.body?.email ?? cliente.email;
  cliente.observacoes = req.body?.observacoes ?? cliente.observacoes;
  cliente.updatedAt = new Date().toISOString();

  return res.json({ success: true, data: cliente });
});

app.delete("/api/clientes/:id", requireAuth, requireRoles(["ADMIN"]), (req: any, res: any) => {
  const idx = clients.findIndex((c: any) => String(c.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Cliente não encontrado" });
  }

  clients.splice(idx, 1);
  return res.json({ success: true, message: "Cliente excluído com sucesso" });
});

// Financeiro endpoints
app.get("/api/financeiro", requireAuth, requireRoles(["ADMIN", "CAIXA"]), (req: any, res: any) => {
  const { page, limit } = getPagination(req.query);
  const tipo = String(req.query?.tipo || "").toUpperCase();
  const filtered = tipo ? transactions.filter((t: any) => String(t.tipo).toUpperCase() === tipo) : transactions;
  return res.json(toPaginatedResponse(filtered, page, limit));
});

app.get("/api/financeiro/resumo", requireAuth, requireRoles(["ADMIN", "CAIXA"]), (_req: any, res: any) => {
  const totalEntradas = transactions
    .filter((t: any) => t.tipo === "ENTRADA")
    .reduce((acc: number, t: any) => acc + Number(t.valor || 0), 0);

  const totalSaidas = transactions
    .filter((t: any) => t.tipo === "SAIDA")
    .reduce((acc: number, t: any) => acc + Number(t.valor || 0), 0);

  const saldo = totalEntradas - totalSaidas;

  return res.json({
    success: true,
    data: {
      totalEntradas,
      totalSaidas,
      saldo,
      faturamentoMensal: 0,
      custoProdutosMensal: 0,
      lucroLiquidoMensal: 0,
      ticketMedioMensal: 0,
      totalVendasMensal: 0,
      mesAtual: {
        entradas: totalEntradas,
        saidas: totalSaidas,
        saldo,
      },
    },
  });
});

app.post("/api/financeiro", requireAuth, requireRoles(["ADMIN", "CAIXA"]), (req: any, res: any) => {
  const tipo = String(req.body?.tipo || "").toUpperCase();
  const valor = Number(req.body?.valor);

  if (!["ENTRADA", "SAIDA"].includes(tipo)) {
    return res.status(400).json({ success: false, error: "Tipo de transação inválido" });
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    return res.status(400).json({ success: false, error: "Valor deve ser maior que zero" });
  }

  const transacao = {
    id: Date.now(),
    tipo,
    valor,
    descricao: req.body?.descricao || null,
    data: req.body?.data || new Date().toISOString().slice(0, 10),
    userId: String(req.authUser.id),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  transactions.push(transacao);
  return res.status(201).json({ success: true, data: transacao });
});

app.delete("/api/financeiro/:id", requireAuth, requireRoles(["ADMIN", "CAIXA"]), (req: any, res: any) => {
  const idx = transactions.findIndex((t: any) => String(t.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Transação não encontrada" });
  }

  transactions.splice(idx, 1);
  return res.json({ success: true, message: "Transação excluída" });
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
