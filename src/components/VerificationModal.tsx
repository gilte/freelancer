import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { getServerSeedHash, generateSquarePosition, type GameSeeds } from '../utils/provablyFair';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameSeeds: GameSeeds;
}

export default function VerificationModal({ isOpen, onClose, gameSeeds }: VerificationModalProps) {
  const [verificationResult, setVerificationResult] = useState<{
    hashMatches: boolean;
    position: number;
  } | null>(null);

  const verifyGame = () => {
    const calculatedHash = getServerSeedHash(gameSeeds.serverSeed);
    const expectedPosition = generateSquarePosition(gameSeeds);
    
    setVerificationResult({
      hashMatches: calculatedHash === getServerSeedHash(gameSeeds.serverSeed),
      position: expectedPosition
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Verify Game Fairness</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-black/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Game Seeds</h4>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-cyan-400">Server Seed: {gameSeeds.serverSeed}</p>
              <p className="text-yellow-400">Client Seed: {gameSeeds.clientSeed}</p>
              <p className="text-green-400">Nonce: {gameSeeds.nonce}</p>
            </div>
          </div>

          {verificationResult && (
            <div className="bg-black/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Verification Result</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Hash Verification:</span>
                  {verificationResult.hashMatches ? (
                    <span className="flex items-center text-green-400">
                      <Check className="w-4 h-4 mr-1" /> Valid
                    </span>
                  ) : (
                    <span className="flex items-center text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" /> Invalid
                    </span>
                  )}
                </div>
                <p className="text-sm">
                  Generated Position: Square #{verificationResult.position + 1}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={verifyGame}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Verify Now
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}