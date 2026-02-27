'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import DifficultyTag from '@/components/authenticated/DifficultyTag';
import ChallengeFilters from '@/components/authenticated/ChallengeFilters';
import AnimatedButton from '@/components/auth/AnimatedButton';
import CodeEditorPanel from '@/components/challenges/CodeEditorPanel';
import { apiRequest } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

interface ChallengeItem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: string;
  points: number;
}

interface ChallengeApiItem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  points: number;
  timeLimit: number;
}

function normalizeDifficulty(value: string): ChallengeItem['difficulty'] {
  const normalized = value.toLowerCase();
  if (normalized === 'beginner') {
    return 'Beginner';
  }
  if (normalized === 'advanced') {
    return 'Advanced';
  }
  return 'Intermediate';
}

function estimatedScore(difficulty: ChallengeItem['difficulty']) {
  if (difficulty === 'Beginner') {
    return 88;
  }
  if (difficulty === 'Advanced') {
    return 74;
  }
  return 81;
}

export default function ChallengesPage() {
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [challengeList, setChallengeList] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [editorLanguage, setEditorLanguage] = useState('typescript');
  const [editorCode, setEditorCode] = useState('');
  const [editorTimeTaken, setEditorTimeTaken] = useState(45);

  useEffect(() => {
    let mounted = true;

    async function loadChallenges() {
      try {
        setLoading(true);
        setError(null);
        const payload = await apiRequest<{ challenges: ChallengeApiItem[] }>('/api/challenges?limit=100');
        if (!mounted) {
          return;
        }

        setChallengeList(
          payload.challenges.map((challenge) => ({
            id: challenge.id,
            title: challenge.title,
            difficulty: normalizeDifficulty(challenge.difficulty),
            category: challenge.category,
            duration: `${challenge.timeLimit} min`,
            points: challenge.points,
          })),
        );
        if (payload.challenges.length > 0) {
          const defaultChallenge = payload.challenges[0];
          setSelectedChallengeId(defaultChallenge.id);
          setEditorTimeTaken(defaultChallenge.timeLimit || 45);
        }
      } catch (apiError) {
        const nextMessage = apiError instanceof Error ? apiError.message : 'Failed to load challenges.';
        if (mounted) {
          setError(nextMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadChallenges();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmitAttempt = async (
    challenge: ChallengeItem,
    codeInput: string,
    languageInput: string,
    timeTakenInput: number,
  ) => {
    try {
      setMessage(null);
      setSubmittingId(challenge.id);
      const parsedDuration = Number.isFinite(timeTakenInput) && timeTakenInput > 0
        ? timeTakenInput
        : Number(challenge.duration.replace(' min', ''));
      const score = estimatedScore(challenge.difficulty);

      const payload = await apiRequest<{ finalScore: number; aiProbability: number }>('/api/submit', {
        method: 'POST',
        body: JSON.stringify({
          challengeId: challenge.id,
          score,
          code: codeInput,
          language: languageInput,
          timeTaken: Number.isFinite(parsedDuration) ? parsedDuration : 45,
        }),
      });

      setMessage(
        `Submitted ${challenge.title}. Final score ${payload.finalScore.toFixed(1)} with AI probability ${payload.aiProbability.toFixed(1)}%.`,
      );
    } catch (apiError) {
      const nextMessage = apiError instanceof Error ? apiError.message : 'Failed to submit challenge.';
      setMessage(nextMessage);
    } finally {
      setSubmittingId(null);
    }
  };

  const filtered = useMemo(() => {
    return challengeList.filter((challenge) => {
      const matchesSearch = challenge.title.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficulty === 'All' || challenge.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficulty]);

  const selectedChallenge = useMemo(
    () => challengeList.find((challenge) => challenge.id === selectedChallengeId) ?? null,
    [challengeList, selectedChallengeId],
  );

  const onSubmitFromEditor = async () => {
    if (!selectedChallenge) {
      return;
    }

    await handleSubmitAttempt(selectedChallenge, editorCode, editorLanguage, editorTimeTaken);
  };

  return (
    <AuthenticatedShell title="Challenges" subtitle="Browse and attempt challenges that verify real skill.">
      <ChallengeFilters search={search} setSearch={setSearch} difficulty={difficulty} setDifficulty={setDifficulty} />

      {loading && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-neutral-600">Loading challenges…</div>}
      {!loading && error && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-red-600">{error}</div>}

      {!loading && !error && role === 'student' && challengeList.length > 0 && (
        <CodeEditorPanel
          challenges={challengeList}
          selectedChallengeId={selectedChallengeId}
          language={editorLanguage}
          code={editorCode}
          timeTaken={editorTimeTaken}
          submitting={submittingId === selectedChallengeId}
          message={message}
          onSelectChallenge={(challengeId) => {
            setSelectedChallengeId(challengeId);
            const challenge = challengeList.find((item) => item.id === challengeId);
            if (challenge) {
              const minutes = Number(challenge.duration.replace(' min', ''));
              if (Number.isFinite(minutes)) {
                setEditorTimeTaken(minutes);
              }
            }
          }}
          onLanguageChange={setEditorLanguage}
          onCodeChange={setEditorCode}
          onTimeTakenChange={setEditorTimeTaken}
          onSubmit={onSubmitFromEditor}
        />
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((challenge, index) => (
          <motion.article
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-black/10 bg-white p-5"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{challenge.category}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold">{challenge.title}</h2>
            <div className="mt-4 flex items-center justify-between">
              <DifficultyTag level={challenge.difficulty} />
              <span className="text-sm text-neutral-600">{challenge.duration}</span>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-neutral-500">{challenge.points} points</p>
            {role === 'student' && (
              <div className="mt-4">
                <AnimatedButton
                  type="button"
                  onClick={() => {
                    setSelectedChallengeId(challenge.id);
                    const minutes = Number(challenge.duration.replace(' min', ''));
                    if (Number.isFinite(minutes)) {
                      setEditorTimeTaken(minutes);
                    }
                  }}
                  label={selectedChallengeId === challenge.id ? 'Selected in Editor' : 'Open in Editor'}
                />
              </div>
            )}
          </motion.article>
        ))}
      </section>
    </AuthenticatedShell>
  );
}
