'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Pause, Play, Trash2, Activity } from 'lucide-react';

interface DashboardHeaderProps {
  isLive: boolean;
  isRefreshing: boolean;
  onToggleLive: () => void;
  onRefresh: () => void;
  onClearLogs: () => void;
}

export function DashboardHeader({
  isLive,
  isRefreshing,
  onToggleLive,
  onRefresh,
  onClearLogs,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">LogStream</h1>
          <p className="text-sm text-muted-foreground">Real-time log monitoring</p>
        </div>
        <Badge variant={isLive ? 'default' : 'secondary'} className="ml-2">
          {isLive ? (
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground"></span>
              </span>
              Live
            </span>
          ) : (
            'Paused'
          )}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLive}
          className="gap-2"
        >
          {isLive ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Resume
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClearLogs}
          className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </header>
  );
}
