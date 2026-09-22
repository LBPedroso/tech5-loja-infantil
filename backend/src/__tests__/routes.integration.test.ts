import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Integracao de rotas principais", () => {
  it("GET /health deve responder status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(typeof response.body.timestamp).toBe("string");
  });

  it("POST /api/auth/login deve retornar 401 para credenciais invalidas", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "email-inexistente@email.com", senha: "Senha123!" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Credenciais inválidas");
  });

  it("POST /api/auth/signup deve cadastrar com campos obrigatorios", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ nome: "Lua", email: "lua@email.com", senha: "Senha123!" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("lua@email.com");
  });

  it("GET /api/produtos sem token deve retornar 401", async () => {
    const response = await request(app).get("/api/produtos");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("GET /api/pedidos sem token deve retornar 401", async () => {
    const response = await request(app).get("/api/pedidos");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("GET /api/financeiro/resumo sem token deve retornar 401", async () => {
    const response = await request(app).get("/api/financeiro/resumo");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/categorias deve preservar a descricao", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@liligu.com", senha: "Admin123!" });

    const response = await request(app)
      .post("/api/categorias")
      .set("Authorization", `Bearer ${login.body.data.token}`)
      .send({ nome: `Categoria descricao ${Date.now()}`, descricao: "Comentario da categoria" });

    expect(response.status).toBe(201);
    expect(response.body.descricao).toBe("Comentario da categoria");
  });
});
