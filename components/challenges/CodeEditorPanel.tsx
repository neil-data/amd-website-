'use client';

import AnimatedButton from '@/components/auth/AnimatedButton';

interface EditorChallenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  points: number;
  duration: string;
}

interface CodeEditorPanelProps {
  challenges: EditorChallenge[];
  selectedChallengeId: string | null;
  language: string;
  code: string;
  timeTaken: number;
  submitting: boolean;
  message: string | null;
  onSelectChallenge: (challengeId: string) => void;
  onLanguageChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onTimeTakenChange: (value: number) => void;
  onSubmit: () => void;
}

export default function CodeEditorPanel({
  challenges,
  selectedChallengeId,
  language,
  code,
  timeTaken,
  submitting,
  message,
  onSelectChallenge,
  onLanguageChange,
  onCodeChange,
  onTimeTakenChange,
  onSubmit,
}: CodeEditorPanelProps) {
  const selected = challenges.find((challenge) => challenge.id === selectedChallengeId) ?? null;

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold">Code Editor</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Write and submit your solution</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Challenge
          <select
            value={selectedChallengeId ?? ''}
            onChange={(event) => onSelectChallenge(event.target.value)}
            className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none focus:border-black"
          >
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Language
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none focus:border-black"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Time Taken (min)
          <input
            type="number"
            min={1}
            value={timeTaken}
            onChange={(event) => onTimeTakenChange(Number(event.target.value || 1))}
            className="rounded-xl border border-black/15 px-3 py-2 outline-none focus:border-black"
          />
        </label>
      </div>

      {selected && (
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
          {selected.category} • {selected.difficulty} • {selected.points} points • {selected.duration}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-black text-white">
        <textarea
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          spellCheck={false}
          placeholder="Write your solution here..."
          className="h-72 w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <AnimatedButton type="button" onClick={onSubmit} label={submitting ? 'Submitting…' : 'Submit Code'} />
        {message && <p className="text-sm text-neutral-700">{message}</p>}
      </div>
    </section>
  );
}
