import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const CookieBanner = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    const consentTimestamp = localStorage.getItem('cookie_consent_timestamp');

    if (!consent) {
      // No consent recorded, show banner
      setShowBanner(true);
    } else {
      // Check if consent is older than 30 days
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      if (consentTimestamp && parseInt(consentTimestamp) < thirtyDaysAgo) {
        // Consent expired, ask again
        setShowBanner(true);
      }
    }
  }, []);

  const handleConsent = (accepted) => {
    // Store consent preference
    localStorage.setItem('cookie_consent', accepted ? 'accepted' : 'declined');
    localStorage.setItem('cookie_consent_timestamp', Date.now().toString());

    // Dispatch event so GA4 can initialize if accepted
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', {
      detail: { accepted }
    }));

    // Hide banner
    setShowBanner(false);

    // If accepted, reload to initialize GA4
    if (accepted) {
      window.location.reload();
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 dark:from-slate-900/95 dark:via-black/95 dark:to-slate-900/95 backdrop-blur-xl border border-slate-300 dark:border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300">
          {/* Close button for dismissing without choosing */}
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-4 right-4 text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80 transition-colors"
            aria-label={t('cookieBanner.closeLabel')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              {t('cookieBanner.title')}
            </h3>
            <p className="text-slate-700 dark:text-white/80 text-sm sm:text-base leading-relaxed mb-2">
              {t('cookieBanner.description')}
            </p>
            <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-white/60">
              <p>
                <span className="text-green-600 dark:text-green-400 font-bold">✓ {t('cookieBanner.acceptLabel')}</span> {t('cookieBanner.acceptDescription')}
              </p>
              <p>
                <span className="text-slate-500 dark:text-white/40 font-bold">✗ {t('cookieBanner.declineLabel')}</span> {t('cookieBanner.declineDescription')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleConsent(true)}
              className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 font-bold text-sm tracking-wider uppercase rounded-lg hover:bg-green-500 dark:hover:bg-green-400 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t('cookieBanner.acceptButton')}
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="flex-1 bg-slate-100 dark:bg-white/5 border-2 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white px-6 py-3 font-bold text-sm tracking-wider uppercase rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/40 transition-all duration-300"
            >
              {t('cookieBanner.declineButton')}
            </button>
          </div>

          {/* Fine print */}
          <p className="mt-4 text-xs text-slate-500 dark:text-white/40 text-center">
            {t('cookieBanner.finePrint')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
