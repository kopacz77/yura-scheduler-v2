import { PrismaClient, Prisma } from '@prisma/client';
import { env, logger } from './env';

declare global {
  var prisma: PrismaClient | undefined;
}

interface ExtendedPrismaClient extends PrismaClient {
  $on(event: 'query', callback: (event: Prisma.QueryEvent) => void): void;
  $on(event: 'error', callback: (event: Prisma.LogEvent) => void): void;
  $on(event: 'warn', callback: (event: Prisma.LogEvent) => void): void;
}

const logOptions: Prisma.PrismaClientOptions = env.isDev
  ? {
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    }
  : {};

const prismaClient = (global.prisma || new PrismaClient(logOptions)) as ExtendedPrismaClient;

// Add event listeners in development
if (env.isDev) {
  prismaClient.$on('query', (e: Prisma.QueryEvent) => {
    logger.debug('Query:', e.query);
    logger.debug('Params:', e.params);
    logger.debug('Duration:', `${e.duration}ms`);
  });

  prismaClient.$on('error', (e: Prisma.LogEvent) => {
    logger.error('Prisma Error:', e.message);
  });

  prismaClient.$on('warn', (e: Prisma.LogEvent) => {
    logger.warn('Prisma Warning:', e.message);
  });
}

// Prevent multiple instances in development
if (env.isDev) {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
export default prismaClient;
