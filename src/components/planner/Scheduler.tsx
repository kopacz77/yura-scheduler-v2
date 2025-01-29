'use client';

import React, { useState, useEffect } from 'react';
import { CalendarView } from './CalendarView';
import { AppointmentDialog, AppointmentFormData } from './AppointmentDialog';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Appointment, Resource } from '@prisma/client';

export function Scheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await Promise.all([fetchAppointments(), fetchResources()]);
      } catch (err) {
        setError('Failed to load scheduler data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleCreateAppointment = async (formData: AppointmentFormData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 409) {
        const { conflicts } = await response.json();
        toast({
          title: 'Scheduling Conflict',
          description: 'The selected time slot conflicts with existing appointments',
          variant: 'destructive'
        });
        return;
      }

      if (!response.ok) throw new Error('Failed to create appointment');

      const newAppointments = await response.json();
      setAppointments(prev => [...prev, ...newAppointments]);
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: formData.isRecurring 
          ? 'Recurring appointments created successfully'
          : 'Appointment created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create appointment',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateAppointment = async (formData: AppointmentFormData & { id: string }) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 409) {
        const { conflicts } = await response.json();
        toast({
          title: 'Scheduling Conflict',
          description: 'The selected time slot conflicts with existing appointments',
          variant: 'destructive'
        });
        return;
      }

      if (!response.ok) throw new Error('Failed to update appointment');

      const updatedAppointment = await response.json();
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        )
      );
      setSelectedAppointment(null);
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Appointment updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete appointment');

      setAppointments(prev => prev.filter(apt => apt.id !== id));
      setSelectedAppointment(null);
      toast({
        title: 'Success',
        description: 'Appointment deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete appointment',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4"
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Schedule</h2>
            <Button onClick={() => {
              setSelectedAppointment(null);
              setIsDialogOpen(true);
            }}>
              New Appointment
            </Button>
          </div>

          <CalendarView
            appointments={appointments}
            onDateSelect={setSelectedDate}
            onViewAppointment={setSelectedAppointment}
            onCreateAppointment={(date) => {
              setSelectedDate(date);
              setSelectedAppointment(null);
              setIsDialogOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(resource => (
              <Card key={resource.id} className="p-4">
                <h3 className="text-lg font-semibold mb-2">{resource.name}</h3>
                <Badge
                  variant={resource.available ? 'default' : 'secondary'}
                  className="mb-2"
                >
                  {resource.available ? 'Available' : 'Unavailable'}
                </Badge>
                <p className="text-sm text-gray-600 mb-2">
                  {resource.description}
                </p>
                <div className="text-sm">
                  <p>Type: {resource.type}</p>
                  {resource.maxCapacity && (
                    <p>Max Capacity: {resource.maxCapacity}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AppointmentDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedAppointment(null);
        }}
        onSave={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
        initialDate={selectedDate}
        existingAppointment={selectedAppointment}
      />
    </div>
  );
}
