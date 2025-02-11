export type Theme = 'light' | 'dark' | 'system';

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}