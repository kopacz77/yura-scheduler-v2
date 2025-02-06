'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { type Appointment } from '@/models/types';

export interface DropTableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  date: Date;
  resourceId: string;
  onActivate: (time: Date) => void;
  appointments: Appointment[];
}

export function DropTableCell({ 
  date,
  resourceId,
  onActivate,
  appointments,
  className,
  children,
  ...props 
}: DropTableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${resourceId}-${date.toISOString()}`,
    data: {
      resourceId,
      time: date,
    },
  });

  return (
    <TableCell
      ref={setNodeRef}
      onClick={() => onActivate(date)}
      {...props}
      className={cn(
        'min-w-[200px] border-r p-2 align-top transition-colors duration-200',
        'hover:bg-primary/5 cursor-pointer',
        isOver && 'bg-primary/10',
        className
      )}
    >
      {children}
      {appointments.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          {appointments.length} appointment(s)
        </div>
      )}
    </TableCell>
  );
}