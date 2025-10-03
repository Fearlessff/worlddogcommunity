import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { BotDifficulty } from '../../types/game';

interface BotThinkingProps {
  difficulty: BotDifficulty;
}

const BotThinking: React.FC<BotThinkingProps> = ({ difficulty }) => {
  const dotVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  const getThinkingMessage = () => {
    switch (difficulty) {
      case 'easy':
        return "Hmm, let me try...";
      case 'medium':
        return "Analyzing moves...";
      case 'hard':
        return "Calculating optimal strategy...";
      default:
        return "Thinking...";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 text-secondary"
    >
      <Bot size={16} className="animate-pulse" />
      <span className="text-sm">{getThinkingMessage()}</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            animate="animate"
            custom={i}
            className="w-1 h-1 bg-secondary rounded-full"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            .
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default BotThinking;