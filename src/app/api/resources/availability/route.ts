import { type NextRequest } from 'next/server';
import { getResourceAvailability } from '@/lib/scheduling/resources';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const resourceId = searchParams.get('resourceId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!resourceId || !startDate || !endDate) {
    return new Response('Missing required parameters', { status: 400 });
  }

  try {
    const availability = await getResourceAvailability(
      resourceId,
      startDate,
      endDate
    );

    return Response.json(availability);
  } catch (error) {
    console.error('Failed to get resource availability:', error);
    return new Response('Failed to get resource availability', { status: 500 });
  }
}