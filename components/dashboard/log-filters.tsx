'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { LOG_LEVELS, SERVICES, LogLevel, ServiceName } from '@/lib/types';

interface LogFiltersProps {
  level: LogLevel | 'all';
  service: ServiceName | 'all';
  search: string;
  onLevelChange: (level: LogLevel | 'all') => void;
  onServiceChange: (service: ServiceName | 'all') => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

export function LogFilters({
  level,
  service,
  search,
  onLevelChange,
  onServiceChange,
  onSearchChange,
  onClearFilters,
}: LogFiltersProps) {
  const hasFilters = level !== 'all' || service !== 'all' || search !== '';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-input"
        />
      </div>

      <Select value={level} onValueChange={(val) => onLevelChange(val as LogLevel | 'all')}>
        <SelectTrigger className="w-[140px] bg-input">
          <SelectValue placeholder="Log Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          {LOG_LEVELS.map((l) => (
            <SelectItem key={l} value={l}>
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    l === 'error'
                      ? 'bg-log-error'
                      : l === 'warn'
                      ? 'bg-log-warn'
                      : l === 'info'
                      ? 'bg-log-info'
                      : 'bg-log-debug'
                  }`}
                />
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={service} onValueChange={(val) => onServiceChange(val as ServiceName | 'all')}>
        <SelectTrigger className="w-[160px] bg-input">
          <SelectValue placeholder="Service" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Services</SelectItem>
          {SERVICES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
