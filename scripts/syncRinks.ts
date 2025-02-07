import { PrismaClient } from '@prisma/client';

const DEFAULT_RINKS = {
  'East West Ice Palace': {
    timezone: 'America/Los_Angeles',
    address: '23770 S Western Ave, Harbor City, CA 90710',
    maxCapacity: 25
  },
  'Great Park Ice': {
    timezone: 'America/Los_Angeles',
    address: '888 Ridge Valley, Irvine, CA 92618',
    maxCapacity: 30
  },
  'Lakewood Ice': {
    timezone: 'America/Los_Angeles',
    address: '3975 Pixie Ave, Lakewood, CA 90712',
    maxCapacity: 25
  },
  'KHS': {
    timezone: 'America/Los_Angeles',
    address: 'Skating Club of Boston, 750 University Ave, Norwood, MA 02062',
    maxCapacity: 20
  },
  'San Jose Sharks Arena': {
    timezone: 'America/Los_Angeles',
    address: '1500 S 10th St, San Jose, CA 95112',
    maxCapacity: 30
  },
  'Novi Ice Arena': {
    timezone: 'America/Detroit',
    address: '42400 Nick Lidstrom Dr, Novi, MI 48375',
    maxCapacity: 25
  }
};

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