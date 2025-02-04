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
          level: 'JUNIOR'
        },
      },
    },
  });

  // Create rinks
  await prisma.rink.createMany({
    data: [
      {
        name: 'East West Ice Palace',
        timezone: 'America/Los_Angeles',
        address: '23770 S Western Ave, Harbor City, CA 90710'
      },
      {
        name: 'Great Park Ice',
        timezone: 'America/Los_Angeles',
        address: '888 Ridge Valley, Irvine, CA 92618'
      },
      {
        name: 'Lakewood Ice',
        timezone: 'America/Los_Angeles',
        address: '3975 Pixie Ave, Lakewood, CA 90712'
      },
      {
        name: 'KHS',
        timezone: 'America/Los_Angeles',
        address: 'Skating Club of Boston, 750 University Ave, Norwood, MA 02062'
      },
      {
        name: 'San Jose Sharks Arena',
        timezone: 'America/Los_Angeles',
        address: '1500 S 10th St, San Jose, CA 95112'
      },
      {
        name: 'Novi Ice Arena',
        timezone: 'America/Detroit',
        address: '42400 Nick Lidstrom Dr, Novi, MI 48375'
      },
      {
        name: 'Any Rink in London ON',
        timezone: 'America/Toronto',
        address: 'London, ON, Canada'
      }
    ]
  });

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
