import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveAuthInfo, getAuthInfo, AuthInfo } from '../utils/authStorage';
import { GameProvider, EXTRA_INFO_MAP, GAME_GUIDE_MAP } from '../context/GameContext';
import MashRabbitGameCanvas from '../components/Mashrabbit/MashRabbitGameCanvas';
import PikaBallGameCanvas from '../components/Pika/PikaBallGameCanvas';
import SpaceShipGameCanvas from '../components/Spaceship/SpaceShipGameCanvas';
import GameLayout from '../components/GameLayout';
import axios from 'axios';
import './GamePage.css';

const GamePage = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const navigate = useNavigate();
  const auth = getAuthInfo() as AuthInfo;

  const DEFAULT_TIME_OUT = 45; // 게임 기본 시간
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_OUT);
  const [score, setScore] = useState(0);
  const [highlightScore, setHighlightScore] = useState(false);
  const [scoreScale, setScoreScale] = useState(1);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [showRestartUI, setShowRestartUI] = useState(false);
  const [gameKey, setGameKey] = useState(Date.now());
  const [isModalOpen, setIsModalOpen] = useState(true); // ✨ 게임 설명 모달 열림 여부
  const [tries, setTries] = useState(3);

  const hasSubmitted = useRef(false);

  // ✅ 게임 시작할 때 타이머 시작
  useEffect(() => {
    if (!auth) {
      alert('Unauthorized access. Please go back to home.');
      navigate('/');
      return;
    }

    if (isModalOpen) return; // 아직 모달 열려있으면 타이머 시작하지 않음

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameKey, isModalOpen]); // ✨ gameKey 또는 isModalOpen이 바뀌면 다시 타이머 설정

  // ✅ 점수 효과
  useEffect(() => {
    if (score === 0) return;

    setHighlightScore(true);
    setScoreScale(1.5);

    const timeout = setTimeout(() => {
      setHighlightScore(false);
      setScoreScale(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [score]);

  // ✅ 게임 오버 처리
  const handleGameOver = async (score: number) => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    setFinalScore(score);
    setShowRestartUI(true);

    try {
      const { token, gameType, jti, nickName } = auth;

      const signRes = await axios.post('http://localhost:8081/api/v1/token/scores', {
        gameType,
        jti,
        score
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const signedToken = signRes.data.data.signedToken;

      await axios.post('http://localhost:8081/api/v1/scores', {
        gameType,
        nickName,
        score,
        jti,
        signedToken
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const response = err.response?.data;
        console.error('❌ 서버 응답 오류:', response);
        alert(`점수 저장 실패: ${response?.message || '알 수 없는 오류'}`);
      } else {
        console.error('❌ 네트워크 또는 알 수 없는 오류:', err);
        alert('서버에 연결할 수 없습니다.');
      }
    }
  };

  // ✅ 다시 시작
  const handleRestart = async () => {
    try {
      const oldAuth = getAuthInfo();
      const res = await axios.post('http://localhost:8081/api/v1/user/token', {
        nickName: oldAuth?.nickName,
        gameType: oldAuth?.gameType,
      });

      saveAuthInfo({
        token: res.data.data.token,
        gameType: res.data.data.gameType,
        jti: res.data.data.jti,
        nickName: res.data.data.nickName
      });

      // 초기화
      setScore(0);
      setTimeLeft(DEFAULT_TIME_OUT);
      setFinalScore(null);
      hasSubmitted.current = false;
      setShowRestartUI(false);
      setGameKey(Date.now()); // 강제 리마운트
    } catch (err) {
      console.error('재시작 실패:', err);
      alert('재시작 실패 😢');
    }
  };

  // ✅ 게임 렌더링
  const renderGameComponent = (setScore: (score: number) => void, setTries: (tries: number) => void) => {
    switch (gameType?.toUpperCase()) {
      case 'RABBIT':
        return (
          <MashRabbitGameCanvas
            key={gameKey}
            onGameOver={handleGameOver}
            timeLeft={timeLeft}
            setScore={setScore}
          />
        );
      case 'PIKACHU':
        return (
          <PikaBallGameCanvas
            key={gameKey}
            onGameOver={handleGameOver}
            timeLeft={timeLeft}
            setScore={setScore}
          />
        );
      case 'COMBAT':
        return (
          <SpaceShipGameCanvas
            key={gameKey}
            onGameOver={handleGameOver}
            timeLeft={timeLeft}
            setScore={setScore}
            setTries={setTries}
          />
        );
      default:
        return <p>Unknown game type</p>;
    }
  };

  // ✅ extraInfo (게임별 추가 정보)
  const extraInfo = gameType && EXTRA_INFO_MAP[gameType as keyof typeof EXTRA_INFO_MAP]
    ? EXTRA_INFO_MAP[gameType as keyof typeof EXTRA_INFO_MAP]({ tries })
    : null;

    return (
      <GameProvider gameType={gameType?.toUpperCase() as any}>
        {isModalOpen ? (
          // ✨ 모달만 보여줄 때
          <div className="game-guide-overlay">
            <div className="game-guide-modal">
              <div className="game-guide-content">
                {(() => {
                  const GuideComponent = GAME_GUIDE_MAP[gameType?.toUpperCase() as keyof typeof GAME_GUIDE_MAP];
                  return GuideComponent ? <GuideComponent /> : <p>게임 방법을 준비 중입니다.</p>;
                })()}
                <button
                  className="start-button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setTimeLeft(DEFAULT_TIME_OUT); // 타이머 초기화
                    setGameKey(Date.now());         // 강제 리마운트 (중요)
                  }}
                >
                  게임 시작
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ✨ 게임 레이아웃 전체
          <GameLayout
            gameType={gameType || ''}
            timeLeft={timeLeft}
            score={score}
            highlightScore={highlightScore}
            scoreScale={scoreScale}
            extraInfo={extraInfo}
          >
            {renderGameComponent(setScore, setTries)}
    
            {showRestartUI && (
              <div className="restart-ui">
                <div className="game-over-tit">Game Over</div>
                <div className="final-score">🎯 Final Score: {finalScore}</div>
                <button onClick={handleRestart}>다시 시작</button>
                <button onClick={() => navigate('/')}>홈으로</button>
              </div>
            )}
          </GameLayout>
        )}
      </GameProvider>
    );
};

export default GamePage;
