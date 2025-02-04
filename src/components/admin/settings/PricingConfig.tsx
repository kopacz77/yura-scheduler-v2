'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Level, LessonType } from '@prisma/client';

type PricingRule = {
  id: string;
  lessonType: LessonType;
  level: Level;
  duration: number;
  price: number;
};

export function PricingConfig() {
  const [rules, setRules] = useState<PricingRule[]>([
    {
      id: '1',
      lessonType: 'PRIVATE',
      level: 'PRELIMINARY',
      duration: 30,
      price: 50,
    },
  ]);

  const handleAddRule = () => {
    const newRule: PricingRule = {
      id: `${Date.now()}`,
      lessonType: 'PRIVATE',
      level: 'PRELIMINARY',
      duration: 30,
      price: 0,
    };
    setRules([...rules, newRule]);
  };

  const handleUpdateRule = (id: string, field: keyof PricingRule, value: any) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving pricing rules:', rules);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rules.map(rule => (
          <div key={rule.id} className="space-y-4 rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select
                  value={rule.lessonType}
                  onValueChange={(value) => handleUpdateRule(rule.id, 'lessonType', value as LessonType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LessonType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Skill Level</Label>
                <Select
                  value={rule.level}
                  onValueChange={(value) => handleUpdateRule(rule.id, 'level', value as Level)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Level).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select
                  value={rule.duration.toString()}
                  onValueChange={(value) => handleUpdateRule(rule.id, 'duration', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 30, 45, 60, 90].map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={rule.price}
                  onChange={(e) => handleUpdateRule(rule.id, 'price', parseFloat(e.target.value))}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleRemoveRule(rule.id)}
              className="mt-2"
            >
              Remove Rule
            </Button>
          </div>
        ))}
        <div className="flex justify-between">
          <Button onClick={handleAddRule}>
            Add New Rule
          </Button>
          <Button onClick={handleSave} variant="default">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}