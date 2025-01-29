import { Resource, Appointment } from '@prisma/client';
import { startOfDay, endOfDay, eachHourOfInterval } from 'date-fns';
import { checkResourceAvailability } from './conflicts';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  appointments: Appointment[];
}

export function getResourceAvailability(
  resource: Resource,
  date: Date,
  existingAppointments: Appointment[],
  slotDuration: number = 60 // minutes
): TimeSlot[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  // Get all hour intervals for the day
  const hourIntervals = eachHourOfInterval({
    start: dayStart,
    end: dayEnd
  });

  // Create time slots based on the specified duration
  const timeSlots: TimeSlot[] = [];
  for (let i = 0; i < hourIntervals.length - 1; i++) {
    const slotStart = hourIntervals[i];
    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

    const availability = checkResourceAvailability(
      resource,
      { start: slotStart, end: slotEnd },
      existingAppointments
    );

    timeSlots.push({
      start: slotStart,
      end: slotEnd,
      available: availability.available,
      appointments: availability.conflicts
    });
  }

  return timeSlots;
}

export function findAvailableResources(
  resources: Resource[],
  timeSlot: { start: Date; end: Date },
  existingAppointments: Appointment[]
): {
  resource: Resource;
  availability: ReturnType<typeof checkResourceAvailability>;
}[] {
  return resources.map(resource => ({
    resource,
    availability: checkResourceAvailability(resource, timeSlot, existingAppointments)
  })).filter(({ availability }) => availability.available);
}

export function getResourceSchedule(
  resource: Resource,
  startDate: Date,
  endDate: Date,
  appointments: Appointment[]
) {
  // Filter appointments for this resource within the date range
  const relevantAppointments = appointments.filter(appointment => 
    appointment.resourceId === resource.id &&
    appointment.start >= startDate &&
    appointment.end <= endDate
  );

  // Get maintenance schedule within the date range
  const maintenanceSlots = resource.maintenanceSchedule 
    ? JSON.parse(resource.maintenanceSchedule as string).filter(
        (slot: { start: string; end: string }) => 
          new Date(slot.start) >= startDate && 
          new Date(slot.end) <= endDate
      )
    : [];

  return {
    resource,
    appointments: relevantAppointments,
    maintenanceSlots,
    utilization: calculateUtilization(relevantAppointments, startDate, endDate)
  };
}

function calculateUtilization(
  appointments: Appointment[],
  startDate: Date,
  endDate: Date
): number {
  const totalMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  const bookedMinutes = appointments.reduce((total, appointment) => {
    const duration = (appointment.end.getTime() - appointment.start.getTime()) / (1000 * 60);
    return total + duration;
  }, 0);

  return (bookedMinutes / totalMinutes) * 100;
}
