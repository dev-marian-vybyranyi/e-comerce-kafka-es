import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@shopflow.com" },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@shopflow.com",
      username: "admin",
      password,
      firstName: "Admin",
      lastName: "ShopFlow",
      role: "admin",
    },
  });

  console.log("Admin created:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
