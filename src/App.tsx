import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import StartScreen from './components/screens/StartScreen';
import GameScreen from './components/screens/GameScreen';

function App() {
  const [screen, setScreen] = useState<'start' | 'game'>('start');

  return (
    <GameProvider>
      <div className="min-h-screen bg-telegram-bg flex flex-col">
        <div className="flex-1 overflow-auto py-4">
          <AnimatePresence mode="wait">
            {screen === 'start' && (
              <motion.div
                key="start-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StartScreen onStartGame={() => setScreen('game')} />
              </motion.div>
            )}
            
            {screen === 'game' && (
              <motion.div
                key="game-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GameScreen onBackToMenu={() => setScreen('start')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;