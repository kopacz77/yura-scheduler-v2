import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getResourceAvailability, findAvailableResources } from '@/lib/scheduling/resources';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('resourceId');
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    if (!date) {
      return new NextResponse('Date is required', { status: 400 });
    }

    // If looking for specific resource availability
    if (resourceId) {
      const resource = await prisma.resource.findUnique({
        where: { id: resourceId }
      });

      if (!resource) {
        return new NextResponse('Resource not found', { status: 404 });
      }

      const appointments = await prisma.appointment.findMany({
        where: {
          resourceId,
          start: {
            gte: new Date(date)
          },
          end: {
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
          }
        }
      });

      const availability = getResourceAvailability(
        resource,
        new Date(date),
        appointments
      );

      return NextResponse.json(availability);
    }

    // If looking for all available resources for a time slot
    if (startTime && endTime) {
      const resources = await prisma.resource.findMany({
        where: { available: true }
      });

      const appointments = await prisma.appointment.findMany({
        where: {
          start: { lte: new Date(endTime) },
          end: { gte: new Date(startTime) }
        }
      });

      const availableResources = findAvailableResources(
        resources,
        {
          start: new Date(startTime),
          end: new Date(endTime)
        },
        appointments
      );

      return NextResponse.json(availableResources);
    }

    return new NextResponse('Invalid request parameters', { status: 400 });
  } catch (error) {
    console.error('Error checking resource availability:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
