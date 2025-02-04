const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const { addDays, setHours, setMinutes } = require('date-fns');

const prismaDb = new PrismaClient();

async function main() {
  // Clear existing data
  await prismaDb.payment.deleteMany();
  await prismaDb.lesson.deleteMany();
  await prismaDb.rinkTimeSlot.deleteMany();
  await prismaDb.student.deleteMany();
  await prismaDb.user.deleteMany();
  await prismaDb.rink.deleteMany();

  // Create admin (Yura)
  const adminPassword = await hash('admin123', 12);
  const admin = await prismaDb.user.create({
    data: {
      name: 'Yura Min',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create students
  const students = await Promise.all([
    prismaDb.user.create({
      data: {
        name: 'Emily Chen',
        email: 'student1@example.com',
        password: await hash('student123', 12),
        role: 'STUDENT',
        student: {
          create: {
            phone: '310-555-0123',
            maxLessonsPerWeek: 3,
            level: 'JUNIOR',
            emergencyContact: {
              name: 'Michael Chen',
              phone: '310-555-0124',
              relation: 'Father',
            },
            notes: 'Preparing for junior competition',
          },
        },
      },
      include: {
        student: true,
      },
    }),
    prismaDb.user.create({
      data: {
        name: 'Alex Kim',
        email: 'student2@example.com',
        password: await hash('student123', 12),
        role: 'STUDENT',
        student: {
          create: {
            phone: '310-555-0125',
            maxLessonsPerWeek: 2,
            level: 'NOVICE',
            emergencyContact: {
              name: 'Sarah Kim',
              phone: '310-555-0126',
              relation: 'Mother',
            },
            notes: 'Working on double jumps',
          },
        },
      },
      include: {
        student: true,
      },
    }),
    prismaDb.user.create({
      data: {
        name: 'Madison Taylor',
        email: 'student3@example.com',
        password: await hash('student123', 12),
        role: 'STUDENT',
        student: {
          create: {
            phone: '310-555-0127',
            maxLessonsPerWeek: 4,
            level: 'SENIOR',
            emergencyContact: {
              name: 'Robert Taylor',
              phone: '310-555-0128',
              relation: 'Father',
            },
            notes: 'Senior competitive program preparation',
          },
        },
      },
      include: {
        student: true,
      },
    }),
  ]);

  // Create rinks with time slots
  const rinks = await Promise.all([
    prismaDb.rink.create({
      data: {
        name: 'East West Ice Palace',
        timezone: 'America/Los_Angeles',
        address: '23770 S Western Ave, Harbor City, CA 90710',
        maxCapacity: 25,
        timeSlots: {
          create: [
            {
              startTime: '09:00',
              endTime: '10:00',
              daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
              maxStudents: 1,
            },
            {
              startTime: '14:00',
              endTime: '15:00',
              daysOfWeek: [2, 4], // Tue, Thu
              maxStudents: 1,
            },
          ],
        },
      },
      include: {
        timeSlots: true,
      },
    }),
    prismaDb.rink.create({
      data: {
        name: 'Great Park Ice',
        timezone: 'America/Los_Angeles',
        address: '888 Ridge Valley, Irvine, CA 92618',
        maxCapacity: 30,
        timeSlots: {
          create: [
            {
              startTime: '10:00',
              endTime: '11:00',
              daysOfWeek: [1, 3, 5],
              maxStudents: 1,
            },
            {
              startTime: '15:00',
              endTime: '16:00',
              daysOfWeek: [2, 4],
              maxStudents: 1,
            },
          ],
        },
      },
      include: {
        timeSlots: true,
      },
    }),
  ]);

  // Create lessons and payments
  const today = new Date();
  const lessons = [];
  const payments = [];

  // Create past, current, and future lessons for each student
  for (const student of students) {
    // Past lessons (completed)
    const pastLesson = await prismaDb.lesson.create({
      data: {
        studentId: student.student.id,
        rinkId: rinks[0].id,
        startTime: setHours(setMinutes(addDays(today, -7), 0), 9),
        endTime: setHours(setMinutes(addDays(today, -7), 0), 10),
        duration: 60,
        status: 'COMPLETED',
        price: 120.00,
        notes: 'Focus on spins and footwork',
        timeSlotId: rinks[0].timeSlots[0].id,
      },
    });
    lessons.push(pastLesson);

    // Past payment (completed)
    const pastPayment = await prismaDb.payment.create({
      data: {
        studentId: student.student.id,
        lessonId: pastLesson.id,
        amount: 120.00,
        method: 'VENMO',
        status: 'COMPLETED',
        referenceCode: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        verifiedBy: admin.id,
        verifiedAt: new Date(),
      },
    });
    payments.push(pastPayment);

    // Upcoming lesson
    const upcomingLesson = await prismaDb.lesson.create({
      data: {
        studentId: student.student.id,
        rinkId: rinks[1].id,
        startTime: setHours(setMinutes(addDays(today, 7), 0), 10),
        endTime: setHours(setMinutes(addDays(today, 7), 0), 11),
        duration: 60,
        status: 'SCHEDULED',
        price: 120.00,
        notes: 'Program run-through',
        timeSlotId: rinks[1].timeSlots[0].id,
      },
    });
    lessons.push(upcomingLesson);

    // Pending payment
    const pendingPayment = await prismaDb.payment.create({
      data: {
        studentId: student.student.id,
        lessonId: upcomingLesson.id,
        amount: 120.00,
        method: 'ZELLE',
        status: 'PENDING',
        referenceCode: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });
    payments.push(pendingPayment);
  }

  console.log('Seed data created successfully');
  console.log('Test Accounts:');
  console.log('Admin - Email: admin@example.com / Password: admin123');
  console.log('Students:');
  students.forEach(student => {
    console.log(`- Email: ${student.email} / Password: student123`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaDb.$disconnect();
  });