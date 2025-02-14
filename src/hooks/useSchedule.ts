import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { type Lesson } from '@prisma/client';

type ScheduleFilters = {
  studentId?: string;
  rinkId?: string;
  startDate?: Date;
  endDate?: Date;
};

type LessonInput = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;

export function useSchedule() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ScheduleFilters>({});

  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.rinkId) params.append('rinkId', filters.rinkId);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await fetch(`/api/lessons?${params}`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const scheduleMutation = useMutation({
    mutationFn: async (lessonData: LessonInput) => {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to schedule lesson');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: 'Success',
        description: 'Lesson scheduled successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ lessonId, reason }: { lessonId: string; reason: string }) => {
      const response = await fetch(`/api/lessons/${lessonId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to cancel lesson');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: 'Success',
        description: 'Lesson cancelled successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    lessons,
    isLoading,
    error,
    filters,
    setFilters,
    scheduleLesson: scheduleMutation.mutate,
    cancelLesson: cancelMutation.mutate,
    isScheduling: scheduleMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
