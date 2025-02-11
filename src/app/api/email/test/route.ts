import { NextResponse } from 'next/server';
import { renderEmailTemplate } from '@/lib/email/render';
import { lessonConfirmation } from '@/lib/email/templates';
import { formatDate, formatTime } from '@/lib/utils/date';

export async function GET() {
  const mockData = {
    studentName: 'Test Student',
    lessonDate: formatDate(new Date()),
    lessonTime: formatTime(new Date()),
    lessonType: 'Private',
    duration: 60,
    price: 75.00,
    location: {
      name: 'Test Rink',
      address: '123 Ice Way, Glacierville, GL 12345'
    }
  };

  const template = lessonConfirmation(mockData);
  const html = renderEmailTemplate(template);

  return NextResponse.json({ subject: template.subject, html });
}