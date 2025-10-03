import useSound from 'use-sound';

export const useGameSounds = () => {
  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });
  const [playDraw] = useSound('/sounds/draw.mp3', { volume: 0.5 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.4 });
  const [playBotMove] = useSound('/sounds/bot-move.mp3', { volume: 0.5 });
  const [playError] = useSound('/sounds/error.mp3', { volume: 0.3 });

  return {
    playMove,
    playWin,
    playDraw,
    playClick,
    playBotMove,
    playError
  };
};