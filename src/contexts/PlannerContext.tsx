import { createContext, useContext, useState, useCallback } from 'react';
import { Appointment, Resource } from '@/models/types';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

type ViewMode = 'day' | 'week' | 'month';

interface PlannerContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  dateRange: { start: Date; end: Date };
  timeLabels: string[];
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export interface PlannerProviderProps {
  children: React.ReactNode;
  initialResources: Resource[];
  initialAppointments: Appointment[];
}

export const PlannerProvider: React.FC<PlannerProviderProps> = ({
  children,
  initialResources,
  initialAppointments,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // Calculate date range based on view mode
  const dateRange = {
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  };

  // Generate time labels (8:00 AM to 10:00 PM)
  const timeLabels = eachDayOfInterval({
    start: dateRange.start,
    end: dateRange.end,
  }).map(date => date.toISOString());

  const updateAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev =>
      prev.map(app => (app.id === appointment.id ? appointment : app))
    );
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  }, []);

  const addAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  }, []);

  return (
    <PlannerContext.Provider
      value={{
        viewMode,
        setViewMode,
        currentDate,
        setCurrentDate,
        dateRange,
        timeLabels,
        resources,
        setResources,
        appointments,
        setAppointments,
        updateAppointment,
        deleteAppointment,
        addAppointment,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a PlannerProvider');
  }
  return context;
};
