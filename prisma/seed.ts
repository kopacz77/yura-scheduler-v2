import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      name: 'Student User',
      password: studentPassword,
      role: 'STUDENT',
    },
  });

  // Create student profile
  await prisma.student.create({
    data: {
      userId: student.id,
      phone: '+1 (555) 123-4567',
      maxLessonsPerWeek: 3,
      level: 'INTERMEDIATE',
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+1 (555) 987-6543',
        relation: 'Parent'
      },
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
