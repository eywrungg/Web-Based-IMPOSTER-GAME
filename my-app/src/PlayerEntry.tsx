import { useState } from 'react';
import type { GameConfig } from './GameConfig';

interface PlayerEntryProps {
  config: GameConfig;
  onContinue: (playerNames: string[]) => void;
  onBack: () => void;
}

function PlayerEntry({ config, onContinue, onBack }: PlayerEntryProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(config.playerCount).fill('').map((_, i) => `Player ${i + 1}`)
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleQuickFill = () => {
    const names = Array(config.playerCount).fill('').map((_, i) => `Player ${i + 1}`);
    setPlayerNames(names);
  };

  const handleRandomNames = () => {
    const funNames = [
      'Shadow', 'Ghost', 'Phoenix', 'Dragon', 'Wolf', 'Tiger', 'Eagle', 'Hawk',
      'Lion', 'Bear', 'Fox', 'Raven', 'Viper', 'Cobra', 'Ninja', 'Samurai',
      'Knight', 'Warrior', 'Hunter', 'Ranger', 'Scout', 'Spy', 'Agent', 'Ace',
      'Blade', 'Storm', 'Thunder', 'Lightning', 'Frost', 'Blaze', 'Meteor', 'Nova'
    ];
    
    const shuffled = [...funNames].sort(() => Math.random() - 0.5);
    const names = shuffled.slice(0, config.playerCount);
    setPlayerNames(names);
  };

  const handleContinue = () => {
    // Check for empty names
    const emptyNames = playerNames.filter(name => !name.trim());
    if (emptyNames.length > 0) {
      alert('⚠️ Please enter all player names!');
      return;
    }

    // Check for duplicate names
    const trimmedNames = playerNames.map(n => n.trim().toLowerCase());
    const uniqueNames = new Set(trimmedNames);
    if (uniqueNames.size !== playerNames.length) {
      alert('⚠️ Player names must be unique!');
      return;
    }

    onContinue(playerNames);
  };

  const filledCount = playerNames.filter(n => n.trim()).length;
  const progress = (filledCount / config.playerCount) * 100;

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
        {/* Back Button */}
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
              <span className="text-yellow-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Step 3</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1.5 md:mb-2 tracking-tight">
              Enter Player Names
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">
              {config.playerCount} players ready to play
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 md:mb-5 animate-fadeInUp animation-delay-100">
            <div className="flex justify-between text-xs md:text-sm text-gray-300 mb-2">
              <span className="font-semibold">Progress</span>
              <span className="font-bold">
                <span className="text-yellow-400">{filledCount}</span> / {config.playerCount}
              </span>
            </div>
            <div className="w-full h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 mb-4 md:mb-5 animate-fadeInUp animation-delay-200">
            <button
              onClick={handleQuickFill}
              className="flex-1 px-3 py-2 md:px-4 md:py-2.5 glass-yellow rounded-lg md:rounded-xl hover-lift transition-all duration-300 group"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-white font-semibold text-xs md:text-sm">Default Names</span>
              </div>
            </button>
            
            <button
              onClick={handleRandomNames}
              className="flex-1 px-3 py-2 md:px-4 md:py-2.5 glass-yellow rounded-lg md:rounded-xl hover-lift transition-all duration-300 group"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-white font-semibold text-xs md:text-sm">Random Names</span>
              </div>
            </button>
          </div>

          {/* Player Cards */}
          <div className="glass-yellow rounded-xl md:rounded-2xl p-3 md:p-5 shadow-2xl mb-4 animate-fadeInUp animation-delay-300">
            <div className="space-y-2 md:space-y-2.5 max-h-100 md:max-h-112.5 overflow-y-auto custom-scrollbar pr-1">
              {playerNames.map((name, index) => (
                <div
                  key={index}
                  className={`
                    relative flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl border-2 transition-all duration-300
                    ${editingIndex === index
                      ? 'bg-yellow-500/20 border-yellow-500 shadow-lg shadow-yellow-500/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Player Number Badge */}
                  <div className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-black font-black text-xs md:text-sm">{index + 1}</span>
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    onFocus={() => setEditingIndex(index)}
                    onBlur={() => setEditingIndex(null)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none font-semibold text-sm md:text-base"
                    maxLength={20}
                  />

                  {/* Status Indicator */}
                  {name.trim() && (
                    <div className="shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 animate-fadeInUp animation-delay-400">
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl shrink-0">💡</span>
              <div>
                <p className="text-blue-200 text-xs md:text-sm">
                  <span className="font-bold">Pro Tip:</span> Remember your player number for the role reveal phase!
                </p>
              </div>
            </div>
          </div>

          {/* Game Info Summary */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 animate-fadeInUp animation-delay-500">
            <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-white/10">
              <div className="text-yellow-400 font-black text-xl md:text-2xl mb-1">{config.playerCount}</div>
              <div className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Total Players</div>
            </div>
            <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 text-center border border-white/10">
              <div className="text-red-400 font-black text-xl md:text-2xl mb-1">{config.imposterCount}</div>
              <div className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">Imposters</div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={filledCount !== config.playerCount}
            className="w-full py-2.5 md:py-3 bg-linear-to-r from-yellow-400 to-orange-500 rounded-lg md:rounded-xl font-black text-sm md:text-base text-black uppercase tracking-wide hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-fadeInUp animation-delay-600"
          >
            <span>Continue</span>
            <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Helper Text */}
          <div className="text-center mt-3 pb-3 animate-fadeInUp animation-delay-700">
            <p className="text-gray-500 text-[10px] md:text-xs">
              Names must be unique and not empty
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerEntry;