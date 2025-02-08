'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Repeat, Users } from 'lucide-react';
import { format } from 'date-fns';
import { DEFAULT_RINKS } from '@/config/rinks';
import { RecurringSlotForm } from './RecurringSlotForm';

interface SlotManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialDate?: Date;
}

interface FormData {
  rinkId: string;
  date: string;
  startTime: string;
  duration: string;
  maxStudents: string;
}

export function SlotManagement({ isOpen, onClose, onSave, initialDate }: SlotManagementProps) {
  const [formData, setFormData] = useState<FormData>({
    rinkId: '',
    date: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
    startTime: '',
    duration: '60',
    maxStudents: '1'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateSingleSlotForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.rinkId) newErrors.rinkId = 'Please select a rink';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSingleSlotSave = () => {
    if (validateSingleSlotForm()) {
      onSave({
        type: 'single',
        ...formData
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Time Slots</DialogTitle>
          <DialogDescription>
            Create and manage available time slots for lessons.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single" className="text-base py-2">
              <Clock className="mr-2 h-4 w-4" />
              Single Slot
            </TabsTrigger>
            <TabsTrigger value="recurring" className="text-base py-2">
              <Repeat className="mr-2 h-4 w-4" />
              Recurring Slots
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Rink</Label>
                    <Select 
                      onValueChange={(value) => handleInputChange('rinkId', value)}
                      value={formData.rinkId}
                    >
                      <SelectTrigger className={errors.rinkId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Choose a location" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DEFAULT_RINKS).map(([name, details]) => (
                          <SelectItem key={name} value={name}>
                            <div className="flex flex-col">
                              <span>{name}</span>
                              <span className="text-xs text-muted-foreground">{details.address}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.rinkId && <span className="text-sm text-red-500">{errors.rinkId}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={errors.date ? 'border-red-500' : ''}
                    />
                    {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                  </div>
                </CardContent>
              </Card>

              {/* Time Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Time Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input 
                      type="time" 
                      step="1800"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className={errors.startTime ? 'border-red-500' : ''}
                    />
                    {errors.startTime && <span className="text-sm text-red-500">{errors.startTime}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select 
                      value={formData.duration}
                      onValueChange={(value) => handleInputChange('duration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Details */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Capacity Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Maximum Students</Label>
                    <Select 
                      value={formData.maxStudents}
                      onValueChange={(value) => handleInputChange('maxStudents', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 student (Private)</SelectItem>
                        <SelectItem value="2">2 students</SelectItem>
                        <SelectItem value="3">3 students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSingleSlotSave}>Create Slot</Button>
            </div>
          </TabsContent>

          <TabsContent value="recurring">
            <RecurringSlotForm 
              onSubmit={onSave}
              onCancel={onClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}