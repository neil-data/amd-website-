export type UserRole = 'student' | 'recruiter';

export interface UserDocument {
  name: string;
  email: string;
  role: UserRole;
  totalPoints: number;
  integrityScore: number;
  avgAiProbability: number;
  completedChallenges: number;
  createdAt?: unknown;
}

export interface ChallengeDocument {
  title: string;
  description: string;
  difficulty: string;
  points: number;
  timeLimit: number;
  createdAt?: unknown;
}

export interface SubmissionDocument {
  userId: string;
  challengeId: string;
  score: number;
  aiProbability: number;
  timeTaken: number;
  createdAt?: unknown;
}

export interface ExchangeDocument {
  teacherId: string;
  learnerId: string;
  skill: string;
  status: 'active' | 'completed';
  pointsAwarded: number;
  createdAt?: unknown;
}

export interface AuthenticatedContext {
  uid: string;
  email: string | null;
  role: UserRole;
}
