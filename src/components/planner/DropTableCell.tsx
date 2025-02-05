'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DropTableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
  onDrop?: (data: any) => void;
  isDropTarget?: boolean;
}

export function DropTableCell({ 
  id,
  children, 
  onDrop,
  isDropTarget = true,
  className, 
  ...props 
}: DropTableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !isDropTarget,
    data: { onDrop },
  });

  return (
    <TableCell
      ref={setNodeRef}
      {...props}
      className={cn(
        'transition-colors duration-200',
        isDropTarget && 'hover:bg-primary/5',
        isOver && 'bg-primary/10',
        className
      )}
    >
      {children}
    </TableCell>
  );
}