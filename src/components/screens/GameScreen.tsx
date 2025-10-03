import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Board from '../Game/Board';
import GameStatus from '../Game/GameStatus';
import GameControls from '../Game/GameControls';
import PlayerSettings from '../Game/PlayerSettings';
import { useGameContext } from '../../context/GameContext';
import { Settings, Users } from 'lucide-react';
import Button from '../UI/Button';

interface GameScreenProps {
  onBackToMenu: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onBackToMenu }) => {
  const { gameState } = useGameContext();
  const [showSettings, setShowSettings] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Users className="text-primary mr-2" size={18} />
            <div className="text-sm">
              <span className="text-primary font-medium">{gameState.playerXName}</span>
              <span className="mx-2 text-neutral-400">vs</span>
              <span className="text-secondary font-medium">{gameState.playerOName}</span>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowSettings(!showSettings)} 
            variant="primary"
            size="sm"
            icon={<Settings size={14} />}
          >
            Names
          </Button>
        </div>
      </motion.div>
      
      {showSettings ? (
        <PlayerSettings onDone={() => setShowSettings(false)} />
      ) : (
        <>
          <motion.div variants={itemVariants}>
            <GameStatus />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Board />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GameControls onBackToMenu={onBackToMenu} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default GameScreen;