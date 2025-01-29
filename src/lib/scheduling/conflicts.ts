import { Appointment, Resource } from '@prisma/client';
import { isWithinInterval, areIntervalsOverlapping } from 'date-fns';

interface TimeSlot {
  start: Date;
  end: Date;
}

export function checkTimeConflict(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return areIntervalsOverlapping(
    { start: new Date(slot1.start), end: new Date(slot1.end) },
    { start: new Date(slot2.start), end: new Date(slot2.end) }
  );
}

export function checkResourceAvailability(
  resource: Resource,
  timeSlot: TimeSlot,
  existingAppointments: Appointment[]
): {
  available: boolean;
  conflicts: Appointment[];
  reason?: string;
} {
  // Check if resource is generally available
  if (!resource.available) {
    return {
      available: false,
      conflicts: [],
      reason: 'Resource is not available for booking'
    };
  }

  // Check maintenance schedule
  if (resource.maintenanceSchedule) {
    const maintenanceSlots = JSON.parse(resource.maintenanceSchedule as string);
    const maintenanceConflict = maintenanceSlots.some((slot: TimeSlot) =>
      checkTimeConflict(timeSlot, slot)
    );

    if (maintenanceConflict) {
      return {
        available: false,
        conflicts: [],
        reason: 'Resource is scheduled for maintenance'
      };
    }
  }

  // Check existing appointments
  const conflictingAppointments = existingAppointments.filter(
    (appointment) => {
      return appointment.resourceId === resource.id &&
        checkTimeConflict(
          timeSlot,
          { start: appointment.start, end: appointment.end }
        );
    }
  );

  // Check capacity constraints if applicable
  if (resource.maxCapacity && conflictingAppointments.length >= resource.maxCapacity) {
    return {
      available: false,
      conflicts: conflictingAppointments,
      reason: 'Resource has reached maximum capacity'
    };
  }

  return {
    available: conflictingAppointments.length === 0,
    conflicts: conflictingAppointments
  };
}

export function generateRecurringAppointments(
  baseAppointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>,
  pattern: 'weekly' | 'biweekly',
  endDate: Date
): Array<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>> {
  const appointments: Array<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>> = [baseAppointment];
  const interval = pattern === 'weekly' ? 7 : 14; // days
  
  let currentStart = new Date(baseAppointment.start);
  let currentEnd = new Date(baseAppointment.end);

  while (currentStart <= endDate) {
    currentStart = new Date(currentStart.setDate(currentStart.getDate() + interval));
    currentEnd = new Date(currentEnd.setDate(currentEnd.getDate() + interval));

    if (currentStart <= endDate) {
      appointments.push({
        ...baseAppointment,
        start: new Date(currentStart),
        end: new Date(currentEnd)
      });
    }
  }

  return appointments;
}

export async function validateAppointments(
  appointments: Array<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>,
  existingAppointments: Appointment[],
  resources: Resource[]
): Promise<{
  valid: boolean;
  conflicts: Array<{
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;
    reason: string;
  }>;
}> {
  const conflicts: Array<{
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;
    reason: string;
  }> = [];

  for (const appointment of appointments) {
    const resource = resources.find(r => r.id === appointment.resourceId);
    if (!resource) {
      conflicts.push({
        appointment,
        reason: 'Resource not found'
      });
      continue;
    }

    const availability = checkResourceAvailability(
      resource,
      { start: appointment.start, end: appointment.end },
      existingAppointments
    );

    if (!availability.available) {
      conflicts.push({
        appointment,
        reason: availability.reason || 'Time slot conflict'
      });
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts
  };
}
