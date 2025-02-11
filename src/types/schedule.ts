import type { Lesson, Student, Payment, Rink, RinkTimeSlot } from '@prisma/client';

// Basic scheduling types
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  isActive: boolean;
  rinkId: string;
  available?: boolean;
  lessons?: Lesson[];
}

export interface MaintenanceSlot {
  start: string;
  end: string;
}

// Lesson types
export interface LessonWithRelations extends Lesson {
  student: Student;
  rink: Rink;
  payment?: Payment;
}

export interface LessonSummary {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
  status: string;
  student: {
    user: {
      name: string;
    };
  };
  rink: {
    name: string;
  };
}

// Rink scheduling
export interface RinkWithSchedule extends Rink {
  lessons: Lesson[];
  timeSlots: RinkTimeSlot[];
  maintenanceSlots?: MaintenanceSlot[];
  utilization?: number;
}

// Scheduling validation
export interface ScheduleConflict {
  lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;
  reason: string;
}

export interface LessonValidation {
  valid: boolean;
  conflicts: ScheduleConflict[];
}

export interface AvailabilityCheck {
  available: boolean;
  conflicts: Lesson[];
  reason?: string;
}

// Progress tracking
export interface ProgressDataPoint {
  name: string;
  current: number;
  total: number;
}

// Recurring patterns
export interface RecurringLessonPattern {
  pattern: 'weekly' | 'biweekly';
  endDate: Date;
}
