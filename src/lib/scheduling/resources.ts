import { prisma } from '@/lib/prisma';
import { checkResourceAvailability } from './conflicts';

export async function getAvailableResources(
  startTime: Date,
  endTime: Date
) {
  const resources = await prisma.rink.findMany({
    where: {
      isActive: true,
    },
  });

  const availabilityPromises = resources.map(async (resource) => {
    const isAvailable = await checkResourceAvailability(
      resource.id,
      startTime,
      endTime
    );
    return { ...resource, isAvailable };
  });

  return Promise.all(availabilityPromises);
}