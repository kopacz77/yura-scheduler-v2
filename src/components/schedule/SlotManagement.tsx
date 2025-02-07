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
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Repeat } from 'lucide-react';
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Time Slots</DialogTitle>
          <DialogDescription>
            Create and manage available time slots for lessons.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Slot</TabsTrigger>
            <TabsTrigger value="recurring">Recurring Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Rink Selection */}
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rink" />
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

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      defaultValue={initialDate ? format(initialDate, 'yyyy-MM-dd') : undefined}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Time Selection */}
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
                </div>

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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onSave({})}>Create Slot</Button>
            </div>
          </TabsContent>

          <TabsContent value="recurring" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Rink Selection */}
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rink" />
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

                  {/* Days Selection */}
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="date" className="w-full" />
                      <span>to</span>
                      <Input type="date" className="w-full" />
                    </div>
                  </div>
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
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onSave({ selectedDays })}>Create Recurring Slots</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}