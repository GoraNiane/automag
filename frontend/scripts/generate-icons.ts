import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.resolve('public/icons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ultra-luxurious AutoElite SVG Icon with gold emblem, aerodynamic car silhouette, and sleek dark obsidian background
const createSvg = (size: number, isMaskable: boolean = false) => {
  const padding = isMaskable ? size * 0.15 : size * 0.08;
  const contentSize = size - padding * 2;
  
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#0B0F19" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    
    <!-- Gold Foil Luxury Gradients -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="30%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>

    <linearGradient id="goldAccent" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>

    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.3" />
      <stop offset="70%" stop-color="#F59E0B" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#0B0F19" stop-opacity="0" />
    </radialGradient>

    <filter id="luxuryShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.015}" stdDeviation="${size * 0.02}" flood-color="#000" flood-opacity="0.6"/>
    </filter>

    <filter id="goldShine" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${size * 0.008}" stdDeviation="${size * 0.01}" flood-color="#F59E0B" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : size * 0.22}" fill="url(#bgGrad)" />
  
  <!-- Subtle Outer Rim / Border for app feel -->
  ${!isMaskable ? `<rect x="${size * 0.01}" y="${size * 0.01}" width="${size * 0.98}" height="${size * 0.98}" rx="${size * 0.21}" fill="none" stroke="url(#goldGrad)" stroke-width="${size * 0.015}" stroke-opacity="0.4" />` : ''}

  <!-- Radial Glow Behind Emblem -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.4}" fill="url(#goldGlow)" />

  <!-- Center Group containing the AutoElite Luxury Badge -->
  <g transform="translate(${size / 2}, ${size / 2}) scale(${contentSize / 500})" filter="url(#luxuryShadow)">
    
    <!-- Outer Shield / Diamond Frame -->
    <path d="M 0,-170 L 150,-50 L 120,110 L 0,180 L -120,110 L -150,-50 Z" 
          fill="none" 
          stroke="url(#goldGrad)" 
          stroke-width="10" 
          stroke-linejoin="round" 
          opacity="0.85" />

    <!-- Inner Sleek Hexagon Contour -->
    <path d="M 0,-140 L 120,-40 L 95,90 L 0,150 L -95,90 L -120,-40 Z" 
          fill="#0B0F19" 
          fill-opacity="0.7"
          stroke="url(#goldAccent)" 
          stroke-width="4" 
          stroke-linejoin="round" />

    <!-- Aerodynamic Supercar Profile Top Silhouette -->
    <path d="M -110,20 Q -80,-30 -30,-45 Q 30,-50 90,-25 Q 115,-10 120,5 Q 90,8 60,8 Q -20,8 -110,20 Z" 
          fill="url(#goldAccent)" 
          filter="url(#goldShine)" />

    <!-- Dynamic Speed Lines / Aerodynamics -->
    <path d="M -90,-5 Q -30,-25 30,-25 Q 70,-25 100,-10" 
          fill="none" 
          stroke="#FFF" 
          stroke-width="4" 
          stroke-linecap="round" 
          opacity="0.9" />

    <!-- Headlight Beam Flare (Cyan-Gold) -->
    <polygon points="105,-12 140,-5 125,5 95,-3" fill="#38BDF8" opacity="0.8" />
    <circle cx="102" cy="-8" r="4" fill="#E0F2FE" />

    <!-- AutoElite 'AE' Monogram Typography -->
    <!-- 'A' Glyph -->
    <path d="M -55,90 L -25,-10 L 5,90 L -10,90 L -18,65 L -38,65 L -45,90 Z M -34,48 L -22,48 L -27,24 Z" 
          fill="url(#goldGrad)" 
          stroke="url(#goldAccent)" 
          stroke-width="1.5" />

    <!-- 'E' Glyph with modern aerodynamic cuts -->
    <path d="M 12,-10 L 62,-10 L 62,8 L 30,8 L 30,30 L 56,30 L 56,46 L 30,46 L 30,72 L 64,72 L 64,90 L 12,90 Z" 
          fill="url(#goldGrad)" 
          stroke="url(#goldAccent)" 
          stroke-width="1.5" />

    <!-- Luxury Stars (3 Prestige Stars) -->
    <!-- Center Star -->
    <polygon points="0,-85 3,-75 13,-75 5,-69 8,-59 0,-65 -8,-59 -5,-69 -13,-75 -3,-75" fill="url(#goldAccent)" />
    <!-- Left Star -->
    <polygon points="-30,-75 -28,-67 -20,-67 -26,-62 -24,-54 -30,-59 -36,-54 -34,-62 -40,-67 -32,-67" fill="url(#goldGrad)" opacity="0.9" transform="scale(0.8) translate(-10, -10)" />
    <!-- Right Star -->
    <polygon points="30,-75 32,-67 40,-67 34,-62 36,-54 30,-59 24,-54 26,-62 20,-67 28,-67" fill="url(#goldGrad)" opacity="0.9" transform="scale(0.8) translate(10, -10)" />

    <!-- Premium Subtitle Badge -->
    <rect x="-65" y="105" width="130" height="20" rx="10" fill="#1E293B" stroke="url(#goldGrad)" stroke-width="2" />
    <text x="0" y="119" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#FDE68A" text-anchor="middle" letter-spacing="3">AUTOELITE</text>
  </g>
</svg>
`;
};

async function generateIcons() {
  console.log('Generating PWA and App Icons...');

  const iconSizes = [
    { name: 'icon-192x192.png', size: 192, maskable: false },
    { name: 'icon-512x512.png', size: 512, maskable: false },
    { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
    { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
    { name: 'favicon-32x32.png', size: 32, maskable: false },
    { name: 'favicon-16x16.png', size: 16, maskable: false },
  ];

  for (const { name, size, maskable } of iconSizes) {
    const svg = createSvg(size, maskable);
    const destPath = path.join(outputDir, name);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(destPath);
    console.log(`Generated: ${name} (${size}x${size})`);

    // Also copy 192, 512 and apple-touch-icon to public root for immediate direct access
    if (['icon-192x192.png', 'icon-512x512.png', 'apple-touch-icon.png'].includes(name)) {
      const rootDest = path.resolve('public', name);
      fs.copyFileSync(destPath, rootDest);
    }
  }

  // Generate SVG icon in public/icons/icon.svg and public/favicon.svg
  const masterSvg = createSvg(512, false);
  fs.writeFileSync(path.join(outputDir, 'icon.svg'), masterSvg);
  fs.writeFileSync(path.resolve('public/favicon.svg'), masterSvg);
  console.log('Generated: icon.svg and updated favicon.svg');

  console.log('Icon generation completed successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
