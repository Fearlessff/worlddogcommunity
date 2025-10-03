export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type GameBoard = CellValue[];
export type GameStatus = 'playing' | 'won' | 'draw';
export type GameMode = 'bot' | 'human';
export type BotDifficulty = 'easy' | 'medium' | 'hard';

export interface TelegramUser {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
}

export interface GameState {
  board: GameBoard;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
  mode: GameMode;
  botDifficulty: BotDifficulty;
  playerXName: string;
  playerOName: string;
  scores: {
    [key: string]: number;
  };
  history: GameHistory[];
  moveCount: number;
  telegramChat?: TelegramChat;
  players?: {
    X?: TelegramUser;
    O?: TelegramUser;
  };
}

export interface GameHistory {
  id: string;
  date: Date;
  playerX: string;
  playerO: string;
  winner: string | 'draw';
  mode: GameMode;
  botDifficulty?: BotDifficulty;
  chatId?: number;
}

export interface LeaderboardEntry {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  score: number;
}

export interface GameContextType {
  gameState: GameState;
  startGame: (mode: GameMode, botDifficulty?: BotDifficulty) => void;
  makeMove: (index: number) => void;
  resetGame: () => void;
  setPlayerNames: (playerX: string, playerO: string) => void;
  leaderboard: LeaderboardEntry[];
  handleTelegramCommand: (command: string, chatId: number, fromUser: TelegramUser, args?: string[]) => boolean;
}