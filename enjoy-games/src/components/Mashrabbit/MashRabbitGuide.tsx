import { useTranslation } from 'react-i18next';

const MashRabbitGuide = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('game.guide.rabbit.title')}</h2>
      <p>{t('game.guide.rabbit.desc1')}</p>
      <p>{t('game.guide.rabbit.desc2')}</p>
    </>
  );
};

export default MashRabbitGuide;