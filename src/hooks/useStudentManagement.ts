import { useState } from 'react';
import { Student, SkatingLevel } from '@/models/types';

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 123-4567',
    level: 'advanced' as SkatingLevel,
    startDate: new Date('2023-09-01'),
    packageCredits: 10,
    preferredDays: ['Monday', 'Wednesday', 'Friday'],
    notes: 'Preparing for regional competition'
  },
  {
    id: '2',
    name: 'Michael Kim',
    email: 'michael.k@example.com',
    phone: '+1 (555) 234-5678',
    level: 'intermediate' as SkatingLevel,
    startDate: new Date('2023-10-15'),
    packageCredits: 8,
    preferredDays: ['Tuesday', 'Thursday'],
    notes: 'Focus on technical skills'
  },
  {
    id: '3',
    name: 'Emily Taylor',
    email: 'emily.t@example.com',
    phone: '+1 (555) 345-6789',
    level: 'beginner' as SkatingLevel,
    startDate: new Date('2024-01-05'),
    packageCredits: 4,
    preferredDays: ['Saturday'],
    notes: 'New student, starting basics'
  }
];

export function useStudentManagement() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isLoading, setIsLoading] = useState(false);

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const newStudent = {
        ...studentData,
        id: Math.random().toString(36).substring(7),
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
          student.id === id ? { ...student, ...data } : student
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
    console.log('Scheduling lesson for:', student.name);
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