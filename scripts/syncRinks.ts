import { PrismaClient } from '@prisma/client';
import { DEFAULT_RINKS } from '../src/config/rinks';

const prisma = new PrismaClient();

async function syncRinks() {
  try {
    console.log('Starting rink synchronization...');

    // Get existing rinks
    const existingRinks = await prisma.rink.findMany();
    console.log('Existing rinks:', existingRinks.map(r => r.name));

    // Create missing rinks
    for (const [name, details] of Object.entries(DEFAULT_RINKS)) {
      const existingRink = existingRinks.find(r => r.name === name);
      
      if (!existingRink) {
        console.log(`Creating rink: ${name}`);
        await prisma.rink.create({
          data: {
            name,
            timezone: details.timezone,
            address: details.address,
            maxCapacity: details.maxCapacity,
          },
        });
      }
    }

    // Find any slots with invalid rink references
    const slots = await prisma.rinkTimeSlot.findMany({
      include: { rink: true }
    });

    const invalidSlots = slots.filter(slot => !slot.rink);
    if (invalidSlots.length > 0) {
      console.log(`Found ${invalidSlots.length} invalid slots. Cleaning up...`);
      
      for (const slot of invalidSlots) {
        await prisma.rinkTimeSlot.delete({
          where: { id: slot.id }
        });
      }
    }

    console.log('Synchronization complete!');
  } catch (error) {
    console.error('Error during synchronization:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncRinks().catch(console.error);