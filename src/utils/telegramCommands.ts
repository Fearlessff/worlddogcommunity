import { GameState, TelegramUser, BotDifficulty } from '../types/game';

export const handleStartCommand = (chatId: number, fromUser: TelegramUser): Partial<GameState> => {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
    winningLine: null,
    mode: 'human',
    telegramChat: {
      id: chatId,
      type: 'group'
    },
    players: {
      X: fromUser
    },
    moveCount: 0
  };
};

export const handleBotCommand = (
  chatId: number, 
  fromUser: TelegramUser, 
  difficulty: BotDifficulty = 'medium'
): Partial<GameState> => {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
    winningLine: null,
    mode: 'bot',
    botDifficulty: difficulty,
    telegramChat: {
      id: chatId,
      type: 'group'
    },
    players: {
      X: fromUser
    },
    moveCount: 0
  };
};

export const handleVsCommand = (
  chatId: number,
  fromUser: TelegramUser,
  opponent: TelegramUser
): Partial<GameState> => {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
    winningLine: null,
    mode: 'human',
    telegramChat: {
      id: chatId,
      type: 'group'
    },
    players: {
      X: fromUser,
      O: opponent
    },
    moveCount: 0
  };
};

export const parseCommand = (text: string): { command: string; args: string[] } => {
  const parts = text.split(' ').filter(Boolean);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  return { command, args };
};