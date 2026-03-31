'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info, Bug } from 'lucide-react';
import { LogStats } from '@/lib/types';

interface LogStatsCardsProps {
  stats: LogStats | null;
  isLoading: boolean;
}

export function LogStatsCards({ stats, isLoading }: LogStatsCardsProps) {
  const cards = [
    {
      label: 'Total Logs',
      value: stats?.total ?? 0,
      icon: Info,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Errors',
      value: stats?.byLevel?.error ?? 0,
      icon: AlertCircle,
      color: 'text-log-error',
      bgColor: 'bg-log-error/10',
    },
    {
      label: 'Warnings',
      value: stats?.byLevel?.warn ?? 0,
      icon: AlertTriangle,
      color: 'text-log-warn',
      bgColor: 'bg-log-warn/10',
    },
    {
      label: 'Debug',
      value: stats?.byLevel?.debug ?? 0,
      icon: Bug,
      color: 'text-log-debug',
      bgColor: 'bg-log-debug/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="py-4">
          <CardContent className="flex items-center gap-4 px-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              {isLoading ? (
                <div className="h-7 w-12 animate-pulse rounded bg-muted" />
              ) : (
                <p className={`text-2xl font-bold tabular-nums ${card.color}`}>
                  {card.value.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
