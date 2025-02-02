import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rink.deleteMany();

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create student user
  const studentPassword = await hash('student123', 12);
  const studentUser = await prisma.user.create({
    data: {
      name: 'Emily Chen',
      email: 'student@example.com',
      password: studentPassword,
      role: 'STUDENT',
      student: {
        create: {
          phone: '310-555-0123',
          maxLessonsPerWeek: 3,
          emergencyContact: {
            name: 'Michael Chen',
            phone: '310-555-0124',
            relation: 'Father',
          },
          notes: 'Preparing for junior competition',
        },
      },
    },
  });

  // Create test rinks
  const rinks = await Promise.all([
    prisma.rink.create({
      data: {
        name: 'Toyota Sports Center',
        timezone: 'America/Los_Angeles',
        address: '555 N Nash St, El Segundo, CA 90245',
      },
    }),
    prisma.rink.create({
      data: {
        name: 'Pickwick Ice',
        timezone: 'America/Los_Angeles',
        address: '1001 Riverside Dr, Burbank, CA 91506',
      },
    }),
  ]);

  console.log('Seed data created successfully');
  console.log('Test Accounts:');
  console.log('Admin - Email: admin@example.com / Password: admin123');
  console.log('Student - Email: student@example.com / Password: student123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
