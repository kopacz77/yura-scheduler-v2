import { useState } from 'react';
import { Student, Level } from '@prisma/client';

const mockStudents: Student[] = [
  {
    id: '1',
    userId: 'user1',
    phone: '+1 (555) 123-4567',
    maxLessonsPerWeek: 3,
    level: 'JUNIOR' as Level,
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
    phone: '+1 (555) 234-5678',
    maxLessonsPerWeek: 2,
    level: 'NOVICE' as Level,
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
    phone: '+1 (555) 345-6789',
    maxLessonsPerWeek: 1,
    level: 'PRELIMINARY' as Level,
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
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isLoading, setIsLoading] = useState(false);

  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const newStudent: Student = {
        ...studentData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
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

  const scheduleLesson = (student: Student) => {
    // TODO: Implement lesson scheduling logic
    console.log('Scheduling lesson for student ID:', student.id);
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