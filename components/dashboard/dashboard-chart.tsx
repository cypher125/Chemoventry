'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/store/dashboard';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  month: {
    label: 'Month',
    color: '#727D73',
  },
} satisfies ChartConfig;

export function DashboardCharts() {
  const { usageTrends, isLoading } = useDashboardStore();

  // Transform the data format for the chart
  const chartData = usageTrends.map(trend => ({
    name: trend.month,
    total: trend.usage
  }));

  return (
    <Card className="w-full dark:bg-gray-900 dark:border-none">
      <CardHeader>
        <CardTitle>Chemical Usage Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="min-h-[20rem] w-full flex items-center justify-center">
            <p>Loading usage trends...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[20rem] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-month)" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
