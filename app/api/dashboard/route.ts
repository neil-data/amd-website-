import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/server/auth';
import { failure, success } from '@/lib/server/response';
import { getStudentDashboard } from '@/lib/server/services/dashboardService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, ['student']);
    const dashboard = await getStudentDashboard(auth.uid);

    return success(dashboard);
  } catch (error) {
    return failure(error);
  }
}
