'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StudentList } from '@/components/students/StudentList';
import { useStudentManagement } from '@/hooks/useStudentManagement';
import type { DashboardStats } from '@/types/stats';

export default function AdminPage() {
  const { students, addStudent, updateStudent, scheduleLesson } = useStudentManagement();

  const adminStats: DashboardStats['overview'] = {
    totalStudents: {
      value: 45,
      change: 5,
      trend: 'up'
    },
    activeStudents: {
      value: 38,
      change: 3,
      trend: 'up'
    },
    completedLessons: {
      value: 120,
      change: 15,
      trend: 'up'
    },
    revenue: {
      value: 125000, // $1,250.00
      change: 25000, // $250.00
      trend: 'up'
    }
  };

  return (
    <div className="space-y-8 p-8">
      <DashboardHeader 
        stats={adminStats}
        isLoading={false}
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