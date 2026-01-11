export interface Player {
  id: string;
  name: string;
  role: 'crewmate' | 'imposter';
  isAlive: boolean;
  hasVoted: boolean;
  tasksCompleted: number;
  totalTasks: number;
}

export interface WordPack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  words?: string[];
}

export interface GameSession {
  word: string;
  wordDescription: string;
  imposterHint: string;
  players: Player[];
  config: {
    playerCount: number;
    imposterCount: number;
    discussionTime: number;
    taskCount: number;
  };
  currentRound: number;
  phase: 'setup' | 'playing' | 'discussion' | 'voting' | 'ended';
}