import { useState } from 'react';
import LandingPage from './LandingPage';
import ModeSelection from './ModeSelection';
import GameConfigComponent from './GameConfig';
import type { GameConfig } from './GameConfig';
import PlayerEntry from './PlayerEntry';
import WordPackSelection from './WordPackSelection';
import RoleAssignment from './RoleAssignment';
import GameTimer from './GameTimer';
import VotingPhase from './VotingPhase';
import type { WordPack, Player } from './types';
import { generateWordFromPack, generateCustomWordPack } from './geminiService';

type Screen = 'landing' | 'mode-selection' | 'game-config' | 'player-entry' | 'word-pack' | 'role-assignment' | 'game-timer' | 'voting' | 'game-over';
type GameMode = 'local' | 'online' | 'ai';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [wordData, setWordData] = useState<{ word: string; description: string; hint: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnterGame = () => {
    setCurrentScreen('mode-selection');
  };

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('game-config');
  };

  const handleConfigContinue = (config: GameConfig) => {
    setGameConfig(config);
    setCurrentScreen('player-entry');
  };

  const handlePlayersContinue = (names: string[]) => {
    setPlayerNames(names);
    setCurrentScreen('word-pack');
  };

  const handlePackSelect = async (pack: WordPack) => {
    setLoading(true);
    
    try {
      // Generate word using Gemini AI
      const data = pack.id.startsWith('custom-')
        ? await generateCustomWordPack(pack.name)
        : await generateWordFromPack(pack);
      
      setWordData({
        word: data.word,
        description: data.description,
        hint: data.imposterHint,
      });
      
      setCurrentScreen('role-assignment');
    } catch (error) {
      console.error('Error generating word:', error);
      alert('Failed to generate word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAssignmentComplete = (assignedPlayers: Player[]) => {
    console.log('Game starting with players:', assignedPlayers);
    console.log('Word:', wordData?.word);
    setPlayers(assignedPlayers);
    setCurrentScreen('game-timer');
  };

  const handleTimerEnd = () => {
    setCurrentScreen('voting');
  };

  const handleVotingComplete = (votedOutPlayer: Player | null) => {
    // Update player status
    if (votedOutPlayer) {
      const updatedPlayers = players.map(p => 
        p.id === votedOutPlayer.id ? { ...p, isAlive: false } : p
      );
      setPlayers(updatedPlayers);
      
      // Check win conditions
      const aliveImposters = updatedPlayers.filter(p => p.role === 'imposter' && p.isAlive);
      const aliveCrewmates = updatedPlayers.filter(p => p.role === 'crewmate' && p.isAlive);
      
      if (aliveImposters.length === 0 || aliveImposters.length >= aliveCrewmates.length) {
        // Game over - someone won
        setCurrentScreen('game-over');
      } else {
        // Continue playing - new round
        setCurrentScreen('game-timer');
      }
    } else {
      // No one eliminated, continue
      setCurrentScreen('game-timer');
    }
  };

  const handleEndGame = () => {
    setCurrentScreen('game-over');
  };

  return (
    <>
      {currentScreen === 'landing' && (
        <LandingPage onEnter={handleEnterGame} />
      )}
      
      {currentScreen === 'mode-selection' && (
        <ModeSelection onSelectMode={handleSelectMode} />
      )}
      
      {currentScreen === 'game-config' && gameMode && (
        <GameConfigComponent 
          onContinue={handleConfigContinue}
          onBack={() => setCurrentScreen('mode-selection')}
        />
      )}
      
      {currentScreen === 'player-entry' && gameConfig && (
        <PlayerEntry 
          config={gameConfig}
          onContinue={handlePlayersContinue}
          onBack={() => setCurrentScreen('game-config')}
        />
      )}
      
      {currentScreen === 'word-pack' && (
        <WordPackSelection
          onSelectPack={handlePackSelect}
          onBack={() => setCurrentScreen('player-entry')}
        />
      )}
      
      {loading && (
        <div className="fixed inset-0 bg-black flex items-center justify-center text-white z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">Generating word with AI...</p>
            <p className="text-sm text-gray-400 mt-2">Using Gemini 2.0 Flash ✨</p>
          </div>
        </div>
      )}
      
      {currentScreen === 'role-assignment' && gameConfig && wordData && (
        <RoleAssignment
          players={playerNames}
          imposterCount={gameConfig.imposterCount}
          word={wordData.word}
          wordDescription={wordData.description}
          imposterHint={wordData.hint}
          onComplete={handleRoleAssignmentComplete}
        />
      )}
      
      {currentScreen === 'game-timer' && gameConfig && wordData && (
        <GameTimer
          players={players}
          discussionTime={gameConfig.discussionTime}
          word={wordData.word}
          onTimerEnd={handleTimerEnd}
        />
      )}
      
      {currentScreen === 'voting' && (
        <VotingPhase
          players={players}
          onVotingComplete={handleVotingComplete}
          onEndGame={handleEndGame}
        />
      )}
      
      {currentScreen === 'game-over' && (
        <div className="fixed inset-0 bg-black overflow-y-auto">
          {/* Animated Background */}
          <div className="fixed inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-orange-500/25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 min-h-screen py-6 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4">🎮 Game Over!</h1>
              </div>
              
              <div className="glass-yellow rounded-2xl p-6 md:p-8 mb-6 shadow-2xl">
                <p className="text-xl md:text-2xl text-white mb-4 text-center">The secret word was:</p>
                <p className="text-4xl md:text-5xl font-black text-yellow-400 mb-4 text-center">{wordData?.word}</p>
                <p className="text-gray-300 italic text-center">"{wordData?.description}"</p>
              </div>

              <div className="glass-yellow rounded-2xl p-6 md:p-8 mb-6 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">Final Results:</h3>
                <div className="space-y-2">
                  {players.map(player => (
                    <div 
                      key={player.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        player.isAlive 
                          ? 'bg-green-500/20 border-2 border-green-500/40' 
                          : 'bg-red-500/20 border-2 border-red-500/40'
                      }`}
                    >
                      <span className="text-white font-semibold">{player.name}</span>
                      <span className="text-white">
                        {player.role === 'imposter' ? '😈 Imposter' : '🕵️ Crewmate'} 
                        {player.isAlive ? ' ✅' : ' ❌'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  // Reset game state
                  setPlayers([]);
                  setPlayerNames([]);
                  setWordData(null);
                  setCurrentScreen('mode-selection');
                }}
                className="w-full px-8 py-4 bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-xl rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-500/30"
              >
                Play Again 🔄
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;