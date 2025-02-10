import { format, parseISO, addDays, isSameDay, addMinutes, isWithinInterval } from 'date-fns';
import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';

// Time slot types
export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

// Time slot generation
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

// Time slot utilities
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

export function formatTimeSlot(slot: TimeSlot, timeZone: string): string {
  return `${formatInTimeZone(slot.start, timeZone, 'h:mm a')} - ${formatInTimeZone(slot.end, timeZone, 'h:mm a')}`;
}

export function formatAppointmentTime(date: Date | string) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, 'h:mm a');
}

// Date calculation utilities
export function calculateNewDates(
  sourceDate: Date,
  targetDate: Date,
  duration: number
): TimeRange {
  const daysDiff = targetDate.getDay() - sourceDate.getDay();
  const start = addDays(targetDate, daysDiff);
  const end = addMinutes(start, duration);
  
  return {
    start,
    end
  };
}

export function filterAppointments<T extends { start: Date }>(
  appointments: T[],
  date: Date
): T[] {
  return appointments.filter(appointment => 
    isSameDay(new Date(appointment.start), date)
  );
}
