import { adminDb } from '@/lib/server/firebaseAdmin';
import { ChallengeDocument } from '@/types/backend';

const fallbackChallenges: Array<ChallengeDocument & { id: string; category: string }> = [
  {
    id: 'frontend-optimization-sprint',
    title: 'Frontend Optimization Sprint',
    description: 'Improve rendering speed and responsiveness for a component-heavy dashboard.',
    difficulty: 'intermediate',
    points: 80,
    timeLimit: 45,
    category: 'Frontend',
  },
  {
    id: 'prompt-integrity-diagnostics',
    title: 'Prompt Integrity Diagnostics',
    description: 'Evaluate AI-generated outputs and detect prompt leakage risks.',
    difficulty: 'advanced',
    points: 95,
    timeLimit: 60,
    category: 'AI',
  },
  {
    id: 'data-reasoning-accuracy-test',
    title: 'Data Reasoning Accuracy Test',
    description: 'Interpret analytics scenarios and derive correct business conclusions.',
    difficulty: 'beginner',
    points: 60,
    timeLimit: 30,
    category: 'Analytics',
  },
];

export async function getChallengeById(challengeId: string): Promise<(ChallengeDocument & { id: string }) | null> {
  const snapshot = await adminDb.collection('challenges').doc(challengeId).get();
  if (!snapshot.exists) {
    const fallback = fallbackChallenges.find((item) => item.id === challengeId);
    return fallback ?? null;
  }

  const data = snapshot.data() as Partial<ChallengeDocument>;
  return {
    id: snapshot.id,
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    difficulty: String(data.difficulty ?? 'medium'),
    points: Number(data.points ?? 0),
    timeLimit: Number(data.timeLimit ?? 0),
    createdAt: data.createdAt,
  };
}

export async function listChallenges(limitCount = 100) {
  const snapshot = await adminDb.collection('challenges').limit(limitCount).get();

  if (snapshot.empty) {
    return fallbackChallenges;
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Partial<ChallengeDocument> & { category?: unknown };
    return {
      id: doc.id,
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      difficulty: String(data.difficulty ?? 'intermediate'),
      points: Number(data.points ?? 0),
      timeLimit: Number(data.timeLimit ?? 0),
      category: String(data.category ?? 'General'),
      createdAt: data.createdAt,
    };
  });
}
