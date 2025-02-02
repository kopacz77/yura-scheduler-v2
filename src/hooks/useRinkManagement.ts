'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type Rink = {
  id: string;
  name: string;
  address: string;
  timezone: string;
  maxCapacity: number;
  timeSlots: RinkTimeSlot[];
};

type RinkTimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  maxStudents: number;
  isActive: boolean;
};

export function useRinkManagement() {
  const [rinks, setRinks] = useState<Rink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rinks');
      if (!response.ok) throw new Error('Failed to fetch rinks');

      const data = await response.json();
      setRinks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Error',
        description: 'Failed to fetch rinks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

      const data = await response.json();
      setRinks(prev => [...prev, data]);

      toast({
        title: 'Success',
        description: 'Rink added successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add rink. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateRink = async (id: string, updateData: Partial<Rink>) => {
    try {
      const response = await fetch(`/api/rinks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update rink');

      const data = await response.json();
      setRinks(prev =>
        prev.map(rink =>
          rink.id === id ? { ...rink, ...data } : rink
        )
      );

      toast({
        title: 'Success',
        description: 'Rink updated successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update rink. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const addTimeSlot = async (rinkId: string, timeSlotData: Omit<RinkTimeSlot, 'id'>) => {
    try {
      const response = await fetch('/api/timeslots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...timeSlotData,
          rinkId,
        }),
      });

      if (!response.ok) throw new Error('Failed to add time slot');

      const data = await response.json();
      setRinks(prev =>
        prev.map(rink =>
          rink.id === rinkId
            ? { ...rink, timeSlots: [...rink.timeSlots, data] }
            : rink
        )
      );

      toast({
        title: 'Success',
        description: 'Time slot added successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add time slot. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTimeSlot = async (timeSlotId: string, updateData: Partial<RinkTimeSlot>) => {
    try {
      const response = await fetch(`/api/timeslots/${timeSlotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update time slot');

      const data = await response.json();
      setRinks(prev =>
        prev.map(rink => ({
          ...rink,
          timeSlots: rink.timeSlots.map(slot =>
            slot.id === timeSlotId ? { ...slot, ...data } : slot
          ),
        }))
      );

      toast({
        title: 'Success',
        description: 'Time slot updated successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update time slot. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchRinks();
  }, []);

  return {
    rinks,
    loading,
    error,
    fetchRinks,
    addRink,
    updateRink,
    addTimeSlot,
    updateTimeSlot,
  };
}