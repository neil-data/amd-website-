import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/server/auth';
import { failure, success } from '@/lib/server/response';
import { listChallenges } from '@/lib/server/services/challengeService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ['student', 'recruiter']);

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') ?? 100);
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 100;

    const challenges = await listChallenges(safeLimit);
    return success({ challenges, total: challenges.length });
  } catch (error) {
    return failure(error);
  }
}
