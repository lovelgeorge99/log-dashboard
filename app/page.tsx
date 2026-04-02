"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LogStatsCards } from "@/components/dashboard/log-stats";
import { LogFilters } from "@/components/dashboard/log-filters";
import { LogChart } from "@/components/dashboard/log-chart";
import { LogTable } from "@/components/dashboard/log-table";
import { LogEntry, LogStats, LogLevel, ServiceName } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const POLL_INTERVAL = 3000; // 3 seconds

export default function Dashboard() {
  const [isLive, setIsLive] = useState(true);
  const [level, setLevel] = useState<LogLevel | "all">("all");
  const [service, setService] = useState<ServiceName | "all">("all");
  const [search, setSearch] = useState("");
  const generateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Build query string for filters
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (level !== "all") params.append("level", level);
    if (service !== "all") params.append("service", service);
    if (search) params.append("search", search);
    params.append("limit", "100");
    return params.toString();
  }, [level, service, search]);

  // Fetch logs with filters
  const {
    data: logsData,
    error: logsError,
    isLoading: logsLoading,
    isValidating: logsValidating,
  } = useSWR<{ logs: LogEntry[]; count: number }>(
    `/api/logs?${buildQueryString()}`,
    fetcher,
    {
      refreshInterval: isLive ? POLL_INTERVAL : 0,
      revalidateOnFocus: false,
    },
  );

  // Fetch stats
  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR<LogStats & { timestamp: string }>("/api/logs/stats", fetcher, {
    refreshInterval: isLive ? POLL_INTERVAL : 0,
    revalidateOnFocus: false,
  });

  // Generate new logs periodically to simulate real traffic
  const generateLogs = useCallback(async () => {
    try {
      await fetch("/api/logs/generate", { method: "POST" });
    } catch (err) {
      console.error("Failed to generate logs:", err);
    }
  }, []);

  // Start/stop log generation based on live status
  useEffect(() => {
    if (isLive) {
      // Generate logs immediately
      generateLogs();
      // Then generate every 2-4 seconds
      generateIntervalRef.current = setInterval(
        () => {
          generateLogs();
        },
        2000 + Math.random() * 2000,
      );
    } else {
      if (generateIntervalRef.current) {
        clearInterval(generateIntervalRef.current);
        generateIntervalRef.current = null;
      }
    }

    return () => {
      if (generateIntervalRef.current) {
        clearInterval(generateIntervalRef.current);
      }
    };
  }, [isLive, generateLogs]);

  const handleRefresh = useCallback(() => {
    mutate(`/api/logs?${buildQueryString()}`);
    mutate("/api/logs/stats");
  }, [buildQueryString]);

  const handleClearLogs = useCallback(async () => {
    try {
      await fetch("/api/logs", { method: "DELETE" });
      handleRefresh();
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  }, [handleRefresh]);

  const handleClearFilters = useCallback(() => {
    setLevel("all");
    setService("all");
    setSearch("");
  }, []);

  const isRefreshing = logsValidating;
  const logs = logsData?.logs ?? [];
  const stats = statsData
    ? {
        total: statsData.total,
        byLevel: statsData.byLevel,
        byService: statsData.byService,
        timeline: statsData.timeline,
      }
    : null;

  if (logsError || statsError) {
    console.error("Error fetching data:", logsError || statsError);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader
        isLive={isLive}
        isRefreshing={isRefreshing}
        onToggleLive={() => setIsLive(!isLive)}
        onRefresh={handleRefresh}
        onClearLogs={handleClearLogs}
      />

      <main className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <LogStatsCards stats={stats} isLoading={statsLoading} />

        {/* Timeline Chart */}
        {/* <LogChart stats={stats} isLoading={statsLoading} /> */}

        {/* Filters */}
        <LogFilters
          level={level}
          service={service}
          search={search}
          onLevelChange={setLevel}
          onServiceChange={setService}
          onSearchChange={setSearch}
          onClearFilters={handleClearFilters}
        />

        {/* Log Table */}
        <LogTable logs={logs} isLoading={logsLoading} />
      </main>

      <footer className="border-t border-border bg-card px-6 py-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            API Endpoints:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              GET /api/logs
            </code>{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              POST /api/logs
            </code>{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              GET /api/logs/stats
            </code>
          </p>
          <p>
            Polling every {POLL_INTERVAL / 1000}s{" "}
            {isLive ? "(active)" : "(paused)"}
          </p>
        </div>
      </footer>
    </div>
  );
}
