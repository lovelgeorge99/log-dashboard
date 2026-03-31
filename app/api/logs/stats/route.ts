import { NextResponse } from 'next/server';
import { logStore } from '@/lib/log-store';
import { generateBatchLogs } from '@/lib/log-generator';

// Initialize with some logs if empty
function ensureInitialized() {
  if (logStore.getCount() === 0) {
    const initialLogs = generateBatchLogs(100);
    logStore.addLogs(initialLogs);
  }
}

// GET /api/logs/stats - Get aggregated statistics
export async function GET() {
  ensureInitialized();

  const stats = logStore.getStats();

  return NextResponse.json({
    ...stats,
    timestamp: new Date().toISOString(),
  });
}
