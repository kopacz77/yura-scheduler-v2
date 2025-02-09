import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getResourceAvailability } from '@/lib/scheduling/resources';

export { dynamic, revalidate } from '../../config';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const duration = searchParams.get('duration');

    if (!startDate || !endDate) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    const availability = await getResourceAvailability(
      new Date(startDate),
      new Date(endDate),
      duration ? parseInt(duration) : undefined
    );

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching resource availability:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}