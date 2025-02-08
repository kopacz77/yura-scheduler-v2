import { LessonType } from '@prisma/client';

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
}
