'use client';

import React, { useRef } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop-core';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop-core/element/monitor';
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

    const unsubscribe = monitorForElements({
      onDrop: ({ location, source }) => {
        if (location.element === ref.current) {
          onDrop?.(source.data);
        }
      },
    });

    return () => {
      unsubscribe();
    };
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