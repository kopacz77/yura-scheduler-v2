import { useState, useCallback } from 'react';
import { Lesson } from '@/types/schedule';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { toast } from 'sonner';

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async ({
    rinkId,
    startDate,
    endDate
  }: {
    rinkId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (rinkId) params.append('rinkId', rinkId);
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    try {
      const response = await fetch(`/api/lessons?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }

      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch lessons');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleLesson = async ({
    studentId,
    rinkId,
    startTime,
    duration
  }: {
    studentId: string;
    rinkId: string;
    startTime: Date;
    duration: 30 | 60;
  }) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          rinkId,
          startTime,
          duration,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to schedule lesson');
      }

      const lesson = await response.json();
      setLessons(prev => [...prev, lesson]);
      toast.success('Lesson scheduled successfully');
      return lesson;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to schedule lesson';
      toast.error(message);
      throw err;
    }
  };

  const cancelLesson = async (lessonId: string, reason: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel lesson');
      }

      const { lesson, cancellationFee } = await response.json();
      setLessons(prev =>
        prev.map(l => (l.id === lessonId ? lesson : l))
      );

      toast.success(
        cancellationFee > 0
          ? `Lesson cancelled. Cancellation fee: $${cancellationFee}`
          : 'Lesson cancelled successfully'
      );

      return { lesson, cancellationFee };
    } catch (err) {
      toast.error('Failed to cancel lesson');
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
