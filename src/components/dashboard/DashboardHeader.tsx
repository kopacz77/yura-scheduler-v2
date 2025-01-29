import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Users, DollarSign, TrendingUp } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Students</p>
            <h3 className="text-2xl font-bold">24</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <CalendarDays className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">This Week's Lessons</p>
            <h3 className="text-2xl font-bold">18</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <DollarSign className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Outstanding Payments</p>
            <h3 className="text-2xl font-bold">$450</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Student Progress</p>
            <h3 className="text-2xl font-bold">85%</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
