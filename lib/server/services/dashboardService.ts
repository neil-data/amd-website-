import { getSubmissionsByUser } from '@/lib/server/services/submissionService';
import { getLeaderboard, getTopStudentsByIntegrity, getUserById } from '@/lib/server/services/userService';

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) {
    return 0;
  }

  const avg = average(values);
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function formatDate(value: unknown) {
  if (!value || typeof value !== 'object' || !('toDate' in value) || typeof (value as { toDate: () => Date }).toDate !== 'function') {
    return null;
  }

  return (value as { toDate: () => Date }).toDate().toISOString();
}

export async function getStudentDashboard(uid: string) {
  const [user, submissions, leaderboard] = await Promise.all([
    getUserById(uid),
    getSubmissionsByUser(uid),
    getLeaderboard(500),
  ]);

  if (!user) {
    throw new Error('User not found');
  }

  const completedChallenges = submissions.length;
  const avgAiProbability = average(submissions.map((item) => item.aiProbability));
  const integrityScore = Number((100 - avgAiProbability).toFixed(2));

  const rankEntry = leaderboard.find((entry) => entry.id === uid);

  return {
    user,
    totalPoints: user.totalPoints,
    integrityScore,
    completedChallenges,
    avgAiProbability: Number(avgAiProbability.toFixed(2)),
    rank: rankEntry?.rank ?? null,
    recentSubmissions: submissions.slice(0, 5).map((item) => ({
      id: item.id,
      challengeId: item.challengeId,
      score: item.score,
      aiProbability: item.aiProbability,
      timeTaken: item.timeTaken,
      createdAt: formatDate(item.createdAt),
    })),
    performanceTrend: submissions.slice(0, 20).reverse().map((item, index) => ({
      index: index + 1,
      score: item.score,
      aiProbability: item.aiProbability,
      createdAt: formatDate(item.createdAt),
    })),
  };
}

export async function getRecruiterDashboard() {
  const students = await getTopStudentsByIntegrity(20);
  return { students };
}

export async function getCandidateDetails(uid: string) {
  const [user, submissions] = await Promise.all([
    getUserById(uid),
    getSubmissionsByUser(uid),
  ]);

  if (!user) {
    throw new Error('Candidate not found');
  }

  const avgScore = average(submissions.map((item) => item.score));
  const avgAiProbability = average(submissions.map((item) => item.aiProbability));
  const performanceConsistency = clamp(100 - standardDeviation(submissions.map((item) => item.score)) * 2);
  const timeConsistency = clamp(100 - standardDeviation(submissions.map((item) => item.timeTaken)));

  return {
    user,
    avgScore: Number(avgScore.toFixed(2)),
    avgAiProbability: Number(avgAiProbability.toFixed(2)),
    performanceConsistency: Number(performanceConsistency.toFixed(2)),
    timeConsistency: Number(timeConsistency.toFixed(2)),
    submissions: submissions.map((item) => ({
      id: item.id,
      challengeId: item.challengeId,
      score: item.score,
      aiProbability: item.aiProbability,
      timeTaken: item.timeTaken,
      createdAt: formatDate(item.createdAt),
    })),
    scoreTrend: submissions.slice(0, 20).reverse().map((item, index) => ({
      index: index + 1,
      score: item.score,
      aiProbability: item.aiProbability,
      createdAt: formatDate(item.createdAt),
    })),
  };
}
