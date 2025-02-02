'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type Student = {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  phone?: string;
  maxLessonsPerWeek: number;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
};

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id' | 'userId' | 'user'>) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) throw new Error('Failed to add student');

      const newStudent = await response.json();
      setStudents((prev) => [...prev, newStudent]);

      toast({
        title: 'Success',
        description: 'Student added successfully',
      });

      return newStudent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add student';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateStudent = async (studentId: string, updateData: Partial<Student>) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update student');

      const updatedStudent = await response.json();
      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId ? updatedStudent : student
        )
      );

      toast({
        title: 'Success',
        description: 'Student updated successfully',
      });

      return updatedStudent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update student';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const getStudentProgress = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/progress`);
      if (!response.ok) throw new Error('Failed to fetch student progress');

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch progress';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    students,
    isLoading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    getStudentProgress,
  };
}