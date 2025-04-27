import { useTranslation } from 'react-i18next';

const SpaceShipGuide = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('game.guide.combat.title')}</h2>
      <p>{t('game.guide.combat.desc1')}</p>
      <p>{t('game.guide.combat.desc2')}</p>
      <p>{t('game.guide.combat.desc3')}</p>
    </>
  );
};

export default SpaceShipGuide;