import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

declare global {
  var prismaAuth: PrismaClient | undefined;
}

export const prisma = global.prismaAuth || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaAuth = prisma;
}
