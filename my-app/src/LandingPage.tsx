import { useState } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

function LandingPage({ onEnter }: LandingPageProps) {
  const [isEntering, setIsEntering] = useState(false);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated Yellow Blobs Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-500/25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
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

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 md:p-8">
        {!isEntering ? (
          <>
            {/* Logo/Badge */}
            <div className="mb-8 md:mb-12 animate-fadeInUp">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse-glow"></div>
                <div className="relative px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <span className="text-black font-bold text-sm md:text-base uppercase tracking-wider">
                    Social Deduction Game
                  </span>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center mb-8 md:mb-12 animate-fadeInUp animation-delay-100">
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-white mb-4 tracking-tighter leading-none">
                <span className="inline-block hover:animate-shake cursor-default">I</span>
                <span className="inline-block hover:animate-shake cursor-default">M</span>
                <span className="inline-block hover:animate-shake cursor-default">P</span>
                <span className="inline-block hover:animate-shake cursor-default">O</span>
                <span className="inline-block hover:animate-shake cursor-default">S</span>
                <span className="inline-block hover:animate-shake cursor-default">T</span>
                <span className="inline-block hover:animate-shake cursor-default">E</span>
                <span className="inline-block hover:animate-shake cursor-default">R</span>
              </h1>
              
              {/* Subtitle */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[2px] w-12 md:w-20 bg-gradient-to-r from-transparent via-yellow-500 to-yellow-500"></div>
                <p className="text-xl md:text-2xl text-yellow-400 font-semibold tracking-wide uppercase">
                  Who Can You Trust?
                </p>
                <div className="h-[2px] w-12 md:w-20 bg-gradient-to-l from-transparent via-yellow-500 to-yellow-500"></div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto">
                Lie, deceive, and expose the truth in this thrilling social game
              </p>
            </div>

            {/* CTA Button */}
            <div className="animate-fadeInUp animation-delay-200 mb-8 md:mb-12">
              <button
                onClick={handleEnter}
                className="group relative px-12 md:px-16 py-5 md:py-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                <span className="relative z-10 text-black font-black text-xl md:text-2xl uppercase tracking-wide flex items-center gap-3">
                  Enter Game
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

       

            {/* Developer Credit */}
            <div className="absolute bottom-8 left-0 right-0 animate-fadeInUp animation-delay-400">
              <div className="text-center">
                <p className="text-gray-600 text-sm md:text-base flex items-center justify-center gap-2 flex-wrap px-4">
                  <span>Developed by</span>
                  <span className="text-gradient-yellow font-bold text-base md:text-lg">EIRUN</span>
                  
                </p>
              </div>
            </div>
          </>
        ) : (
          // Loading State
          <div className="text-center animate-scaleIn">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-xl md:text-2xl font-bold mb-2">Loading Game...</p>
            <p className="text-yellow-400 text-sm">Preparing your experience</p>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 w-20 h-20 border-2 border-yellow-500/20 rounded-full animate-rotate hidden md:block"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-yellow-500/20 rounded-lg animate-float hidden md:block"></div>
    </div>
  );
}

export default LandingPage;