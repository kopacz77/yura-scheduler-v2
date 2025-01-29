export interface ApiResponse<T> {
  data?: T;
  error?: string;
  conflicts?: any[];
  status: number;
}

export interface ApiErrorResponse {
  error: string;
  conflicts?: any[];
  status: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface ResourceParams extends PaginationParams, DateRangeParams {
  available?: boolean;
  type?: string;
}

export interface AppointmentParams extends PaginationParams, DateRangeParams {
  studentId?: string;
  resourceId?: string;
  lessonType?: string;
}
