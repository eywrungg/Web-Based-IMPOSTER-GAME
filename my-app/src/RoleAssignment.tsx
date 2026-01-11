import { useState, useEffect } from 'react';
import type { Player } from './types';

interface RoleAssignmentProps {
  players: string[];
  imposterCount: number;
  word: string;
  wordDescription: string;
  imposterHint: string;
  onComplete: (assignedPlayers: Player[]) => void;
}

function RoleAssignment({
  players,
  imposterCount,
  word,
  wordDescription,
  imposterHint,
  onComplete,
}: RoleAssignmentProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [assignedPlayers, setAssignedPlayers] = useState<Player[]>([]);
  const [touchStart, setTouchStart] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);

  // Assign roles on component mount
  useEffect(() => {
    // Create array of role indices
    const roleIndices = Array.from({ length: players.length }, (_, i) => i);
    
    // Shuffle only the role indices
    for (let i = roleIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roleIndices[i], roleIndices[j]] = [roleIndices[j], roleIndices[i]];
    }

    // Assign roles to players IN ORDER, but roles are randomized
    const assigned: Player[] = players.map((name, index) => ({
      id: `player-${index}`,
      name,
      role: roleIndices[index] < imposterCount ? 'imposter' : 'crewmate',
      isAlive: true,
      hasVoted: false,
      tasksCompleted: 0,
      totalTasks: 5,
    }));

    setAssignedPlayers(assigned);
  }, [players, imposterCount]);

  const currentPlayer = assignedPlayers[currentPlayerIndex];
  const isImposter = currentPlayer?.role === 'imposter';

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.touches[0].clientY;
    const distance = touchStart - currentTouch;
    
    // Only allow swipe up to 150px (half swipe)
    if (distance > 0 && distance < 150) {
      setSwipeDistance(distance);
      if (distance > 50 && !isRevealing) {
        setIsRevealing(true);
      }
    }
  };

  const handleTouchEnd = () => {
    // Reveal at 75px instead of 150px (half the distance)
    if (swipeDistance > 75) {
      setRevealed(true);
      setSwipeDistance(0);
    } else {
      setSwipeDistance(0);
      setIsRevealing(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart === 0) return;
    
    const distance = touchStart - e.clientY;
    
    // Only allow swipe up to 150px (half swipe)
    if (distance > 0 && distance < 150) {
      setSwipeDistance(distance);
      if (distance > 50 && !isRevealing) {
        setIsRevealing(true);
      }
    }
  };

  const handleMouseUp = () => {
    // Reveal at 75px instead of 150px (half the distance)
    if (swipeDistance > 75) {
      setRevealed(true);
      setSwipeDistance(0);
    } else {
      setSwipeDistance(0);
      setIsRevealing(false);
    }
    setTouchStart(0);
  };

  const handleNext = () => {
    if (currentPlayerIndex < assignedPlayers.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setRevealed(false);
      setIsRevealing(false);
      setSwipeDistance(0);
    } else {
      onComplete(assignedPlayers);
    }
  };

  if (!currentPlayer) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-sm md:text-base">Preparing roles...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentPlayerIndex + 1) / assignedPlayers.length) * 100;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-500/25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-3 md:p-6">
        <div className="w-full max-w-xl lg:max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-4 md:mb-6 animate-fadeInUp">
            <div className="flex justify-between text-xs md:text-sm text-gray-300 mb-2">
              <span className="font-semibold">Role Assignment</span>
              <span className="font-bold">
                <span className="text-yellow-400">{currentPlayerIndex + 1}</span> / {assignedPlayers.length}
              </span>
            </div>
            <div className="w-full h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Player Name Header */}
          <div className="text-center mb-6 md:mb-8 animate-fadeInUp animation-delay-100">
            <div className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-2 md:mb-3">
              <span className="text-yellow-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Player {currentPlayerIndex + 1}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-2xl">
              {currentPlayer.name}
            </h2>
            <p className="text-gray-400 text-xs md:text-sm">Your turn to reveal your role</p>
          </div>

          {/* Reveal Card */}
          <div className="relative mb-6 md:mb-8 animate-fadeInUp animation-delay-200">
            {!revealed ? (
              <div
                className="glass-yellow rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl cursor-pointer select-none hover-lift"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  transform: `translateY(-${Math.min(swipeDistance, 75)}px)`,
                  transition: swipeDistance === 0 ? 'transform 0.3s ease' : 'none',
                }}
              >
                <div className="text-center">
                  <div className="text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-6">🎭</div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-3 md:mb-4">
                    Swipe Up to Reveal
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm mb-6 md:mb-8">
                    Hold and swipe up halfway to see your role
                  </p>
                  
                  {/* Swipe Indicator */}
                  <div className="flex justify-center">
                    <div className={`transition-all duration-300 ${isRevealing ? 'animate-bounce' : ''}`}>
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {swipeDistance > 0 && (
                    <div className="mt-6">
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                          style={{ width: `${(swipeDistance / 75) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-yellow-400 text-xs mt-2 font-semibold">
                        {swipeDistance > 75 ? 'Release to reveal!' : 'Keep swiping...'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`
                rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl animate-scaleIn
                ${isImposter 
                  ? 'bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-400' 
                  : 'bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-yellow-300'
                }
              `}>
                <div className="text-center">
                  <div className="text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-6">
                    {isImposter ? '😈' : '🕵️'}
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 md:mb-6">
                    {isImposter ? 'YOU ARE AN IMPOSTER!' : 'YOU ARE A CREWMATE!'}
                  </h3>
                  
                  <div className="bg-black/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                    <p className="text-white/80 text-xs md:text-sm font-semibold mb-2">
                      {isImposter ? '🎯 Your Hint:' : '📝 The Secret Word:'}
                    </p>
                    <p className="text-white text-2xl md:text-3xl lg:text-4xl font-black">
                      {isImposter ? imposterHint : word}
                    </p>
                  </div>
                  
                  {!isImposter && (
                    <p className="text-white/90 text-xs md:text-sm italic mb-4">
                      "{wordDescription}"
                    </p>
                  )}
                  
                  {isImposter && (
                    <div className="bg-yellow-500/20 border-2 border-yellow-500/40 rounded-lg md:rounded-xl p-3 md:p-4">
                      <p className="text-yellow-200 text-[10px] md:text-xs leading-relaxed">
                        ⚠️ <span className="font-bold">Mission:</span> Use the hint to blend in without knowing the exact word!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          {revealed && (
            <div className="text-center animate-fadeInUp">
              <button
                onClick={handleNext}
                className="px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-sm md:text-base lg:text-lg rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/30 flex items-center gap-2 md:gap-3 mx-auto"
              >
                <span>
                  {currentPlayerIndex < assignedPlayers.length - 1 ? 'Next Player' : 'Start Game!'}
                </span>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-gray-500 text-[10px] md:text-xs mt-3 md:mt-4">
                Make sure only {currentPlayer.name} saw this!
              </p>
            </div>
          )}

          {/* Warning for other players */}
          {!revealed && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg md:rounded-xl p-3 md:p-4 animate-fadeInUp animation-delay-300">
              <p className="text-yellow-200 text-[10px] md:text-xs text-center leading-relaxed">
                ⚠️ <span className="font-bold">Other players:</span> Look away! Don't peek at {currentPlayer.name}'s role!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleAssignment;