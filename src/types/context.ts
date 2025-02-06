import { Dispatch } from 'react';
import { Theme } from './shared';

// App Context Types
export type Student = {
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
};

export type Rink = {
  id: string;
  name: string;
  address: string;
  timezone: string;
  maxCapacity: number;
  timeSlots: TimeSlot[];
};

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  maxStudents: number;
  isActive: boolean;
};

export type AppState = {
  students: Student[];
  rinks: Rink[];
  selectedRinkId?: string;
  selectedStudentId?: string;
  isLoading: boolean;
  error: string | null;
};

export type AppAction =
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'SET_RINKS'; payload: Rink[] }
  | { type: 'SELECT_RINK'; payload: string }
  | { type: 'SELECT_STUDENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export type AppContextType = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};

// Theme Context Types
export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Auth Context Types
export type AuthState = {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  isLoading: boolean;
};

export type AuthContextType = {
  authState: AuthState;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => Promise<void>;
};