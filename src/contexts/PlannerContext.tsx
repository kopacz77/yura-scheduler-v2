'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Appointment, Resource } from '@/models/types';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachHourOfInterval } from 'date-fns';

interface DateRange {
  start: Date;
  end: Date;
}

interface PlannerContextType {
  appointments: Appointment[];
  resources: Resource[];
  selectedDate: Date;
  viewMode: 'day' | 'week' | 'month';
  dateRange: DateRange;
  timeLabels: Date[];
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  setSelectedDate: (date: Date) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

interface PlannerProviderProps {
  children: React.ReactNode;
  initialAppointments?: Appointment[];
  initialResources?: Resource[];
}

export function PlannerProvider({ 
  children, 
  initialAppointments = [],
  initialResources = []
}: PlannerProviderProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const dateRange = useMemo(() => {
    switch (viewMode) {
      case 'day':
        return {
          start: selectedDate,
          end: selectedDate
        };
      case 'week':
        return {
          start: startOfWeek(selectedDate, { weekStartsOn: 0 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 0 })
        };
      case 'month':
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate)
        };
      default:
        return {
          start: selectedDate,
          end: selectedDate
        };
    }
  }, [selectedDate, viewMode]);

  const timeLabels = useMemo(() => {
    const start = new Date();
    start.setHours(6, 0, 0, 0); // Start at 6 AM
    const end = new Date();
    end.setHours(22, 0, 0, 0); // End at 10 PM

    return eachHourOfInterval({ start, end });
  }, []);

  const addAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  }, []);

  const updateAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === appointment.id ? appointment : apt))
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
        dateRange,
        timeLabels,
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