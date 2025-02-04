const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prismaDb = new PrismaClient();

async function main() {
  await prismaDb.payment.deleteMany();
  await prismaDb.lesson.deleteMany();
  await prismaDb.student.deleteMany();
  await prismaDb.user.deleteMany();
  await prismaDb.rink.deleteMany();

  const adminPassword = await hash('admin123', 12);
  const admin = await prismaDb.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const studentPassword = await hash('student123', 12);
  const studentUser = await prismaDb.user.create({
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

  await prismaDb.rink.createMany({
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
    await prismaDb.$disconnect();
  });
