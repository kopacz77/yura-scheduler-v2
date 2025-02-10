import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const RINKS = [
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
];

async function main() {
  console.log('Starting database seed...');

  // Create the rinks
  for (const rink of RINKS) {
    await prisma.rink.upsert({
      where: { name: rink.name },
      update: rink,
      create: rink
    });
  }
  console.log('✓ Rinks created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log('✓ Admin user created');

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {
      password: studentPassword,
      role: 'STUDENT'
    },
    create: {
      email: 'student@example.com',
      name: 'Student User',
      password: studentPassword,
      role: 'STUDENT'
    }
  });

  // Create/update student profile
  if (student) {
    await prisma.student.upsert({
      where: { userId: student.id },
      update: {
        phone: '+1 (555) 123-4567',
        maxLessonsPerWeek: 3,
        level: 'INTERMEDIATE',
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+1 (555) 987-6543',
          relation: 'Parent'
        }
      },
      create: {
        userId: student.id,
        phone: '+1 (555) 123-4567',
        maxLessonsPerWeek: 3,
        level: 'INTERMEDIATE',
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+1 (555) 987-6543',
          relation: 'Parent'
        }
      }
    });
  }
  console.log('✓ Student user and profile created');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
