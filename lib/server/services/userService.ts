import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/server/firebaseAdmin';
import { UserDocument } from '@/types/backend';

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export async function getUserById(uid: string): Promise<(UserDocument & { id: string }) | null> {
  const snapshot = await getAdminDb().collection('users').doc(uid).get();
  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data() as Partial<UserDocument>;
  return {
    id: snapshot.id,
    name: String(data.name ?? 'SkillRank User'),
    email: String(data.email ?? ''),
    role: data.role === 'recruiter' ? 'recruiter' : 'student',
    totalPoints: Number(data.totalPoints ?? 0),
    integrityScore: Number(data.integrityScore ?? 100),
    avgAiProbability: Number(data.avgAiProbability ?? 0),
    completedChallenges: Number(data.completedChallenges ?? 0),
    createdAt: data.createdAt,
  };
}

export async function upsertUserProfile(uid: string, payload: Omit<UserDocument, 'createdAt'>) {
  await getAdminDb()
    .collection('users')
    .doc(uid)
    .set(
      {
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

export async function updateUserAfterSubmission(uid: string, finalScore: number, aiProbability: number) {
  const userRef = getAdminDb().collection('users').doc(uid);

  return getAdminDb().runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const existing = userSnap.exists ? (userSnap.data() as Partial<UserDocument>) : {};

    const completed = Number(existing.completedChallenges ?? 0);
    const avgAi = Number(existing.avgAiProbability ?? 0);
    const totalPoints = Number(existing.totalPoints ?? 0);

    const updatedCompleted = completed + 1;
    const updatedAvgAi = ((avgAi * completed) + aiProbability) / updatedCompleted;
    const updatedIntegrity = clamp(100 - updatedAvgAi);

    transaction.set(
      userRef,
      {
        totalPoints: Number((totalPoints + finalScore).toFixed(2)),
        completedChallenges: updatedCompleted,
        avgAiProbability: Number(updatedAvgAi.toFixed(2)),
        integrityScore: Number(updatedIntegrity.toFixed(2)),
      },
      { merge: true },
    );

    return {
      totalPoints: Number((totalPoints + finalScore).toFixed(2)),
      completedChallenges: updatedCompleted,
      avgAiProbability: Number(updatedAvgAi.toFixed(2)),
      integrityScore: Number(updatedIntegrity.toFixed(2)),
    };
  });
}

export async function getLeaderboard(limitCount = 50) {
  const snapshot = await getAdminDb()
    .collection('users')
    .where('role', '==', 'student')
    .orderBy('totalPoints', 'desc')
    .limit(limitCount)
    .get();
  const rows = snapshot.docs
    .map((doc) => {
      const data = doc.data() as Partial<UserDocument>;
      return {
        id: doc.id,
        name: String(data.name ?? 'Student'),
        totalPoints: Number(data.totalPoints ?? 0),
        integrityScore: Number(data.integrityScore ?? 100),
        avgAiProbability: Number(data.avgAiProbability ?? 0),
        completedChallenges: Number(data.completedChallenges ?? 0),
      };
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return rows;
}

export async function getTopStudentsByIntegrity(limitCount = 20) {
  const snapshot = await getAdminDb()
    .collection('users')
    .where('role', '==', 'student')
    .orderBy('integrityScore', 'desc')
    .limit(limitCount)
    .get();
  return snapshot.docs
    .map((doc) => {
      const data = doc.data() as Partial<UserDocument>;
      return {
        id: doc.id,
        name: String(data.name ?? 'Student'),
        totalPoints: Number(data.totalPoints ?? 0),
        integrityScore: Number(data.integrityScore ?? 100),
        avgAiProbability: Number(data.avgAiProbability ?? 0),
        completedChallenges: Number(data.completedChallenges ?? 0),
      };
    });
}
