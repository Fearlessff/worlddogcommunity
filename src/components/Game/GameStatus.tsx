import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../../context/GameContext';
import TelegramMessage from '../UI/TelegramMessage';
import AnimatedText from '../UI/AnimatedText';
import { Clock } from 'lucide-react';
import BotThinking from './BotThinking';
import ParticleEffects from './ParticleEffects';

const GameStatus: React.FC = () => {
  const { gameState } = useGameContext();
  const { status, winner, currentPlayer, playerXName, playerOName, moveCount, mode, botDifficulty } = gameState;

  let statusMessage = '';
  let messageSender: 'system' | 'user' | 'bot' = 'system';

  if (status === 'playing') {
    statusMessage = `${currentPlayer === 'X' ? playerXName : playerOName}'s turn (${currentPlayer})`;
    messageSender = currentPlayer === 'X' ? 'user' : 'bot';
  } else if (status === 'won') {
    statusMessage = `${winner === 'X' ? playerXName : playerOName} wins!`;
    messageSender = winner === 'X' ? 'user' : 'bot';
  } else {
    statusMessage = "It's a draw!";
    messageSender = 'system';
  }

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <motion.div
      className="mt-6 mb-4 relative"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      key={statusMessage}
    >
      {status === 'won' && (
        <ParticleEffects type={winner === 'X' ? 'win-x' : 'win-o'} />
      )}
      {status === 'draw' && <ParticleEffects type="draw" />}

      <TelegramMessage sender={messageSender}>
        <div className="flex items-center justify-between">
          <span>{statusMessage}</span>
          <div className="flex items-center text-sm text-neutral-400">
            <Clock size={14} className="mr-1" />
            <span>Move {moveCount}</span>
          </div>
        </div>
      </TelegramMessage>
      
      <AnimatePresence>
        {status === 'playing' && mode === 'bot' && currentPlayer === 'O' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2"
          >
            <BotThinking difficulty={botDifficulty} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {status === 'won' && (
        <TelegramMessage sender="system" delay={0.3}>
          <div className="flex flex-col items-center">
            <AnimatedText 
              text="🎉 Congratulations! 🎉" 
              className="text-lg font-orbitron text-accent"
              delay={0.1}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-2"
            >
              <span className={`text-2xl ${winner === 'X' ? 'text-primary' : 'text-secondary'}`}>
                {winner}
              </span>
            </motion.div>
          </div>
        </TelegramMessage>
      )}
    </motion.div>
  );
};

export default GameStatus;