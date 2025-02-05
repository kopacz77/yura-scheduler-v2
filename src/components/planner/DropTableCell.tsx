'use client';

import React, { useRef, useEffect } from 'react';
import { dropTarget } from '@atlaskit/pragmatic-drag-and-drop';
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

    const cleanup = dropTarget({
      element: ref.current,
      onDragEnter() {
        ref.current?.setAttribute('data-dragging', 'true');
      },
      onDragLeave() {
        ref.current?.removeAttribute('data-dragging');
      },
      onDrop: ({ source }) => {
        ref.current?.removeAttribute('data-dragging');
        onDrop?.(source.data);
      },
    });

    return cleanup;
  }, [isDropTarget, onDrop]);

  return (
    <TableCell
      ref={ref}
      {...props}
      className={cn(
        'transition-colors duration-200',
        isDropTarget && 'hover:bg-primary/5 data-[dragging=true]:bg-primary/10',
        className
      )}
    >
      {children}
    </TableCell>
  );
}