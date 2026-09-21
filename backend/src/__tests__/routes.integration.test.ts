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

  it("POST /api/categorias deve disponibilizar a categoria na listagem", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@liligu.com", senha: "Admin123!" });

    expect(login.status).toBe(200);

    const nome = `Categoria teste ${Date.now()}`;
    const criada = await request(app)
      .post("/api/categorias")
      .set("Authorization", `Bearer ${login.body.data.token}`)
      .send({ nome });

    expect(criada.status).toBe(201);

    const listagem = await request(app)
      .get("/api/categorias")
      .set("Authorization", `Bearer ${login.body.data.token}`);

    expect(listagem.status).toBe(200);
    expect(listagem.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: criada.body.id, nome }),
    ]));
  });
});
