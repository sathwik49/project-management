import { PrismaClient } from "../generated/prisma";
import { getEnv } from "../utils/getEnv";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ datasourceUrl: getEnv("LOCAL_DATABASE_URL") });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
