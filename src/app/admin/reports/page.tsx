'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueReport } from '@/components/admin/reports/RevenueReport';
import { AttendanceReport } from '@/components/admin/reports/AttendanceReport';
import { ProgressReport } from '@/components/admin/reports/ProgressReport';

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Reports</h1>
      
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="progress">Student Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <RevenueReport />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <AttendanceReport />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ProgressReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
