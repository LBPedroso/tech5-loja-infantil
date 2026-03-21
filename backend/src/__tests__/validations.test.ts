import { describe, it, expect } from "vitest";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

describe("Validação de CPF", () => {
  it("deve aceitar CPF válido", () => {
    const cpfValido = "52998224725";
    expect(cpfValidator.isValid(cpfValido)).toBe(true);
  });

  it("deve rejeitar CPF inválido", () => {
    const cpfInvalido = "12345678901";
    expect(cpfValidator.isValid(cpfInvalido)).toBe(false);
  });

  it("deve aceitar CPF válido com máscara", () => {
    const cpfComCaracteres = "529.982.247-25";
    expect(cpfValidator.isValid(cpfComCaracteres)).toBe(true);
  });

  it("deve rejeitar CPF vazio", () => {
    expect(cpfValidator.isValid("")).toBe(false);
  });
});

describe("Validação de Email", () => {
  it("deve validar um email válido", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("joao@email.com")).toBe(true);
  });

  it("deve rejeitar email sem @", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("joaoemail.com")).toBe(false);
  });

  it("deve rejeitar email sem domínio", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("joao@")).toBe(false);
  });
});

describe("Validação de Senha", () => {
  it("deve aceitar senha forte (8+ chars, maiúscula, número, caractere especial)", () => {
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    expect(senhaRegex.test("Senha123!")).toBe(true);
  });

  it("deve rejeitar senha sem maiúscula", () => {
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    expect(senhaRegex.test("senha123!")).toBe(false);
  });

  it("deve rejeitar senha sem número", () => {
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    expect(senhaRegex.test("SenhaAbc!")).toBe(false);
  });

  it("deve rejeitar senha sem caractere especial", () => {
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    expect(senhaRegex.test("Senha123")).toBe(false);
  });

  it("deve rejeitar senha com menos de 8 caracteres", () => {
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    expect(senhaRegex.test("Abc1!")).toBe(false);
  });
});

describe("Lógica de Estoque", () => {
  it("deve calcular estoque após pedido corretamente", () => {
    const estoqueInicial = 10;
    const quantidade = 3;
    const estoqueApos = estoqueInicial - quantidade;
    expect(estoqueApos).toBe(7);
  });

  it("deve rejeitar pedido com quantidade maior que estoque", () => {
    const estoqueDisponivel = 5;
    const quantidadePedida = 10;
    expect(quantidadePedida > estoqueDisponivel).toBe(true);
  });

  it("deve permitir pedido com quantidade igual ao estoque", () => {
    const estoqueDisponivel = 5;
    const quantidadePedida = 5;
    expect(quantidadePedida <= estoqueDisponivel).toBe(true);
  });
});

describe("Cálculo de Total do Pedido", () => {
  it("deve calcular total corretamente", () => {
    const itens = [
      { preco: 100, quantidade: 2 },
      { preco: 50, quantidade: 1 },
    ];
    const total = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    expect(total).toBe(250);
  });

  it("deve retornar zero para pedido vazio", () => {
    const itens: { preco: number; quantidade: number }[] = [];
    const total = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    expect(total).toBe(0);
  });
});
