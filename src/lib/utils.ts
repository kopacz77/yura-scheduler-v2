import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { Level } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getLevelBadgeColor(level: Level) {
  const badges: Record<Level, string> = {
    PRE_PRELIMINARY: 'bg-blue-100 text-blue-800',
    PRELIMINARY: 'bg-blue-200 text-blue-800',
    PRE_JUVENILE: 'bg-indigo-100 text-indigo-800',
    JUVENILE: 'bg-indigo-200 text-indigo-800',
    INTERMEDIATE: 'bg-purple-100 text-purple-800',
    NOVICE: 'bg-purple-200 text-purple-800',
    JUNIOR: 'bg-green-100 text-green-800',
    SENIOR: 'bg-green-200 text-green-800'
  };
  return badges[level];
}

export function formatAppointmentTime(date: Date | string) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, 'h:mm a');
}

export function getTimeSlots(startHour = 6, endHour = 22, interval = 30) {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
    }
  }
  return slots;
}
