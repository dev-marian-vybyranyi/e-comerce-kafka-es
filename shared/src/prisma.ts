import { PrismaClient } from "../generated/prisma";

declare global {
  var sharedPrisma: PrismaClient | undefined;
}

export const prisma = global.sharedPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.sharedPrisma = prisma;
}
