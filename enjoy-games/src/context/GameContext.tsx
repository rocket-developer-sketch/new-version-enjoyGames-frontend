import { createContext, useContext, ReactNode } from 'react';
import SpaceShipInfo from '../components/Spaceship/SpaceShipInfo';
import MashRabbitGuide from '../components/Mashrabbit/MashRabbitGuide';
import PikaBallGuide from '../components/Pika/PikaBallGuide';
import SpaceShipGuide from '../components/Spaceship/SpaceShipGuide';

export const GAME_TYPE_MAP = {
  RABBIT: 'games.rabbit',
  PIKACHU: 'games.pikachu',
  COMBAT: 'games.combat',
} as const;

export const GAME_GUIDE_MAP = {
  RABBIT: MashRabbitGuide,
  PIKACHU: PikaBallGuide,
  COMBAT: SpaceShipGuide
} as const;

export const EXTRA_INFO_MAP = {
  COMBAT: (props: { tries: number }) => <SpaceShipInfo tries={props.tries} />,
} as const;

type GameType = keyof typeof GAME_TYPE_MAP;

interface GameContextType {
  gameType: GameType | null;
  gameLabel: string; // i18n key 저장
}


const GameContext = createContext<GameContextType>({
  gameType: null,
  gameLabel: 'games.unknown',
});

export const useGameContext = () => useContext(GameContext);

interface GameProviderProps {
  gameType: GameType | null;
  children: ReactNode;
}

export const GameProvider = ({ gameType, children }: GameProviderProps) => {
  const gameLabel = gameType ? GAME_TYPE_MAP[gameType] : 'games.unknown';

  return (
    <GameContext.Provider value={{ gameType, gameLabel }}>
      {children}
    </GameContext.Provider>
  );
};
