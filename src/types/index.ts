// Re-export all type modules
export * from './api';
export * from './auth';
export * from './components';
export * from './context';
export * from './domain';
export * from './schedule';
export * from './schema';
export * from './shared';
export * from './stats';
export * from './student';
export * from './utils';

// Re-export common utility types
export type {
  TimeSlot,
  LessonWithRelations,
  ProgressDataPoint,
  RinkWithSchedule,
  Appointment,
  Resource,
  DashboardStats,
  StatsDataPoint,
  ValidationError,
  PaginationParams,
} from './schedule';
