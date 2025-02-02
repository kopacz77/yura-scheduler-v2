'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type Lesson = {
  id: string;
  startTime: Date;
  endTime: Date;
  studentId: string;
  rinkId: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
};

type ScheduleFilters = {
  studentId?: string;
  rinkId?: string;
  startDate?: Date;
  endDate?: Date;
};

export function useSchedule() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async (filters: ScheduleFilters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.rinkId) params.append('rinkId', filters.rinkId);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await fetch(`/api/lessons?${params}`);
      if (!response.ok) throw new Error('Failed to fetch lessons');

      const data = await response.json();
      setLessons(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Error',
        description: 'Failed to fetch lessons. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const bookLesson = async (lessonData: Omit<Lesson, 'id'>) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to book lesson');
      }

      const data = await response.json();
      setLessons(prev => [...prev, data]);
      
      toast({
        title: 'Success',
        description: 'Lesson booked successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to book lesson',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const cancelLesson = async (lessonId: string, reason: string) => {
    try {
      const response = await fetch(`/api/lessons`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: lessonId,
          status: 'CANCELLED',
          cancellationReason: reason,
          cancellationTime: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Failed to cancel lesson');

      const data = await response.json();
      setLessons(prev =>
        prev.map(lesson =>
          lesson.id === lessonId ? data : lesson
        )
      );

      toast({
        title: 'Success',
        description: 'Lesson cancelled successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to cancel lesson. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return {
    lessons,
    loading,
    error,
    fetchLessons,
    bookLesson,
    cancelLesson,
  };
}