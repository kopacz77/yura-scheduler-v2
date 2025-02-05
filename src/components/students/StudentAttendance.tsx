import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AttendanceRecord {
  date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

interface StudentAttendanceProps {
  records: AttendanceRecord[];
}

const getVariantFromStatus = (status: AttendanceRecord['status']): 'success' | 'destructive' | 'warning' => {
  switch (status) {
    case 'present':
      return 'success';
    case 'absent':
      return 'destructive';
    case 'late':
      return 'warning';
  }
};

export function StudentAttendance({ records = [] }: StudentAttendanceProps) {
  const sortedRecords = [...records].sort((a, b) => b.date.getTime() - a.date.getTime());
  const attendanceRate = records.length > 0
    ? (records.filter(r => r.status === 'present').length / records.length * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Attendance History</h3>
        <Badge variant="secondary">{attendanceRate}% Present</Badge>
      </div>

      {sortedRecords.length > 0 ? (
        <div className="space-y-4">
          {sortedRecords.map((record) => (
            <div
              key={record.date.toISOString()}
              className="flex items-start justify-between border-b pb-2"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {format(record.date, 'MMMM d, yyyy')}
                </div>
                <Badge variant={getVariantFromStatus(record.status)}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
                {record.notes && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {record.notes}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(record.date, 'h:mm a')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No attendance records found
        </div>
      )}
    </div>
  );
}
