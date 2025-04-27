import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import koTranslation from './locales/ko/translation.json';
import enTranslation from './locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: koTranslation },
      en: { translation: enTranslation },
    },
    lng: 'en',          // 기본 언어
    fallbackLng: 'en',  // fallback 언어
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
