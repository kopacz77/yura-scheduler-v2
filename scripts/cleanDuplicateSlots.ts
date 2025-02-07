import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDuplicateSlots() {
  const slots = await prisma.rinkTimeSlot.findMany();
  const seen = new Set();
  const duplicates = [];

  for (const slot of slots) {
    const key = `${slot.rinkId}-${slot.startTime}-${slot.daysOfWeek.sort().join(',')}`;
    if (seen.has(key)) {
      duplicates.push(slot.id);
    } else {
      seen.add(key);
    }
  }

  if (duplicates.length > 0) {
    await prisma.rinkTimeSlot.deleteMany({
      where: {
        id: { in: duplicates }
      }
    });
    console.log(`Deleted ${duplicates.length} duplicate slots`);
  } else {
    console.log('No duplicates found');
  }
}

cleanDuplicateSlots()
  .catch(console.error)
  .finally(() => prisma.$disconnect());