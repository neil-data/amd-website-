import { getAdminDb } from '@/lib/server/firebaseAdmin';
import { ChallengeDocument } from '@/types/backend';

const fallbackChallenges: Array<ChallengeDocument & { id: string; category: string }> = [
  {
    id: 'frontend-optimization-sprint',
    title: 'Frontend Optimization Sprint',
    description:
      'You are given a React dashboard that renders N widgets, each with charts and tables backed by remote data. The current implementation re-renders the entire dashboard whenever any widget filter changes.\n\nYour task is to refactor the dashboard so that: (1) only the widget whose props changed re-renders; (2) expensive chart components are lazily loaded; and (3) the initial Time To Interactive (TTI) is reduced without changing visible behavior. Describe your component structure and implement the key optimization primitives (memoization, code-splitting hooks, or selectors).',
    difficulty: 'intermediate',
    points: 80,
    timeLimit: 45,
    category: 'Frontend',
  },
  {
    id: 'prompt-integrity-diagnostics',
    title: 'Prompt Integrity Diagnostics',
    description:
      'You operate an LLM-backed API that receives a hidden system prompt S and a visible conversation transcript C = [u1, a1, u2, a2, ...]. Some user turns may attempt to extract S.\n\nDesign a function that, given S and C, returns a numeric leakage risk score in [0, 1] and a short explanation. The score should increase when: (1) user messages explicitly ask for the instructions, secrets, or system prompts; (2) assistant messages echo long fragments of S; or (3) the conversation contains jailbreak-style patterns. You do not need to run a model; compute the score using string and pattern analysis only.',
    difficulty: 'advanced',
    points: 95,
    timeLimit: 60,
    category: 'AI',
  },
  {
    id: 'data-reasoning-accuracy-test',
    title: 'Data Reasoning Accuracy Test',
    description:
      'You are given weekly KPI data for a product: signups, activations, and conversions over T weeks, plus a list of known seasonality events (holidays, campaigns). Conversions suddenly drop in week k.\n\nImplement a function that, given the time series and event markers, identifies the most likely root cause: (1) funnel drop at a particular stage; (2) seasonal pattern; or (3) anomaly not explained by events. Your function should return both the classification and a human-readable explanation referencing the segments and weeks used in the decision.',
    difficulty: 'beginner',
    points: 60,
    timeLimit: 30,
    category: 'Analytics',
  },
  {
    id: 'async-api-resilience',
    title: 'Async API Resilience',
    description:
      'You are given a low-level HTTP client (such as fetch) that can fail with timeouts, transient 5xx errors, or network disconnects.\n\nImplement a function requestWithResilience(input, options) that: (1) enforces a per-request timeout; (2) retries idempotent requests with exponential backoff on network/5xx errors; (3) surfaces a structured error object with type, message, and last HTTP status; and (4) never retries on clearly fatal errors (e.g., 4xx auth errors). Keep the external call-site API unchanged and make sure the function is safe to use concurrently from multiple components.',
    difficulty: 'intermediate',
    points: 85,
    timeLimit: 40,
    category: 'Backend',
  },
  {
    id: 'state-machine-auth-flow',
    title: 'State Machine Auth Flow',
    description:
      'You need to model a multi-step authentication flow as a finite state machine. The valid states are: IDLE, PASSWORD_REQUIRED, MFA_REQUIRED, VERIFIED, and LOCKED. The events are: START_LOGIN, PASSWORD_ACCEPTED, PASSWORD_REJECTED, MFA_SENT, MFA_VERIFIED, and TOO_MANY_ATTEMPTS.\n\nImplement a pure function transition(state, event) -> nextState that: (1) disallows illegal transitions (e.g., MFA_VERIFIED from IDLE); (2) moves to LOCKED after a configurable number of failed attempts; and (3) is easy to extend with new states without breaking existing ones. Provide the state type, event type, and the transition function.',
    difficulty: 'advanced',
    points: 96,
    timeLimit: 55,
    category: 'Architecture',
  },
  {
    id: 'react-list-virtualization',
    title: 'React List Virtualization',
    description:
      'You are rendering a list of up to 100,000 items in React, each row containing text and a couple of icons. Rendering all rows at once freezes the UI.\n\nImplement a lightweight VirtualList component with the following props: items (array), rowHeight (number), and renderRow(index, item). The component should: (1) only render the rows visible in the viewport plus a small buffer; (2) handle vertical scrolling smoothly; and (3) correctly update when the items array length changes. Do not introduce external virtualization libraries; use standard DOM measurements and React.',
    difficulty: 'intermediate',
    points: 88,
    timeLimit: 45,
    category: 'Frontend',
  },
  {
    id: 'index-strategy-advisor',
    title: 'Index Strategy Advisor',
    description:
      'You are given a small set of SQL SELECT queries over one or two tables (users, orders, events). Each query has WHERE, ORDER BY, and occasionally JOIN clauses.\n\nWrite a function suggestIndexes(queries) that returns a list of recommended single- and multi-column indexes. Your output should include: (1) the table name; (2) the indexed columns in order; and (3) a short justification based on equality filters, range filters, and sort patterns. You do not need to simulate an optimizer, but your rules should be consistent and explainable.',
    difficulty: 'advanced',
    points: 93,
    timeLimit: 60,
    category: 'Data',
  },
  {
    id: 'log-anomaly-detector',
    title: 'Log Anomaly Detector',
    description:
      'You receive application logs as a stream of lines: each line has a sessionId, timestamp, logLevel, and message. Most sessions have a "normal" mix of INFO/WARN/ERROR entries and latency within a known range.\n\nImplement a function detectAnomalousSessions(logs) that groups logs by sessionId and flags sessions as anomalous when their error rate or 95th percentile latency deviates significantly from the global baseline. Return the list of anomalous sessionIds along with a short explanation string per session (e.g., "error rate 3x baseline").',
    difficulty: 'intermediate',
    points: 82,
    timeLimit: 45,
    category: 'Analytics',
  },
  {
    id: 'webhook-signature-verifier',
    title: 'Webhook Signature Verifier',
    description:
      'You expose a /webhook endpoint that receives POST requests from a third-party provider. Each request includes a body and a signature header H that is an HMAC-SHA256 of the raw body using a shared secret.\n\nImplement middleware verifyWebhook(req, secret) that: (1) reads the raw body without being corrupted by JSON parsers; (2) computes the expected HMAC; (3) compares it to H using a timing-safe comparison; and (4) rejects requests that are older than a small time window to prevent replay attacks. On success, the downstream handler should receive the parsed JSON body.',
    difficulty: 'beginner',
    points: 70,
    timeLimit: 30,
    category: 'Security',
  },
];

export async function getChallengeById(challengeId: string): Promise<(ChallengeDocument & { id: string }) | null> {
  const snapshot = await getAdminDb().collection('challenges').doc(challengeId).get();
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
  const snapshot = await getAdminDb().collection('challenges').limit(limitCount).get();

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
