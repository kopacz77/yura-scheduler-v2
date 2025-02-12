import { useEffect, useState } from 'react';
import { Rink } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

export default function ScheduleView() {
  const [rinks, setRinks] = useState<Rink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRinks() {
      try {
        const response = await fetch('/api/schedule/rinks');
        if (!response.ok) {
          throw new Error('Failed to fetch rinks');
        }
        const data = await response.json();
        setRinks(data);
      } catch (error) {
        console.error('Error fetching rinks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load rinks. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRinks();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rinks.map((rink) => (
          <div
            key={rink.id}
            className="p-4 border rounded-lg bg-card shadow-sm"
          >
            <h3 className="text-lg font-semibold">{rink.name}</h3>
            <p className="text-sm text-muted-foreground">{rink.address}</p>
            <p className="text-sm text-muted-foreground">Timezone: {rink.timezone}</p>
            {rink.maxCapacity && (
              <p className="text-sm text-muted-foreground">
                Max Capacity: {rink.maxCapacity}
              </p>
            )}
          </div>
        ))}
      </div>

      {rinks.length === 0 && (
        <p className="text-center text-muted-foreground">
          No rinks available. Please add a rink to start scheduling.
        </p>
      )}
    </div>
  );
}