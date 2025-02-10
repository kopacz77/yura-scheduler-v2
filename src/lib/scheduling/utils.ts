import { addMinutes, isBefore, isAfter } from 'date-fns';
import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';
import { Appointment } from '@/types/domain';

// Time zone utilities
export function convertTimeToZone(date: Date, timeZone: string): Date {
  return utcToZonedTime(date, timeZone);
}

export function formatScheduleTime(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, 'h:mm a');
}

// Conflict checking
export function hasTimeConflict(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return (
    (isAfter(start1, start2) && isBefore(start1, end2)) ||
    (isAfter(end1, start2) && isBefore(end1, end2)) ||
    (isBefore(start1, start2) && isAfter(end1, end2))
  );
}

export function checkAppointmentConflicts(
  newStart: Date,
  newEnd: Date,
  existingAppointments: Appointment[],
  excludeId?: string
): boolean {
  return existingAppointments.some(
    appointment =>
      appointment.id !== excludeId &&
      hasTimeConflict(
        newStart,
        newEnd,
        new Date(appointment.start),
        new Date(appointment.end)
      )
  );
}

// Resource management
export function validateResourceAvailability(
  resourceId: string,
  start: Date,
  end: Date,
  currentBookings: Appointment[]
): {
  available: boolean;
  conflicts?: Appointment[];
} {
  const conflicts = currentBookings.filter(
    booking =>
      booking.resourceId === resourceId &&
      hasTimeConflict(start, end, new Date(booking.start), new Date(booking.end))
  );

  return {
    available: conflicts.length === 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
}

export function getResourceCapacity(
  resourceId: string,
  resources: Array<{ id: string; capacity: number }>
): number {
  const resource = resources.find(r => r.id === resourceId);
  return resource?.capacity || 1;
}

export function checkResourceOverbooking(
  resourceId: string,
  start: Date,
  end: Date,
  resources: Array<{ id: string; capacity: number }>,
  currentBookings: Appointment[]
): boolean {
  const capacity = getResourceCapacity(resourceId, resources);
  const overlappingBookings = currentBookings.filter(
    booking =>
      booking.resourceId === resourceId &&
      hasTimeConflict(start, end, new Date(booking.start), new Date(booking.end))
  );

  return overlappingBookings.length >= capacity;
}
