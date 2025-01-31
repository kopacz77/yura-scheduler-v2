import React from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { TableCell } from '@/components/ui/table';

interface DropTableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  resourceId: string;
  columnIndex: number;
}

export const DropTableCell: React.FC<DropTableCellProps> = ({ 
  resourceId, 
  columnIndex,
  children,
  ...props 
}) => {
  const ref = React.useRef<HTMLTableCellElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      getData: () => ({
        resourceId,
        columnIndex
      }),
    });
  }, [resourceId, columnIndex]);

  return (
    <TableCell
      ref={ref}
      className="min-h-[120px] min-w-[200px] border-x p-2 align-top lg:min-w-[250px]"
      {...props}
    >
      {children}
    </TableCell>
  );
};