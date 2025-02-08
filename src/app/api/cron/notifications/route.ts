import { NextResponse } from 'next/server';
import { processNotifications } from '@/lib/notifications/scheduler';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await processNotifications();
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Notifications processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process notifications'
      },
      { status: 500 }
    );
  }
}
