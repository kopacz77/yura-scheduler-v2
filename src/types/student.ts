import { Level, User } from '@prisma/client';

export interface StudentWithUser {
  id: string;
  userId: string;
  user: User;
  phone: string | null;
  maxLessonsPerWeek: number;
  notes: string | null;
  level: Level;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  studentId: string;
  date: string;
  skillLevel: number;
  attendance: number;
  notes?: string;
  evaluatedBy: string;
}

export interface StudentStats {
  totalLessons: number;
  completedLessons: number;
  upcomingLessons: number;
  averageAttendance: number;
  currentLevel: Level;
  progressRate: number;
}