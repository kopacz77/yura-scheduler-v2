import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { Student } from '@prisma/client';
import { StudentCard } from './StudentCard';
import { StudentForm } from './StudentForm';

interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  onScheduleLesson: (student: Student) => void;
}

export function StudentList({ 
  students, 
  onAddStudent, 
  onUpdateStudent,
  onScheduleLesson 
}: StudentListProps) {
  const [search, setSearch] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student =>
    student.notes?.toLowerCase().includes(search.toLowerCase()) ||
    student.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStudent = async (data: any) => {
    await onAddStudent(data);
    setIsAddingStudent(false);
  };

  const handleUpdateStudent = async (data: any) => {
    if (editingStudent) {
      await onUpdateStudent(editingStudent.id, data);
      setEditingStudent(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Student</DialogTitle>
            <StudentForm
              onSubmit={handleAddStudent}
              onCancel={() => setIsAddingStudent(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={setEditingStudent}
            onSchedule={onScheduleLesson}
          />
        ))}
      </div>

      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogTitle>Edit Student</DialogTitle>
          {editingStudent && (
            <StudentForm
              student={editingStudent}
              onSubmit={handleUpdateStudent}
              onCancel={() => setEditingStudent(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No students found matching your search criteria
        </div>
      )}
    </div>
  );
}