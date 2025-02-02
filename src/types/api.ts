// Base API Response type
export type ApiResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// Auth Types
export type SignUpRequest = {
  email: string;
  password: string;
  name: string;
  role?: 'STUDENT' | 'ADMIN' | 'COACH';
};

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

export type UpdateStudentRequest = Partial<CreateStudentRequest>;

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

// Rink Types
export type CreateRinkRequest = {
  name: string;
  address: string;
  timezone: string;
  maxCapacity?: number;
};

export type UpdateRinkRequest = Partial<CreateRinkRequest>;

export type CreateTimeSlotRequest = {
  rinkId: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  maxStudents: number;
  isActive?: boolean;
};

export type UpdateTimeSlotRequest = Partial<Omit<CreateTimeSlotRequest, 'rinkId'>>;

// Analytics Types
export type AnalyticsResponse = {
  revenue: {
    total: number;
    byPeriod: Array<{
      period: string;
      amount: number;
    }>;
  };
  lessons: {
    total: number;
    completed: number;
    cancelled: number;
    upcomingCount: number;
    byPeriod: Array<{
      period: string;
      count: number;
    }>;
  };
  students: {
    totalCount: number;
    activeCount: number;
    newCount: number;
    byLevel: Array<{
      level: string;
      count: number;
    }>;
  };
};

export type RetentionAnalyticsResponse = {
  periods: Array<{
    startDate: string;
    cohortSize: number;
    retentionRates: Array<{
      month: number;
      rate: number;
    }>;
  }>;
};

export type RevenueProjectionResponse = {
  projectedRevenue: Array<{
    month: string;
    amount: number;
    confidence: number;
  }>;
  factors: Array<{
    name: string;
    impact: number;
    trend: 'up' | 'down' | 'stable';
  }>;
};

// Notification Types
export type Notification = {
  id: string;
  type: 'LESSON_BOOKED' | 'LESSON_CANCELLED' | 'PAYMENT_REQUIRED' | 'PAYMENT_VERIFIED' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    action?: {
      label: string;
      url: string;
    };
    [key: string]: any;
  };
};

// Schedule Types
export type AvailabilityRequest = {
  rinkId: string;
  startDate: string;
  endDate: string;
};

export type AvailabilityResponse = {
  availableSlots: Array<{
    date: string;
    timeSlots: Array<{
      id: string;
      startTime: string;
      endTime: string;
      available: boolean;
      currentBookings: number;
      maxStudents: number;
    }>;
  }>;
};