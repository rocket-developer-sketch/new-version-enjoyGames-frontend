import { useTranslation } from 'react-i18next';

const PikaBallGuide = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('game.guide.pikachu.title')}</h2>
      <p>{t('game.guide.pikachu.desc1')}</p>
      <p>{t('game.guide.pikachu.desc2')}</p>
      <p>{t('game.guide.pikachu.desc3')}</p>
    </>
  );
};

export default PikaBallGuide;