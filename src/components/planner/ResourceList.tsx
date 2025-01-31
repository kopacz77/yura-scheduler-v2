import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Resource {
  id: string;
  name: string;
  type: string;
  availability: 'available' | 'busy' | 'maintenance';
}

interface ResourceListProps {
  resources: Resource[];
  onResourceSelect: (resourceId: string) => void;
  selectedResourceId?: string;
}

export function ResourceList({ resources, onResourceSelect, selectedResourceId }: ResourceListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-2 p-2">
        {resources.map(resource => (
          <Card
            key={resource.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${resource.id === selectedResourceId ? 'bg-muted' : ''}`}
            onClick={() => onResourceSelect(resource.id)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h4 className="text-sm font-medium">{resource.name}</h4>
                <p className="text-xs text-muted-foreground">{resource.type}</p>
              </div>
              <Badge
                variant={resource.availability === 'available' ? 'default' : 
                        resource.availability === 'busy' ? 'secondary' : 'destructive'}
              >
                {resource.availability}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}