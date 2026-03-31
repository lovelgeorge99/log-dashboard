'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { LogStats } from '@/lib/types';

interface LogChartProps {
  stats: LogStats | null;
  isLoading: boolean;
}

export function LogChart({ stats, isLoading }: LogChartProps) {
  const chartData =
    stats?.timeline?.map((item) => ({
      time: new Date(item.time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      error: item.error,
      warn: item.warn,
      info: item.info,
      debug: item.debug,
    })) ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Log Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Log Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-log-error)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-log-error)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="warnGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-log-warn)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-log-warn)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="infoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-log-info)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-log-info)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="debugGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-log-debug)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-log-debug)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => <span className="text-muted-foreground capitalize">{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="error"
                  stroke="var(--color-log-error)"
                  fill="url(#errorGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="warn"
                  stroke="var(--color-log-warn)"
                  fill="url(#warnGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="info"
                  stroke="var(--color-log-info)"
                  fill="url(#infoGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="debug"
                  stroke="var(--color-log-debug)"
                  fill="url(#debugGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No timeline data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
