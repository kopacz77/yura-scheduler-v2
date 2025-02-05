'use client';

import React, { useRef, useEffect } from 'react';
import { DragSource, DropTarget } from '@atlaskit/drag-and-drop';
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

  if (!isDropTarget) {
    return (
      <TableCell
        ref={ref}
        {...props}
        className={className}
      >
        {children}
      </TableCell>
    );
  }

  return (
    <DropTarget
      onDrop={(element) => onDrop?.(element.data)}
    >
      {({ isActivated, ref: dropRef }) => (
        <TableCell
          ref={(node) => {
            ref.current = node;
            dropRef(node);
          }}
          {...props}
          className={cn(
            'transition-colors duration-200',
            isActivated && 'bg-primary/10',
            !isActivated && 'hover:bg-primary/5',
            className
          )}
        >
          {children}
        </TableCell>
      )}
    </DropTarget>
  );
}