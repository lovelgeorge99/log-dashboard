import { NextRequest, NextResponse } from "next/server";
import { logStore } from "@/lib/log-store";
import { generateLog, generateBatchLogs } from "@/lib/log-generator";
import { LogLevel, LOG_LEVELS, SERVICES } from "@/lib/types";

// Initialize with some logs if empty
function ensureInitialized() {
  if (!logStore.isInitialized()) {
    const initialLogs = generateBatchLogs(100);
    logStore.addLogs(initialLogs);
  }
}

// GET /api/logs - Fetch logs with optional filters
export async function GET(request: NextRequest) {
  ensureInitialized();

  const searchParams = request.nextUrl.searchParams;

  const level = searchParams.get("level") as LogLevel | null;
  const service = searchParams.get("service");
  const search = searchParams.get("search");
  const since = searchParams.get("since");
  const limit = searchParams.get("limit");

  const filter = {
    level: level && LOG_LEVELS.includes(level) ? level : undefined,
    service:
      service && SERVICES.includes(service as (typeof SERVICES)[number])
        ? service
        : undefined,
    search: search || undefined,
    since: since || undefined,
    limit: limit ? parseInt(limit, 10) : 10,
  };

  const logs = logStore.getLogs(filter);

  return NextResponse.json({
    logs,
    count: logs.length,
    timestamp: new Date().toISOString(),
  });
}

// POST /api/logs - Ingest new log(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle single log or array of logs
    const logsToAdd = Array.isArray(body) ? body : [body];

    const addedLogs = logsToAdd.map((logData) => {
      const log = generateLog({
        level: logData.level,
        service: logData.service,
        message: logData.message,
        traceId: logData.traceId,
        metadata: logData.metadata,
      });
      logStore.addLog(log);
      return log;
    });

    return NextResponse.json(
      {
        success: true,
        logs: addedLogs,
        count: addedLogs.length,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}

// DELETE /api/logs - Clear all logs
export async function DELETE() {
  console.log("THisn is before", logStore);
  logStore.clearLogs();
  console.log("THisn is after", logStore);

  return NextResponse.json({
    success: true,
    message: "All logs cleared",
  });
}
