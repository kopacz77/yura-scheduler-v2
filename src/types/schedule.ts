export interface Rink {
  id: string;
  name: string;
  timezone: string;
  address: string;
}

export interface Lesson {
  id: string;
  studentId: string;
  rinkId: string;
  startTime: Date;
  endTime: Date;
  duration: 30 | 60;  // in minutes
  status: 'scheduled' | 'cancelled' | 'completed';
  cancellationReason?: string;
  cancellationTime?: Date;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  maxLessonsPerWeek: number;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface CancellationPolicy {
  withinHours: number;  // 24 for your case
  refundPercentage: number;  // 50 for half refund
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