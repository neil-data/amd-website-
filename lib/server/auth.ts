import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/server/firebaseAdmin';
import { AuthenticatedContext, UserRole } from '@/types/backend';

export class ApiAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7);
}

export async function requireAuth(request: NextRequest): Promise<AuthenticatedContext> {
  const token = getBearerToken(request);
  if (!token) {
    throw new ApiAuthError('Missing auth token.', 401);
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const userSnap = await adminDb.collection('users').doc(decoded.uid).get();

  if (!userSnap.exists) {
    throw new ApiAuthError('User profile not found.', 404);
  }

  const data = userSnap.data();
  const role: UserRole = data?.role === 'recruiter' ? 'recruiter' : 'student';

  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    role,
  };
}

export async function requireRole(request: NextRequest, allowedRoles: UserRole[]): Promise<AuthenticatedContext> {
  const context = await requireAuth(request);
  if (!allowedRoles.includes(context.role)) {
    throw new ApiAuthError('Forbidden', 403);
  }

  return context;
}
