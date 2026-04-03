export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRules = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const isValidCpf = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }

  const calcDigit = (base: string, factor: number): number => {
    let total = 0;

    for (const digit of base) {
      total += Number(digit) * factor;
      factor -= 1;
    }

    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const firstDigit = calcDigit(cleaned.slice(0, 9), 10);
  if (firstDigit !== Number(cleaned[9])) {
    return false;
  }

  const secondDigit = calcDigit(cleaned.slice(0, 10), 11);
  return secondDigit === Number(cleaned[10]);
};
