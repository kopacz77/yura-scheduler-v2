import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RinkFormData {
  name: string;
  address: string;
  timezone: string;
  maxCapacity?: number;
}

interface RinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RinkFormData;
  onSubmit: (data: RinkFormData) => Promise<void>;
}

const TIMEZONES = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
];

export function RinkDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: RinkDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<RinkFormData>(
    initialData || {
      name: '',
      address: '',
      timezone: 'America/Los_Angeles',
    }
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      setFormData({
        name: '',
        address: '',
        timezone: 'America/Los_Angeles',
      });
    } catch (error) {
      console.error('Error submitting rink:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Edit Rink' : 'Add New Rink'}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? 'Modify the rink details below.'
                : 'Enter the details for the new rink.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, timezone: value }))
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxCapacity">Max Capacity (optional)</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={formData.maxCapacity || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxCapacity: e.target.value ? parseInt(e.target.value) : undefined,
                  }))
                }
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Rink'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
