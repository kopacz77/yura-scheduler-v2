import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
// This allows both:
// import { prisma } from '@/lib/prisma';
// import prisma from '@/lib/prisma';
export default prismaClient;
