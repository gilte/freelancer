import { useCallback } from 'react';

interface GameBoardProps {
  onSquareClick: (index: number) => void;
  prizeSquare: number;
  playerTries: number;
}

export default function GameBoard({ onSquareClick, prizeSquare, playerTries }: GameBoardProps) {
  const getRandomColor = useCallback(() => {
    const hue = Math.random() * 360;
    return `hsla(${hue}, 70%, 50%, 0.2)`;
  }, []);

  return (
    <div className="grid grid-cols-5 gap-3 max-w-[600px] mx-auto">
      {Array.from({ length: 25 }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSquareClick(i)}
          disabled={playerTries <= 0}
          style={{ backgroundColor: getRandomColor() }}
          className={`
            aspect-square rounded-lg transition-all duration-300
            hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50
            border border-white/10 backdrop-blur-sm
            ${playerTries > 0 ? 'hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]' : ''}
          `}
        >
          {i === prizeSquare && (
            <span className="text-3xl font-bold">X</span>
          )}
        </button>
      ))}
    </div>
  );
}