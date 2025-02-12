import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Lesson, Student, User, Rink } from '@prisma/client';

type LessonWithDetails = Lesson & {
  student: Student & {
    user: Pick<User, 'name' | 'email'>;
  };
  rink: Rink;
};

export default function UpcomingLessons() {
  const [lessons, setLessons] = useState<LessonWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch('/api/lessons/upcoming');
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming lessons');
        }
        const data = await response.json();
        setLessons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLessons();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upcoming Lessons</h2>
      {lessons.length === 0 ? (
        <p>No upcoming lessons scheduled</p>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-4 border rounded-lg bg-background shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {lesson.student.user.name || 'Unnamed Student'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(lesson.startTime), 'PPP p')} -{' '}
                    {format(new Date(lesson.endTime), 'p')}
                  </p>
                  <p className="text-sm">{lesson.rink.name}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {lesson.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}