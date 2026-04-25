import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Integracao de rotas principais", () => {
  it("GET /health deve responder status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("POST /api/auth/login deve validar email invalido", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "email-invalido", senha: "Senha123!" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Erro de validação");
  });

  it("POST /api/auth/signup deve exigir campos obrigatorios", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ nome: "Lua", email: "lua@email.com", senha: "Senha123!" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Erro de validação");
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
});
