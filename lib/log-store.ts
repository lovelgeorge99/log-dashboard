import { LogEntry, LogFilter, LogStats, LogLevel } from "./types";

const MAX_LOGS = 1000;

class LogStore {
  private logs: LogEntry[] = [];
  private initialized = false;

  private static instance: LogStore;

  private constructor() {}

  static getInstance(): LogStore {
    if (!LogStore.instance) {
      LogStore.instance = new LogStore();
    }
    return LogStore.instance;
  }

  addLog(log: LogEntry): void {
    this.logs.unshift(log);
    console.log(this.logs.length);
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }
  }

  addLogs(logs: LogEntry[]): void {
    this.initialized = true;

    logs.forEach((log) => this.addLog(log));
  }

  getLogs(filter?: LogFilter): LogEntry[] {
    let result = [...this.logs];

    if (filter?.level) {
      result = result.filter((log) => log.level === filter.level);
    }

    if (filter?.service) {
      result = result.filter((log) => log.service === filter.service);
    }

    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        (log) =>
          log.message.toLowerCase().includes(searchLower) ||
          log.service.toLowerCase().includes(searchLower) ||
          log.traceId?.toLowerCase().includes(searchLower),
      );
    }

    if (filter?.since) {
      const sinceDate = new Date(filter.since);
      result = result.filter((log) => new Date(log.timestamp) > sinceDate);
    }

    const limit = filter?.limit || 10;
    return result.slice(0, limit);
  }

  getLogById(id: string): LogEntry | undefined {
    return this.logs.find((log) => log.id === id);
  }

  clearLogs(): void {
    this.logs = [];
    this.initialized = true;
  }
  isInitialized(): boolean {
    return this.initialized;
  }
  getStats(): LogStats {
    const byLevel: Record<LogLevel, number> = {
      error: 0,
      warn: 0,
      info: 0,
      debug: 0,
    };

    const byService: Record<string, number> = {};

    // Group logs by 1-minute intervals for timeline
    const timelineMap = new Map<
      string,
      { error: number; warn: number; info: number; debug: number }
    >();

    this.logs.forEach((log) => {
      byLevel[log.level]++;
      byService[log.service] = (byService[log.service] || 0) + 1;

      // Round to nearest minute for timeline
      const date = new Date(log.timestamp);
      date.setSeconds(0, 0);
      const timeKey = date.toISOString();

      if (!timelineMap.has(timeKey)) {
        timelineMap.set(timeKey, { error: 0, warn: 0, info: 0, debug: 0 });
      }
      const entry = timelineMap.get(timeKey)!;
      entry[log.level]++;
    });

    // Convert timeline map to array, sorted by time
    const timeline = Array.from(timelineMap.entries())
      .map(([time, counts]) => ({ time, ...counts }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(-30); // Last 30 minutes

    return {
      total: this.logs.length,
      byLevel,
      byService,
      timeline,
    };
  }

  getCount(): number {
    return this.logs.length;
  }
}

export const logStore = LogStore.getInstance();
