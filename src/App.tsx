import { useState, useEffect } from 'react';
import { Coins, Trophy, AlertTriangle, Lock, Shield } from 'lucide-react';
import GameBoard from './components/GameBoard';
import DifficultySelector from './components/DifficultySelector';
import MatrixBackground from './components/MatrixBackground';
import VerificationModal from './components/VerificationModal';
import { generateInitialSeeds, generateSquarePosition, getServerSeedHash, type GameSeeds } from './utils/provablyFair';

export type Difficulty = 'easy' | 'medium' | 'hard';

function App() {
  const [tokens, setTokens] = useState(100);
  const [playerTries, setPlayerTries] = useState(0);
  const [prizeSquare, setPrizeSquare] = useState(-1);
  const [gameSeeds, setGameSeeds] = useState<GameSeeds>(generateInitialSeeds());
  const [serverSeedHash, setServerSeedHash] = useState('');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  useEffect(() => {
    setServerSeedHash(getServerSeedHash(gameSeeds.serverSeed));
  }, [gameSeeds.serverSeed]);

  const handleStartGame = (difficulty: Difficulty) => {
    if (tokens <= 0) {
      alert("You need more tokens to play!");
      return;
    }

    let cost = 0;
    let tries = 0;

    switch (difficulty) {
      case 'easy':
        tries = 10;
        cost = 1;
        break;
      case 'medium':
        tries = 5;
        cost = 2;
        break;
      case 'hard':
        tries = 1;
        cost = 5;
        break;
    }

    const newSeeds = {
      ...gameSeeds,
      nonce: (parseInt(gameSeeds.nonce) + 1).toString()
    };
    setGameSeeds(newSeeds);

    setTokens(prev => prev - cost);
    setPlayerTries(tries);
    setPrizeSquare(generateSquarePosition(newSeeds));
  };

  const handleSquareClick = (index: number) => {
    if (playerTries <= 0) {
      alert("No more tries left! Start a new game.");
      return;
    }

    if (index === prizeSquare) {
      const payout = parseFloat((18 / playerTries).toFixed(2));
      setTokens(prev => prev + payout);
      alert(`🎉 You found the prize and won ${payout} tokens!`);
      setPlayerTries(0);
    } else {
      setPlayerTries(prev => prev - 1);
      if (playerTries === 1) {
        alert("😢 You're out of tries. Start a new game.");
      } else {
        alert(`❌ Wrong square! Tries left: ${playerTries - 1}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixBackground />
      
      <header className="fixed top-0 w-full bg-black/90 py-4 shadow-[0_4px_10px_rgba(0,255,255,0.3)] z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wider uppercase flex items-center gap-2">
            <Trophy className="w-6 h-6 text-cyan-400" />
            Crypto Gaming Universe
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="flex items-center gap-2 text-xs bg-green-500/10 py-1 px-3 rounded-full hover:bg-green-500/20 transition-colors"
            >
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Verify Fairness</span>
            </button>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-semibold">{tokens}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Welcome to the Future of Blockchain Gaming!
          </h2>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <p className="text-lg text-yellow-400">Choose your difficulty and find the prize!</p>
            </div>
            <DifficultySelector onSelect={handleStartGame} disabled={tokens <= 0} />
          </div>

          <GameBoard 
            onSquareClick={handleSquareClick}
            prizeSquare={prizeSquare}
            playerTries={playerTries}
          />

          <div className="mt-8 p-4 bg-white/5 rounded-lg text-xs text-gray-400">
            <p>Server Seed Hash: {serverSeedHash}</p>
            <p>Client Seed: {gameSeeds.clientSeed}</p>
            <p>Nonce: {gameSeeds.nonce}</p>
          </div>
        </div>
      </main>

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        gameSeeds={gameSeeds}
      />
    </div>
  );
}

export default App;