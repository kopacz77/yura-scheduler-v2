import { addDays, format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { getLocalDateTime } from '@/lib/utils/date';

interface DateRange {
  start: Date;
  end: Date;
}

export function generateDateRange(start: Date | string, days: number): DateRange {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const localStart = getLocalDateTime(startDate);
  
  return {
    start: startOfDay(localStart),
    end: endOfDay(addDays(localStart, days))
  };
}

export function formatScheduleTime(date: Date | string) {
  const localDate = getLocalDateTime(date);
  return format(localDate, 'h:mm a');
}

export function formatScheduleDate(date: Date | string) {
  const localDate = getLocalDateTime(date);
  return format(localDate, 'EEEE, MMMM d, yyyy');
}

export function formatScheduleDateTime(date: Date | string) {
  const localDate = getLocalDateTime(date);
  return format(localDate, 'EEEE, MMMM d, yyyy h:mm a');
}
