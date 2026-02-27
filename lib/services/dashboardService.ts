import {
  DocumentData,
  QueryDocumentSnapshot,
  Unsubscribe,
  collection,
  doc,
  orderBy,
  onSnapshot,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { perfLog } from '@/lib/perfLog';
import {
  CandidateDetails,
  RecruiterDashboardData,
  RecruiterRow,
  StudentDashboardData,
  SubmissionDoc,
  UserDoc,
} from '@/types/dashboard';

const usersCollection = collection(db, 'users');
const submissionsCollection = collection(db, 'submissions');

function toUser(snapshot: QueryDocumentSnapshot<DocumentData>): UserDoc {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: String(data.name ?? 'Unknown User'),
    email: String(data.email ?? ''),
    role: data.role === 'recruiter' ? 'recruiter' : 'student',
    totalPoints: Number(data.totalPoints ?? 0),
    integrityScore: Number(data.integrityScore ?? 0),
    createdAt: data.createdAt?.toDate?.()?.toISOString?.(),
    avgAiProbability: Number(data.avgAiProbability ?? 0),
    completedChallenges: Number(data.completedChallenges ?? 0),
  };
}

function toSubmission(snapshot: QueryDocumentSnapshot<DocumentData>): SubmissionDoc {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: String(data.userId ?? ''),
    challengeId: String(data.challengeId ?? 'challenge'),
    score: Number(data.score ?? 0),
    aiProbability: Number(data.aiProbability ?? 0),
    timeTaken: Number(data.timeTaken ?? 0),
    createdAt: data.createdAt?.toDate?.()?.toISOString?.(),
  };
}

function formatDateLabel(value?: string): string {
  if (!value) {
    return 'N/A';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'N/A';
  }

  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) {
    return 0;
  }
  const avg = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function clamp(value: number, minValue = 0, maxValue = 100): number {
  return Math.max(minValue, Math.min(maxValue, value));
}

export function getStudentDashboard(
  uid: string,
  onData: (data: StudentDashboardData) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let currentUser: UserDoc | null = null;
  let currentSubmissions: SubmissionDoc[] = [];
  let rankedUsers: UserDoc[] = [];

  const emit = () => {
    if (!currentUser) {
      return;
    }

    const completedChallenges = currentSubmissions.length;
    const avgAiProbability = mean(currentSubmissions.map((item) => item.aiProbability));
    const integrityScore = clamp(100 - avgAiProbability);
    const globalRank = rankedUsers.findIndex((item) => item.id === uid);
    const recentSubmissions = currentSubmissions.slice(0, 5);
    const trendRows = [...currentSubmissions]
      .slice(0, 10)
      .reverse()
      .map((item) => ({
        label: formatDateLabel(item.createdAt),
        score: item.score,
        aiProbability: item.aiProbability,
      }));

    onData({
      user: currentUser,
      totalPoints: currentUser.totalPoints,
      integrityScore,
      completedChallenges,
      avgAiProbability,
      globalRank: globalRank >= 0 ? globalRank + 1 : null,
      recentSubmissions,
      scoreTrend: trendRows,
    });
  };

  const unsubs: Unsubscribe[] = [];

  unsubs.push(
    onSnapshot(
      doc(db, 'users', uid),
      (snapshot) => {
        if (!snapshot.exists()) {
          currentUser = {
            id: uid,
            name: 'SkillRank User',
            email: '',
            role: 'student',
            totalPoints: 0,
            integrityScore: 0,
          };
        } else {
          const data = snapshot.data();
          currentUser = {
            id: snapshot.id,
            name: String(data.name ?? 'SkillRank User'),
            email: String(data.email ?? ''),
            role: data.role === 'recruiter' ? 'recruiter' : 'student',
            totalPoints: Number(data.totalPoints ?? 0),
            integrityScore: Number(data.integrityScore ?? 0),
            createdAt: data.createdAt?.toDate?.()?.toISOString?.(),
            avgAiProbability: Number(data.avgAiProbability ?? 0),
            completedChallenges: Number(data.completedChallenges ?? 0),
          };
        }
        emit();
      },
      (error) => onError?.(error as Error),
    ),
  );

  unsubs.push(
    onSnapshot(
      query(submissionsCollection, where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(100)),
      (snapshot) => {
        currentSubmissions = snapshot.docs.map(toSubmission);
        emit();
      },
      (error) => onError?.(error as Error),
    ),
  );

  unsubs.push(
    onSnapshot(
      query(usersCollection, where('role', '==', 'student'), orderBy('totalPoints', 'desc'), limit(100)),
      (snapshot) => {
        rankedUsers = snapshot.docs.map(toUser);
        emit();
      },
      (error) => onError?.(error as Error),
    ),
  );

  return () => {
    unsubs.forEach((unsubscribe) => unsubscribe());
  };
}

export function getRecruiterDashboard(
  onData: (data: RecruiterDashboardData) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const startedAt = performance.now();

  return onSnapshot(
    query(usersCollection, where('role', '==', 'student'), orderBy('integrityScore', 'desc'), limit(20)),
    (snapshot) => {
      const students: RecruiterRow[] = snapshot.docs
        .map((item) => {
          const user = toUser(item);
          return {
            id: user.id,
            name: user.name,
            totalPoints: user.totalPoints,
            integrityScore: user.integrityScore,
            avgAiProbability: Number(user.avgAiProbability ?? 100 - user.integrityScore),
            completedChallenges: Number(user.completedChallenges ?? 0),
          };
        });

      perfLog('recruiter-dashboard', 'snapshot_received', {
        rows: students.length,
        fromCache: snapshot.metadata.fromCache,
        hasPendingWrites: snapshot.metadata.hasPendingWrites,
        elapsedMs: Math.round(performance.now() - startedAt),
      });

      onData({ students });
    },
    (error) => {
      perfLog('recruiter-dashboard', 'snapshot_error', {
        message: (error as Error).message,
        elapsedMs: Math.round(performance.now() - startedAt),
      }, 'error');

      onError?.(error as Error);
    },
  );
}

export function getCandidateDetails(
  uid: string,
  onData: (data: CandidateDetails) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let currentUser: UserDoc | null = null;
  let currentSubmissions: SubmissionDoc[] = [];

  const emit = () => {
    if (!currentUser) {
      return;
    }

    const avgAiProbability = mean(currentSubmissions.map((item) => item.aiProbability));
    const completedChallenges = currentSubmissions.length;
    const scoreValues = currentSubmissions.map((item) => item.score);
    const timeValues = currentSubmissions.map((item) => item.timeTaken);

    const performanceConsistency = clamp(100 - stdDev(scoreValues) * 2);
    const avgTime = mean(timeValues) || 1;
    const timeConsistency = clamp(100 - (stdDev(timeValues) / avgTime) * 100);

    const trendRows = [...currentSubmissions]
      .slice(0, 12)
      .reverse()
      .map((item) => ({
        label: formatDateLabel(item.createdAt),
        score: item.score,
        aiProbability: item.aiProbability,
      }));

    onData({
      user: currentUser,
      totalPoints: currentUser.totalPoints,
      integrityScore: clamp(100 - avgAiProbability),
      avgAiProbability,
      completedChallenges,
      performanceConsistency,
      timeConsistency,
      scoreTrend: trendRows,
      submissionHistory: currentSubmissions,
    });
  };

  const unsubs: Unsubscribe[] = [];

  unsubs.push(
    onSnapshot(
      doc(db, 'users', uid),
      (snapshot) => {
        if (!snapshot.exists()) {
          currentUser = {
            id: uid,
            name: 'Unknown User',
            email: '',
            role: 'student',
            totalPoints: 0,
            integrityScore: 0,
          };
        } else {
          const data = snapshot.data();
          currentUser = {
            id: snapshot.id,
            name: String(data.name ?? 'Unknown User'),
            email: String(data.email ?? ''),
            role: data.role === 'recruiter' ? 'recruiter' : 'student',
            totalPoints: Number(data.totalPoints ?? 0),
            integrityScore: Number(data.integrityScore ?? 0),
            createdAt: data.createdAt?.toDate?.()?.toISOString?.(),
            avgAiProbability: Number(data.avgAiProbability ?? 0),
            completedChallenges: Number(data.completedChallenges ?? 0),
          };
        }
        emit();
      },
      (error) => onError?.(error as Error),
    ),
  );

  unsubs.push(
    onSnapshot(
      query(submissionsCollection, where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(100)),
      (snapshot) => {
        currentSubmissions = snapshot.docs.map(toSubmission);
        emit();
      },
      (error) => onError?.(error as Error),
    ),
  );

  return () => {
    unsubs.forEach((unsubscribe) => unsubscribe());
  };
}
