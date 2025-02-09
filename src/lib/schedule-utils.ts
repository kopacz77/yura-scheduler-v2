import { addHours, parse, format } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export function calculateCancellationFee(lessonPrice: number, hoursUntilLesson: number) {
  if (hoursUntilLesson >= 48) return 0;
  if (hoursUntilLesson >= 24) return lessonPrice * 0.5;
  return lessonPrice;
}

export function formatTimeSlot(start: string, end: string, timezone = 'UTC') {
  const baseDate = new Date();
  const startTime = parse(start, 'HH:mm', baseDate);
  const endTime = parse(end, 'HH:mm', baseDate);
  
  return `${formatInTimeZone(startTime, timezone, 'h:mm a')} - ${formatInTimeZone(endTime, timezone, 'h:mm a')}`;
}