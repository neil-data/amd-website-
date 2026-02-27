export interface UserDoc {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter';
  totalPoints: number;
  integrityScore: number;
  createdAt?: string;
  avgAiProbability?: number;
  completedChallenges?: number;
}

export interface SubmissionDoc {
  id: string;
  userId: string;
  challengeId: string;
  score: number;
  aiProbability: number;
  timeTaken: number;
  createdAt?: string;
}

export interface StudentDashboardData {
  user: UserDoc;
  totalPoints: number;
  integrityScore: number;
  completedChallenges: number;
  avgAiProbability: number;
  globalRank: number | null;
  recentSubmissions: SubmissionDoc[];
  scoreTrend: Array<{ label: string; score: number; aiProbability: number }>;
}

export interface RecruiterRow {
  id: string;
  name: string;
  totalPoints: number;
  integrityScore: number;
  avgAiProbability: number;
  completedChallenges: number;
}

export interface RecruiterDashboardData {
  students: RecruiterRow[];
}

export interface CandidateDetails {
  user: UserDoc;
  totalPoints: number;
  integrityScore: number;
  avgAiProbability: number;
  completedChallenges: number;
  performanceConsistency: number;
  timeConsistency: number;
  scoreTrend: Array<{ label: string; score: number; aiProbability: number }>;
  submissionHistory: SubmissionDoc[];
}
