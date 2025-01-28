import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from '@/contexts/PlannerContext';
import { cn } from '@/lib/utils';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const Timeline: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { timeLabels, viewMode } = useCalendar();

  return (
    <TableHeader>
      <TableRow className="bg-background">
        <TableHead className="w-40 min-w-[160px] border-r">
          Rink Areas
        </TableHead>
        {timeLabels.map((date, index) => {
          const dayDate = new Date(date);
          return (
            <TableHead
              key={index}
              className={cn(
                'sticky top-0 z-10 min-w-[200px] border-x bg-background text-center lg:min-w-[250px]',
                'flex flex-col items-center justify-center p-2'
              )}
            >
              <div className="text-sm font-semibold">
                {format(dayDate, 'EEEE')}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(dayDate, 'MMM d, yyyy')}
              </div>
              {viewMode === 'day' && (
                <div className="mt-1 grid grid-cols-12 gap-1 text-[10px] text-muted-foreground">
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 8; // Starting from 8 AM
                    return (
                      <div key={hour} className="text-center">
                        {format(new Date().setHours(hour, 0), 'ha')}
                      </div>
                    );
                  })}
                </div>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
