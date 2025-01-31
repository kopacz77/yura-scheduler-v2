import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAppointmentTime(date: Date | string): string {
  return format(new Date(date), 'h:mm a');
}

export function getLessonTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'private':
      return 'bg-blue-50 dark:bg-blue-950';
    case 'group':
      return 'bg-green-50 dark:bg-green-950';
    case 'competition':
      return 'bg-purple-50 dark:bg-purple-950';
    case 'evaluation':
      return 'bg-orange-50 dark:bg-orange-950';
    default:
      return 'bg-gray-50 dark:bg-gray-950';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function calculateLessonDuration(start: Date | string, end: Date | string): number {
  return (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60);
}

export function generateTimeSlots(startTime: number = 6, endTime: number = 22): string[] {
  const slots: string[] = [];
  for (let hour = startTime; hour < endTime; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}