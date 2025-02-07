'use client';

import { MoreVertical, Edit, Trash2, Copy, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RinkTimeSlot } from '@prisma/client';

interface SlotContextMenuProps {
  slot: RinkTimeSlot;
  isRecurring?: boolean;
  onEdit: (slot: RinkTimeSlot) => void;
  onDelete: (slot: RinkTimeSlot, deleteRecurring?: boolean) => void;
}

export function SlotContextMenu({ slot, isRecurring, onEdit, onDelete }: SlotContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(slot)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Slot
        </DropdownMenuItem>
        {isRecurring && (
          <DropdownMenuItem onClick={() => onDelete(slot, true)}>
            <Clock className="mr-2 h-4 w-4" />
            Delete All Future
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => onDelete(slot)}
          className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Slot
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}