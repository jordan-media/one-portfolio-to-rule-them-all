import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationJA from './locales/ja/translation.json';

i18n
  .use(initReactI18next) // Connect to React
  .init({
    resources: {
      en: {
        translation: translationEN
      },
      ja: {
        translation: translationJA
      }
    },
    lng: localStorage.getItem('language') || 'en', // Default language from localStorage or 'en'
    fallbackLng: 'en', // Fallback if translation missing
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    react: {
      useSuspense: false // Disable suspense for simpler setup
    }
  });

export default i18n;
