import { NextResponse } from 'next/server';
import { logStore } from '@/lib/log-store';
import { generateLog } from '@/lib/log-generator';

// POST /api/logs/generate - Generate random logs (for demo purposes)
export async function POST() {
  // Generate 1-3 random logs
  const count = Math.floor(Math.random() * 3) + 1;
  const newLogs = [];

  for (let i = 0; i < count; i++) {
    const log = generateLog();
    logStore.addLog(log);
    newLogs.push(log);
  }

  return NextResponse.json({
    success: true,
    logs: newLogs,
    count: newLogs.length,
  });
}
