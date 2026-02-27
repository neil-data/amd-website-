import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/server/auth';
import { failure, success } from '@/lib/server/response';
import { estimateAiProbability } from '@/lib/server/services/aiProbabilityService';
import { getChallengeById } from '@/lib/server/services/challengeService';
import { createSubmission } from '@/lib/server/services/submissionService';
import { updateUserAfterSubmission } from '@/lib/server/services/userService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeTimeTaken(value: unknown) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(request, ['student']);

    const body = await request.json();
    const challengeId = String(body.challengeId ?? '').trim();
    const score = Number(body.score ?? 0);
    const timeTaken = normalizeTimeTaken(body.timeTaken);

    if (!challengeId) {
      return success({ error: 'challengeId is required' }, 400);
    }

    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return success({ error: 'score must be a valid number between 0 and 100' }, 400);
    }

    const challenge = await getChallengeById(challengeId);
    if (!challenge) {
      return success({ error: 'Challenge not found' }, 404);
    }

    const aiProbability = estimateAiProbability({
      challengePoints: challenge.points,
      timeTaken,
      baselineScore: score,
    });
    const finalScore = Number((score * (1 - aiProbability / 100)).toFixed(2));

    const submissionId = await createSubmission({
      userId: auth.uid,
      challengeId,
      score: finalScore,
      aiProbability,
      timeTaken,
    });

    const userStats = await updateUserAfterSubmission(auth.uid, finalScore, aiProbability);

    return success({
      submissionId,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        difficulty: challenge.difficulty,
      },
      score,
      aiProbability,
      finalScore,
      integrityPenalty: Number((score - finalScore).toFixed(2)),
      userStats,
    });
  } catch (error) {
    return failure(error);
  }
}
