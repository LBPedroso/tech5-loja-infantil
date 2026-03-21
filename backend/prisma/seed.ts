import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.ADMIN_NAME || "Administrador Lili&Gu";
  const email = process.env.ADMIN_EMAIL || "admin@liligu.com";
  const cpf = process.env.ADMIN_CPF || "52998224725";
  const rawPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const password = await bcrypt.hash(rawPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: { name, cpf, password },
    create: { name, email, cpf, password },
  });

  console.log("Admin pronto para uso:");
  console.log(`Email: ${email}`);
  console.log(`Senha: ${rawPassword}`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
