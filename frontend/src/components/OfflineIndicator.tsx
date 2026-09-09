import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { subscribePWAState } from '../pwa/registerServiceWorker';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribePWAState((state) => {
      if (state.isOffline) {
        setIsOffline(true);
        setHasBeenOffline(true);
        setShowRestored(false);
      } else {
        setIsOffline(false);
        if (hasBeenOffline) {
          setShowRestored(true);
          const timer = setTimeout(() => setShowRestored(false), 3500);
          return () => clearTimeout(timer);
        }
      }
    });

    return () => unsubscribe();
  }, [hasBeenOffline]);

  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white text-xs font-semibold py-2 px-4 shadow-lg flex items-center justify-center gap-2 animate-fade-in backdrop-blur-md">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>Mode Hors-Ligne - Vous naviguez actuellement sur le catalogue sauvegardé en local.</span>
      </div>
    );
  }

  if (showRestored) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold py-2 px-4 shadow-lg flex items-center justify-center gap-2 animate-fade-in backdrop-blur-md">
        <Wifi className="w-4 h-4" />
        <span>Connexion rétablie ! Les données sont automatiquement synchronisées.</span>
      </div>
    );
  }

  return null;
};
