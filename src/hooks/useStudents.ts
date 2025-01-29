import { useState } from 'react';
import { Student } from '@prisma/client';
import { toast } from 'sonner';

export function useStudents() {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const newStudent = await response.json();
      setStudents(prev => [...prev, newStudent]);
      toast.success('Student added successfully');
      return newStudent;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add student');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const updatedStudent = await response.json();
      setStudents(prev =>
        prev.map(student =>
          student.id === id ? updatedStudent : student
        )
      );
      toast.success('Student updated successfully');
      return updatedStudent;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update student');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setStudents(prev => prev.filter(student => student.id !== id));
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete student');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    students,
    isLoading,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}
