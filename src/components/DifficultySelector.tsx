import { type Difficulty } from '../App';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  disabled: boolean;
}

const difficulties = [
  { level: 'easy', tries: 10, multiplier: 1.8 },
  { level: 'medium', tries: 5, multiplier: 3.6 },
  { level: 'hard', tries: 1, multiplier: 18 },
] as const;

export default function DifficultySelector({ onSelect, disabled }: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {difficulties.map(({ level, tries, multiplier }) => (
        <button
          key={level}
          onClick={() => onSelect(level as Difficulty)}
          disabled={disabled}
          className={`
            py-3 px-6 rounded-lg font-semibold text-white
            transition-all duration-300 transform hover:scale-105
            bg-gradient-to-r from-green-500 to-yellow-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            ${disabled ? '' : 'hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]'}
          `}
        >
          <div className="text-sm mb-1">({tries} tries)</div>
          <div className="text-lg">Pays {multiplier}x</div>
        </button>
      ))}
    </div>
  );
}