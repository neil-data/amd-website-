import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import { failure, success } from '@/lib/server/response';
import { getUserById } from '@/lib/server/services/userService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const user = await getUserById(auth.uid);

    if (!user) {
      return success({ error: 'User not found' }, 404);
    }

    return success({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      totalPoints: user.totalPoints,
      integrityScore: user.integrityScore,
      avgAiProbability: user.avgAiProbability,
      completedChallenges: user.completedChallenges,
    });
  } catch (error) {
    return failure(error);
  }
}
