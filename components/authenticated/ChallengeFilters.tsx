'use client';

interface ChallengeFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  difficulty: 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
  setDifficulty: (value: 'All' | 'Beginner' | 'Intermediate' | 'Advanced') => void;
}

export default function ChallengeFilters({ search, setSearch, difficulty, setDifficulty }: ChallengeFiltersProps) {
  const filters: ('All' | 'Beginner' | 'Intermediate' | 'Advanced')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <section className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search challenges"
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-black"
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDifficulty(item)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] ${
                item === difficulty ? 'bg-black text-white' : 'border border-black/20 text-black'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
