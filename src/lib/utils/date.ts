import { addMinutes, format, parse, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

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
  const zonedDate = utcToZonedTime(date, timezone);
  const start = startOfWeek(zonedDate, { weekStartsOn: 0 });
  const end = endOfWeek(zonedDate, { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end }).map(day =>
    zonedTimeToUtc(day, timezone)
  );
}

export function formatTimeSlot(slot: TimeSlot): string {
  return `${slot.startTime} - ${slot.endTime}`;
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
  buffer: number = 0 // buffer in minutes
): boolean {
  const slotStart = parse(slot.startTime, 'HH:mm', new Date());
  const slotEnd = parse(slot.endTime, 'HH:mm', new Date());

  return !existingSlots.some(existing => {
    const existingStart = parse(existing.startTime, 'HH:mm', new Date());
    const existingEnd = parse(existing.endTime, 'HH:mm', new Date());

    // Add buffer to both start and end times
    const bufferStart = addMinutes(slotStart, -buffer);
    const bufferEnd = addMinutes(slotEnd, buffer);
    const existingBufferStart = addMinutes(existingStart, -buffer);
    const existingBufferEnd = addMinutes(existingEnd, buffer);

    return (
      (bufferStart >= existingBufferStart && bufferStart < existingBufferEnd) ||
      (bufferEnd > existingBufferStart && bufferEnd <= existingBufferEnd) ||
      (bufferStart <= existingBufferStart && bufferEnd >= existingBufferEnd)
    );
  });
}