import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../../context/GameContext';
import TelegramMessage from '../UI/TelegramMessage';
import Button from '../UI/Button';
import { User, Bot } from 'lucide-react';

interface PlayerSettingsProps {
  onDone: () => void;
}

const PlayerSettings: React.FC<PlayerSettingsProps> = ({ onDone }) => {
  const { gameState, setPlayerNames } = useGameContext();
  const { mode, botDifficulty, playerXName, playerOName } = gameState;
  
  const [nameX, setNameX] = useState(playerXName);
  const [nameO, setNameO] = useState(playerOName);
  
  // Reset nameO when mode changes
  useEffect(() => {
    if (mode === 'bot') {
      setNameO(playerOName);
    }
  }, [mode, botDifficulty, playerOName]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayerNames(nameX || 'Player X', nameO || 'Player O');
    onDone();
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="my-4"
    >
      <TelegramMessage>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-orbitron text-primary mb-3 text-center">Player Names</h3>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-neutral-300">
                <User size={16} className="text-primary mr-2" />
                Player X (You)
              </label>
              <input
                type="text"
                value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                maxLength={12}
                placeholder="Enter name"
                className="telegram-input"
              />
            </div>
            
            {mode === 'human' && (
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-neutral-300">
                  <User size={16} className="text-secondary mr-2" />
                  Player O (Friend)
                </label>
                <input
                  type="text"
                  value={nameO}
                  onChange={(e) => setNameO(e.target.value)}
                  maxLength={12}
                  placeholder="Enter name"
                  className="telegram-input"
                />
              </div>
            )}
            
            {mode === 'bot' && (
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-neutral-300">
                  <Bot size={16} className="text-secondary mr-2" />
                  Bot Player
                </label>
                <input
                  type="text"
                  value={playerOName}
                  disabled
                  className="telegram-input opacity-70 cursor-not-allowed"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">Save Names</Button>
          </div>
        </form>
      </TelegramMessage>
    </motion.div>
  );
};

export default PlayerSettings;