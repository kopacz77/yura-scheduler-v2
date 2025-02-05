'use client';

import React, { useRef, useEffect } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/monitor';
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

  useEffect(() => {
    if (!ref.current || !isDropTarget) return;

    const cleanup = dropTargetForElements({
      element: ref.current,
      onDragEnter: () => {
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

    // Cleanup function to remove event listeners
    return () => cleanup();
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
    >
      {children}
    </TableCell>
  );
}