import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientConfig: Prisma.PrismaClientOptions = process.env.NODE_ENV === 'development' 
  ? {
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' }
      ],
    }
  : {};

const prismaClient = global.prisma || new PrismaClient(prismaClientConfig);

if (process.env.NODE_ENV === 'development') {
  prismaClient.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
export default prismaClient;