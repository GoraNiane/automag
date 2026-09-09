import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PassatLogo from './PassatLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Ultra-premium minimalist automotive splash screen.
 * Art direction:
 * - Pure white background (#FFFFFF)
 * - Deep black original logo, perfectly centered and razor-sharp
 * - Cinematic fade-in + subtle zoom
 * - Minimalist horizontal progress line filling left-to-right
 * - Soft ambient depth and smooth dissolve into homepage
 */
export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'initial' | 'revealed' | 'loading' | 'completed' | 'exit'>('initial');

  useEffect(() => {
    // Lock scrolling on document body while splash screen is mounted
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Allow user to press Escape to instantly skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (shouldReduceMotion) {
      const quickTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(quickTimer);
      };
    }

    // 0.0s - 0.35s: Pure white minimalist canvas
    // 0.35s: Subtle ambient shadow and logo reveal starts
    const t1 = setTimeout(() => setPhase('revealed'), 350);

    // 1.15s: Elegant horizontal loading line appears and begins filling
    const t2 = setTimeout(() => setPhase('loading'), 1150);

    // 2.30s: Loading complete -> line gently fades out
    const t3 = setTimeout(() => setPhase('completed'), 2300);

    // 2.75s: Pause on crisp centered logo, then fluid cinematic dissolve
    const t4 = setTimeout(() => {
      setPhase('exit');
      setTimeout(onComplete, 550);
    }, 2750);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, shouldReduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Subtle Central Ambient Depth (Very soft diffuse shadow on white) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{
          opacity: phase !== 'initial' && phase !== 'exit' ? 1 : 0,
          scale: phase !== 'initial' && phase !== 'exit' ? 1 : 0.88
        }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.012) 42%, transparent 70%)',
          filter: 'blur(36px)'
        }}
      />

      {/* Main Container - Dead Center */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Original Brand Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{
            opacity: phase !== 'initial' ? 1 : 0,
            scale: phase !== 'initial' ? 1 : 0.94,
            y: phase !== 'initial' ? 0 : 8
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center gap-3.5 sm:gap-4"
        >
          {/* Logo Badge (Identical shape, proportions, and colors) */}
          <div className="relative p-2 sm:p-2.5 bg-black rounded-xl sm:rounded-2xl border border-black shadow-[0_12px_28px_-6px_rgba(0,0,0,0.16)] flex items-center justify-center overflow-hidden">
            <PassatLogo size={42} className="sm:w-[48px]" />

            {/* Subtle luxury light sheen reflection over the icon badge */}
            <motion.div
              initial={{ x: '-150%', opacity: 0 }}
              animate={phase !== 'initial' ? { x: '250%', opacity: [0, 0.3, 0] } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] pointer-events-none"
            />
          </div>

          {/* Original Typography */}
          <div className="text-left select-none">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-black leading-none block">
              NBKF AUTO<span className="font-light text-black/80">ELITE</span>
            </span>
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-black/50 font-bold leading-none mt-1.5">
              Sénégal
            </span>
          </div>
        </motion.div>

        {/* Minimalist Horizontal Loading Line */}
        <div className="mt-8 sm:mt-10 h-[1.5px] w-36 sm:w-44 relative overflow-hidden">
          {/* Track (Extremely subtle guide line) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === 'loading' ? 0.12 : (phase === 'completed' || phase === 'exit' ? 0 : 0)
            }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-black rounded-full"
          />

          {/* Fill line: elegant progressive reveal from left to right */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: phase === 'loading' || phase === 'completed' || phase === 'exit' ? 1 : 0,
              opacity: phase === 'loading' ? 1 : (phase === 'completed' || phase === 'exit' ? 0 : 0)
            }}
            transition={{
              scaleX: { duration: 1.15, ease: [0.4, 0.0, 0.2, 1] },
              opacity: { duration: 0.3 }
            }}
            style={{ transformOrigin: 'left' }}
            className="h-full w-full bg-black rounded-full shadow-[0_0_6px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      {/* Discrete Skip Button (Accessible & Minimalist) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== 'initial' && phase !== 'exit' ? 1 : 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        onClick={onComplete}
        className="absolute bottom-6 sm:bottom-8 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-black/30 hover:text-black transition-colors duration-200 cursor-pointer px-3 py-1"
        aria-label="Passer l'introduction"
      >
        Passer
      </motion.button>
    </motion.div>
  );
}
