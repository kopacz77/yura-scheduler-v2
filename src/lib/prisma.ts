import { PrismaClient } from '@prisma/client';
import { env, logger } from './env';

declare global {
  var prisma: PrismaClient | undefined;
}

const logOptions = env.isDev ? {
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
} : {};

const prismaClient = global.prisma || new PrismaClient(logOptions);

// Debug logging in development
if (env.isDev && prismaClient.$on) {
  prismaClient.$on('query', (e: any) => {
    logger.debug('Query:', e.query);
    logger.debug('Params:', e.params);
    logger.debug('Duration:', `${e.duration}ms`);
  });

  prismaClient.$on('error', (e: any) => {
    logger.error('Prisma Error:', e.message);
  });

  prismaClient.$on('warn', (e: any) => {
    logger.warn('Prisma Warning:', e.message);
  });
}

// Prevent multiple instances in development
if (env.isDev) {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
export default prismaClient;
