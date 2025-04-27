import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; 

import { fetchRanking } from '../services/rankingService';
import { RankingEntry } from '../models/Ranking';

import './RankingPopup.css'

const RankingPopup = ({ gameType, top, onClose }: { gameType: string; top:number; onClose: () => void }) => {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const { t } = useTranslation(); // i18n 추가
    
  useEffect(() => {
    fetchRanking(gameType, top)
      .then((res) => setRanking(res.data))
      .catch((err) => console.error('랭킹 조회 실패', err));
  }, [gameType, top]);

  return (
    
    <div className="ranking-overlay">
      <div className="ranking-popup">
        <h2><span role="img" aria-label="trophy">🏆</span> {t(`game.ranking`)}</h2>

        <div className="ranking-scroll-container ranking-list">
          {ranking.map((entry, index) => {
             let topClass = '';
             if (entry.rank === 1) topClass = 'top-1';
             else if (entry.rank === 2) topClass = 'top-2';
             else if (entry.rank === 3) topClass = 'top-3';

            return (
              <div className={`rank-row ${topClass}`} key={index}>
                <div className="rank">{entry.rank}</div>
                <div className="nickname">{entry.nickName}</div>
                <div className="score">{entry.score} {t(`game.points`)}</div>
              </div>
            );
          })}
        </div>

        <div className="close-button-container">
          <button onClick={onClose} className="close-btn">{t(`close`)}</button>
        </div>
      </div>
    </div>

  );
};

export default RankingPopup;
