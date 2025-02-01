import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

interface AttendanceRecord {
  date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

interface StudentAttendanceProps {
  attendanceRecords: AttendanceRecord[];
}

export function StudentAttendance({ attendanceRecords }: StudentAttendanceProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  const getAttendanceForDate = (date: Date) => {
    return attendanceRecords.find(
      (record) =>
        record.date.toDateString() === date.toDateString()
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              booked: (date) => {
                const record = getAttendanceForDate(date);
                return !!record;
              }
            }}
            modifiersStyles={{
              booked: {
                fontWeight: 'bold'
              }
            }}
          />
          <div className="space-y-4">
            {selectedDate && (
              <div>
                <h4 className="font-medium mb-2">
                  {selectedDate.toLocaleDateString()}
                </h4>
                {getAttendanceForDate(selectedDate) ? (
                  <div className="space-y-2">
                    <Badge
                      variant={{
                        present: 'success',
                        absent: 'destructive',
                        late: 'warning'
                      }[getAttendanceForDate(selectedDate)!.status]}
                    >
                      {getAttendanceForDate(selectedDate)!.status}
                    </Badge>
                    {getAttendanceForDate(selectedDate)!.notes && (
                      <p className="text-sm text-muted-foreground">
                        {getAttendanceForDate(selectedDate)!.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No attendance record for this date
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
