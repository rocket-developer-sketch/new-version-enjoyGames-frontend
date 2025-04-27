import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './Homepage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // t 추가

  const handleGameSelect = (game: string) => {
    navigate(`/play?game=${game}`);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="home-wrapper">
      <div className="home-box">
        <h1>🎮 {t('chooseGame')}</h1>
        <button onClick={() => handleGameSelect('RABBIT')}>{t('games.rabbit')}</button>
        <br />
        <button onClick={() => handleGameSelect('PIKACHU')}>{t('games.pikachu')}</button>
        <br />
        <button onClick={() => handleGameSelect('COMBAT')}>{t('games.combat')}</button>
      </div>

      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>{t('language.english')}</button>
        <button onClick={() => changeLanguage('ko')}>{t('language.korean')}</button>
      </div>
    </div>
  );
};

export default HomePage;
