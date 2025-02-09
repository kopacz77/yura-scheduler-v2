import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';
import { format, addMinutes, isWithinInterval } from 'date-fns';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export function createTimeSlots(date: Date, rinkTimeZone: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startTime = utcToZonedTime(date, rinkTimeZone);
  startTime.setHours(6, 0, 0, 0); // Start at 6 AM
  
  for (let i = 0; i < 32; i++) { // End at 10 PM (32 half-hour slots)
    const start = new Date(startTime);
    const end = addMinutes(start, 30);
    
    slots.push({
      start,
      end,
      available: true
    });
    
    startTime.setMinutes(startTime.getMinutes() + 30);
  }
  
  return slots;
}

export function formatTimeSlot(slot: TimeSlot, timeZone: string): string {
  return `${formatInTimeZone(slot.start, timeZone, 'h:mm a')} - ${formatInTimeZone(slot.end, timeZone, 'h:mm a')}`;
}
