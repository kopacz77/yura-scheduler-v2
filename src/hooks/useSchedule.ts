'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type Lesson = {
  id: string;
  startTime: string;
  endTime: string;
  studentId: string;
  rinkId: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
};

type ScheduleFilters = {
  studentId?: string;
  rinkId?: string;
  startDate?: Date;
  endDate?: Date;
};

export function useSchedule() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async (filters: ScheduleFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.rinkId) params.append('rinkId', filters.rinkId);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await fetch(`/api/lessons?${params}`);
      if (!response.ok) throw new Error('Failed to fetch lessons');

      const data = await response.json();
      setLessons(data);
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
    fetchLessons();
  }, []);

  const scheduleLesson = async (lessonData: Omit<Lesson, 'id'>) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) throw new Error('Failed to schedule lesson');

      const newLesson = await response.json();
      setLessons((prev) => [...prev, newLesson]);

      toast({
        title: 'Success',
        description: 'Lesson scheduled successfully',
      });

      return newLesson;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to schedule lesson';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const cancelLesson = async (lessonId: string, reason: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED',
          cancellationReason: reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to cancel lesson');

      const updatedLesson = await response.json();
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId ? updatedLesson : lesson
        )
      );

      toast({
        title: 'Success',
        description: 'Lesson cancelled successfully',
      });

      return updatedLesson;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel lesson';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    lessons,
    isLoading,
    error,
    fetchLessons,
    scheduleLesson,
    cancelLesson,
  };
}