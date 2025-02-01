import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, MoreVertical, CalendarRange } from 'lucide-react';

interface RinkCardProps {
  rink: {
    id: string;
    name: string;
    address: string;
    timezone: string;
    lessonCount?: number;
    currentCapacity?: number;
    maxCapacity?: number;
  };
  onEdit: (rinkId: string) => void;
  onDelete: (rinkId: string) => void;
  onManageSchedule: (rinkId: string) => void;
}

export function RinkCard({ rink, onEdit, onDelete, onManageSchedule }: RinkCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{rink.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onManageSchedule(rink.id)}>
                <CalendarRange className="mr-2 h-4 w-4" />
                Manage Schedule
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(rink.id)}>
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(rink.id)}
              >
                Delete Rink
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="mt-1 h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm">{rink.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{rink.timezone}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {rink.currentCapacity !== undefined && rink.maxCapacity !== undefined && (
            <Badge variant="secondary">
              {rink.currentCapacity}/{rink.maxCapacity} slots used
            </Badge>
          )}
          {rink.lessonCount !== undefined && (
            <Badge variant="secondary">
              {rink.lessonCount} lessons this week
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
