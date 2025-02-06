import { Level, LessonStatus, LessonType, RinkArea, Role } from '@prisma/client';

export interface Rink {
  id: string;
  name: string;
  timezone: string;
  address: string;
  maxCapacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
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

export interface Lesson {
  id: string;
  studentId: string;
  student: Student;
  rinkId: string;
  rink: Rink;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: LessonType;
  area: RinkArea;
  status: LessonStatus;
  cancellationReason: string | null;
  cancellationTime: Date | null;
  notes: string | null;
  price: number;
  googleCalendarEventId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RinkTimeSlot {
  id: string;
  rinkId: string;
  rink: Rink;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  maxStudents: number;
  lessons: Lesson[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_RINKS: Record<string, Pick<Rink, 'timezone' | 'address'>> = {
  'East West Ice Palace': {
    timezone: 'America/Los_Angeles',
    address: '23770 S Western Ave, Harbor City, CA 90710'
  },
  'Great Park Ice': {
    timezone: 'America/Los_Angeles',
    address: '888 Ridge Valley, Irvine, CA 92618'
  },
  'Lakewood Ice': {
    timezone: 'America/Los_Angeles',
    address: '3975 Pixie Ave, Lakewood, CA 90712'
  },
  'KHS': {
    timezone: 'America/Los_Angeles',
    address: 'Skating Club of Boston, 750 University Ave, Norwood, MA 02062'
  },
  'San Jose Sharks Arena': {
    timezone: 'America/Los_Angeles',
    address: '1500 S 10th St, San Jose, CA 95112'
  },
  'Novi Ice Arena': {
    timezone: 'America/Detroit',
    address: '42400 Nick Lidstrom Dr, Novi, MI 48375'
  },
  'Any Rink in London ON': {
    timezone: 'America/Toronto',
    address: 'London, ON, Canada'
  }
};