import { useState } from 'react';
import { Appointment, Resource, RinkArea } from '@/models/types';

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Main Rink',
    type: 'main-rink' as RinkArea,
    details: {
      maxCapacity: 20,
      description: 'Olympic-sized ice rink',
      available: true
    }
  },
  {
    id: '2',
    name: 'Practice Rink',
    type: 'practice-rink' as RinkArea,
    details: {
      maxCapacity: 15,
      description: 'Smaller practice area',
      available: true
    }
  },
  {
    id: '3',
    name: 'Dance Studio',
    type: 'dance-studio' as RinkArea,
    details: {
      maxCapacity: 10,
      description: 'Off-ice training area',
      available: true
    }
  }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Sarah Chen - Private Lesson',
    start: new Date('2025-01-31T14:00:00'),
    end: new Date('2025-01-31T15:00:00'),
    resourceId: '1',
    order: 0,
    details: {
      studentId: '1',
      lessonType: 'private',
      notes: 'Jump technique focus',
      paymentStatus: 'paid',
      skill: 'triple jumps',
      focus: 'technique refinement'
    }
  },
  {
    id: '2',
    title: 'Group Class - Intermediate',
    start: new Date('2025-01-31T15:30:00'),
    end: new Date('2025-01-31T16:30:00'),
    resourceId: '2',
    order: 1,
    details: {
      studentId: 'group-1',
      lessonType: 'group',
      notes: 'Intermediate level class',
      paymentStatus: 'paid'
    }
  }
];

export function usePlanner() {
  const [resources] = useState<Resource[]>(mockResources);
  const [appointments] = useState<Appointment[]>(mockAppointments);

  return {
    resources,
    appointments
  };
}