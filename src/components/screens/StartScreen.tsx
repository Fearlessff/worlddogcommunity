import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, Settings, ChevronDown, ChevronUp, BarChart2, Trophy } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import Logo from '../UI/Logo';
import Button from '../UI/Button';
import TelegramMessage from '../UI/TelegramMessage';
import ScoreBoard from '../Game/ScoreBoard';
import GameStats from '../Game/GameStats';
import { BotDifficulty } from '../../types/game';
import { useGameSounds } from '../../hooks/useGameSounds';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const { startGame } = useGameContext();
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { playClick } = useGameSounds();
  
  const handleStartBot = (difficulty: BotDifficulty) => {
    playClick();
    startGame('bot', difficulty);
    onStartGame();
  };
  
  const handleStartHuman = () => {
    playClick();
    startGame('human');
    onStartGame();
  };
  
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <Logo />
      </motion.div>
      
      <motion.div variants={itemVariants} className="w-full">
        <TelegramMessage>
          Welcome to LMART Tic Tac Toe! Choose your game mode:
        </TelegramMessage>
      </motion.div>
      
      <motion.div variants={itemVariants} className="w-full mt-4">
        <Button 
          onClick={() => {
            playClick();
            setShowDifficulty(!showDifficulty);
          }} 
          variant="primary" 
          fullWidth 
          icon={<Gamepad2 size={18} />}
        >
          Play vs Bot {showDifficulty ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        
        {showDifficulty && (
          <motion.div 
            className="mt-2 space-y-2 pl-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Button onClick={() => handleStartBot('easy')} variant="accent" fullWidth>
              Easy Bot
            </Button>
            <Button onClick={() => handleStartBot('medium')} variant="accent" fullWidth>
              Medium Bot
            </Button>
            <Button onClick={() => handleStartBot('hard')} variant="accent" fullWidth>
              Hard Bot
            </Button>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div variants={itemVariants} className="w-full mt-4">
        <Button 
          onClick={handleStartHuman} 
          variant="secondary" 
          fullWidth 
          icon={<Users size={18} />}
        >
          Play vs Friend
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants} className="w-full mt-4">
        <Button 
          onClick={() => {
            playClick();
            setShowLeaderboard(!showLeaderboard);
          }} 
          variant="primary" 
          fullWidth
          icon={<Trophy size={18} />}
        >
          {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full mt-4">
        <Button 
          onClick={() => {
            playClick();
            setShowStats(!showStats);
          }} 
          variant="accent" 
          fullWidth
          icon={<BarChart2 size={18} />}
        >
          {showStats ? 'Hide' : 'Show'} Statistics
        </Button>
      </motion.div>
      
      {showLeaderboard && <ScoreBoard />}
      {showStats && <GameStats />}
      
      <motion.div 
        variants={itemVariants} 
        className="mt-8 text-center text-sm text-neutral-400"
      >
        Choose a mode to start playing!
      </motion.div>
    </motion.div>
  );
};

export default StartScreen;