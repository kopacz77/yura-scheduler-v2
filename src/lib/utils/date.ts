import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';
import { format, addDays, isSameDay, addMinutes } from 'date-fns';

export function formatToTimeZone(date: Date, timeZone: string, formatStr: string): string {
  return formatInTimeZone(date, timeZone, formatStr);
}

export function convertToTimeZone(date: Date, timeZone: string): Date {
  return utcToZonedTime(date, timeZone);
}

// Other date utility functions...
