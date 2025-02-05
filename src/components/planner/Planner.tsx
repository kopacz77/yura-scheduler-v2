import React, { useState, useEffect } from "react";
import { DndContext, DragEndEvent, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { Resource, Appointment } from "@/models/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { ResourceTableCell } from "./ResourceTableCell";
import { calculateNewDates, filterAppointments } from "@/lib/utils";
import { DropTableCell } from "./DropTableCell";

export interface PlannerProps extends React.HTMLAttributes<HTMLDivElement> {
  initialResources: Resource[];
  initialAppointments: Appointment[];
  onAppointmentMove?: (appointment: Appointment, newStart: Date, resourceId: string) => void;
}

export function Planner({
  initialResources,
  initialAppointments,
  onAppointmentMove,
  ...props
}: PlannerProps) {
  const [resources] = useState<Resource[]>(initialResources);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const appointment = appointments.find(app => app.id === active.id);
    const dropData = over.data.current;
    if (!appointment || !dropData?.time || !dropData?.resourceId) return;

    const { start, end } = calculateNewDates(
      appointment.start,
      dropData.time,
      appointment.duration
    );

    onAppointmentMove?.(appointment, start, dropData.resourceId);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Card {...props}>
        <Table>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <ResourceTableCell resource={resource} />
                {/* Time slots will go here */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </DndContext>
  );
}