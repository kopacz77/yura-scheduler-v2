'use client';

import React, { useRef } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop';
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
  const ref = useRef<HTMLTableCellElement>(null);

  React.useEffect(() => {
    if (!ref.current || !isDropTarget) return;

    return dropTargetForElements({
      element: ref.current,
      onDragStart: () => {
        if (ref.current) {
          ref.current.classList.add('bg-primary/10');
        }
      },
      onDragLeave: () => {
        if (ref.current) {
          ref.current.classList.remove('bg-primary/10');
        }
      },
      onDrop: ({ source }) => {
        if (ref.current) {
          ref.current.classList.remove('bg-primary/10');
          onDrop?.(source.data);
        }
      },
    });
  }, [isDropTarget, onDrop]);

  return (
    <TableCell
      ref={ref}
      {...props}
      className={cn(
        'transition-colors duration-200',
        isDropTarget && 'hover:bg-primary/5',
        className
      )}
      data-droppable={isDropTarget}
    >
      {children}
    </TableCell>
  );
}