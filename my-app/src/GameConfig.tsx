import { useState } from 'react';

export interface GameConfig {
  playerCount: number;
  imposterCount: number;
  discussionTime: number;
  taskCount: number;
}

interface GameConfigProps {
  onContinue: (config: GameConfig) => void;
  onBack: () => void;
}

function GameConfigComponent({ onContinue, onBack }: GameConfigProps) {
  const [config, setConfig] = useState<GameConfig>({
    playerCount: 6,
    imposterCount: 1,
    discussionTime: 120,
    taskCount: 5,
  });

  const discussionTimeOptions = [
    { value: 60, label: '1 min', recommended: false },
    { value: 90, label: '1.5 min', recommended: false },
    { value: 120, label: '2 min', recommended: true },
    { value: 180, label: '3 min', recommended: false },
    { value: 240, label: '4 min', recommended: false },
    { value: 300, label: '5 min', recommended: false },
  ];

  // Calculate max imposters: at most half of players (rounded down), max 12
  const getMaxImposters = (playerCount: number) => {
    return Math.min(12, Math.floor((playerCount - 1) / 2));
  };

  const maxImposters = getMaxImposters(config.playerCount);

  const handleContinue = () => {
    if (config.imposterCount >= config.playerCount) {
      alert('⚠️ Imposter count must be less than player count!');
      return;
    }
    if (config.imposterCount > maxImposters) {
      alert(`⚠️ Maximum ${maxImposters} imposters for ${config.playerCount} players!`);
      return;
    }
    onContinue(config);
  };

  const incrementPlayers = () => {
    if (config.playerCount < 25) {
      setConfig({ ...config, playerCount: config.playerCount + 1 });
    }
  };

  const decrementPlayers = () => {
    if (config.playerCount > 4) {
      const newPlayerCount = config.playerCount - 1;
      const newMaxImposters = getMaxImposters(newPlayerCount);
      setConfig({
        ...config,
        playerCount: newPlayerCount,
        imposterCount: Math.min(config.imposterCount, newMaxImposters),
      });
    }
  };

  const incrementImposters = () => {
    if (config.imposterCount < maxImposters) {
      setConfig({ ...config, imposterCount: config.imposterCount + 1 });
    }
  };

  const decrementImposters = () => {
    if (config.imposterCount > 1) {
      setConfig({ ...config, imposterCount: config.imposterCount - 1 });
    }
  };

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
        {/* Back Button - Top Left */}
        <div className="mb-3 md:mb-4 animate-fadeInUp max-w-xl lg:max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 glass-yellow rounded-lg md:rounded-xl hover-lift transition-all duration-300 group"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-white font-semibold text-xs md:text-sm">Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-xl lg:max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6 animate-fadeInUp">
            <div className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-2 md:mb-3">
              <span className="text-yellow-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Step 2</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1.5 md:mb-2 tracking-tight">
              Game Configuration
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">Customize your game settings</p>
          </div>

          {/* Config Card */}
          <div className="glass-yellow rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-6 shadow-2xl animate-fadeInUp animation-delay-100 mb-3">
            {/* Player Count */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center justify-between gap-2 mb-2 md:mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl md:text-2xl flex-shrink-0">👥</span>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-xs md:text-sm lg:text-base truncate">Players</h3>
                    <p className="text-gray-400 text-[10px] md:text-xs">4-25</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                  <button
                    onClick={decrementPlayers}
                    disabled={config.playerCount <= 4}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border-2 border-white/10 hover:border-yellow-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <div className="w-12 md:w-14 h-8 md:h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-black font-black text-lg md:text-xl">{config.playerCount}</span>
                  </div>
                  
                  <button
                    onClick={incrementPlayers}
                    disabled={config.playerCount >= 25}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border-2 border-white/10 hover:border-yellow-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Imposter Count */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center justify-between gap-2 mb-2 md:mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl md:text-2xl flex-shrink-0">😈</span>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-xs md:text-sm lg:text-base truncate">Imposters</h3>
                    <p className="text-gray-400 text-[10px] md:text-xs">1-{maxImposters} max</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                  <button
                    onClick={decrementImposters}
                    disabled={config.imposterCount <= 1}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border-2 border-white/10 hover:border-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <div className="w-12 md:w-14 h-8 md:h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <span className="text-white font-black text-lg md:text-xl">{config.imposterCount}</span>
                  </div>
                  
                  <button
                    onClick={incrementImposters}
                    disabled={config.imposterCount >= maxImposters}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border-2 border-white/10 hover:border-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Discussion Time */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="text-xl md:text-2xl">⏱️</span>
                <div>
                  <h3 className="text-white font-bold text-xs md:text-sm lg:text-base">Discussion Time</h3>
                  <p className="text-gray-400 text-[10px] md:text-xs">Time per round</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                {discussionTimeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setConfig({ ...config, discussionTime: option.value })}
                    className={`
                      relative p-2 md:p-3 rounded-lg transition-all duration-300 hover:scale-105
                      ${config.discussionTime === option.value
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-yellow-300'
                        : 'glass border-2 border-white/10 hover:border-yellow-500/30'
                      }
                    `}
                  >
                    {option.recommended && (
                      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 rounded-full">
                        <span className="text-white text-[8px] md:text-[9px] font-bold uppercase">Best</span>
                      </div>
                    )}
                    <div className={`font-black text-sm md:text-base ${
                      config.discussionTime === option.value ? 'text-black' : 'text-white'
                    }`}>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Game Summary */}
            <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4 border-2 border-yellow-500/20">
              <h3 className="text-yellow-400 font-bold text-xs md:text-sm mb-2 md:mb-3 flex items-center gap-2">
                <span>📋</span>
                <span>Summary</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="text-center">
                  <div className="text-yellow-400 font-black text-xl md:text-2xl mb-0.5">{config.playerCount}</div>
                  <div className="text-gray-400 text-[9px] md:text-[10px]">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-black text-xl md:text-2xl mb-0.5">{config.imposterCount}</div>
                  <div className="text-gray-400 text-[9px] md:text-[10px]">Imposters</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-black text-xl md:text-2xl mb-0.5">{config.discussionTime}s</div>
                  <div className="text-gray-400 text-[9px] md:text-[10px]">Time</div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full py-2.5 md:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg md:rounded-xl font-black text-sm md:text-base text-black uppercase tracking-wide hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50 flex items-center justify-center gap-2 group"
            >
              <span>Continue</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Helper Tip */}
          <div className="text-center animate-fadeInUp animation-delay-200 pb-3">
            <div className="inline-flex items-center gap-2 px-3 py-2 glass-yellow rounded-lg md:rounded-xl">
              <span className="text-lg md:text-xl">💡</span>
              <span className="text-gray-300 text-[10px] md:text-xs">
                <span className="font-semibold text-yellow-400">Tip:</span> More imposters = harder game!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameConfigComponent;