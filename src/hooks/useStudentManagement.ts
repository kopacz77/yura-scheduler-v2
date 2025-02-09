import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Student, Level, User } from '@prisma/client';

type StudentWithUser = Student & {
  user: Pick<User, 'name' | 'email'>;
};

export function useStudentManagement() {
  const queryClient = useQueryClient();

  // Fetch students
  const { data: students, isLoading } = useQuery<StudentWithUser[]>(
    ['students'],
    async () => {
      const response = await fetch('/api/students');
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch students');
      }
      return response.json();
    },
    {
      staleTime: 30 * 1000, // 30 seconds
    }
  );

  // Add student
  const addStudent = useMutation<
    StudentWithUser,
    Error,
    Omit<StudentWithUser, 'id' | 'createdAt' | 'updatedAt'>
  >(
    async (studentData) => {
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
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['students']);
        toast.success('Student added successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add student');
      },
    }
  );

  // Update student
  const updateStudent = useMutation<
    StudentWithUser,
    Error,
    { id: string; data: Partial<StudentWithUser> }
  >(
    async ({ id, data }) => {
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
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['students']);
        toast.success('Student updated successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update student');
      },
    }
  );

  // Schedule lesson
  const scheduleLesson = useMutation(
    async (data: { studentId: string; startTime: Date; duration: number }) => {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to schedule lesson');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['lessons']);
        toast.success('Lesson scheduled successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to schedule lesson');
      },
    }
  );

  return {
    students: students || [],
    isLoading,
    addStudent: addStudent.mutate,
    updateStudent: updateStudent.mutate,
    scheduleLesson: scheduleLesson.mutate,
    isAddingStudent: addStudent.isLoading,
    isUpdatingStudent: updateStudent.isLoading,
    isSchedulingLesson: scheduleLesson.isLoading,
  };
}
