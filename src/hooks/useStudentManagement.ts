import { useState } from 'react';
import { Student, Level, User } from '@prisma/client';

type StudentWithUser = Student & {
  user: Pick<User, 'name' | 'email'>;
};

const mockUsers: Record<string, Pick<User, 'name' | 'email'>> = {
  'user1': {
    name: 'Emily Wilson',
    email: 'emily.w@example.com',
  },
  'user2': {
    name: 'David Lee',
    email: 'david.lee@example.com',
  },
  'user3': {
    name: 'Sophie Brown',
    email: 'sophie.b@example.com',
  },
};

const mockStudents: StudentWithUser[] = [
  {
    id: '1',
    userId: 'user1',
    user: mockUsers['user1'],
    phone: '+1 (555) 123-4567',
    maxLessonsPerWeek: 3,
    level: Level.JUNIOR,
    emergencyContact: {
      name: 'Michael Chen',
      phone: '+1 (555) 123-4568',
      relation: 'Father'
    },
    notes: 'Preparing for regional competition',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01')
  },
  {
    id: '2',
    userId: 'user2',
    user: mockUsers['user2'],
    phone: '+1 (555) 234-5678',
    maxLessonsPerWeek: 2,
    level: Level.NOVICE,
    emergencyContact: {
      name: 'Sarah Kim',
      phone: '+1 (555) 234-5679',
      relation: 'Mother'
    },
    notes: 'Focus on technical skills',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-15')
  },
  {
    id: '3',
    userId: 'user3',
    user: mockUsers['user3'],
    phone: '+1 (555) 345-6789',
    maxLessonsPerWeek: 1,
    level: Level.PRELIMINARY,
    emergencyContact: {
      name: 'John Taylor',
      phone: '+1 (555) 345-6780',
      relation: 'Father'
    },
    notes: 'New student, starting basics',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

export function useStudentManagement() {
  const [students, setStudents] = useState<StudentWithUser[]>(mockStudents);
  const [isLoading, setIsLoading] = useState(false);

  const addStudent = async (studentData: Omit<StudentWithUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const newStudent: StudentWithUser = {
        ...studentData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setStudents(prev => [...prev, newStudent]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (id: string, data: Partial<StudentWithUser>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setStudents(prev =>
        prev.map(student =>
          student.id === id 
            ? { ...student, ...data, updatedAt: new Date() } 
            : student
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      setStudents(prev => prev.filter(student => student.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleLesson = (student: StudentWithUser) => {
    // TODO: Implement lesson scheduling logic
    console.log('Scheduling lesson for student:', student.user.name);
  };

  return {
    students,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    scheduleLesson,
  };
}