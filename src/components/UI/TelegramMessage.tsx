import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';

interface TelegramMessageProps {
  children: React.ReactNode;
  sender?: 'system' | 'user' | 'bot';
  delay?: number;
  animate?: boolean;
}

const TelegramMessage: React.FC<TelegramMessageProps> = ({ 
  children, 
  sender = 'system',
  delay = 0,
  animate = true
}) => {
  const messageClasses = {
    system: 'telegram-message bg-telegram-message',
    user: 'telegram-message sent',
    bot: 'telegram-message bg-telegram-active'
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        duration: 0.5, 
        delay: delay 
      } 
    }
  };

  return (
    <motion.div
      className={messageClasses[sender]}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      variants={messageVariants}
    >
      {typeof children === 'string' ? (
        <AnimatedText text={children} delay={delay + 0.1} />
      ) : (
        children
      )}
    </motion.div>
  );
};

export default TelegramMessage;