import { addMinutes, format, parse, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export type TimeSlot = {
  startTime: string; // format: 'HH:mm'
  endTime: string;   // format: 'HH:mm'
  duration: number;  // in minutes
};

export function generateTimeSlots(startTime: string, endTime: string, duration: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());

  let currentSlot = start;
  while (currentSlot < end) {
    const slotEnd = addMinutes(currentSlot, duration);
    if (slotEnd > end) break;

    slots.push({
      startTime: format(currentSlot, 'HH:mm'),
      endTime: format(slotEnd, 'HH:mm'),
      duration,
    });

    currentSlot = slotEnd;
  }

  return slots;
}

export function getWeekDays(date: Date, timezone: string): Date[] {
  const zonedDate = toZonedTime(date, timezone);
  const start = startOfWeek(zonedDate, { weekStartsOn: 0 });
  const end = endOfWeek(zonedDate, { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end }).map(day => {
    // Convert each day to the target timezone
    const zonedDay = toZonedTime(day, timezone);
    // Reset the time to midnight in the target timezone
    zonedDay.setHours(0, 0, 0, 0);
    return zonedDay;
  });
}

export function formatTimeSlot(slot: TimeSlot, timezone?: string): string {
  if (!timezone) {
    return `${slot.startTime} - ${slot.endTime}`;
  }

  const baseDate = new Date();
  const start = parse(slot.startTime, 'HH:mm', baseDate);
  const end = parse(slot.endTime, 'HH:mm', baseDate);

  return `${formatInTimeZone(start, timezone, 'HH:mm')} - ${formatInTimeZone(end, timezone, 'HH:mm')}`;
}

export function parseTimeSlot(timeString: string): TimeSlot {
  const [startTime, endTime] = timeString.split(' - ');
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

  return {
    startTime,
    endTime,
    duration,
  };
}

export function isTimeSlotAvailable(
  slot: TimeSlot,
  existingSlots: TimeSlot[],
  buffer: number = 0, // buffer in minutes
  timezone?: string
): boolean {
  const baseDate = new Date();
  const slotStart = parse(slot.startTime, 'HH:mm', baseDate);
  const slotEnd = parse(slot.endTime, 'HH:mm', baseDate);

  // If timezone is provided, convert times to that timezone
  const effectiveStart = timezone ? toZonedTime(slotStart, timezone) : slotStart;
  const effectiveEnd = timezone ? toZonedTime(slotEnd, timezone) : slotEnd;

  return !existingSlots.some(existing => {
    const existingStart = parse(existing.startTime, 'HH:mm', baseDate);
    const existingEnd = parse(existing.endTime, 'HH:mm', baseDate);

    // Convert existing times to timezone if provided
    const effectiveExistingStart = timezone ? toZonedTime(existingStart, timezone) : existingStart;
    const effectiveExistingEnd = timezone ? toZonedTime(existingEnd, timezone) : existingEnd;

    // Add buffer to both start and end times
    const bufferStart = addMinutes(effectiveStart, -buffer);
    const bufferEnd = addMinutes(effectiveEnd, buffer);
    const existingBufferStart = addMinutes(effectiveExistingStart, -buffer);
    const existingBufferEnd = addMinutes(effectiveExistingEnd, buffer);

    return (
      (bufferStart >= existingBufferStart && bufferStart < existingBufferEnd) ||
      (bufferEnd > existingBufferStart && bufferEnd <= existingBufferEnd) ||
      (bufferStart <= existingBufferStart && bufferEnd >= existingBufferEnd)
    );
  });
}