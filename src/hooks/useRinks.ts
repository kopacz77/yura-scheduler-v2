'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  maxStudents: number;
  isActive: boolean;
}

export interface Rink {
  id: string;
  name: string;
  address: string;
  timezone: string;
  maxCapacity: number;
  timeSlots: TimeSlot[];
}

export function useRinks() {
  const [rinks, setRinks] = useState<Rink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRinks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/rinks');
      if (!response.ok) throw new Error('Failed to fetch rinks');

      const data = await response.json();
      setRinks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRinks();
  }, []);

  const addRink = async (rinkData: Omit<Rink, 'id' | 'timeSlots'>) => {
    try {
      const response = await fetch('/api/rinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rinkData),
      });

      if (!response.ok) throw new Error('Failed to add rink');

      const newRink = await response.json();
      setRinks((prev) => [...prev, newRink]);

      toast({
        title: 'Success',
        description: 'Rink added successfully',
      });

      return newRink;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add rink';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateRink = async (rinkId: string, updateData: Partial<Rink>) => {
    try {
      const response = await fetch(`/api/rinks/${rinkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update rink');

      const updatedRink = await response.json();
      setRinks((prev) =>
        prev.map((rink) =>
          rink.id === rinkId ? { ...rink, ...updatedRink } : rink
        )
      );

      toast({
        title: 'Success',
        description: 'Rink updated successfully',
      });

      return updatedRink;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update rink';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteRink = async (rinkId: string) => {
    try {
      const response = await fetch(`/api/rinks/${rinkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete rink');

      setRinks((prev) => prev.filter((rink) => rink.id !== rinkId));

      toast({
        title: 'Success',
        description: 'Rink deleted successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete rink';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const addTimeSlot = async (rinkId: string, slotData: Omit<TimeSlot, 'id'>) => {
    try {
      const response = await fetch(`/api/rinks/${rinkId}/timeslots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slotData),
      });

      if (!response.ok) throw new Error('Failed to add time slot');

      const newSlot = await response.json();
      setRinks((prev) =>
        prev.map((rink) =>
          rink.id === rinkId
            ? { ...rink, timeSlots: [...rink.timeSlots, newSlot] }
            : rink
        )
      );

      toast({
        title: 'Success',
        description: 'Time slot added successfully',
      });

      return newSlot;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add time slot';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTimeSlot = async (slotId: string, updateData: Partial<TimeSlot>) => {
    try {
      const response = await fetch(`/api/timeslots/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update time slot');

      const updatedSlot = await response.json();
      setRinks((prev) =>
        prev.map((rink) => ({
          ...rink,
          timeSlots: rink.timeSlots.map((slot) =>
            slot.id === slotId ? { ...slot, ...updatedSlot } : slot
          ),
        }))
      );

      toast({
        title: 'Success',
        description: 'Time slot updated successfully',
      });

      return updatedSlot;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update time slot';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteTimeSlot = async (slotId: string) => {
    try {
      const response = await fetch(`/api/timeslots/${slotId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete time slot');

      setRinks((prev) =>
        prev.map((rink) => ({
          ...rink,
          timeSlots: rink.timeSlots.filter((slot) => slot.id !== slotId),
        }))
      );

      toast({
        title: 'Success',
        description: 'Time slot deleted successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete time slot';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    rinks,
    isLoading,
    error,
    fetchRinks,
    addRink,
    updateRink,
    deleteRink,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
  };
}