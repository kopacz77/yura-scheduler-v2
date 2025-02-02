'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type Rink = {
  id: string;
  name: string;
  address: string;
};

type AppState = {
  students: Student[];
  rinks: Rink[];
  selectedRinkId?: string;
  selectedStudentId?: string;
  isLoading: boolean;
  error: string | null;
};

type AppAction =
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'SET_RINKS'; payload: Rink[] }
  | { type: 'SELECT_RINK'; payload: string }
  | { type: 'SELECT_STUDENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  students: [],
  rinks: [],
  isLoading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STUDENTS':
      return { ...state, students: action.payload };
    case 'SET_RINKS':
      return { ...state, rinks: action.payload };
    case 'SELECT_RINK':
      return { ...state, selectedRinkId: action.payload };
    case 'SELECT_STUDENT':
      return { ...state, selectedStudentId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}