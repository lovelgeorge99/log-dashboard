export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
}

export interface LogFilter {
  level?: LogLevel;
  service?: string;
  search?: string;
  since?: string;
  limit?: number;
}

export interface LogStats {
  total: number;
  byLevel: Record<LogLevel, number>;
  byService: Record<string, number>;
  timeline: { time: string; error: number; warn: number; info: number; debug: number }[];
}

export const LOG_LEVELS: LogLevel[] = ['error', 'warn', 'info', 'debug'];

export const SERVICES = [
  'api-gateway',
  'auth-service',
  'payment-service',
  'user-service',
  'database',
] as const;

export type ServiceName = (typeof SERVICES)[number];
