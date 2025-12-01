import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationJA from './locales/ja/translation.json';

// Detect user's browser language
const detectLanguage = () => {
  // Check localStorage first
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    return savedLanguage;
  }

  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage;

  // If browser language is Japanese, use Japanese
  if (browserLang.startsWith('ja')) {
    return 'ja';
  }

  // Default to English
  return 'en';
};

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
    lng: detectLanguage(), // Auto-detect language or use saved preference
    fallbackLng: 'en', // Fallback if translation missing
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    react: {
      useSuspense: false // Disable suspense for simpler setup
    }
  });

export default i18n;
