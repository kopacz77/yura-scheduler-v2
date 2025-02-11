import { NextResponse } from 'next/server';
import { renderToString } from 'react-dom/server';
import { LessonConfirmation } from '@/lib/email/templates/LessonConfirmation';

export async function GET() {
  const mockData = {
    student: {
      user: {
        name: 'Test Student',
        email: 'test@example.com'
      }
    },
    lesson: {
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      duration: 60,
      type: 'PRIVATE',
      price: 75.00,
      rink: {
        name: 'Test Rink',
        address: '123 Ice Way, Glacierville, GL 12345'
      }
    }
  };

  const html = renderToString(
    LessonConfirmation(mockData)
  );

  return NextResponse.json({ html });
}
