// Base API Response type
export type ApiResponse<T> = {
  data?: T;
  error?: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export type ApiErrorCode = 
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'CONFLICT';

// Auth Types
export type SignInRequest = {
  email: string;
  password: string;
};

export type ResetPasswordRequest = {
  email: string;
};

export type UpdatePasswordRequest = {
  token: string;
  password: string;
};

// Student Types
export type CreateStudentRequest = {
  email: string;
  name: string;
  phone?: string;
  maxLessonsPerWeek?: number;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
};

export type UpdateStudentRequest = {
  id: string;
  data: Partial<CreateStudentRequest>;
};

// Lesson Types
export type CreateLessonRequest = {
  studentId: string;
  rinkId: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  price: number;
  paymentMethod: 'VENMO' | 'ZELLE';
  timeSlotId?: string;
};

export type UpdateLessonRequest = {
  status?: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  cancellationReason?: string;
  notes?: string;
};

// Payment Types
export type CreatePaymentRequest = {
  lessonId: string;
  studentId: string;
  amount: number;
  method: 'VENMO' | 'ZELLE';
  notes?: string;
};

export type VerifyPaymentRequest = {
  paymentId: string;
  verificationNotes?: string;
};

// Stats Types
export type StatsOverview = {
  totalStudents: number;
  activeStudents: number;
  totalLessons: number;
  upcomingLessons: number;
  monthlyRevenue: number;
  ytdRevenue: number;
};

export type StatsDistribution = {
  byLevel: Array<{
    level: string;
    count: number;
  }>;
  byType: Array<{
    type: string;
    count: number;
  }>;
};

export type StatsProgress = {
  periods: Array<{
    label: string;
    lessons: number;
    revenue: number;
  }>;
};

export type StatsResponse = {
  overview: StatsOverview;
  distribution: StatsDistribution;
  progress: StatsProgress;
};
