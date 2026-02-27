import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/server/auth';
import { failure, success } from '@/lib/server/response';
import { createExchange, getExchangesForUser } from '@/lib/server/services/exchangeService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, ['student', 'recruiter']);
    const exchanges = await getExchangesForUser(auth.uid);

    return success({ exchanges });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(request, ['student', 'recruiter']);
    const body = await request.json();

    const learnerId = String(body.learnerId ?? auth.uid).trim();
    const skill = String(body.skill ?? '').trim();

    if (!learnerId) {
      return success({ error: 'learnerId is required' }, 400);
    }

    if (!skill) {
      return success({ error: 'skill is required' }, 400);
    }

    const exchangeId = await createExchange({
      teacherId: auth.uid,
      learnerId,
      skill,
      status: 'active',
      pointsAwarded: 0,
    });

    return success({ exchangeId }, 201);
  } catch (error) {
    return failure(error);
  }
}
