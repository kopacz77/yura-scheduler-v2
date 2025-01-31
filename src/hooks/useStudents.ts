import { useState, useCallback } from 'react';
import { Student } from '@/types/student';

export function useStudents() {
  const [isLoading, setIsLoading] = useState(false);

  const getStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStudentDetails = useCallback(async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch student details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  }, []);

  const updateStudent = useCallback(async (studentId: string, data: Partial<Student>) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update student');
      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }, []);

  return {
    getStudents,
    getStudentDetails,
    updateStudent,
    isLoading
  };
}