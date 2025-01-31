'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { StudentList } from '@/components/students/StudentList';
import { useStudentManagement } from '@/hooks/useStudentManagement';

export default function StudentsPage() {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    scheduleLesson 
  } = useStudentManagement();

  return (
    <div className="space-y-4 p-8">
      <PageHeader
        title="Students"
        description="Manage your students and their profiles"
      />
      <StudentList
        students={students}
        onAddStudent={addStudent}
        onUpdateStudent={updateStudent}
        onScheduleLesson={scheduleLesson}
      />
    </div>
  );
}