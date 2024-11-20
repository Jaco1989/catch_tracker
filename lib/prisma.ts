import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
    errorFormat: "pretty",

    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;