import { NextResponse } from 'next/server';
import { ApiAuthError } from '@/lib/server/auth';

export function success(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function failure(error: unknown) {
  if (error instanceof ApiAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
}
