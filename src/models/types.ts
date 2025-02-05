import { LessonType, PaymentStatus } from '@prisma/client';

export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  duration: number;
  resourceId: string;  // rinkAreaId
  order: number;
  details: {
    studentId: string;
    lessonType: LessonType;
    notes?: string;
    paymentStatus?: PaymentStatus;
    skill?: string;
    focus?: string;
  };
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  details: {
    maxCapacity?: number;
    description?: string;
    available: boolean;
    maintenanceSchedule?: {
      start: Date;
      end: Date;
    }[];
  };
}

export interface TimeSlot {
  time: string;
  resourceId: string;
}