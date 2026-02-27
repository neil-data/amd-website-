import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/server/auth';
import { failure, success } from '@/lib/server/response';
import { getLeaderboard } from '@/lib/server/services/userService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ['student', 'recruiter']);

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') ?? 50);
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50;

    const leaderboard = await getLeaderboard(safeLimit);
    return success({ leaderboard, total: leaderboard.length });
  } catch (error) {
    return failure(error);
  }
}
