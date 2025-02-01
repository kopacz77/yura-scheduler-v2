import { useState, useCallback } from 'react';
import { Student } from '@/types/schedule';
import { toast } from 'sonner';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStudent = async (studentData: {
    email: string;
    name: string;
    phone?: string;
    maxLessonsPerWeek?: number;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  }) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const student = await response.json();
      setStudents(prev => [...prev, student]);
      toast.success('Student created successfully');
      return student;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create student';
      toast.error(message);
      throw err;
    }
  };

  return {
    students,
    isLoading,
    error,
    fetchStudents,
    createStudent,
  };
}
