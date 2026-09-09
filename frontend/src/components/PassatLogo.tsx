import React from 'react';

interface PassatLogoProps {
  /** Optional custom class for the outer wrapper */
  className?: string;
  /** Width in pixels or CSS string (default: 40px) */
  size?: number | string;
}

/**
 * Volkswagen Passat 2012 Front-Facing Logo Graphic
 * 
 * - Modèle Passat 2012 B7/NMS
 * - Vue strictement de face (0° d'angle, symétrie parfaite)
 * - Carrosserie noire avec reflets subtils
 * - Calandre 3 lames chromées signature VW avec emblème circulaire
 * - Phares avant réalistes avec optiques doubles
 * - Éléments lumineux indépendants .headlight-left et .headlight-right
 * - Totalement statique (aucun mouvement, tilt, ou déplacement)
 */
export const PassatLogo: React.FC<PassatLogoProps> = ({
  className = '',
  size = 40
}) => {
  const widthStyle = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{
        width: widthStyle,
        aspectRatio: '100 / 64',
        pointerEvents: 'none'
      }}
      aria-label="Volkswagen Passat 2012 - NBKF AutoElite"
    >
      {/* 
        Volkswagen Passat 2012 Vector Graphic (Strictly Frontal View)
        100% vector SVG - Crisp at any resolution
      */}
      <svg
        viewBox="0 0 100 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        <defs>
          {/* Carrosserie glossy black gradient */}
          <linearGradient id="passatBody" x1="50" y1="20" x2="50" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e2024" />
            <stop offset="35%" stopColor="#0d0e11" />
            <stop offset="100%" stopColor="#050607" />
          </linearGradient>

          {/* Hood highlight gradient */}
          <linearGradient id="passatHood" x1="50" y1="30" x2="50" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2a2c33" />
            <stop offset="60%" stopColor="#14161a" />
            <stop offset="100%" stopColor="#0a0a0d" />
          </linearGradient>

          {/* Windshield tint gradient */}
          <linearGradient id="passatWindshield" x1="50" y1="14" x2="50" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06080b" />
            <stop offset="50%" stopColor="#10141a" />
            <stop offset="100%" stopColor="#080a0d" />
          </linearGradient>

          {/* Chrome slat gradient */}
          <linearGradient id="passatChrome" x1="34" y1="41" x2="66" y2="41" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="25%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="75%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Headlight inner reflector gradient */}
          <linearGradient id="headlightInnerL" x1="18" y1="38" x2="34" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="40%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="headlightInnerR" x1="82" y1="38" x2="66" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="40%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Ground shadow radial */}
          <radialGradient id="passatGroundShadow" cx="50" cy="62" rx="44" ry="2.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Ground Shadow */}
        <ellipse cx="50" cy="62" rx="44" ry="2.5" fill="url(#passatGroundShadow)" />

        {/* 2. Tires (Front wheels visible underneath) */}
        {/* Left Tire */}
        <rect x="11.5" y="48" width="7" height="13" rx="2" fill="#090a0c" />
        <rect x="12" y="49" width="1.5" height="11" rx="0.5" fill="#1b1d22" />
        {/* Right Tire */}
        <rect x="81.5" y="48" width="7" height="13" rx="2" fill="#090a0c" />
        <rect x="86.5" y="49" width="1.5" height="11" rx="0.5" fill="#1b1d22" />

        {/* 3. Aerodynamic Side Mirrors */}
        {/* Left Mirror */}
        <path
          d="M 19 32.5 C 14 32.5 10 34 9.5 37.5 C 9 40 12 40.5 18 39 Z"
          fill="#111317"
          stroke="#262930"
          strokeWidth="0.6"
        />
        <line x1="11" y1="36" x2="16.5" y2="35.5" stroke="#f1f5f9" strokeWidth="0.75" strokeLinecap="round" opacity="0.9" />

        {/* Right Mirror */}
        <path
          d="M 81 32.5 C 86 32.5 90 34 90.5 37.5 C 91 40 88 40.5 82 39 Z"
          fill="#111317"
          stroke="#262930"
          strokeWidth="0.6"
        />
        <line x1="89" y1="36" x2="83.5" y2="35.5" stroke="#f1f5f9" strokeWidth="0.75" strokeLinecap="round" opacity="0.9" />

        {/* 4. Roofline and Cabin */}
        <path
          d="M 33 14 C 42 13 58 13 67 14 C 74 15 78.5 24 81 33.5 L 19 33.5 C 21.5 24 26 15 33 14 Z"
          fill="#0a0c0f"
        />

        {/* 5. Windshield & Rearview Mirror */}
        <path
          d="M 34.5 15.2 C 43 14.5 57 14.5 65.5 15.2 C 71.5 16.5 76 25 78.5 33 L 21.5 33 C 24 25 28.5 16.5 34.5 15.2 Z"
          fill="url(#passatWindshield)"
        />
        {/* Rearview Mirror */}
        <rect x="47.5" y="16.5" width="5" height="2.2" rx="0.7" fill="#000000" stroke="#334155" strokeWidth="0.4" />
        {/* Subtle Windshield Glass Reflection */}
        <path
          d="M 38 16 L 46 16 L 31 32.5 L 26 32.5 Z"
          fill="white"
          fillOpacity="0.04"
        />

        {/* 6. Main Body & Front Fascia (Passat 2012 B7 Front) */}
        {/* Hood & Front Bumper Shell */}
        <path
          d="M 19 33 
             C 17 38 14.5 44 14.5 48 
             C 14.5 52.5 16 56 18.5 57.5 
             C 23 59.5 36 60 50 60 
             C 64 60 77 59.5 81.5 57.5 
             C 84 56 85.5 52.5 85.5 48 
             C 85.5 44 83 38 81 33 
             Z"
          fill="url(#passatBody)"
          stroke="#262930"
          strokeWidth="0.7"
        />

        {/* Passat 2012 Hood & Power Bulge Lines */}
        <path
          d="M 21.5 33 C 26 34 33 34.5 50 34.5 C 67 34.5 74 34 78.5 33 L 79 36.5 C 73 37.5 67 38 50 38 C 33 38 27 37.5 21 36.5 Z"
          fill="url(#passatHood)"
        />
        {/* Twin Characteristic Creases from A-pillar to Grille */}
        <path d="M 29 33 L 34.5 38.5" stroke="#3b404a" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M 71 33 L 65.5 38.5" stroke="#3b404a" strokeWidth="0.8" strokeLinecap="round" />

        {/* 7. Passat 2012 Signature Grille with 3 Chrome Blades */}
        {/* Grille Base / Dark Intake Cavity */}
        <rect x="34.5" y="37" width="31" height="8.5" rx="1" fill="#040507" stroke="#1f242d" strokeWidth="0.5" />

        {/* Chrome Blade 1 (Top) */}
        <line x1="35" y1="38" x2="65" y2="38" stroke="url(#passatChrome)" strokeWidth="1" />
        {/* Chrome Blade 2 (Middle, split by VW roundel) */}
        <line x1="35" y1="41.2" x2="45" y2="41.2" stroke="url(#passatChrome)" strokeWidth="0.9" />
        <line x1="55" y1="41.2" x2="65" y2="41.2" stroke="url(#passatChrome)" strokeWidth="0.9" />
        {/* Chrome Blade 3 (Bottom) */}
        <line x1="35.5" y1="44.3" x2="64.5" y2="44.3" stroke="url(#passatChrome)" strokeWidth="1" />

        {/* 8. Volkswagen Emblem (Dead Center of Grille) */}
        <g id="vw-emblem">
          {/* Chrome outer ring */}
          <circle cx="50" cy="41.2" r="4.6" fill="#08090c" stroke="url(#passatChrome)" strokeWidth="0.9" />
          {/* Inner chrome ring */}
          <circle cx="50" cy="41.2" r="3.7" stroke="#64748b" strokeWidth="0.4" fill="#050608" />
          {/* 'V' Top */}
          <path
            d="M 48.2 39.2 L 50 42.1 L 51.8 39.2"
            stroke="url(#passatChrome)"
            strokeWidth="0.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 'W' Bottom */}
          <path
            d="M 47.3 40.2 L 48.8 43.4 L 50 41.5 L 51.2 43.4 L 52.7 40.2"
            stroke="url(#passatChrome)"
            strokeWidth="0.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 9. Passat 2012 Angular Headlights (Twin Optics Units) */}
        {/* Left Headlight */}
        <g id="headlight-housing-left">
          {/* Trapezoidal Glass Contour */}
          <path
            d="M 34.5 37 L 18.5 37.8 C 17.5 38 16.5 39 16 41.5 C 15.5 43.5 17 45.2 19 45.5 L 34.5 45.5 Z"
            fill="url(#headlightInnerL)"
            stroke="#475569"
            strokeWidth="0.6"
          />
          {/* Outer Projector Lens (Main Low Beam) */}
          <circle cx="21.5" cy="41.5" r="2.6" fill="#1e293b" stroke="#cbd5e1" strokeWidth="0.6" />
          <circle cx="21.5" cy="41.5" r="1.3" fill="#f8fafc" fillOpacity="0.85" />
          {/* Inner Reflector Lens (High Beam) */}
          <ellipse cx="29" cy="41.5" rx="2.2" ry="1.9" fill="#1e293b" stroke="#94a3b8" strokeWidth="0.5" />
          <circle cx="29" cy="41.5" r="0.9" fill="#e2e8f0" fillOpacity="0.7" />
          {/* Top chrome eyebrow accent (2012 Passat headlight line) */}
          <path d="M 34 37.6 L 19 38.3" stroke="#e2e8f0" strokeWidth="0.6" strokeLinecap="round" />
        </g>

        {/* Right Headlight */}
        <g id="headlight-housing-right">
          {/* Trapezoidal Glass Contour */}
          <path
            d="M 65.5 37 L 81.5 37.8 C 82.5 38 83.5 39 84 41.5 C 84.5 43.5 83 45.2 81 45.5 L 65.5 45.5 Z"
            fill="url(#headlightInnerR)"
            stroke="#475569"
            strokeWidth="0.6"
          />
          {/* Outer Projector Lens (Main Low Beam) */}
          <circle cx="78.5" cy="41.5" r="2.6" fill="#1e293b" stroke="#cbd5e1" strokeWidth="0.6" />
          <circle cx="78.5" cy="41.5" r="1.3" fill="#f8fafc" fillOpacity="0.85" />
          {/* Inner Reflector Lens (High Beam) */}
          <ellipse cx="71" cy="41.5" rx="2.2" ry="1.9" fill="#1e293b" stroke="#94a3b8" strokeWidth="0.5" />
          <circle cx="71" cy="41.5" r="0.9" fill="#e2e8f0" fillOpacity="0.7" />
          {/* Top chrome eyebrow accent */}
          <path d="M 66 37.6 L 81 38.3" stroke="#e2e8f0" strokeWidth="0.6" strokeLinecap="round" />
        </g>

        {/* 10. Front Bumper Divide & Lower Fascia */}
        {/* Horizontal bumper split crease */}
        <path
          d="M 16.5 47 C 26 48 37 48.5 50 48.5 C 63 48.5 74 48 83.5 47"
          stroke="#1b1e24"
          strokeWidth="0.6"
        />

        {/* Lower Central Air Intake */}
        <path
          d="M 31 51 L 69 51 L 67.5 56.5 L 32.5 56.5 Z"
          fill="#040507"
          stroke="#1e242d"
          strokeWidth="0.5"
        />
        {/* Lower Chrome Trim Strip (Passat signature) */}
        <line x1="28" y1="56.8" x2="72" y2="56.8" stroke="url(#passatChrome)" strokeWidth="0.75" strokeLinecap="round" />

        {/* Fog Light Left */}
        <rect x="18" y="51.5" width="8" height="4" rx="1" fill="#0b0e14" stroke="#334155" strokeWidth="0.5" />
        <ellipse cx="22" cy="53.5" rx="2" ry="1.2" fill="#cbd5e1" fillOpacity="0.5" />

        {/* Fog Light Right */}
        <rect x="74" y="51.5" width="8" height="4" rx="1" fill="#0b0e14" stroke="#334155" strokeWidth="0.5" />
        <ellipse cx="78" cy="53.5" rx="2" ry="1.2" fill="#cbd5e1" fillOpacity="0.5" />

        {/* Lower Front Lip Spoiler */}
        <path
          d="M 20 58.5 C 32 60 68 60 80 58.5 L 81.5 59.5 C 68 61 32 61 18.5 59.5 Z"
          fill="#060709"
        />
      </svg>

      {/* 
        Independent Luminous Elements (Animated in CSS)
        .headlight-left and .headlight-right are locked via percentage coordinates
        over the exact projector positions (x: 21.5%, y: 64.8% & x: 78.5%, y: 64.8%)
      */}

      {/* Subtle Hood & Bumper Reflection on Carrosserie */}
      <div
        className="headlight-reflection"
        style={{
          left: '14%',
          right: '14%',
          top: '60%',
          height: '24%',
          borderRadius: '50%'
        }}
      />

      {/* Left Headlight Luminous Glow */}
      <div
        className="headlight-left"
        style={{
          left: '16.5%',
          top: '59.5%',
          width: '12%',
          height: '13%'
        }}
      />

      {/* Right Headlight Luminous Glow */}
      <div
        className="headlight-right"
        style={{
          right: '16.5%',
          top: '59.5%',
          width: '12%',
          height: '13%'
        }}
      />
    </div>
  );
};

export default PassatLogo;
