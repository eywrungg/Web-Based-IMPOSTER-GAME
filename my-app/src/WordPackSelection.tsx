import { useState } from 'react';
import type { WordPack } from './types';

interface WordPackSelectionProps {
  onSelectPack: (pack: WordPack) => void;
  onBack: () => void;
}

function WordPackSelection({ onSelectPack, onBack }: WordPackSelectionProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Default packs
  const defaultPacks: WordPack[] = [
    {
      id: 'animals',
      name: 'Animals',
      description: 'Creatures from around the world',
      emoji: '🦁',
    },
    {
      id: 'food',
      name: 'Food & Drinks',
      description: 'Delicious items to eat and drink',
      emoji: '🍕',
    },
    {
      id: 'movies',
      name: 'Movies',
      description: 'Famous films and cinema',
      emoji: '🎬',
    },
    {
      id: 'sports',
      name: 'Sports',
      description: 'Games and athletic activities',
      emoji: '⚽',
    },
    {
      id: 'technology',
      name: 'Technology',
      description: 'Gadgets and digital innovations',
      emoji: '💻',
    },
    {
      id: 'countries',
      name: 'Countries',
      description: 'Nations around the globe',
      emoji: '🌍',
    },
  ];

  const handleSelectPack = (pack: WordPack) => {
    setSelectedPack(pack.id);
    setTimeout(() => {
      onSelectPack(pack);
    }, 300);
  };

  const handleGenerateCustom = async () => {
    if (!customTopic.trim()) {
      alert('⚠️ Please enter a topic!');
      return;
    }

    setIsGenerating(true);
    setSelectedPack('custom');
    
    setTimeout(() => {
      const customPack: WordPack = {
        id: `custom-${Date.now()}`,
        name: customTopic,
        description: `Custom topic: ${customTopic}`,
        emoji: '✨',
      };
      onSelectPack(customPack);
    }, 300);
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
        {/* Back Button */}
        <div className="mb-3 md:mb-4 animate-fadeInUp max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6 animate-fadeInUp">
            <div className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-2 md:mb-3">
              <span className="text-yellow-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Step 4</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1.5 md:mb-2 tracking-tight">
              Choose a Word Pack
            </h1>
            <p className="text-gray-400 text-xs md:text-sm">Pick a topic for the secret word</p>
          </div>

          {/* Word Packs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-5 animate-fadeInUp animation-delay-100">
            {defaultPacks.map((pack, index) => (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack)}
                disabled={isGenerating}
                className={`
                  relative group p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm border-2 
                  transition-all duration-300 text-center hover-lift
                  ${selectedPack === pack.id
                    ? 'bg-yellow-500/20 border-yellow-500 scale-105 shadow-lg shadow-yellow-500/30'
                    : 'glass-yellow hover:bg-yellow-500/10 hover:border-yellow-500/50'
                  }
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Emoji Icon */}
                <div className={`
                  text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-3 transition-all duration-500
                  ${selectedPack === pack.id ? 'scale-110 animate-float' : 'scale-100'}
                `}>
                  {pack.emoji}
                </div>

                {/* Pack Name */}
                <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-1">
                  {pack.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-[10px] md:text-xs leading-tight">
                  {pack.description}
                </p>

                {/* Selection Indicator */}
                {selectedPack === pack.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Topic Section */}
          <div className="glass-yellow rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl mb-4 animate-fadeInUp animation-delay-200">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <span className="text-2xl md:text-3xl">✨</span>
              <div className="flex-1">
                <h3 className="text-white font-bold text-sm md:text-base lg:text-lg">Custom Topic</h3>
                <p className="text-gray-400 text-[10px] md:text-xs">
                  AI will generate a unique word
                </p>
              </div>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="px-3 py-1.5 md:px-4 md:py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-yellow-400 text-xs md:text-sm font-semibold">
                  {showCustomInput ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>

            {/* Custom Input (Expandable) */}
            {showCustomInput && (
              <div className="space-y-2 md:space-y-3 animate-fadeInUp">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your topic (e.g., 'Space', 'Ocean', 'Superheroes')"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white/5 border-2 border-white/10 rounded-lg md:rounded-xl text-white placeholder-gray-500 outline-none focus:border-yellow-500 transition-all text-sm md:text-base"
                  disabled={isGenerating}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustom()}
                  maxLength={50}
                />
                
                <button
                  onClick={handleGenerateCustom}
                  disabled={isGenerating || !customTopic.trim()}
                  className="w-full py-2.5 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg md:rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 animate-fadeInUp animation-delay-300">
            {/* How It Works */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl shrink-0">💡</span>
                <div>
                  <h4 className="text-blue-200 font-bold text-xs md:text-sm mb-1">How it works</h4>
                  <p className="text-blue-200/80 text-[10px] md:text-xs leading-relaxed">
                    Crewmates get the word. Imposters get a hint to blend in!
                  </p>
                </div>
              </div>
            </div>

            {/* AI Powered */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl shrink-0">🤖</span>
                <div>
                  <h4 className="text-purple-200 font-bold text-xs md:text-sm mb-1">AI Powered</h4>
                  <p className="text-purple-200/80 text-[10px] md:text-xs leading-relaxed">
                    Gemini 2.0 generates unique words every game
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Packs Badge */}
          <div className="text-center mb-3 animate-fadeInUp animation-delay-400">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 glass-yellow rounded-lg md:rounded-xl">
              <span className="text-lg md:text-xl">🔥</span>
              <span className="text-gray-300 text-[10px] md:text-xs">
                <span className="font-semibold text-yellow-400">Popular:</span> Animals & Food are fan favorites!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordPackSelection;