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
import { Calendar, Clock, MapPin, Repeat, Users } from 'lucide-react';
import { format } from 'date-fns';
import { DEFAULT_RINKS } from '@/config/rinks';

interface SlotManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialDate?: Date;
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

export function SlotManagement({ isOpen, onClose, onSave, initialDate }: SlotManagementProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (dayValue: string) => {
    setSelectedDays(current =>
      current.includes(dayValue)
        ? current.filter(d => d !== dayValue)
        : [...current, dayValue]
    );
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
                    <Select>
                      <SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      defaultValue={initialDate ? format(initialDate, 'yyyy-MM-dd') : undefined}
                    />
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
                    <Input type="time" step="1800" />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select defaultValue="60">
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
                    <Select defaultValue="1">
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
              <Button onClick={() => onSave({})}>Create Slot</Button>
            </div>
          </TabsContent>

          <TabsContent value="recurring">
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
                    <Select>
                      <SelectTrigger>
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
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Pattern */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Days of Week</Label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <Button
                          key={day.value}
                          variant={selectedDays.includes(day.value) ? "default" : "outline"}
                          onClick={() => toggleDay(day.value)}
                          className="w-14"
                          type="button"
                        >
                          {day.name}
                        </Button>
                      ))}
                    </div>
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
                    <Label>Time Range</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="time" step="1800" className="w-[120px]" />
                      <span>to</span>
                      <Input type="time" step="1800" className="w-[120px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Slot Duration</Label>
                    <Select defaultValue="60">
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
                    <Label>Select Range</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="date" className="w-full" />
                      <span>to</span>
                      <Input type="date" className="w-full" />
                    </div>
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
                    <Label>Maximum Students per Slot</Label>
                    <Select defaultValue="1">
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
              <Button onClick={() => onSave({ selectedDays })}>Create Recurring Slots</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}