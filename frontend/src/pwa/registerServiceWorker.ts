/**
 * AutoElite Senegal - Service Worker & PWA Manager
 */

export interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
}

let deferredPrompt: any = null;
let updateWaitingWorker: ServiceWorker | null = null;
const listeners = new Set<(state: PWAState) => void>();

let currentState: PWAState = {
  isInstalled: false,
  isInstallable: false,
  isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  hasUpdate: false,
};

function notifyListeners() {
  listeners.forEach((listener) => listener({ ...currentState }));
}

export function subscribePWAState(listener: (state: PWAState) => void) {
  listeners.add(listener);
  listener({ ...currentState });
  return () => {
    listeners.delete(listener);
  };
}

export function registerPWA() {
  if (typeof window === 'undefined') return;

  // Check if running in standalone mode (already installed as PWA)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  currentState.isInstalled = isStandalone;
  notifyListeners();

  // Network online/offline listeners
  window.addEventListener('online', () => {
    currentState.isOffline = false;
    notifyListeners();
  });

  window.addEventListener('offline', () => {
    currentState.isOffline = true;
    notifyListeners();
  });

  // Capture beforeinstallprompt for custom install banner
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    currentState.isInstallable = true;
    notifyListeners();
    console.log('[AutoElite PWA] Application ready for installation.');
  });

  // Detect appinstalled
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    currentState.isInstallable = false;
    currentState.isInstalled = true;
    notifyListeners();
    console.log('[AutoElite PWA] Application installed successfully!');
  });

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[AutoElite PWA] Service Worker active with scope:', reg.scope);

          // Check if there is an update waiting
          if (reg.waiting) {
            updateWaitingWorker = reg.waiting;
            currentState.hasUpdate = true;
            notifyListeners();
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  updateWaitingWorker = newWorker;
                  currentState.hasUpdate = true;
                  notifyListeners();
                  console.log('[AutoElite PWA] New update ready to apply.');
                }
              });
            }
          });

          // Check for SW updates every hour
          setInterval(() => {
            reg.update().catch((err) => console.log('[AutoElite PWA] Auto-update check:', err));
          }, 60 * 60 * 1000);
        })
        .catch((err) => {
          console.warn('[AutoElite PWA] Service Worker registration skipped/failed:', err);
        });
    });

    // Reload page when new worker takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}

/**
 * Triggers the native browser install prompt (Android, Chrome, Edge)
 */
export async function promptPWAInstall(): Promise<'accepted' | 'dismissed' | 'unsupported'> {
  if (!deferredPrompt) {
    return 'unsupported';
  }

  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    currentState.isInstallable = false;
    notifyListeners();
    return choice.outcome;
  } catch (err) {
    console.error('[AutoElite PWA] Install error:', err);
    return 'unsupported';
  }
}

/**
 * Tells the waiting Service Worker to skipWaiting and immediately update the app
 */
export function applyPWAUpdate() {
  if (updateWaitingWorker) {
    updateWaitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }
}
