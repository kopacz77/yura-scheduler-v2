import prisma from '@/lib/prisma';
import { checkResourceAvailability } from './conflicts';

export async function getResourceAvailability(
  resourceId: string,
  startTime: Date,
  endTime: Date
) {
  const isAvailable = await checkResourceAvailability(
    resourceId,
    startTime,
    endTime
  );
  return { isAvailable };
}

export async function findAvailableResources(
  startTime: Date,
  endTime: Date
) {
  const resources = await prisma.rink.findMany({
    where: { isActive: true },
  });

  const availabilityPromises = resources.map(async (resource) => {
    const { isAvailable } = await getResourceAvailability(
      resource.id,
      startTime,
      endTime
    );
    return { ...resource, isAvailable };
  });

  return Promise.all(availabilityPromises);
}