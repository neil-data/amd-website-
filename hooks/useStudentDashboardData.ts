'use client';

import { useEffect, useMemo, useState } from 'react';
import { getStudentDashboard } from '@/lib/services/dashboardService';
import { StudentDashboardData } from '@/types/dashboard';

export function useStudentDashboardData(uid: string | null) {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = getStudentDashboard(
      uid,
      (nextData) => {
        setData(nextData);
        setLoading(false);
      },
      (err) => {
        const message = err.message || 'Failed to load dashboard data.';
        if (message.toLowerCase().includes('missing or insufficient permissions')) {
          setError('Firestore rules are blocking dashboard reads. Deploy firestore.rules to project amda-cf25f.');
        } else {
          setError(message);
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [uid]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
