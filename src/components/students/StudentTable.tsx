'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StudentWithUser } from '@/types/student';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Level } from '@prisma/client';

interface StudentTableProps {
  students: StudentWithUser[];
  onEditStudent?: (student: StudentWithUser) => void;
  onDeleteStudent?: (student: StudentWithUser) => void;
}

export function StudentTable({ students, onEditStudent, onDeleteStudent }: StudentTableProps) {
  const router = useRouter();

  const formatLevel = (level: Level) => {
    return level.replace('_', ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRowClick = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  const handleAction = (e: React.MouseEvent, action: (student: StudentWithUser) => void, student: StudentWithUser) => {
    e.stopPropagation();
    action(student);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Max Lessons/Week</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow
            key={student.id}
            className="cursor-pointer"
            onClick={() => handleRowClick(student.id)}
          >
            <TableCell>{student.user.name}</TableCell>
            <TableCell>{student.user.email}</TableCell>
            <TableCell>{student.phone || 'N/A'}</TableCell>
            <TableCell>{formatLevel(student.level)}</TableCell>
            <TableCell>{student.maxLessonsPerWeek}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                {onEditStudent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleAction(e, onEditStudent, student)}
                  >
                    Edit
                  </Button>
                )}
                {onDeleteStudent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleAction(e, onDeleteStudent, student)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}