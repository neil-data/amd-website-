import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/server/firebaseAdmin';
import { ExchangeDocument } from '@/types/backend';

function toTimestamp(value: unknown): number {
  if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as { toMillis: () => number }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}

export async function createExchange(payload: Omit<ExchangeDocument, 'createdAt'>) {
  const ref = await getAdminDb().collection('exchanges').add({
    ...payload,
    createdAt: FieldValue.serverTimestamp(),
  });

  return ref.id;
}

export async function getExchangesForUser(uid: string) {
  const adminDb = getAdminDb();
  const [teacherSnapshot, learnerSnapshot] = await Promise.all([
    adminDb.collection('exchanges').where('teacherId', '==', uid).get(),
    adminDb.collection('exchanges').where('learnerId', '==', uid).get(),
  ]);

  const map = new Map<string, ReturnType<typeof mapExchange>>();

  teacherSnapshot.docs.forEach((doc) => map.set(doc.id, mapExchange(doc.id, doc.data())));
  learnerSnapshot.docs.forEach((doc) => map.set(doc.id, mapExchange(doc.id, doc.data())));

  return [...map.values()].sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));
}

function mapExchange(id: string, data: Record<string, unknown>) {
  return {
    id,
    teacherId: String(data.teacherId ?? ''),
    learnerId: String(data.learnerId ?? ''),
    skill: String(data.skill ?? ''),
    status: data.status === 'completed' ? 'completed' : 'active',
    pointsAwarded: Number(data.pointsAwarded ?? 0),
    createdAt: data.createdAt,
  };
}
