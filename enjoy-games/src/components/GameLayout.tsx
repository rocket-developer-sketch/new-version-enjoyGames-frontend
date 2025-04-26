import { ReactNode } from 'react';
import { getAuthInfo } from '../utils/authStorage';
import { useGameContext } from '../context/GameContext';
import './GameLayout.css';

interface GameLayoutProps {
  gameType: string;
  timeLeft: number;
  score: number;
  highlightScore?: boolean;
  scoreScale?: number;
  children: ReactNode; // 이 안에 각 게임 캔버스 들어감
  extraInfo?: React.ReactNode; // 추가
}

const GameLayout = ({
  gameType,
  timeLeft,
  score,
  highlightScore,
  scoreScale,
  extraInfo,
  children,
}: GameLayoutProps) => {
  const auth = getAuthInfo();
  const { gameLabel } = useGameContext();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="game-layout">
      <main className="game-main">
        <div className="canvas-wrapper">
          {/* 왼쪽 박스 - canvas 기준 */}
          <div className="left-info-box">
            <div className="info-line"><strong>🎮 {gameLabel}</strong></div>
            <div className="info-line"><strong>Player:</strong> {auth?.nickName}</div>
            <div className="info-line"><strong>Time left:</strong> {formatTime(timeLeft)}</div>
            <div
              className="info-line"
              style={{
                color: highlightScore ? '#ffe600' : 'white',
                transform: `scale(${scoreScale})`,
                transition: 'transform 0.3s ease, color 0.3s ease',
                display: 'inline-block',
              }}
            >
              <strong>Score:</strong> {score}
            </div>

            {/* 게임 별 추가 정보: tries 등 */}
            {extraInfo && (
              <div className="info-line">
                {extraInfo}
              </div>
            )}
          </div>

          {/* 캔버스 영역 */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default GameLayout;
