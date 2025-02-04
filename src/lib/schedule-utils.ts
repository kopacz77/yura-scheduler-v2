import { addHours, parse, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export function calculateCancellationFee(lessonPrice: number, hoursUntilLesson: number) {
  if (hoursUntilLesson >= 48) return 0;
  if (hoursUntilLesson >= 24) return lessonPrice * 0.5;
  return lessonPrice;
}

export function formatTimeSlot(start: string, end: string, timezone = 'UTC') {
  const startTime = utcToZonedTime(parse(start, 'HH:mm', new Date()), timezone);
  const endTime = utcToZonedTime(parse(end, 'HH:mm', new Date()), timezone);
  
  return `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;
}