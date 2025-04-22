import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveAuthInfo } from '../utils/authStorage';
import { GameProvider, GAME_TYPE_MAP } from '../context/GameContext';
import axios from 'axios';
import './NicknameInputPage.css';
import RankingPopup from './RankingPopup';

const NicknameInputPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameType = searchParams.get('game')?.toUpperCase();
  const [nickName, setNickName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  
  if (!gameType || !(gameType in GAME_TYPE_MAP)) {
    return <div>❌ 잘못된 게임 접근입니다.</div>;
  }
  const handleSubmit = async () => {    
    if (!nickName || !gameType) return alert('닉네임과 게임 종류가 필요합니다.');

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8081/api/v1/user/token', {
        nickName: nickName,
        gameType: gameType,
      });

      saveAuthInfo({
        token: res.data.data.token,
        gameType: res.data.data.gameType,
        jti: res.data.data.jti,
        nickName: res.data.data.nickName,
      });

      navigate(`/game/${gameType}`);
    } catch (err) {
      alert('JWT 발급 실패 😢');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <GameProvider gameType={gameType as keyof typeof GAME_TYPE_MAP}>
      <div className="nickname-wrapper">
        <div className="nickname-box">
          <h2>🎮 {GAME_TYPE_MAP[gameType as keyof typeof GAME_TYPE_MAP]}</h2>
          <h2>게임을 시작합니다!</h2>

          <div className="input-group">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? '로딩 중...' : '게임 시작'}
            </button>
          </div>

          {/* 메인/순위 보기 */}
          <div className="action-buttons">
            <button onClick={() => navigate('/')}><span role="img" aria-label="home">🏠</span> 메인으로</button>
            <button onClick={() => setShowRanking(true)}><span role="img" aria-label="trophy">🏆</span> 순위 보기</button>        
          </div>
        </div>
        
        {showRanking && (
          <RankingPopup gameType={gameType || ''} top={100} onClose={() => setShowRanking(false)} />
        )}
        </div>
      </GameProvider>
  )
};

export default NicknameInputPage;