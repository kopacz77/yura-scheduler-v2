import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const resource = await prisma.resource.findUnique({
        where: { id },
        include: {
          appointments: {
            where: {
              end: { gte: new Date() }
            }
          }
        }
      });

      if (!resource) {
        return new NextResponse('Resource not found', { status: 404 });
      }

      return NextResponse.json(resource);
    }

    const resources = await prisma.resource.findMany({
      include: {
        appointments: {
          where: {
            end: { gte: new Date() }
          }
        }
      }
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { maintenanceSchedule, ...resourceData } = body;

    // Validate maintenance schedule if provided
    if (maintenanceSchedule) {
      const isValidSchedule = maintenanceSchedule.every((slot: any) =>
        slot.start && slot.end && new Date(slot.start) < new Date(slot.end)
      );

      if (!isValidSchedule) {
        return new NextResponse(
          'Invalid maintenance schedule format',
          { status: 400 }
        );
      }
    }

    const resource = await prisma.resource.create({
      data: {
        ...resourceData,
        maintenanceSchedule: maintenanceSchedule ? JSON.stringify(maintenanceSchedule) : null
      }
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, maintenanceSchedule, ...updateData } = body;

    if (!id) {
      return new NextResponse('Resource ID is required', { status: 400 });
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!existingResource) {
      return new NextResponse('Resource not found', { status: 404 });
    }

    // Validate maintenance schedule if provided
    if (maintenanceSchedule) {
      const isValidSchedule = maintenanceSchedule.every((slot: any) =>
        slot.start && slot.end && new Date(slot.start) < new Date(slot.end)
      );

      if (!isValidSchedule) {
        return new NextResponse(
          'Invalid maintenance schedule format',
          { status: 400 }
        );
      }
    }

    // Check for scheduling conflicts
    if (!updateData.available && existingResource.available) {
      const futureAppointments = await prisma.appointment.findMany({
        where: {
          resourceId: id,
          start: { gte: new Date() }
        }
      });

      if (futureAppointments.length > 0) {
        return NextResponse.json(
          {
            error: 'Cannot mark resource as unavailable with future appointments',
            conflicts: futureAppointments
          },
          { status: 409 }
        );
      }
    }

    const updatedResource = await prisma.resource.update({
      where: { id },
      data: {
        ...updateData,
        maintenanceSchedule: maintenanceSchedule ? JSON.stringify(maintenanceSchedule) : null
      }
    });

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Resource ID is required', { status: 400 });
    }

    // Check for future appointments
    const futureAppointments = await prisma.appointment.findMany({
      where: {
        resourceId: id,
        start: { gte: new Date() }
      }
    });

    if (futureAppointments.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete resource with future appointments',
          conflicts: futureAppointments
        },
        { status: 409 }
      );
    }

    await prisma.resource.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
