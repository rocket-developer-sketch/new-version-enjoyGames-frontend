import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from  '../apis/apiClient';
import { useTranslation } from 'react-i18next'; 

import { saveAuthInfo } from '../utils/authStorage';
import { GameProvider, GAME_TYPE_MAP } from '../context/GameContext';
import RankingPopup from './RankingPopup';

import './NicknameInputPage.css';


const NicknameInputPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameType = searchParams.get('game')?.toUpperCase();
  const [nickName, setNickName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  const { t } = useTranslation(); // i18n 추가
  
  if (!gameType || !(gameType in GAME_TYPE_MAP)) {
    // return <div>❌ 잘못된 게임 접근입니다.</div>;
    return <div>`${t('auth.wrong_access')}`</div>
  }
  const handleSubmit = async () => {    
    // if (!nickName || !gameType) return alert('닉네임과 게임 종류가 필요합니다.');
    if (!nickName || !gameType) return alert(`${t('auth.required_nickname')}`);

    setLoading(true);
    try {
      const res = await apiClient.post('/api/v1/user/token', {
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const gameTypeKey = gameType.toLowerCase();

  return (
    <GameProvider gameType={gameType as keyof typeof GAME_TYPE_MAP}>
      <div className="nickname-wrapper">
        <div className="nickname-box">
          <h2>🎮 {t(`games.${gameTypeKey}`)}</h2>
          <h2>{t('start_game')}</h2>

          <div className="input-group">
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? t(`loading`) : t(`game.start`)}
            </button>
          </div>

          {/* 메인/순위 보기 */}
          <div className="action-buttons">
            <button onClick={() => navigate('/')}><span role="img" aria-label="home">🏠</span> {t(`game.home`)}</button>
            <button onClick={() => setShowRanking(true)}><span role="img" aria-label="trophy">🏆</span>  {t(`game.rank`)}</button>        
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