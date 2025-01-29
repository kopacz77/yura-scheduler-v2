import type { Appointment, Resource, Student, Payment } from '@prisma/client';

export interface AppointmentWithRelations extends Appointment {
  student: Student;
  resource: Resource;
  payment?: Payment;
}

export interface ResourceWithAppointments extends Resource {
  appointments: Appointment[];
}

export interface MaintenanceSlot {
  start: string;
  end: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  appointments: Appointment[];
}

export interface AvailabilityCheck {
  available: boolean;
  conflicts: Appointment[];
  reason?: string;
}

export interface RecurringAppointmentPattern {
  pattern: 'weekly' | 'biweekly';
  endDate: Date;
}

export interface ScheduleConflict {
  appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;
  reason: string;
}

export interface ResourceSchedule {
  resource: Resource;
  appointments: Appointment[];
  maintenanceSlots: MaintenanceSlot[];
  utilization: number;
}

export interface AppointmentValidation {
  valid: boolean;
  conflicts: ScheduleConflict[];
}
