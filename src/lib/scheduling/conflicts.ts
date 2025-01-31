import { Appointment, Resource } from '@/types/scheduling';

export function validateAppointments(
  newAppointments: Appointment[],
  existingAppointments: Appointment[],
  resources: Resource[]
) {
  const conflicts = [];

  for (const newAppt of newAppointments) {
    // Check resource availability
    const resource = resources.find(r => r.id === newAppt.resourceId);
    if (!resource) {
      conflicts.push({
        type: 'resource_not_found',
        appointment: newAppt
      });
      continue;
    }

    // Check time conflicts
    for (const existingAppt of existingAppointments) {
      if (hasTimeConflict(newAppt, existingAppt)) {
        conflicts.push({
          type: 'time_conflict',
          appointment: newAppt,
          conflictingAppointment: existingAppt
        });
      }
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts
  };
}

export function generateRecurringAppointments(
  baseAppointment: Appointment,
  pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  endDate: Date
): Appointment[] {
  const appointments: Appointment[] = [];
  let currentDate = new Date(baseAppointment.start);
  const baseEnd = new Date(baseAppointment.end);
  const duration = baseEnd.getTime() - currentDate.getTime();

  while (currentDate <= endDate) {
    appointments.push({
      ...baseAppointment,
      start: new Date(currentDate),
      end: new Date(currentDate.getTime() + duration)
    });

    switch (pattern) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  return appointments;
}

function hasTimeConflict(appt1: Appointment, appt2: Appointment): boolean {
  const start1 = new Date(appt1.start).getTime();
  const end1 = new Date(appt1.end).getTime();
  const start2 = new Date(appt2.start).getTime();
  const end2 = new Date(appt2.end).getTime();

  return (start1 < end2 && end1 > start2);
}