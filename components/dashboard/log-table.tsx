'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { LogEntry, LogLevel } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LogTableProps {
  logs: LogEntry[];
  isLoading: boolean;
}

function getLevelBadgeClass(level: LogLevel): string {
  switch (level) {
    case 'error':
      return 'bg-log-error/20 text-log-error border-log-error/30 hover:bg-log-error/30';
    case 'warn':
      return 'bg-log-warn/20 text-log-warn border-log-warn/30 hover:bg-log-warn/30';
    case 'info':
      return 'bg-log-info/20 text-log-info border-log-info/30 hover:bg-log-info/30';
    case 'debug':
      return 'bg-log-debug/20 text-log-debug border-log-debug/30 hover:bg-log-debug/30';
    default:
      return '';
  }
}

function LogRow({ log }: { log: LogEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const timestamp = new Date(log.timestamp);
  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <TableRow
        className={cn(
          'cursor-pointer transition-colors',
          isExpanded && 'bg-muted/50'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TableCell className="w-8 py-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell className="py-2 font-mono text-xs text-muted-foreground">
          <span className="text-foreground">{formattedTime}</span>
          <span className="ml-2">{formattedDate}</span>
        </TableCell>
        <TableCell className="py-2">
          <Badge variant="outline" className={cn('text-xs', getLevelBadgeClass(log.level))}>
            {log.level.toUpperCase()}
          </Badge>
        </TableCell>
        <TableCell className="py-2">
          <Badge variant="secondary" className="text-xs font-normal">
            {log.service}
          </Badge>
        </TableCell>
        <TableCell className="max-w-[400px] truncate py-2 font-mono text-sm">
          {log.message}
        </TableCell>
        <TableCell className="py-2 text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={6} className="py-3">
            <div className="space-y-2 px-2">
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <span className="ml-2 font-mono text-xs">{log.id}</span>
                </div>
                {log.traceId && (
                  <div>
                    <span className="text-muted-foreground">Trace ID:</span>
                    <span className="ml-2 font-mono text-xs">{log.traceId}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Full Time:</span>
                  <span className="ml-2 font-mono text-xs">{log.timestamp}</span>
                </div>
              </div>
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Metadata:</span>
                  <pre className="mt-1 overflow-x-auto rounded bg-background p-2 font-mono text-xs">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function LogTable({ logs, isLoading }: LogTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Live Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          Live Logs
          <Badge variant="secondary" className="font-normal">
            {logs.length} entries
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-[160px]">Timestamp</TableHead>
                <TableHead className="w-[90px]">Level</TableHead>
                <TableHead className="w-[140px]">Service</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => <LogRow key={log.id} log={log} />)
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
