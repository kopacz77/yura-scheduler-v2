import { TimeSlot } from './date';

export type ScheduleConflict = {
  type: 'overlap' | 'capacity' | 'availability';
  message: string;
  conflictingSlot?: TimeSlot;
};

export function validateSchedule(
  slots: TimeSlot[],
  existingSlots: TimeSlot[],
  maxCapacity: number
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  slots.forEach(slot => {
    // Check for overlaps
    const overlappingSlots = existingSlots.filter(existing =>
      isOverlapping(slot, existing)
    );

    if (overlappingSlots.length >= maxCapacity) {
      conflicts.push({
        type: 'capacity',
        message: 'Maximum capacity reached for this time slot',
        conflictingSlot: slot,
      });
    }

    overlappingSlots.forEach(conflicting => {
      conflicts.push({
        type: 'overlap',
        message: `Time slot overlaps with existing booking at ${conflicting.startTime}`,
        conflictingSlot: conflicting,
      });
    });
  });

  return conflicts;
}

function isOverlapping(slot1: TimeSlot, slot2: TimeSlot): boolean {
  const start1 = new Date(`1970-01-01T${slot1.startTime}:00`);
  const end1 = new Date(`1970-01-01T${slot1.endTime}:00`);
  const start2 = new Date(`1970-01-01T${slot2.startTime}:00`);
  const end2 = new Date(`1970-01-01T${slot2.endTime}:00`);

  return (
    (start1 >= start2 && start1 < end2) ||
    (end1 > start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  );
}

export function groupSlotsByDay(slots: TimeSlot[]): Record<string, TimeSlot[]> {
  return slots.reduce((acc, slot) => {
    const day = slot.startTime.split(' ')[0]; // Assuming date is part of startTime
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);
}