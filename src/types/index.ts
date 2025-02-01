export type Rink = {
  id: string;
  name: string;
  timezone: string;
  address: string;
  isActive: boolean;
};

export type LessonDuration = 30 | 60;

export type Lesson = {
  id: string;
  studentId: string;
  rinkId: string;
  startTime: Date;
  duration: LessonDuration;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  weeklyLessonLimit: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: string;
  lessonId: string;
  studentId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded' | 'cancelled';
  type: 'lesson' | 'cancellation-fee';
  createdAt: Date;
  updatedAt: Date;
};

export const RINKS: Record<string, { timezone: string; address: string }> = {
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