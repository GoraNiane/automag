import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, X, Smartphone, Sparkles, Check, Share2, PlusSquare } from 'lucide-react';
import { subscribePWAState, promptPWAInstall, applyPWAUpdate, PWAState } from '../pwa/registerServiceWorker';

export const PWAInstallBanner: React.FC = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: false,
    hasUpdate: false,
  });
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check localStorage dismissal
    const dismissedAt = localStorage.getItem('autoelite_pwa_dismissed');
    if (dismissedAt) {
      const hoursPassed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (hoursPassed < 24) {
        setIsDismissed(true);
      }
    }

    const unsubscribe = subscribePWAState(setPwaState);
    return () => unsubscribe();
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('autoelite_pwa_dismissed', Date.now().toString());
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    const result = await promptPWAInstall();
    if (result === 'unsupported' && isIOS) {
      setShowIOSModal(true);
    }
  };

  // If already installed and no update, hide banner
  if (pwaState.isInstalled && !pwaState.hasUpdate) {
    return null;
  }

  // Update Available Notification
  if (pwaState.hasUpdate) {
    return (
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100%-3rem)] bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-white">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-amber-200">Mise à jour disponible</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Une nouvelle version d'AutoElite est prête.
            </p>
            <button
              onClick={applyPWAUpdate}
              className="mt-2.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg transition-all duration-200 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Actualiser maintenant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user dismissed banner and there's no update, stay hidden
  if (isDismissed) {
    return null;
  }

  // Show installation banner (either installable on Android/desktop or iOS guide)
  if (!pwaState.isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-slate-900/95 border border-amber-500/30 backdrop-blur-xl rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-white animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-slate-800 border border-amber-500/40 p-1 flex items-center justify-center shrink-0 shadow-inner">
              <img src="/icons/icon-192x192.png" alt="AutoElite App" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">AutoElite Sénégal</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  App PWA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Installez l'application sur votre écran d'accueil pour une expérience ultra-fluide et hors-ligne.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Installer l'application</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Installer sur iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium text-white flex items-center gap-1.5">
                    Appuyez sur le bouton Partager <Share2 className="w-4 h-4 text-amber-400 inline" />
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">En bas de votre navigateur Safari</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium text-white flex items-center gap-1.5">
                    Sélectionnez <PlusSquare className="w-4 h-4 text-amber-400 inline" /> « Sur l'écran d'accueil »
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Faites défiler le menu de partage vers le bas</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-medium text-white flex items-center gap-1.5">
                    Touchez « Ajouter » <Check className="w-4 h-4 text-emerald-400 inline" />
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">AutoElite apparaîtra directement sur votre écran</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </>
  );
};
