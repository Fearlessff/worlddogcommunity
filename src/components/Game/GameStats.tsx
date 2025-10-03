import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Timer, Hash, Zap, Clock } from 'lucide-react';
import TelegramMessage from '../UI/TelegramMessage';
import { useGameContext } from '../../context/GameContext';

const GameStats: React.FC = () => {
  const { gameState } = useGameContext();
  const { history, moveCount, status } = gameState;
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'playing') {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'playing') {
      // Save final time somewhere if needed
    }
  }, [status]);

  const stats = {
    totalGames: history.length,
    winStreak: calculateWinStreak(history),
    bestScore: Math.max(...Object.values(gameState.scores), 0),
    timePlayed: calculateTotalTime(history)
  };

  const formatGameTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <TelegramMessage>
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            icon={<Trophy className="text-secondary" />}
            label="Win Streak"
            value={stats.winStreak}
          />
          <StatItem
            icon={<Hash className="text-primary" />}
            label="Moves"
            value={moveCount}
          />
          <StatItem
            icon={<Clock className="text-accent" />}
            label="Game Time"
            value={formatGameTime(gameTime)}
          />
          <StatItem
            icon={<Timer className="text-secondary" />}
            label="Total Time"
            value={formatTime(stats.timePlayed)}
          />
        </div>
      </TelegramMessage>
    </motion.div>
  );
};

const StatItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
}> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center p-3 bg-telegram-active/20 rounded-lg">
    <div className="mb-2">{icon}</div>
    <div className="text-sm text-neutral-400">{label}</div>
    <div className="text-lg font-orbitron">{value}</div>
  </div>
);

const calculateWinStreak = (history: GameHistory[]): number => {
  let streak = 0;
  let currentStreak = 0;
  
  for (const game of history) {
    if (game.winner !== 'draw') {
      currentStreak++;
      streak = Math.max(streak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return streak;
};

const calculateTotalTime = (history: GameHistory[]): number => {
  return history.length * 2; // Assuming average game time of 2 minutes
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export default GameStats;