import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Resource, type Appointment } from '@/models/types';
import { RinkArea } from '@prisma/client';

// Initial data for development and testing
const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'rink1',
    name: 'Main Rink',
    type: RinkArea.MAIN_RINK,
    capacity: 20,
    location: {
      address: '123 Ice Way',
      timezone: 'America/New_York'
    },
    properties: {
      description: 'Olympic-sized ice rink',
      hasLockers: true,
      hasCafe: true
    }
  },
  {
    id: 'rink2',
    name: 'Practice Rink',
    type: RinkArea.PRACTICE_RINK,
    capacity: 15,
    location: {
      address: '123 Ice Way',
      timezone: 'America/New_York'
    },
    properties: {
      description: 'Practice rink with specialized training areas',
      hasLockers: true,
      hasVideoSystem: true
    }
  },
  {
    id: 'studio1',
    name: 'Dance Studio',
    type: RinkArea.DANCE_STUDIO,
    capacity: 10,
    location: {
      address: '123 Ice Way',
      timezone: 'America/New_York'
    },
    properties: {
      description: 'Professional dance studio with mirrors and bars',
      hasAudioSystem: true,
      hasSpringFloor: true
    }
  }
];

async function fetchResources() {
  // In production, this would fetch from an API
  return Promise.resolve(INITIAL_RESOURCES);
}

export interface UsePlannerOptions {
  initialDate?: Date;
  onAppointmentMove?: (appointment: Appointment, resourceId: string, time: Date) => void;
}

export function usePlanner(options: UsePlannerOptions = {}) {
  const [currentDate, setCurrentDate] = useState(options.initialDate || new Date());

  const { data: resources = [], isLoading: isLoadingResources } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    resources,
    isLoadingResources,
    currentDate,
    setCurrentDate,
  };
}
