'use client';

import { DEFAULT_RINKS } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface RinkSelectorProps {
  selectedRink: string;
  onRinkChange: (rinkId: string) => void;
}

export function RinkSelector({ selectedRink, onRinkChange }: RinkSelectorProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="font-medium text-foreground">Location</span>
        </div>

        <Select
          value={selectedRink}
          onValueChange={onRinkChange}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a rink" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
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
    </Card>
  );
}
