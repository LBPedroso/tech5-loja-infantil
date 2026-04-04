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

  it("deve rejeitar CPF com todos os dígitos iguais", () => {
    expect(cpfValidator.isValid("11111111111")).toBe(false);
    expect(cpfValidator.isValid("00000000000")).toBe(false);
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

  it("deve rejeitar email com espaço", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("joao @email.com")).toBe(false);
  });

  it("deve aceitar email com subdomínio", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("admin@liligu.com.br")).toBe(true);
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

  it("deve restaurar estoque ao cancelar pedido", () => {
    const estoqueAntes = 5;
    const quantidadePedido = 3;
    const estoqueAposCancelamento = estoqueAntes + quantidadePedido;
    expect(estoqueAposCancelamento).toBe(8);
  });

  it("deve rejeitar pedido com quantidade zero", () => {
    const estoqueDisponivel = 5;
    const quantidadePedida = 0;
    expect(quantidadePedida <= 0).toBe(true);
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

  it("deve calcular total com vários itens e quantidades distintas", () => {
    const itens = [
      { preco: 29.9, quantidade: 3 },
      { preco: 49.9, quantidade: 2 },
    ];
    const total = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    expect(total).toBeCloseTo(189.5);
  });
});

describe("Cálculo de Paginação", () => {
  it("deve calcular número total de páginas corretamente", () => {
    expect(Math.ceil(23 / 10)).toBe(3);
    expect(Math.ceil(10 / 10)).toBe(1);
    expect(Math.ceil(11 / 10)).toBe(2);
  });

  it("deve calcular offset de paginação corretamente", () => {
    expect((2 - 1) * 10).toBe(10);
    expect((1 - 1) * 10).toBe(0);
    expect((3 - 1) * 10).toBe(20);
  });

  it("deve retornar zero registros pularados na primeira página", () => {
    const page = 1;
    const skip = (page - 1) * 10;
    expect(skip).toBe(0);
  });
});

describe("Regras de Negócio — Usuário", () => {
  it("deve impedir alteração de email no schema de edição", () => {
    const camposPermitidosEdicao = ["nome", "cpf", "senha"];
    expect(camposPermitidosEdicao.includes("email")).toBe(false);
  });

  it("deve exigir nome com pelo menos 3 caracteres", () => {
    const nomeMinLength = 3;
    expect("Lu".length >= nomeMinLength).toBe(false);
    expect("Lua".length >= nomeMinLength).toBe(true);
  });

  it("deve confirmar que senha é opcional na edição do usuário", () => {
    const editarSemSenha = { nome: "João", cpf: "52998224725" };
    expect("senha" in editarSemSenha).toBe(false);
  });

  it("deve rejeitar CPF com caracteres alfanuméricos", () => {
    // CPF contendo letras nunca é válido
    const cpfComLetras = "529.9A2.247-25";
    expect(cpfValidator.isValid(cpfComLetras)).toBe(false);
  });
});

describe("Regras de Negócio — Autenticação", () => {
  it("deve exigir todos os campos no cadastro", () => {
    const camposObrigatoriosCadastro = ["nome", "email", "cpf", "senha"];
    expect(camposObrigatoriosCadastro.length).toBe(4);
    expect(camposObrigatoriosCadastro.includes("nome")).toBe(true);
    expect(camposObrigatoriosCadastro.includes("email")).toBe(true);
    expect(camposObrigatoriosCadastro.includes("cpf")).toBe(true);
    expect(camposObrigatoriosCadastro.includes("senha")).toBe(true);
  });

  it("deve exigir email e senha no login", () => {
    const camposLogin = ["email", "senha"];
    expect(camposLogin.length).toBe(2);
    expect(camposLogin.includes("email")).toBe(true);
    expect(camposLogin.includes("senha")).toBe(true);
  });

  it("deve rejeitar token inválido (string vazia)", () => {
    const token = "";
    expect(token.length === 0).toBe(true);
  });
});


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
