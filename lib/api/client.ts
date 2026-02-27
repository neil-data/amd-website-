'use client';

import { auth } from '@/lib/firebase';

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let cachedToken: string | null = null;
let cachedTokenAt = 0;

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiClientError('You must be logged in to continue.', 401);
  }

  const now = Date.now();
  if (cachedToken && now - cachedTokenAt < 4 * 60 * 1000) {
    return { Authorization: `Bearer ${cachedToken}` };
  }

  const token = await user.getIdToken();
  cachedToken = token;
  cachedTokenAt = now;
  return { Authorization: `Bearer ${token}` };
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const authHeader = await getAuthHeader();

  const response = await fetch(path, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(init.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.error) {
    const message = data?.error ?? 'Request failed';
    throw new ApiClientError(message, response.status);
  }

  return data as T;
}
