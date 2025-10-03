import { GameHistory, LeaderboardEntry } from '../types/game';

// Local storage keys
const GAME_HISTORY_KEY = 'tic-tac-toe-history';
const SCORES_KEY = 'tic-tac-toe-scores';

// Save game history
export const saveGameHistory = (history: GameHistory[]): void => {
  localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(history));
};

// Load game history
export const loadGameHistory = (): GameHistory[] => {
  const historyJSON = localStorage.getItem(GAME_HISTORY_KEY);
  if (!historyJSON) return [];
  
  try {
    const history = JSON.parse(historyJSON) as GameHistory[];
    // Convert string dates back to Date objects
    return history.map(game => ({
      ...game,
      date: new Date(game.date)
    }));
  } catch (error) {
    console.error('Error loading game history:', error);
    return [];
  }
};

// Save player scores
export const savePlayerScores = (scores: Record<string, number>): void => {
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
};

// Load player scores
export const loadPlayerScores = (): Record<string, number> => {
  const scoresJSON = localStorage.getItem(SCORES_KEY);
  if (!scoresJSON) return {};
  
  try {
    return JSON.parse(scoresJSON) as Record<string, number>;
  } catch (error) {
    console.error('Error loading scores:', error);
    return {};
  }
};

// Generate leaderboard from history and scores
export const generateLeaderboard = (history: GameHistory[], scores: Record<string, number>): LeaderboardEntry[] => {
  const playerStats: Record<string, { wins: number, losses: number, draws: number }> = {};
  
  // Count wins, losses, and draws
  history.forEach(game => {
    // Initialize player records if they don't exist
    if (!playerStats[game.playerX]) {
      playerStats[game.playerX] = { wins: 0, losses: 0, draws: 0 };
    }
    if (!playerStats[game.playerO]) {
      playerStats[game.playerO] = { wins: 0, losses: 0, draws: 0 };
    }
    
    // Update stats based on game result
    if (game.winner === 'draw') {
      playerStats[game.playerX].draws += 1;
      playerStats[game.playerO].draws += 1;
    } else if (game.winner === 'X') {
      playerStats[game.playerX].wins += 1;
      playerStats[game.playerO].losses += 1;
    } else { // winner is 'O'
      playerStats[game.playerX].losses += 1;
      playerStats[game.playerO].wins += 1;
    }
  });
  
  // Convert to leaderboard entries
  const leaderboard: LeaderboardEntry[] = Object.entries(playerStats).map(([name, stats]) => ({
    name,
    wins: stats.wins,
    losses: stats.losses,
    draws: stats.draws,
    score: scores[name] || 0
  }));
  
  // Sort by score (highest first)
  return leaderboard.sort((a, b) => b.score - a.score);
};