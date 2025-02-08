import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function cleanDuplicateSlots() {
  try {
    console.log('Starting slot cleanup...');

    // Get all slots
    const slots = await prisma.rinkTimeSlot.findMany();
    const seen = new Set();
    const duplicates = [];

    for (const slot of slots) {
      // Create a unique key based on rinkId, date, and time
      const dateStr = format(slot.startTime, 'yyyy-MM-dd');
      const timeStr = format(slot.startTime, 'HH:mm');
      const key = `${slot.rinkId}-${dateStr}-${timeStr}`;

      if (seen.has(key)) {
        duplicates.push(slot.id);
      } else {
        seen.add(key);
      }
    }

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate slots. Cleaning up...`);
      
      // Delete duplicates
      await prisma.rinkTimeSlot.deleteMany({
        where: {
          id: { in: duplicates }
        }
      });

      console.log('Duplicates removed successfully.');
    } else {
      console.log('No duplicates found.');
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDuplicateSlots().catch(console.error);