import { ReactNode } from 'react';
import { Student, Rink, TimeSlot } from './context';

// Shared Types
export type BaseProps = {
  className?: string;
  children?: ReactNode;
};

// Layout Types
export type LayoutProps = BaseProps & {
  showNavigation?: boolean;
};

export type SidebarProps = BaseProps & {
  isOpen: boolean;
  onClose: () => void;
};

export type TopNavProps = BaseProps & {
  onMenuClick: () => void;
};

// Page Header Types
export type PageHeaderProps = BaseProps & {
  title: string;
  description?: string;
  actions?: ReactNode;
};

// Data Display Types
export type DataTableProps<T> = BaseProps & {
  data: T[];
  columns: Array<{
    header: string;
    accessorKey: keyof T | string;
    cell?: (info: { row: { original: T } }) => ReactNode;
  }>;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  pagination?: {
    pageSize?: number;
    pageIndex?: number;
    pageCount?: number;
    onPageChange?: (pageIndex: number) => void;
  };
  sorting?: {
    sortBy?: string;
    sortDesc?: boolean;
    onSort?: (sortBy: string, sortDesc: boolean) => void;
  };
};

// Form Types
export type FormFieldProps = BaseProps & {
  label: string;
  error?: string;
  required?: boolean;
};

// Student Components
export type StudentFormProps = BaseProps & {
  initialData?: Partial<Student>;
  onSubmit: (data: Partial<Student>) => Promise<void>;
  isLoading?: boolean;
};

export type StudentListProps = BaseProps & {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  isLoading?: boolean;
};

// Rink Components
export type RinkFormProps = BaseProps & {
  initialData?: Partial<Rink>;
  onSubmit: (data: Partial<Rink>) => Promise<void>;
  isLoading?: boolean;
};

export type TimeSlotFormProps = BaseProps & {
  rinkId: string;
  initialData?: Partial<TimeSlot>;
  onSubmit: (data: Partial<TimeSlot>) => Promise<void>;
  isLoading?: boolean;
};

// Schedule Components
export type ScheduleCalendarProps = BaseProps & {
  onSlotSelect: (start: Date, end: Date) => void;
  onEventClick: (eventId: string) => void;
  events: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId?: string;
  }>;
  resources?: Array<{
    id: string;
    title: string;
  }>;
  isLoading?: boolean;
};

export type LessonFormProps = BaseProps & {
  studentId?: string;
  rinkId?: string;
  startTime?: Date;
  endTime?: Date;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

// Payment Components
export type PaymentFormProps = BaseProps & {
  lessonId: string;
  studentId: string;
  amount: number;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export type PaymentListProps = BaseProps & {
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    date: Date;
    method: string;
  }>;
  onVerifyPayment: (paymentId: string) => Promise<void>;
  isLoading?: boolean;
};

// Analytics Components
export type AnalyticsCardProps = BaseProps & {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: ReactNode;
};

export type RevenueChartProps = BaseProps & {
  data: Array<{
    date: string;
    revenue: number;
    target?: number;
  }>;
  isLoading?: boolean;
};

export type StudentRetentionChartProps = BaseProps & {
  data: Array<{
    cohort: string;
    retention: Array<{
      month: number;
      rate: number;
    }>;
  }>;
  isLoading?: boolean;
};

// Modal Types
export type ConfirmDialogProps = BaseProps & {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
};

// Notification Types
export type NotificationListProps = BaseProps & {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
  }>;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  isLoading?: boolean;
};