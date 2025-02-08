'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { DEFAULT_RINKS } from '@/config/rinks';

interface RecurringSlotFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = [
  { name: 'Mon', value: '1' },
  { name: 'Tue', value: '2' },
  { name: 'Wed', value: '3' },
  { name: 'Thu', value: '4' },
  { name: 'Fri', value: '5' },
  { name: 'Sat', value: '6' },
  { name: 'Sun', value: '0' },
];

export function RecurringSlotForm({ onSubmit, onCancel }: RecurringSlotFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    rinkId: '',
    startDate: '',
    endDate: '',
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

  const toggleDay = (dayValue: string) => {
    setSelectedDays(current =>
      current.includes(dayValue)
        ? current.filter(d => d !== dayValue)
        : [...current, dayValue]
    );
    // Clear days error when selection changes
    if (errors.days) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.days;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.rinkId) newErrors.rinkId = 'Please select a rink';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (selectedDays.length === 0) newErrors.days = 'Please select at least one day';

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        type: 'recurring',
        ...formData,
        daysString: selectedDays.join(',')
      });
    }
  };

  return (
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
        </CardContent>
      </Card>

      {/* Date Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input 
              type="date" 
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={errors.startDate ? 'border-red-500' : ''}
            />
            {errors.startDate && <span className="text-sm text-red-500">{errors.startDate}</span>}
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input 
              type="date" 
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={errors.endDate ? 'border-red-500' : ''}
            />
            {errors.endDate && <span className="text-sm text-red-500">{errors.endDate}</span>}
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

      {/* Recurring Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Recurring Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Select Days</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <Toggle
                  key={day.value}
                  pressed={selectedDays.includes(day.value)}
                  onPressedChange={() => toggleDay(day.value)}
                  className={`px-3 py-2 ${errors.days ? 'border-red-500' : ''}`}
                >
                  {day.name}
                </Toggle>
              ))}
            </div>
            {errors.days && <span className="text-sm text-red-500">{errors.days}</span>}
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

      <div className="md:col-span-2 flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Recurring Slots</Button>
      </div>
    </div>
  );
}
