import React from 'react';
import { useCalendar } from '@/contexts/PlannerContext';
import { type Resource, type Appointment } from '@/models/types';
import { TableCell } from '@/components/ui/table';

export interface ResourceTableCellProps {
  resource: Resource;
  appointments: Appointment[];
}

export const ResourceTableCell: React.FC<ResourceTableCellProps> = ({ 
  resource,
  appointments 
}) => {
  return (
    <TableCell className="min-w-[160px] border-r bg-background p-2">
      <div className="flex flex-col space-y-1">
        <span className="font-medium">{resource.name}</span>
        <span className="text-xs text-muted-foreground">{resource.type}</span>
        <span className="text-xs text-muted-foreground">
          {appointments.length} appointments
        </span>
      </div>
    </TableCell>
  );
};