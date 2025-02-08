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
  details: AppointmentDetails;
  payment?: PaymentDetails;
}
