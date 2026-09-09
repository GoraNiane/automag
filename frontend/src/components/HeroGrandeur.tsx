import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import grandeurOff from '../assets/grandeur-off.jpg';
import grandeurOn from '../assets/grandeur-on.jpg';

interface HeroGrandeurProps {
  onExploreClick?: () => void;
}

/**
 * Ultra-realistic luxury automotive HERO for NBKF AUTOELITE.
 * Features:
 * - Obsidian black Hyundai Grandeur parked facing the user in a dark minimalist showroom
 * - Sequential LED headlight activation:
 *   1. Initial dark showroom (0.0s - 0.8s)
 *   2. Left headlight illuminates smoothly (at 0.8s)
 *   3. Right headlight illuminates (~120ms later, at 0.92s)
 *   4. Full photorealistic beam reflections pool on the dark polished floor
 *   5. Subtle 7-second breathing cycle (100% -> 90% -> 100%)
 * - 100% stationary vehicle (no camera shifts, no movement)
 * - Pure monochrome luxury palette (black, dark anthracite, crisp white)
 */
export default function HeroGrandeur({ onExploreClick }: HeroGrandeurProps) {
  const shouldReduceMotion = useReducedMotion();
  // 0: All off, 1: Left light turning on, 2: Right light turning on, 3: Fully lit and breathing
  const [headlightStep, setHeadlightStep] = useState<number>(shouldReduceMotion ? 3 : 0);
  const [isHeroReady, setIsHeroReady] = useState(false);

  useEffect(() => {
    // Micro-interaction: fade in hero container softly
    const tReady = setTimeout(() => setIsHeroReady(true), 50);

    if (shouldReduceMotion) {
      setHeadlightStep(3);
      return () => clearTimeout(tReady);
    }

    // Step 2: Left headlight awakens at 800ms
    const tLeft = setTimeout(() => {
      setHeadlightStep(1);
    }, 800);

    // Step 3: Right headlight awakens 120ms later (at 920ms)
    const tRight = setTimeout(() => {
      setHeadlightStep(2);
    }, 920);

    // Step 4: Full steady-state settling at 1600ms
    const tFull = setTimeout(() => {
      setHeadlightStep(3);
    }, 1600);

    return () => {
      clearTimeout(tReady);
      clearTimeout(tLeft);
      clearTimeout(tRight);
      clearTimeout(tFull);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="relative w-full min-h-[640px] md:min-h-[720px] lg:min-h-[820px] xl:min-h-[880px] bg-black overflow-hidden flex flex-col justify-between items-center select-none pt-8 pb-12 sm:pb-16 transition-opacity duration-700 ease-out"
      style={{ opacity: isHeroReady ? 1 : 0 }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAGE 1: CINEMATIC SHOWROOM BACKDROP & STUDIO LIGHTING
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-black pointer-events-none z-10" />
      
      {/* Soft Top Down Ceiling Light (Sculpting the Grandeur roof & hood) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none z-10 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAGE 2: THE CAR (STATIONARY HYUNDAI GRANDEUR)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      
      {/* Base Layer: Headlights completely OFF */}
      <img
        src={grandeurOff}
        alt="Hyundai Grandeur Noire - NBKF AutoElite"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        fetchPriority="high"
      />

      {/* Left Headlight & Floor Beam (Viewer's Left, Car's Right) */}
      <div
        className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-700 ease-out ${
          headlightStep >= 1 ? 'opacity-100' : 'opacity-0'
        } ${headlightStep === 3 ? 'animate-headlight-breathe' : ''}`}
        style={{
          clipPath: 'polygon(0% 0%, 50.05% 0%, 50.05% 100%, 0% 100%)'
        }}
      >
        <img
          src={grandeurOn}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right Headlight & Floor Beam (Viewer's Right, Car's Left) */}
      <div
        className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-700 ease-out ${
          headlightStep >= 2 ? 'opacity-100' : 'opacity-0'
        } ${headlightStep === 3 ? 'animate-headlight-breathe' : ''}`}
        style={{
          clipPath: 'polygon(49.95% 0%, 100% 0%, 100% 100%, 49.95% 100%)'
        }}
      >
        <img
          src={grandeurOn}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAGE 3: SUBTLE PRECISION LIGHTING LAYERS (NO SCI-FI)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Left LED Projector Aperture & Soft White Halo */}
      <div
        className={`absolute pointer-events-none z-2 transition-opacity duration-500 ease-out ${
          headlightStep >= 1 ? 'opacity-90' : 'opacity-0'
        } ${headlightStep === 3 ? 'animate-headlight-breathe' : ''}`}
        style={{
          left: '32.6%',
          top: '59.8%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Soft white core */}
        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/20 blur-md" />
        <div className="absolute inset-0 m-auto w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-white/90 blur-[2px]" />
      </div>

      {/* Right LED Projector Aperture & Soft White Halo */}
      <div
        className={`absolute pointer-events-none z-2 transition-opacity duration-500 ease-out ${
          headlightStep >= 2 ? 'opacity-90' : 'opacity-0'
        } ${headlightStep === 3 ? 'animate-headlight-breathe' : ''}`}
        style={{
          left: '67.4%',
          top: '59.8%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Soft white core */}
        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/20 blur-md" />
        <div className="absolute inset-0 m-auto w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-white/90 blur-[2px]" />
      </div>

      {/* Forward Floor Light Diffusion (Soft white ambient pool) */}
      <div
        className={`absolute bottom-0 inset-x-0 h-44 sm:h-56 pointer-events-none z-2 transition-opacity duration-1000 ease-out flex justify-between px-[12%] sm:px-[18%] ${
          headlightStep >= 2 ? 'opacity-100' : headlightStep === 1 ? 'opacity-40' : 'opacity-0'
        } ${headlightStep === 3 ? 'animate-headlight-breathe' : ''}`}
      >
        {/* Left floor pool */}
        <div 
          className="w-48 sm:w-72 h-full rounded-full opacity-35 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)'
          }}
        />
        {/* Right floor pool */}
        <div 
          className="w-48 sm:w-72 h-full rounded-full opacity-35 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)'
          }}
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAGE 4: BRAND IDENTITY & TEXT (HIERARCHY 3, 4)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-3 sm:space-y-4 pt-2 sm:pt-4">
        {/* Private Showroom Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
            Concession Automobile Premium
          </span>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-none">
            NBKF AUTO<span className="font-light text-white/75">ELITE</span>
          </h1>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/50 font-bold">
            Sénégal
          </p>
        </motion.div>

        {/* Minimalist Slogan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-xs sm:text-sm text-neutral-300 font-light tracking-wide max-w-md mx-auto leading-relaxed"
        >
          L'Excellence Automobile au Sénégal &bull; Véhicules d'Exception & d'Occasion
        </motion.p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAGE 5: CTA BUTTON (HIERARCHY 5)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-20 text-center"
      >
        <Link
          to="/voitures"
          onClick={onExploreClick}
          className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-[0.22em] rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-white"
        >
          <span>Découvrir nos véhicules</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}
