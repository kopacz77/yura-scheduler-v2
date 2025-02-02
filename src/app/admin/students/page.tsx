'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { StudentList } from '@/components/admin/StudentList';
import { useStudentManagement } from '@/hooks/useStudentManagement';

export default function StudentsManagementPage() {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    scheduleLesson 
  } = useStudentManagement();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Student Management"
        description="Manage your students and their schedules"
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