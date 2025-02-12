import { useState } from 'react';
import CalendarView from '@/components/calendar/CalendarView';
import UpcomingLessons from '@/components/schedule/UpcomingLessons';

const StudentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">My Schedule</h2>
        <CalendarView
          selectedDate={selectedDate}
          onChange={handleDateChange}
          readOnly
        />
      </section>

      <section>
        <UpcomingLessons />
      </section>
    </div>
  );
};

export default StudentDashboard;