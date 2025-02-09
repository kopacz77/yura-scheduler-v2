import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientConfig = process.env.NODE_ENV === 'development' 
  ? { log: ['query', 'error', 'warn'] }
  : {};

const prismaClient = global.prisma || new PrismaClient(prismaClientConfig);

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
export default prismaClient;