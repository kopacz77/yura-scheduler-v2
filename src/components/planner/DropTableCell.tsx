'use client';

import React, { useRef } from 'react';
import { useDroppable } from '@atlaskit/pragmatic-drag-and-drop/react';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DropTableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  onDrop?: (data: any) => void;
  isDropTarget?: boolean;
}

export function DropTableCell({ 
  children, 
  onDrop,
  isDropTarget = true,
  className, 
  ...props 
}: DropTableCellProps) {
  const [isActivated, ref] = useDroppable({
    onDrop: ({ source }) => onDrop?.(source.data),
  });

  return (
    <TableCell
      ref={ref}
      {...props}
      className={cn(
        'transition-colors duration-200',
        isActivated && 'bg-primary/10',
        !isActivated && isDropTarget && 'hover:bg-primary/5',
        className
      )}
      data-droppable={isDropTarget}
    >
      {children}
    </TableCell>
  );
}