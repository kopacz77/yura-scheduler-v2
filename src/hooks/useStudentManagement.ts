import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Student, User } from '@prisma/client';

type StudentWithUser = Student & {
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

  // Schedule lesson
  const scheduleLesson = useMutation({
    mutationFn: async (student: StudentWithUser) => {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          // Add other required fields here
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

  const handleAddStudent = async (student: Omit<StudentWithUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addStudent.mutateAsync(student);
  };

  const handleUpdateStudent = async (id: string, data: Partial<StudentWithUser>) => {
    await updateStudent.mutateAsync({ id, data });
  };

  const handleScheduleLesson = (student: StudentWithUser) => {
    scheduleLesson.mutate(student);
  };

  return {
    students,
    isLoading,
    addStudent: handleAddStudent,
    updateStudent: handleUpdateStudent,
    scheduleLesson: handleScheduleLesson,
    isAddingStudent: addStudent.isPending,
    isUpdatingStudent: updateStudent.isPending,
    isSchedulingLesson: scheduleLesson.isPending,
  };
}
