import { NextResponse } from 'next/server';
import { scheduleNotifications } from '@/lib/notifications/scheduler';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await scheduleNotifications();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process notifications:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process notifications'
      },
      { status: 500 }
    );
  }
}