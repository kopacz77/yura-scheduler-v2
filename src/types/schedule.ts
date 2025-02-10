export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  isActive: boolean;
  rinkId: string;
}

export interface Lesson {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
  status: string;
  student: {
    user: {
      name: string;
    };
  };
  rink: {
    name: string;
  };
}

export interface ProgressDataPoint {
  name: string;
  current: number;
  total: number;
}