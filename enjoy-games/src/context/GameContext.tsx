import React, { createContext, useContext, ReactNode } from 'react';
import SpaceShipInfo from '../components/SpaceShipInfo';

export const GAME_TYPE_MAP = {
  RABBIT: 'MashRabbit Hunter',
  PIKACHU: 'Pika Ball',
  COMBAT: 'Spaceship',
} as const;

export const EXTRA_INFO_MAP = {
  COMBAT: (props: { tries: number }) => <SpaceShipInfo tries={props.tries} />,
} as const;

type GameType = keyof typeof GAME_TYPE_MAP;

interface GameContextType {
  gameType: GameType | null;
  gameLabel: string;
}

const GameContext = createContext<GameContextType>({
  gameType: null,
  gameLabel: 'Unknown Game',
});

export const useGameContext = () => useContext(GameContext);

interface GameProviderProps {
  gameType: GameType | null;
  children: ReactNode;
}

export const GameProvider = ({ gameType, children }: GameProviderProps) => {
  const gameLabel = gameType ? GAME_TYPE_MAP[gameType] : 'Unknown Game';

  return (
    <GameContext.Provider value={{ gameType, gameLabel }}>
      {children}
    </GameContext.Provider>
  );
};
