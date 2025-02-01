import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  date: Date;
  author: string;
}

interface StudentNotesProps {
  notes: Note[];
  onAddNote: (content: string) => void;
}

export function StudentNotes({ notes, onAddNote }: StudentNotesProps) {
  const [newNote, setNewNote] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Coach Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Textarea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </form>
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border-b pb-4 last:border-0 space-y-2"
            >
              <p className="text-sm text-muted-foreground">
                {note.date.toLocaleDateString()} - {note.author}
              </p>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
