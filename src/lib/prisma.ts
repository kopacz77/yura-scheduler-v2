import { PrismaClient, Prisma } from '@prisma/client';
import { env, logger } from './env';

declare global {
  var prisma: PrismaClient | undefined;
}

const logOptions = env.isDev ? {
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ] as Prisma.LogDefinition[],
} : {};

const prismaClient = global.prisma || new PrismaClient(logOptions);

// Add event listeners in development
if (env.isDev && prismaClient.$on) {
  prismaClient.$on('query' as never, (e: Prisma.QueryEvent) => {
    logger.debug('Query:', e.query);
    logger.debug('Params:', e.params);
    logger.debug('Duration:', `${e.duration}ms`);
  });

  prismaClient.$on('error' as never, (e: Prisma.LogEvent) => {
    logger.error('Prisma Error:', e.message);
  });

  prismaClient.$on('warn' as never, (e: Prisma.LogEvent) => {
    logger.warn('Prisma Warning:', e.message);
  });
}

// Prevent multiple instances in development
if (env.isDev) {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
export default prismaClient;
