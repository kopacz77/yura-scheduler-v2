import React, { createContext, useContext, useState, useCallback } from 'react';
import { Appointment, Resource } from '@/types/scheduling';

interface PlannerContextType {
  appointments: Appointment[];
  resources: Resource[];
  selectedDate: Date;
  viewMode: 'day' | 'week' | 'month';
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  setSelectedDate: (date: Date) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const addAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  }, []);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, ...updates } : apt))
    );
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  }, []);

  const addResource = useCallback((resource: Resource) => {
    setResources(prev => [...prev, resource]);
  }, []);

  const updateResource = useCallback((id: string, updates: Partial<Resource>) => {
    setResources(prev =>
      prev.map(res => (res.id === id ? { ...res, ...updates } : res))
    );
  }, []);

  const deleteResource = useCallback((id: string) => {
    setResources(prev => prev.filter(res => res.id !== id));
  }, []);

  return (
    <PlannerContext.Provider
      value={{
        appointments,
        resources,
        selectedDate,
        viewMode,
        setViewMode,
        setSelectedDate,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addResource,
        updateResource,
        deleteResource,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a PlannerProvider');
  }
  return context;
}