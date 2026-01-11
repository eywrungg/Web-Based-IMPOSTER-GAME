import { useState, useEffect } from 'react';
import type { Player } from './types';

interface VotingPhaseProps {
  players: Player[];
  onVotingComplete: (votedOutPlayer: Player | null) => void;
  onEndGame: () => void;
}

function VotingPhase({ players, onVotingComplete, onEndGame }: VotingPhaseProps) {
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState<string[]>([]);
  const [currentVoter, setCurrentVoter] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const alivePlayers = players.filter(p => p.isAlive);
  const currentPlayer = alivePlayers[currentVoter];

  // Check win condition
  const checkWinCondition = () => {
    const aliveImposters = players.filter(p => p.role === 'imposter' && p.isAlive);
    const aliveCrewmates = players.filter(p => p.role === 'crewmate' && p.isAlive);
    
    if (aliveImposters.length === 0) {
      return { winner: 'crewmates', message: 'Crewmates Win! All imposters eliminated!' };
    } else if (aliveImposters.length >= aliveCrewmates.length) {
      return { winner: 'imposters', message: 'Imposters Win! They outnumber the crewmates!' };
    }
    return null;
  };

  const handleEndGameWithReveal = () => {
    setShowCountdown(true);
    setCountdown(3);
  };

  // Countdown effect
  useEffect(() => {
    if (!showCountdown) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished, show final screen
      setTimeout(() => {
        onEndGame();
      }, 500);
    }
  }, [showCountdown, countdown, onEndGame]);

  const handleVote = (targetPlayerId: string) => {
    if (!currentPlayer) return;

    // Record vote
    setVotes(prev => ({ ...prev, [currentPlayer.id]: targetPlayerId }));
    setHasVoted(prev => [...prev, currentPlayer.id]);

    // Move to next voter or show results
    if (currentVoter < alivePlayers.length - 1) {
      setCurrentVoter(currentVoter + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSkipVote = () => {
    if (!currentPlayer) return;

    // Record skip
    setVotes(prev => ({ ...prev, [currentPlayer.id]: 'skip' }));
    setHasVoted(prev => [...prev, currentPlayer.id]);

    // Move to next voter or show results
    if (currentVoter < alivePlayers.length - 1) {
      setCurrentVoter(currentVoter + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentVoter > 0) {
      // Remove last vote
      const lastVoter = alivePlayers[currentVoter - 1];
      const newVotes = { ...votes };
      delete newVotes[lastVoter.id];
      setVotes(newVotes);
      
      const newHasVoted = hasVoted.filter(id => id !== lastVoter.id);
      setHasVoted(newHasVoted);
      
      setCurrentVoter(currentVoter - 1);
    }
  };

  const calculateResults = () => {
    const voteCounts: Record<string, number> = {};
    let skipCount = 0;

    Object.values(votes).forEach(vote => {
      if (vote === 'skip') {
        skipCount++;
      } else {
        voteCounts[vote] = (voteCounts[vote] || 0) + 1;
      }
    });

    // Find player with most votes
    let maxVotes = 0;
    let votedOutPlayerId: string | null = null;
    let isTie = false;

    Object.entries(voteCounts).forEach(([playerId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        votedOutPlayerId = playerId;
        isTie = false;
      } else if (count === maxVotes && count > 0) {
        isTie = true;
      }
    });

    if (isTie || maxVotes === 0) {
      return null; // No one voted out
    }

    return players.find(p => p.id === votedOutPlayerId) || null;
  };

  const handleConfirmResults = () => {
    const votedOut = calculateResults();
    onVotingComplete(votedOut);
  };

  // Countdown Reveal Screen
  if (showCountdown) {
    const winCondition = checkWinCondition();
    const imposters = players.filter(p => p.role === 'imposter');

    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-500/25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
          <div className="text-center">
            {countdown > 0 ? (
              <>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-pulse">
                  Revealing in...
                </h1>
                <div className="text-9xl md:text-[12rem] font-black text-yellow-400 mb-8 animate-scaleIn">
                  {countdown}
                </div>
              </>
            ) : (
              <>
                <div className="animate-fadeInUp">
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-8">
                    {winCondition ? winCondition.message : 'Game Over!'}
                  </h1>
                  
                  <div className="glass-yellow rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-2xl mx-auto mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-red-400 mb-6">
                      😈 The Imposter{imposters.length > 1 ? 's were' : ' was'}:
                    </h2>
                    <div className="space-y-3">
                      {imposters.map((imposter, index) => (
                        <div 
                          key={imposter.id}
                          className="bg-red-500/20 border-2 border-red-500/40 rounded-xl p-4 animate-fadeInUp"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          <p className="text-white text-2xl md:text-3xl font-black">
                            {imposter.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {winCondition && (
                    <div className={`
                      text-xl md:text-2xl font-bold p-4 rounded-xl mb-4
                      ${winCondition.winner === 'imposters' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                      }
                    `}>
                      {winCondition.winner === 'imposters' ? '😈 Imposters Win!' : '🕵️ Crewmates Win!'}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const voteCounts: Record<string, number> = {};
    let skipCount = 0;

    Object.values(votes).forEach(vote => {
      if (vote === 'skip') {
        skipCount++;
      } else {
        voteCounts[vote] = (voteCounts[vote] || 0) + 1;
      }
    });

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
                <span className="text-yellow-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Voting Results</span>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1.5 md:mb-2 tracking-tight">
                📊 The Votes Are In
              </h1>
              <p className="text-gray-400 text-xs md:text-sm">See who the group suspects</p>
            </div>

            {/* Results Card - Scrollable */}
            <div className="glass-yellow rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl mb-4 max-h-[50vh] overflow-y-auto custom-scrollbar animate-fadeInUp animation-delay-100">
              {/* Vote Breakdown */}
              <div className="space-y-2 md:space-y-3">
                {alivePlayers.map((player, index) => {
                  const voteCount = voteCounts[player.id] || 0;
                  const percentage = alivePlayers.length > 0 
                    ? (voteCount / alivePlayers.length) * 100 
                    : 0;

                  return (
                    <div 
                      key={player.id} 
                      className="glass rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10 animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm md:text-base">{player.name}</span>
                        <span className={`font-black text-base md:text-lg ${
                          voteCount > 0 ? 'text-red-400' : 'text-gray-500'
                        }`}>
                          {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>
                      <div className="w-full h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}

                {/* Skip votes */}
                {skipCount > 0 && (
                  <div className="glass rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm md:text-base">⏭️ Skipped</span>
                      <span className="text-gray-400 font-black text-base md:text-lg">
                        {skipCount} {skipCount === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                    <div className="w-full h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-500"
                        style={{ width: `${(skipCount / alivePlayers.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Result Announcement - Outside scroll area */}
            <div className={`
              text-center p-4 md:p-6 rounded-xl md:rounded-2xl mb-4 animate-fadeInUp animation-delay-200
              ${results 
                ? 'bg-red-500/20 border-2 border-red-500/40' 
                : 'bg-gray-500/20 border-2 border-gray-500/40'
              }
            `}>
              {results ? (
                <>
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">☠️</div>
                  <p className="text-white text-xl md:text-2xl font-black mb-2">
                    {results.name} was eliminated!
                  </p>
                  <p className="text-gray-300 text-sm md:text-base">
                    They were {results.role === 'imposter' ? 'an' : 'a'}{' '}
                    <span className={`font-bold ${
                      results.role === 'imposter' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {results.role === 'imposter' ? 'IMPOSTER! 😈' : 'CREWMATE 🕵️'}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">🤷</div>
                  <p className="text-white text-xl md:text-2xl font-black mb-2">
                    No one was eliminated
                  </p>
                  <p className="text-gray-300 text-sm md:text-base">
                    It was a tie or everyone skipped!
                  </p>
                </>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 animate-fadeInUp animation-delay-300">
              <p className="text-purple-200 text-xs md:text-sm text-center leading-relaxed">
                <span className="font-bold">Continue Playing:</span> Start a new discussion round
                <br />
                <span className="font-bold">End Game:</span> Reveal all roles and finish
              </p>
            </div>

            {/* Action Buttons - Always visible */}
            <div className="flex gap-2 md:gap-3 animate-fadeInUp animation-delay-400">
              <button
                onClick={handleConfirmResults}
                className="flex-1 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black text-sm md:text-base rounded-lg md:rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Continue</span>
              </button>
              <button
                onClick={handleEndGameWithReveal}
                className="flex-1 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-sm md:text-base rounded-lg md:rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>End Game</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentVoter + 1) / alivePlayers.length) * 100;

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
          {/* Back Button */}
          {currentVoter > 0 && (
            <div className="mb-3 md:mb-4 animate-fadeInUp">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 glass-yellow rounded-lg md:rounded-xl hover-lift transition-all duration-300 group"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-white font-semibold text-xs md:text-sm">Back</span>
              </button>
            </div>
          )}
          
          {/* Progress */}
          <div className="mb-4 md:mb-6 animate-fadeInUp">
            <div className="flex justify-between text-xs md:text-sm text-gray-300 mb-2">
              <span className="font-semibold">Voting Progress</span>
              <span className="font-bold">
                <span className="text-yellow-400">{currentVoter + 1}</span> / {alivePlayers.length}
              </span>
            </div>
            <div className="w-full h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Voter Header */}
          <div className="text-center mb-6 md:mb-8 animate-fadeInUp animation-delay-100">
            <div className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-2 md:mb-3">
              <span className="text-yellow-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Your Turn</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-2xl">
              {currentPlayer?.name}
            </h2>
            <p className="text-gray-400 text-xs md:text-sm">Cast your vote!</p>
          </div>

          {/* Voting Card */}
          <div className="glass-yellow rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl mb-4 animate-fadeInUp animation-delay-200">
            <h3 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 text-center">
              Who do you think is the imposter?
            </h3>

            {/* Player Vote Buttons */}
            <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5 max-h-[40vh] overflow-y-auto custom-scrollbar">
              {alivePlayers
                .filter(p => p.id !== currentPlayer?.id)
                .map((player, index) => (
                  <button
                    key={player.id}
                    onClick={() => handleVote(player.id)}
                    className="w-full p-3 md:p-4 glass hover:bg-red-500/20 border-2 border-white/10 hover:border-red-500/50 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-[1.02] text-left group animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-sm md:text-base">{player.name}</span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkipVote}
              className="w-full p-3 md:p-4 glass hover:bg-white/10 border-2 border-white/10 rounded-lg md:rounded-xl transition-all duration-300 text-center"
            >
              <span className="text-gray-300 font-bold text-sm md:text-base">⏭️ Skip Vote</span>
            </button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg md:rounded-xl p-3 md:p-4 animate-fadeInUp animation-delay-300">
            <p className="text-yellow-200 text-[10px] md:text-xs text-center leading-relaxed">
              ⚠️ <span className="font-bold">Others:</span> Look away while {currentPlayer?.name} votes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotingPhase;