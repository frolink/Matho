import { PrismaClient } from '../generated/client';

/**
 * Singleton PrismaClient — prevents exhausting the PostgreSQL connection
 * pool from hot-reloads in development (a common Next.js/Nest dev pitfall).
 */
declare global {
  // eslint-disable-next-line no-var
  var __mathoPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__mathoPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__mathoPrisma = prisma;
}
