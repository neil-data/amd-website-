interface DifficultyTagProps {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function DifficultyTag({ level }: DifficultyTagProps) {
  const colorByLevel = {
    Beginner: 'bg-black/5 text-black',
    Intermediate: 'bg-black/10 text-black',
    Advanced: 'bg-black text-white',
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${colorByLevel[level]}`}>{level}</span>;
}
