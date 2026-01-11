import { useState } from 'react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'local' | 'online' | 'ai') => void;
}

function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const modes = [
    {
      id: 'local',
      title: 'Local Game',
      subtitle: 'Pass & Play',
      description: 'Play with friends on the same device. Perfect for gatherings!',
      icon: '👥',
      available: true,
    },
    {
      id: 'online',
      title: 'Online Multiplayer',
      subtitle: 'Coming Soon',
      description: 'Play with friends online in real-time. Create or join rooms!',
      icon: '🌐',
      available: false,
    },
    {
      id: 'ai',
      title: 'AI Powered',
      subtitle: 'Play vs AI',
      description: 'Experience dynamic AI-powered gameplay with intelligent bots!',
      icon: '🤖',
      available: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-500/25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
            <div className="inline-block px-4 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-4">
              <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">Step 1</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Select Game Mode
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">Choose how you want to play</p>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {modes.map((mode, index) => (
              <button
                key={mode.id}
                onClick={() => mode.available && onSelectMode(mode.id as 'local' | 'online' | 'ai')}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                disabled={!mode.available}
                className={`
                  relative group p-8 md:p-10 rounded-3xl text-left
                  transition-all duration-500 animate-fadeInUp
                  ${mode.available 
                    ? 'glass-yellow hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/30 cursor-pointer' 
                    : 'glass opacity-40 cursor-not-allowed'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Coming Soon Badge */}
                {!mode.available && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
                    <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Soon</span>
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  text-6xl md:text-7xl mb-6 transition-all duration-500
                  ${hoveredMode === mode.id ? 'scale-110 animate-float' : 'scale-100'}
                `}>
                  {mode.icon}
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                  {mode.title}
                </h2>
                <p className="text-yellow-400 font-semibold text-sm md:text-base mb-4 uppercase tracking-wide">
                  {mode.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {mode.description}
                </p>

                {/* Hover Indicator */}
                {mode.available && (
                  <div className="mt-6 flex items-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-semibold text-sm">Select Mode</span>
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                {/* Glow Effect on Hover */}
                {mode.available && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all duration-500 -z-10"></div>
                )}
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 text-center animate-fadeInUp animation-delay-300">
            <div className="inline-flex items-center gap-3 px-6 py-4 glass-yellow rounded-2xl">
              <span className="text-2xl">💡</span>
              <span className="text-gray-300 text-sm md:text-base">
                <span className="font-semibold text-yellow-400">Tip:</span> Start with Local Game for instant fun!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModeSelection;