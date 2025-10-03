import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GameState, 
  GameContextType, 
  Player, 
  GameMode, 
  BotDifficulty, 
  LeaderboardEntry,
  GameHistory,
  TelegramUser,
  TelegramChat
} from '../types/game';
import { 
  checkWinner, 
  isBoardFull, 
  createGameHistory, 
  getBotMove,
  getBotName
} from '../utils/gameLogic';
import {
  handleStartCommand,
  handleBotCommand,
  handleVsCommand,
  parseCommand
} from '../utils/telegramCommands';
import { 
  saveGameHistory, 
  loadGameHistory, 
  savePlayerScores, 
  loadPlayerScores,
  generateLeaderboard
} from '../utils/storage';
import { useGameSounds } from '../hooks/useGameSounds';

const initialGameState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  status: 'playing',
  winner: null,
  winningLine: null,
  mode: 'human',
  botDifficulty: 'medium',
  playerXName: 'Player X',
  playerOName: 'Player O',
  scores: {},
  history: [],
  moveCount: 0
};

const GameContext = createContext<GameContextType>({
  gameState: initialGameState,
  startGame: () => {},
  makeMove: () => {},
  resetGame: () => {},
  setPlayerNames: () => {},
  leaderboard: [],
  handleTelegramCommand: () => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...initialGameState,
    scores: loadPlayerScores(),
    history: loadGameHistory()
  }));
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const { playMove, playWin, playDraw, playBotMove, playClick, playError } = useGameSounds();

  useEffect(() => {
    const newLeaderboard = generateLeaderboard(gameState.history, gameState.scores);
    setLeaderboard(newLeaderboard);
  }, [gameState.history, gameState.scores]);

  const handleTelegramCommand = (
    command: string,
    chatId: number,
    fromUser: TelegramUser,
    args: string[] = []
  ) => {
    try {
      let newState: Partial<GameState>;

      switch (command) {
        case '/start':
          newState = handleStartCommand(chatId, fromUser);
          break;

        case '/bot':
          const difficulty = (args[0]?.toLowerCase() || 'medium') as BotDifficulty;
          if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            throw new Error('Invalid difficulty level. Use: easy, medium, or hard');
          }
          newState = handleBotCommand(chatId, fromUser, difficulty);
          break;

        case '/vs':
          if (!args[0]) {
            throw new Error('Please mention a user to challenge');
          }
          // In a real implementation, you would resolve the username to a TelegramUser
          const opponent: TelegramUser = {
            id: Math.random(),
            first_name: args[0].replace('@', '')
          };
          newState = handleVsCommand(chatId, fromUser, opponent);
          break;

        default:
          throw new Error('Unknown command');
      }

      setGameState(prev => ({
        ...prev,
        ...newState,
        playerXName: fromUser.first_name,
        playerOName: newState.mode === 'bot' ? getBotName(newState.botDifficulty!) : 
          (newState.players?.O?.first_name || 'Player O')
      }));

      playClick();
      return true;
    } catch (error) {
      console.error('Error handling command:', error);
      playError();
      return false;
    }
  };

  const startGame = (mode: GameMode, botDifficulty: BotDifficulty = 'medium') => {
    playClick();
    setGameState(prev => ({
      ...initialGameState,
      mode,
      botDifficulty,
      scores: prev.scores,
      history: prev.history,
      playerXName: prev.playerXName,
      playerOName: mode === 'bot' ? getBotName(botDifficulty) : prev.playerOName
    }));
    setIsProcessingMove(false);
  };

  const makeMove = async (index: number) => {
    if (isProcessingMove || 
        gameState.board[index] !== null || 
        gameState.status !== 'playing') {
      return;
    }

    setIsProcessingMove(true);
    playMove();

    try {
      // Player move
      const newState = await processMove(index);
      setGameState(newState);

      // Bot move if game is still playing
      if (newState.mode === 'bot' && 
          newState.status === 'playing' && 
          newState.currentPlayer === 'O') {
        await new Promise(resolve => setTimeout(resolve, 750));
        const botMove = getBotMove(newState.board, newState.botDifficulty, 'O');
        if (botMove !== -1) {
          playBotMove();
          const finalState = await processMove(botMove);
          setGameState(finalState);
        }
      }
    } finally {
      setIsProcessingMove(false);
    }
  };

  const processMove = async (index: number): Promise<GameState> => {
    return new Promise(resolve => {
      setGameState(prev => {
        const newBoard = [...prev.board];
        newBoard[index] = prev.currentPlayer;

        const { winner, line } = checkWinner(newBoard);
        const boardFull = isBoardFull(newBoard);
        
        let status = prev.status;
        let winningLine = prev.winningLine;
        let currentPlayer = prev.currentPlayer === 'X' ? 'O' : 'X';
        
        if (winner) {
          status = 'won';
          winningLine = line;
          playWin();
        } else if (boardFull) {
          status = 'draw';
          playDraw();
        }

        let newScores = { ...prev.scores };
        let newHistory = [...prev.history];
        
        if (status !== 'playing') {
          const historyEntry = createGameHistory(
            prev.playerXName,
            prev.playerOName,
            winner,
            prev.mode,
            prev.mode === 'bot' ? prev.botDifficulty : undefined
          );
          
          newHistory = [historyEntry, ...prev.history];
          saveGameHistory(newHistory);
          
          if (winner) {
            const winnerName = winner === 'X' ? prev.playerXName : prev.playerOName;
            newScores[winnerName] = (newScores[winnerName] || 0) + 3;
            savePlayerScores(newScores);
          } else if (status === 'draw') {
            newScores[prev.playerXName] = (newScores[prev.playerXName] || 0) + 1;
            newScores[prev.playerOName] = (newScores[prev.playerOName] || 0) + 1;
            savePlayerScores(newScores);
          }
        }

        const newState = {
          ...prev,
          board: newBoard,
          currentPlayer,
          status,
          winner,
          winningLine,
          scores: newScores,
          history: newHistory,
          moveCount: prev.moveCount + 1
        };

        resolve(newState);
        return newState;
      });
    });
  };

  const resetGame = () => {
    playClick();
    setGameState(prev => ({
      ...initialGameState,
      mode: prev.mode,
      botDifficulty: prev.botDifficulty,
      playerXName: prev.playerXName,
      playerOName: prev.mode === 'bot' ? getBotName(prev.botDifficulty) : prev.playerOName,
      scores: prev.scores,
      history: prev.history
    }));
    setIsProcessingMove(false);
  };

  const setPlayerNames = (playerX: string, playerO: string) => {
    playClick();
    setGameState(prev => ({
      ...prev,
      playerXName: playerX || 'Player X',
      playerOName: prev.mode === 'bot' ? getBotName(prev.botDifficulty) : (playerO || 'Player O')
    }));
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      startGame, 
      makeMove, 
      resetGame, 
      setPlayerNames,
      leaderboard,
      handleTelegramCommand
    }}>
      {children}
    </GameContext.Provider>
  );
};