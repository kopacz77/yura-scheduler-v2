import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { RinkArea } from '@prisma/client';
import type { Resource } from '@prisma/client';
import { format } from 'date-fns';

interface ResourceFormData {
  name: string;
  type: RinkArea;
  maxCapacity?: number;
  description?: string;
  available: boolean;
  maintenanceSchedule?: { start: string; end: string }[];
}

interface MaintenanceSlot {
  start: string;
  end: string;
}

export function ResourceManager() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [maintenanceSlots, setMaintenanceSlots] = useState<MaintenanceSlot[]>([]);
  const [formData, setFormData] = useState<ResourceFormData>({
    name: '',
    type: RinkArea.MAIN_RINK,
    available: true,
    maintenanceSchedule: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        maintenanceSchedule: maintenanceSlots
      };

      const response = await fetch('/api/resources', {
        method: selectedResource ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedResource ? { id: selectedResource.id, ...dataToSubmit } : dataToSubmit)
      });

      if (!response.ok) throw new Error('Failed to save resource');

      const savedResource = await response.json();
      setResources(prev =>
        selectedResource
          ? prev.map(res => res.id === savedResource.id ? savedResource : res)
          : [...prev, savedResource]
      );

      setIsDialogOpen(false);
      resetForm();

      toast({
        title: 'Success',
        description: `Resource ${selectedResource ? 'updated' : 'created'} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedResource ? 'update' : 'create'} resource`,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/resources?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete resource');

      setResources(prev => prev.filter(res => res.id !== id));
      toast({
        title: 'Success',
        description: 'Resource deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete resource',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setSelectedResource(null);
    setFormData({
      name: '',
      type: RinkArea.MAIN_RINK,
      available: true,
      maintenanceSchedule: []
    });
    setMaintenanceSlots([]);
  };

  const addMaintenanceSlot = () => {
    setMaintenanceSlots(prev => [...prev, { start: '', end: '' }]);
  };

  const updateMaintenanceSlot = (index: number, field: 'start' | 'end', value: string) => {
    setMaintenanceSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const removeMaintenanceSlot = (index: number) => {
    setMaintenanceSlots(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Resources</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(resource => (
          <Card key={resource.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{resource.name}</h3>
                <p className="text-sm text-gray-600">{resource.type}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedResource(resource);
                    setFormData({
                      name: resource.name,
                      type: resource.type,
                      maxCapacity: resource.maxCapacity || undefined,
                      description: resource.description || undefined,
                      available: resource.available,
                      maintenanceSchedule: resource.maintenanceSchedule 
                        ? JSON.parse(resource.maintenanceSchedule as string)
                        : []
                    });
                    if (resource.maintenanceSchedule) {
                      setMaintenanceSlots(JSON.parse(resource.maintenanceSchedule as string));
                    }
                    setIsDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(resource.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Badge
                variant={resource.available ? 'default' : 'secondary'}
                className="mb-2"
              >
                {resource.available ? 'Available' : 'Unavailable'}
              </Badge>

              {resource.description && (
                <p className="text-sm text-gray-600">{resource.description}</p>
              )}

              {resource.maxCapacity && (
                <p className="text-sm">Maximum Capacity: {resource.maxCapacity}</p>
              )}

              {resource.maintenanceSchedule && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Maintenance Schedule</h4>
                  <div className="space-y-1">
                    {JSON.parse(resource.maintenanceSchedule as string).map((slot: MaintenanceSlot, index: number) => (
                      <div key={index} className="text-sm text-gray-600">
                        {format(new Date(slot.start), 'PPp')} - {format(new Date(slot.end), 'PPp')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedResource ? 'Edit Resource' : 'Add Resource'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: RinkArea) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RinkArea).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Maximum Capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={formData.maxCapacity || ''}
                onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || undefined })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label>Available</Label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Maintenance Schedule</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMaintenanceSlot}
                >
                  Add Slot
                </Button>
              </div>

              {maintenanceSlots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="datetime-local"
                    value={slot.start}
                    onChange={(e) => updateMaintenanceSlot(index, 'start', e.target.value)}
                  />
                  <Input
                    type="datetime-local"
                    value={slot.end}
                    onChange={(e) => updateMaintenanceSlot(index, 'end', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeMaintenanceSlot(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="submit">
                {selectedResource ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
