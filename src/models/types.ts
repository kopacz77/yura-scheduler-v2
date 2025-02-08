import { LessonType, PaymentStatus } from '@prisma/client';

export interface PaymentDetails {
  status: PaymentStatus;
  amount: number;
  dueDate?: Date;
  paidAt?: Date;
}

export interface AppointmentDetails {
  lessonType: LessonType;
  studentId?: string;
  studentName?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  duration: number;      // Duration in minutes
  resourceId: string;    // ID of the resource (rink/area)
  details: AppointmentDetails;
  payment?: PaymentDetails;
}

// Resource represents a bookable entity (like a rink or area)
export interface Resource {
  id: string;
  name: string;
  type: 'rink' | 'area';
  capacity?: number;
  availability?: {
    start: string;  // Time in HH:mm format
    end: string;    // Time in HH:mm format
    days: number[];  // Days of week (0-6, 0 = Sunday)
  };
  location?: {
    address?: string;
    timezone?: string;
  };
  properties?: {
    [key: string]: any;
  };
}
