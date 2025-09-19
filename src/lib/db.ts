import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function closeDb() {
  await prisma.$disconnect();
}

// Fonction de compatibilité pour les requêtes SQL brutes si nécessaire
export async function query(text: string, params?: any[]) {
  return await prisma.$queryRawUnsafe(text, ...(params || []));
}
