import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CellValue } from '../../types/game';
import { useGameSounds } from '../../hooks/useGameSounds';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  index: number;
  isWinningCell: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, index, isWinningCell }) => {
  const { playMove } = useGameSounds();
  
  const handleClick = () => {
    if (!value) {
      playMove();
      onClick();
    }
  };

  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: index * 0.05 
      }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const cellClasses = `
    game-cell 
    ${value === 'X' ? 'player-x' : ''} 
    ${value === 'O' ? 'player-o' : ''} 
    ${isWinningCell ? 'winner-cell' : ''}
    ${value ? 'cursor-default' : 'hover:bg-telegram-active/30'}
    bg-telegram-message relative
    ${!value ? 'hover:after:content-[""] hover:after:absolute hover:after:inset-0 hover:after:bg-current hover:after:opacity-10' : ''}
  `;

  return (
    <motion.div
      className={cellClasses}
      onClick={handleClick}
      variants={variants}
      initial="initial"
      animate="animate"
      whileTap={value ? {} : "tap"}
      whileHover={value ? {} : { scale: 1.05 }}
    >
      {value && (
        <motion.div
          variants={iconVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-center"
        >
          {value === 'X' ? (
            <X size={48} strokeWidth={3} className="text-primary" />
          ) : (
            <span className="text-4xl transform scale-125">🐸</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Cell;