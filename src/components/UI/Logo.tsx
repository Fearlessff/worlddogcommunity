import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const Logo: React.FC = () => {
  const createdByVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 1,
        duration: 0.5
      }
    }
  };

  const letterVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.2 + (i * 0.1),
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    })
  };

  const teamNameVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 1.5
      }
    }
  };

  const wordVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-center flex-col"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="flex items-center justify-center mb-2"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <motion.div 
          className="text-4xl font-orbitron font-bold flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Gamepad2 
            size={48} 
            className="text-primary mr-4"
            style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.5))' }}
          />
          <div>
            <motion.span 
              className="neon-text"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              LMART
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="text-md font-orbitron text-neutral-300 text-center mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        LMRT Contest Edition
      </motion.div>

      <motion.div
        className="mt-4 text-sm text-neutral-400"
        variants={createdByVariants}
        initial="initial"
        animate="animate"
      >
        Created by Fearless
      </motion.div>

    </motion.div>
  );
};

export default Logo;