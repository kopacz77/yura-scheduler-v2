import { type User, type Student, type Role } from '@prisma/client';

export interface UserData {
  name: string | null;
  email: string;
}

export interface StudentWithUser extends Omit<Student, 'user'> {
  user: UserData;
}

export interface StudentFormData {
  email: string;
  name: string;
  phone?: string;
  level: string;
  maxLessonsPerWeek: number;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}