import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentDistribution } from '@/types/stats';

interface ChartDataItem extends StudentDistribution {}

interface StudentOverviewProps {
  distribution?: StudentDistribution[];
}

export function StudentOverview({ distribution }: StudentOverviewProps) {
  const chartData: ChartDataItem[] = distribution?.map((item) => ({
    name: item.name,
    count: item.count,
    color: item.color
  })) ?? [];

  const totalStudents = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Overview</CardTitle>
        <CardDescription>
          Distribution of student levels and categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div className="w-1/3">
                <div className="flex items-center">
                  <div
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </div>
              <div className="w-2/3">
                <div className="flex items-center">
                  <div className="w-full bg-secondary rounded-full h-2 mr-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(item.count / totalStudents) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
