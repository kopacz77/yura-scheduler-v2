import { useState } from 'react';
import { Appointment, Resource } from '@/models/types';
import { RinkArea } from '@prisma/client';

const mockResources: Resource[] = [
  {
    id: 'rink1',
    name: 'Main Rink',
    type: RinkArea.MAIN_RINK,
    details: {
      maxCapacity: 20,
      description: 'Olympic-sized ice rink',
      available: true,
    },
  },
  {
    id: 'rink2',
    name: 'Practice Rink',
    type: RinkArea.PRACTICE_RINK,
    details: {
      maxCapacity: 15,
      description: 'Smaller rink for practice sessions',
      available: true,
    },
  },
  {
    id: 'studio1',
    name: 'Dance Studio',
    type: RinkArea.DANCE_STUDIO,
    details: {
      maxCapacity: 10,
      description: 'Off-ice training space',
      available: true,
    },
  },
];

export function usePlanner() {
  const [resources] = useState<Resource[]>(mockResources);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Math.random().toString(36).substring(7),
      };
      setAppointments(prev => [...prev, newAppointment]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setAppointments(prev =>
        prev.map(appointment =>
          appointment.id === id 
            ? { ...appointment, ...data } 
            : appointment
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  const moveAppointment = (id: string, resourceId: string) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id
          ? { ...appointment, resourceId }
          : appointment
      )
    );
  };

  return {
    resources,
    appointments,
    isLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    moveAppointment,
  };
}