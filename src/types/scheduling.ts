import type { Lesson, Student, Payment, Rink, RinkTimeSlot } from '@prisma/client';

export interface LessonWithRelations extends Lesson {
  student: Student;
  rink: Rink;
  payment?: Payment;
}

export interface RinkWithLessons extends Rink {
  lessons: Lesson[];
  timeSlots: RinkTimeSlot[];
}

export interface MaintenanceSlot {
  start: string;
  end: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  lessons: Lesson[];
}

export interface AvailabilityCheck {
  available: boolean;
  conflicts: Lesson[];
  reason?: string;
}

export interface RecurringLessonPattern {
  pattern: 'weekly' | 'biweekly';
  endDate: Date;
}

export interface ScheduleConflict {
  lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;
  reason: string;
}

export interface RinkSchedule {
  rink: Rink;
  lessons: Lesson[];
  timeSlots: RinkTimeSlot[];
  maintenanceSlots: MaintenanceSlot[];
  utilization: number;
}

export interface LessonValidation {
  valid: boolean;
  conflicts: ScheduleConflict[];
}
