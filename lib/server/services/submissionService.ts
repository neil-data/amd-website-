import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { SubmissionDocument } from '@/types/backend';

export async function createSubmission(payload: Omit<SubmissionDocument, 'createdAt'>) {
  const ref = await adminDb.collection('submissions').add({
    ...payload,
    createdAt: FieldValue.serverTimestamp(),
  });

  return ref.id;
}

export async function getSubmissionsByUser(uid: string) {
  const snapshot = await adminDb
    .collection('submissions')
    .where('userId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs
    .map((doc) => {
      const data = doc.data() as Partial<SubmissionDocument>;
      return {
        id: doc.id,
        userId: String(data.userId ?? ''),
        challengeId: String(data.challengeId ?? ''),
        score: Number(data.score ?? 0),
        aiProbability: Number(data.aiProbability ?? 0),
        timeTaken: Number(data.timeTaken ?? 0),
        createdAt: data.createdAt,
      };
    });
}
