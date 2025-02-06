// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : never;

export type PromiseType<T> = T extends Promise<infer U> ? U : never;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type NonNullable<T> = T extends null | undefined ? never : T;

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Date and Time Types
export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type TimeRange = {
  startTime: string; // Format: HH:mm
  endTime: string;   // Format: HH:mm
};

// Function Types
export type AsyncFunction<T = void> = () => Promise<T>;

export type AsyncFunctionWithParams<P, T = void> = (params: P) => Promise<T>;

export type ErrorCallback = (error: Error) => void;

export type SuccessCallback<T> = (data: T) => void;

// Validation Types
export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

// API Helper Types
export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
};

export type FilterParams = {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
};

export type QueryParams = PaginationParams & FilterParams;

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Event Types
export type EventHandler<T = any> = (event: T) => void;

export type KeyboardEventHandler = EventHandler<KeyboardEvent>;

export type MouseEventHandler = EventHandler<MouseEvent>;

// Animation Types
export type TransitionOptions = {
  duration?: number;
  delay?: number;
  timing?: string;
};

export type AnimationOptions = {
  from: any;
  to: any;
  duration?: number;
  delay?: number;
  timing?: string;
  onComplete?: () => void;
};
