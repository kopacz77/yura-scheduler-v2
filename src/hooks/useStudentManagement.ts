import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Student, User } from '@prisma/client';

export type StudentWithUser = Student & {
  user: Pick<User, 'name' | 'email'>;
};

export function useStudentManagement() {
  const queryClient = useQueryClient();

  // Fetch students
  const { data: students = [], isLoading } = useQuery<StudentWithUser[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await fetch('/api/students');
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch students');
      }
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Add student
  const addStudent = useMutation({
    mutationFn: async (studentData: Omit<StudentWithUser, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to add student');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add student');
    },
  });

  // Update student
  const updateStudent = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StudentWithUser> }) => {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to update student');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update student');
    },
  });

  // Delete student
  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to delete student');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete student');
    },
  });

  // Get student progress
  const getStudentProgress = async (studentId: string) => {
    const response = await fetch(`/api/students/${studentId}/progress`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch student progress');
    }
    return response.json();
  };

  // Schedule lesson
  const scheduleLesson = useMutation({
    mutationFn: async ({ studentId, lessonData }: { studentId: string; lessonData: any }) => {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          ...lessonData,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to schedule lesson');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson scheduled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to schedule lesson');
    },
  });

  return {
    // Data
    students,
    isLoading,
    
    // Methods
    addStudent: (student: Omit<StudentWithUser, 'id' | 'createdAt' | 'updatedAt'>) => 
      addStudent.mutateAsync(student),
    updateStudent: (id: string, data: Partial<StudentWithUser>) => 
      updateStudent.mutateAsync({ id, data }),
    deleteStudent: (id: string) => 
      deleteStudent.mutateAsync(id),
    getStudentProgress,
    scheduleLesson: (studentId: string, lessonData: any) => 
      scheduleLesson.mutateAsync({ studentId, lessonData }),

    // Loading states
    isAddingStudent: addStudent.isPending,
    isUpdatingStudent: updateStudent.isPending,
    isDeletingStudent: deleteStudent.isPending,
    isSchedulingLesson: scheduleLesson.isPending,
  };
}
