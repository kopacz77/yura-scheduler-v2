import { addMinutes, isBefore, isAfter } from 'date-fns';
import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';

export function convertTimeToZone(date: Date, timeZone: string): Date {
  return utcToZonedTime(date, timeZone);
}

export function formatScheduleTime(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, 'h:mm a');
}
