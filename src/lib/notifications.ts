import { format } from 'date-fns';
import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';

export function formatNotificationDate(date: Date, timeZone: string): string {
  const zonedDate = utcToZonedTime(date, timeZone);
  return formatInTimeZone(zonedDate, timeZone, 'PPpp');
}
