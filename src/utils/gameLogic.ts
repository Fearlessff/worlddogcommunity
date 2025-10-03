import { v4 as uuidv4 } from 'uuid';
import { GameBoard, Player, GameHistory, BotDifficulty } from '../types/game';

// All possible winning lines
export const WINNING_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal \
  [2, 4, 6]  // diagonal /
];

// Check if there's a winner
export const checkWinner = (board: GameBoard): { winner: Player | null, line: number[] | null } => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        line: line
      };
    }
  }
  return { winner: null, line: null };
};

// Check if the board is full (draw)
export const isBoardFull = (board: GameBoard): boolean => {
  return board.every(cell => cell !== null);
};

// Create a new game history entry
export const createGameHistory = (
  playerX: string,
  playerO: string,
  winner: Player | null,
  mode: 'bot' | 'human',
  botDifficulty?: BotDifficulty
): GameHistory => {
  return {
    id: uuidv4(),
    date: new Date(),
    playerX,
    playerO,
    winner: winner ? winner : 'draw',
    mode,
    botDifficulty
  };
};

// Get all empty cells
const getEmptyCells = (board: GameBoard): number[] => {
  return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
};

// Check if a move would result in a win
const isWinningMove = (board: GameBoard, player: Player, move: number): boolean => {
  const boardCopy = [...board];
  boardCopy[move] = player;
  const { winner } = checkWinner(boardCopy);
  return winner === player;
};

// Bot AI for different difficulty levels
export const getBotMove = (board: GameBoard, difficulty: BotDifficulty, botPlayer: Player): number => {
  const availableMoves = getEmptyCells(board);
  const humanPlayer = botPlayer === 'X' ? 'O' : 'X';
  
  if (availableMoves.length === 0) return -1;

  // Easy - 70% random, 30% smart moves
  if (difficulty === 'easy') {
    if (Math.random() > 0.7) {
      // Try to win or block
      for (const move of availableMoves) {
        if (isWinningMove(board, botPlayer, move)) return move;
        if (isWinningMove(board, humanPlayer, move)) return move;
      }
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  
  // Medium - Strategic play with occasional mistakes
  if (difficulty === 'medium') {
    if (Math.random() > 0.2) { // 80% chance of playing optimally
      // Try to win
      for (const move of availableMoves) {
        if (isWinningMove(board, botPlayer, move)) return move;
      }
      
      // Block opponent
      for (const move of availableMoves) {
        if (isWinningMove(board, humanPlayer, move)) return move;
      }
      
      // Take center if available
      if (availableMoves.includes(4)) return 4;
      
      // Take opposite corner of opponent's move
      const corners = [0, 2, 6, 8];
      const oppositeCorners = [[0, 8], [2, 6]];
      
      for (const [c1, c2] of oppositeCorners) {
        if (board[c1] === humanPlayer && availableMoves.includes(c2)) return c2;
        if (board[c2] === humanPlayer && availableMoves.includes(c1)) return c1;
      }
      
      // Take any available corner
      const availableCorners = corners.filter(corner => availableMoves.includes(corner));
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    }
    
    // Random move (simulating mistake)
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  
  // Hard - Minimax with alpha-beta pruning
  if (difficulty === 'hard') {
    return minimaxMove(board, botPlayer);
  }
  
  return availableMoves[0];
};

// Minimax algorithm with alpha-beta pruning for unbeatable AI
const minimaxMove = (board: GameBoard, botPlayer: Player): number => {
  const humanPlayer = botPlayer === 'X' ? 'O' : 'X';
  const availableMoves = getEmptyCells(board);
  
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];
  let alpha = -Infinity;
  let beta = Infinity;
  
  for (const move of availableMoves) {
    const boardCopy = [...board];
    boardCopy[move] = botPlayer;
    
    const score = minimax(boardCopy, 0, false, botPlayer, humanPlayer, alpha, beta);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    
    alpha = Math.max(alpha, bestScore);
    if (beta <= alpha) break;
  }
  
  return bestMove;
};

const minimax = (
  board: GameBoard,
  depth: number,
  isMaximizing: boolean,
  botPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): number => {
  const { winner } = checkWinner(board);
  
  // Terminal states with depth consideration
  if (winner === botPlayer) return 10 - depth;
  if (winner === humanPlayer) return depth - 10;
  if (isBoardFull(board)) return 0;
  
  const availableMoves = getEmptyCells(board);
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = botPlayer;
      const score = minimax(boardCopy, depth + 1, false, botPlayer, humanPlayer, alpha, beta);
      maxScore = Math.max(score, maxScore);
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = humanPlayer;
      const score = minimax(boardCopy, depth + 1, true, botPlayer, humanPlayer, alpha, beta);
      minScore = Math.min(score, minScore);
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return minScore;
  }
};

// Helper to get a name for the bot based on difficulty
export const getBotName = (difficulty: BotDifficulty): string => {
  switch (difficulty) {
    case 'easy':
      return 'NoviceBot';
    case 'medium':
      return 'TacticalBot';
    case 'hard':
      return 'MasterBot';
    default:
      return 'Bot';
  }
};