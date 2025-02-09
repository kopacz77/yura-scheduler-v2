import { PrismaClient, Prisma } from '@prisma/client';
import { env, logger } from './env';

declare global {
  var prisma: PrismaClient | undefined;
}

type PrismaOptions = {
  log?: Array<Prisma.LogDefinition>;
};

const logOptions: PrismaOptions = env.isDev
  ? {
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    }
  : {};

const prismaClient = global.prisma || new PrismaClient(logOptions);

// Add event listeners in development
if (env.isDev && 'on' in prismaClient) {
  const client = prismaClient as PrismaClient & {
    $on: Function;
  };

  client.$on('query', (e: Prisma.QueryEvent) => {
    logger.debug('Query:', e.query);
    logger.debug('Params:', e.params);
    logger.debug('Duration:', `${e.duration}ms`);
  });

  client.$on('error', (e: Prisma.LogEvent) => {
    logger.error('Prisma Error:', e.message);
  });

  client.$on('warn', (e: Prisma.LogEvent) => {
    logger.warn('Prisma Warning:', e.message);
  });
}

// Prevent multiple instances in development
if (env.isDev) {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
export default prismaClient;
