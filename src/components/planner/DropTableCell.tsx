'use client';

import React from 'react';
import { TableCell } from '@/components/ui/table';

interface DropTableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  onDrop?: (e: React.DragEvent<HTMLTableCellElement>) => void;
}

export function DropTableCell({ 
  children, 
  onDrop,
  className, 
  ...props 
}: DropTableCellProps) {
  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop?.(e);
  };

  return (
    <TableCell
      {...props}
      className={className}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </TableCell>
  );
}