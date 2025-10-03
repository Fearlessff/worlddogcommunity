import React from 'react';
import { motion } from 'framer-motion';
import Cell from './Cell';
import { useGameContext } from '../../context/GameContext';

const Board: React.FC = () => {
  const { gameState, makeMove } = useGameContext();
  const { board, winningLine } = gameState;

  const boardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const isWinningCell = (index: number): boolean => {
    return winningLine !== null && winningLine.includes(index);
  };

  return (
    <motion.div
      className="game-board"
      variants={boardVariants}
      initial="initial"
      animate="animate"
    >
      {board.map((cell, index) => (
        <Cell 
          key={index} 
          value={cell} 
          index={index}
          onClick={() => makeMove(index)}
          isWinningCell={isWinningCell(index)}
        />
      ))}
    </motion.div>
  );
};

export default Board;