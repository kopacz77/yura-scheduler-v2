'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { type Appointment, type Resource } from "@/models/types";
import { useDndMonitor } from "@dnd-kit/core";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { ResourceTableCell } from "./ResourceTableCell";
import { calculateNewDates, filterAppointments } from "@/lib/utils";
import { DropTableCell } from "./DropTableCell";

export interface PlannerProps extends React.HTMLAttributes<HTMLDivElement> {
  resources: Resource[];
  appointments: Appointment[];
  dates: Date[];
  onAppointmentMove?: (appointment: Appointment, resourceId: string, time: Date) => void;
}

type DropData = {
  resourceId: string;
  time: Date;
};

export function Planner({
  resources,
  appointments,
  dates,
  onAppointmentMove,
  className,
  ...props
}: PlannerProps) {
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [dropData, setDropData] = useState<DropData | null>(null);

  const handleDrop = () => {
    if (!currentAppointment || !dropData?.time || !dropData?.resourceId) return;

    // Calculate new start and end times
    const { start, end } = calculateNewDates(
      currentAppointment.start,
      dropData.time,
      currentAppointment.duration // Now properly typed
    );

    // Create updated appointment with new resource and times
    const updatedAppointment: Appointment = {
      ...currentAppointment,
      resourceId: dropData.resourceId,
      start,
      end,
    };

    onAppointmentMove?.(updatedAppointment, dropData.resourceId, start);
  };

  useDndMonitor({
    onDragStart(event) {
      const appointment = event.active.data.current as Appointment;
      setCurrentAppointment(appointment);
    },
    onDragEnd() {
      handleDrop();
      setCurrentAppointment(null);
      setDropData(null);
    },
  });

  // Filter appointments by date and resource
  const getFilteredAppointments = (resourceId: string, date: Date): Appointment[] => {
    return filterAppointments(
      appointments.filter(a => a.resourceId === resourceId),
      date
    );
  };

  return (
    <div className={cn("relative overflow-x-auto", className)} {...props}>
      <Table>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <ResourceTableCell
                resource={resource}
                appointments={getFilteredAppointments(resource.id, dates[0])}
              />
              {dates.map((date) => {
                const cellAppointments = getFilteredAppointments(resource.id, date);
                return (
                  <DropTableCell
                    key={`${resource.id}-${date.toISOString()}`}
                    date={date}
                    resourceId={resource.id}
                    onActivate={(time) => setDropData({ resourceId: resource.id, time })}
                    appointments={cellAppointments}
                  />
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}