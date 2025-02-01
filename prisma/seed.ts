import { PrismaClient } from '@prisma/client';
import { addDays, setHours, setMinutes, addWeeks } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rink.deleteMany();

  // Create test rinks
  const toyotaSportsCenter = await prisma.rink.create({
    data: {
      name: 'Toyota Sports Center',
      timezone: 'America/Los_Angeles',
      address: '555 N Nash St, El Segundo, CA 90245',
    },
  });

  const pickwickIce = await prisma.rink.create({
    data: {
      name: 'Pickwick Ice',
      timezone: 'America/Los_Angeles',
      address: '1001 Riverside Dr, Burbank, CA 91506',
    },
  });

  // Create test students
  const student1 = await prisma.user.create({
    data: {
      name: 'Emily Chen',
      email: 'emily.chen@example.com',
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
    include: {
      student: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Marcus Rodriguez',
      email: 'marcus.r@example.com',
      role: 'STUDENT',
      student: {
        create: {
          phone: '323-555-0125',
          maxLessonsPerWeek: 2,
          emergencyContact: {
            name: 'Laura Rodriguez',
            phone: '323-555-0126',
            relation: 'Mother',
          },
          notes: 'Focus on ice dance basics',
        },
      },
    },
    include: {
      student: true,
    },
  });

  // Create lessons for the next 4 weeks
  const startDate = new Date();
  const lessonTimes = [
    { hours: 9, minutes: 0 },   // 9:00 AM
    { hours: 10, minutes: 30 },  // 10:30 AM
    { hours: 14, minutes: 0 },   // 2:00 PM
    { hours: 15, minutes: 30 },  // 3:30 PM
    { hours: 17, minutes: 0 },   // 5:00 PM
  ];

  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 5; day++) { // Monday to Friday
      const currentDate = addDays(addWeeks(startDate, week), day);
      
      for (const time of lessonTimes) {
        const lessonStart = setMinutes(
          setHours(currentDate, time.hours),
          time.minutes
        );

        // Alternate between students and rinks
        const student = day % 2 === 0 ? student1 : student2;
        const rink = day % 2 === 0 ? toyotaSportsCenter : pickwickIce;

        const lesson = await prisma.lesson.create({
          data: {
            studentId: student.student!.id,
            rinkId: rink.id,
            startTime: lessonStart,
            endTime: new Date(lessonStart.getTime() + 60 * 60 * 1000), // 1 hour
            duration: 60,
            status: 'SCHEDULED',
            price: 85.0,
            payment: {
              create: {
                studentId: student.student!.id,
                amount: 85.0,
                method: 'VENMO',
                status: 'COMPLETED',
                referenceCode: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
              },
            },
          },
        });
      }
    }
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
