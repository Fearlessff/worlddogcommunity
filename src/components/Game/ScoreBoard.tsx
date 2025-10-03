import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import TelegramMessage from '../UI/TelegramMessage';

const ScoreBoard: React.FC = () => {
  const { leaderboard } = useGameContext();
  
  // Take only top 5 players
  const topPlayers = leaderboard.slice(0, 5);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (topPlayers.length === 0) {
    return (
      <TelegramMessage>
        No games played yet. Start playing to see the leaderboard!
      </TelegramMessage>
    );
  }

  return (
    <motion.div
      className="mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <TelegramMessage>
        <div className="flex items-center mb-3">
          <Trophy className="text-secondary mr-2" size={20} />
          <h3 className="text-lg font-orbitron text-secondary">Leaderboard</h3>
        </div>
        
        <div className="space-y-2">
          {topPlayers.map((player, index) => (
            <motion.div 
              key={player.name}
              variants={itemVariants}
              className={`flex items-center justify-between p-2 rounded-md ${
                index === 0 ? 'bg-secondary/20' : 
                index === 1 ? 'bg-primary/20' : 
                index === 2 ? 'bg-accent/20' : 
                'bg-telegram-active/20'
              }`}
            >
              <div className="flex items-center">
                {index === 0 && <Award className="text-secondary mr-2\" size={16} />}
                {index === 1 && <Award className="text-primary mr-2" size={16} />}
                {index === 2 && <Award className="text-accent mr-2\" size={16} />}
                {index > 2 && <span className="w-6 text-center text-neutral-400">{index + 1}</span>}
                <span className="font-medium truncate max-w-[120px]">{player.name}</span>
              </div>
              <div className="flex items-center">
                <Star className="text-secondary mr-1" size={14} />
                <span className="font-orbitron">{player.score}</span>
                <span className="text-xs text-neutral-400 ml-2">
                  ({player.wins}W/{player.draws}D/{player.losses}L)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </TelegramMessage>
    </motion.div>
  );
};

export default ScoreBoard;