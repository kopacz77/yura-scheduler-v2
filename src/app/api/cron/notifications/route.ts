import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { scheduleNotifications } from '@/lib/notifications/scheduler';

// This endpoint will be called by a cron job service (e.g., Vercel Cron)
export async function GET(req: Request) {
  try {
    const headersList = headers();
    const authToken = headersList.get('authorization');

    // Verify the request is coming from our cron service
    if (authToken !== `Bearer ${process.env.CRON_SECRET_TOKEN}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await scheduleNotifications();
    return new NextResponse('Notifications scheduled successfully');
  } catch (error) {
    console.error('Error in notification cron job:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
