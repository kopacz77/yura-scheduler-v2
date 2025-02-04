'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Rink = {
  id: string;
  name: string;
  location: string;
  maxCapacity: number;
};

export function RinkSettings() {
  const [rinks, setRinks] = useState<Rink[]>([
    {
      id: '1',
      name: 'Main Rink',
      location: '123 Main St',
      maxCapacity: 20,
    },
  ]);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving rink settings:', rinks);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rink Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rinks.map((rink) => (
            <div key={rink.id} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Rink Name</label>
                  <Input
                    value={rink.name}
                    onChange={(e) => {
                      const newRinks = rinks.map((r) =>
                        r.id === rink.id ? { ...r, name: e.target.value } : r
                      );
                      setRinks(newRinks);
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={rink.location}
                    onChange={(e) => {
                      const newRinks = rinks.map((r) =>
                        r.id === rink.id ? { ...r, location: e.target.value } : r
                      );
                      setRinks(newRinks);
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Capacity</label>
                  <Input
                    type="number"
                    value={rink.maxCapacity}
                    onChange={(e) => {
                      const newRinks = rinks.map((r) =>
                        r.id === rink.id
                          ? { ...r, maxCapacity: parseInt(e.target.value) }
                          : r
                      );
                      setRinks(newRinks);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleSave} className="mt-4">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}