import { useState, useEffect } from 'react';
import type { Player } from './types';

interface GameTimerProps {
  players: Player[];
  discussionTime: number;
  word: string;
  onTimerEnd: () => void;
}

function GameTimer({ players, discussionTime, word, onTimerEnd }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(discussionTime);
  const [isRunning, setIsRunning] = useState(true); // Start automatically

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimerEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((discussionTime - timeLeft) / discussionTime) * 100;
  const alivePlayers = players.filter(p => p.isAlive);
  const isUrgent = timeLeft <= 30;
  const isCritical = timeLeft <= 10;

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto">
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

      <div className="relative z-10 min-h-screen py-3 md:py-6 px-3 md:px-6">
        <div className="max-w-xl lg:max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6 animate-fadeInUp">
            <div className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-2 md:mb-3">
              <span className="text-yellow-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Discussion Phase</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1.5 md:mb-2 tracking-tight">
              🕵️ Find the Imposter
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">Talk and figure out who's lying!</p>
          </div>

          {/* Timer Card */}
          <div className="glass-yellow rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl mb-4 md:mb-5 animate-fadeInUp animation-delay-100">
            {/* Large Timer Display */}
            <div className="text-center mb-4 md:mb-6">
              <div className={`
                text-6xl md:text-7xl lg:text-8xl font-black mb-3 md:mb-4 transition-all duration-300
                ${isCritical 
                  ? 'text-red-400 animate-pulse scale-110' 
                  : isUrgent 
                  ? 'text-orange-400' 
                  : 'text-yellow-400'
                }
              `}>
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3 md:h-4 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isCritical 
                      ? 'bg-gradient-to-r from-red-600 to-red-500' 
                      : isUrgent
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Time Status */}
              {isCritical && (
                <p className="text-red-400 text-xs md:text-sm font-bold mt-2 animate-pulse">
                  ⚠️ TIME RUNNING OUT!
                </p>
              )}
              {isUrgent && !isCritical && (
                <p className="text-orange-400 text-xs md:text-sm font-bold mt-2">
                  ⏰ Hurry up!
                </p>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={onTimerEnd}
                className="flex-1 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg md:rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Vote Now</span>
              </button>
              
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-2.5 md:py-3 glass border-2 border-white/20 hover:bg-white/10 text-white font-bold rounded-lg md:rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {isRunning ? (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Players Grid */}
          <div className="glass-yellow rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl mb-4 animate-fadeInUp animation-delay-200">
            <h3 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2">
              <span className="text-xl md:text-2xl">👥</span>
              <span>Alive Players ({alivePlayers.length})</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {alivePlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="glass rounded-lg md:rounded-xl p-2.5 md:p-3 border border-white/10 hover:border-yellow-500/30 transition-all duration-300 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-black text-xs">{index + 1}</span>
                    </div>
                    <p className="text-white font-semibold text-xs md:text-sm truncate">{player.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 animate-fadeInUp animation-delay-300">
            <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg md:text-xl">🎯</span>
                <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Imposters</span>
              </div>
              <div className="text-red-400 font-black text-xl md:text-2xl">
                {players.filter(p => p.role === 'imposter' && p.isAlive).length}
              </div>
            </div>

            <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg md:text-xl">🕵️</span>
                <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Crewmates</span>
              </div>
              <div className="text-yellow-400 font-black text-xl md:text-2xl">
                {players.filter(p => p.role === 'crewmate' && p.isAlive).length}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 animate-fadeInUp animation-delay-400">
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl shrink-0">💡</span>
              <div>
                <h4 className="text-blue-200 font-bold text-xs md:text-sm mb-1">Discussion Tips</h4>
                <ul className="text-blue-200/80 text-[10px] md:text-xs space-y-1 leading-relaxed">
                  <li>• Ask about the secret word</li>
                  <li>• Watch for suspicious behavior</li>
                  <li>• Ready to vote? Click "Vote Now"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Secret Word (Hidden) */}
          <div className="glass-yellow rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-yellow-500/30 animate-fadeInUp animation-delay-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl">🔒</span>
                <span className="text-white font-bold text-xs md:text-sm">Secret Word</span>
              </div>
              <div className="px-3 py-1 bg-yellow-500/20 rounded-lg">
                <span className="text-yellow-400 font-black text-xs md:text-sm">Hidden</span>
              </div>
            </div>
            <p className="text-gray-400 text-[10px] md:text-xs mt-2">
              Only crewmates know the word. Reveal at the end!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameTimer;