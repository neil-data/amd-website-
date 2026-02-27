import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/server/auth';
import { failure, success } from '@/lib/server/response';
import { getCandidateDetails, getRecruiterDashboard } from '@/lib/server/services/dashboardService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ['recruiter']);

    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('candidateId');

    if (candidateId) {
      const candidate = await getCandidateDetails(candidateId);
      return success(candidate);
    }

    const dashboard = await getRecruiterDashboard();
    return success(dashboard);
  } catch (error) {
    return failure(error);
  }
}
