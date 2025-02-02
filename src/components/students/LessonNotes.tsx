'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type Note = {
  id: string;
  date: string;
  content: string;
  coach: string;
  focus: string;
};

export function LessonNotes() {
  const notes: Note[] = [
    {
      id: '1',
      date: '2024-02-01',
      content: 'Great progress on the camel spin. Work on entry speed and position.',
      coach: 'Yura Min',
      focus: 'Spins',
    },
    {
      id: '2',
      date: '2024-01-29',
      content: 'Footwork sequence improving. Focus on arm positions during twizzles.',
      coach: 'Yura Min',
      focus: 'Footwork',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Lesson Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{format(new Date(note.date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">Focus: {note.focus}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{note.coach}</span>
                </div>
                <p className="text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
