import { NextRequest, NextResponse } from 'next/server';
import { logStore } from '@/lib/log-store';

// GET /api/logs/[id] - Get single log by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const log = logStore.getLogById(id);

  if (!log) {
    return NextResponse.json(
      { error: 'Log not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(log);
}
