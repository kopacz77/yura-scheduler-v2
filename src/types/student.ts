export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  dateOfBirth?: string;
  joinedDate: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    preferredDays: string[];
    preferredTimes: string[];
    notes: string;
  };
  paymentInfo?: {
    defaultMethod: string;
    billingAddress: string;
  };
}

export interface StudentProgress {
  studentId: string;
  date: string;
  skillLevel: number;
  attendance: number;
  notes?: string;
  evaluatedBy: string;
}

export interface StudentStats {
  totalLessons: number;
  completedLessons: number;
  upcomingLessons: number;
  averageAttendance: number;
  currentLevel: string;
  progressRate: number;
}