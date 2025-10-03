import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, RotateCcw, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import Button from '../UI/Button';
import { useGameContext } from '../../context/GameContext';
import { GameMode, BotDifficulty } from '../../types/game';
import { useGameSounds } from '../../hooks/useGameSounds';

interface GameControlsProps {
  onBackToMenu: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onBackToMenu }) => {
  const { gameState, resetGame } = useGameContext();
  const { status, mode, botDifficulty } = gameState;
  const [isMuted, setIsMuted] = React.useState(false);
  const { playClick } = useGameSounds();
  
  const controlsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getBotDifficultyText = (difficulty: BotDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Novice';
      case 'medium':
        return 'Tactical';
      case 'hard':
        return 'Master';
      default:
        return '';
    }
  };

  const handleReset = () => {
    playClick();
    resetGame();
  };

  const handleBack = () => {
    playClick();
    onBackToMenu();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    playClick();
  };

  return (
    <motion.div 
      className="flex flex-col space-y-4 mt-6"
      variants={controlsVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex space-x-2">
        <Button 
          onClick={handleReset} 
          variant="secondary" 
          className="flex-1"
          icon={<RotateCcw size={18} />}
        >
          New Game
        </Button>
        
        <Button
          onClick={toggleMute}
          variant="accent"
          size="sm"
          icon={isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button 
          onClick={handleBack} 
          variant="primary" 
          fullWidth
          icon={<ArrowLeft size={18} />}
        >
          Back to Menu
        </Button>
      </motion.div>
      
      {status !== 'playing' && (
        <motion.div 
          className="text-center text-sm text-neutral-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {mode === 'bot' ? (
            <span>Playing against {getBotDifficultyText(botDifficulty)} Bot</span>
          ) : (
            <span>Playing against Friend</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameControls;