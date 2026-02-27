'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCandidateDetails, getRecruiterDashboard } from '@/lib/services/dashboardService';
import { perfLog } from '@/lib/perfLog';
import { CandidateDetails, RecruiterDashboardData } from '@/types/dashboard';

export function useRecruiterDashboardData(selectedCandidateId: string | null) {
  const [dashboard, setDashboard] = useState<RecruiterDashboardData | null>(null);
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dashboardStartedAt = useRef<number>(0);
  const candidateStartedAt = useRef<number>(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    dashboardStartedAt.current = performance.now();
    perfLog('recruiter-dashboard-hook', 'dashboard_subscribe_start');

    const unsubscribe = getRecruiterDashboard(
      (nextData) => {
        setDashboard(nextData);
        setLoading(false);
        perfLog('recruiter-dashboard-hook', 'dashboard_subscribe_success', {
          rows: nextData.students.length,
          elapsedMs: Math.round(performance.now() - dashboardStartedAt.current),
        });
      },
      (err) => {
        const message = err.message || 'Failed to load recruiter dashboard.';
        if (message.toLowerCase().includes('missing or insufficient permissions')) {
          setError('Firestore rules are blocking recruiter reads. Deploy firestore.rules to project amda-cf25f.');
        } else {
          setError(message);
        }
        setLoading(false);
        perfLog('recruiter-dashboard-hook', 'dashboard_subscribe_error', {
          message,
          elapsedMs: Math.round(performance.now() - dashboardStartedAt.current),
        }, 'error');
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedCandidateId) {
      setCandidate(null);
      return;
    }

    setCandidateLoading(true);
    candidateStartedAt.current = performance.now();
    perfLog('recruiter-dashboard-hook', 'candidate_subscribe_start', {
      candidateId: selectedCandidateId,
    });

    const unsubscribe = getCandidateDetails(
      selectedCandidateId,
      (nextData) => {
        setCandidate(nextData);
        setCandidateLoading(false);
        perfLog('recruiter-dashboard-hook', 'candidate_subscribe_success', {
          candidateId: selectedCandidateId,
          submissions: nextData.submissionHistory.length,
          elapsedMs: Math.round(performance.now() - candidateStartedAt.current),
        });
      },
      (err) => {
        const message = err.message || 'Failed to load candidate details.';
        if (message.toLowerCase().includes('missing or insufficient permissions')) {
          setError('Firestore rules are blocking candidate details reads. Deploy firestore.rules to project amda-cf25f.');
        } else {
          setError(message);
        }
        setCandidateLoading(false);
        perfLog('recruiter-dashboard-hook', 'candidate_subscribe_error', {
          candidateId: selectedCandidateId,
          message,
          elapsedMs: Math.round(performance.now() - candidateStartedAt.current),
        }, 'error');
      },
    );

    return () => unsubscribe();
  }, [selectedCandidateId]);

  return useMemo(
    () => ({ dashboard, candidate, loading, candidateLoading, error }),
    [dashboard, candidate, loading, candidateLoading, error],
  );
}
