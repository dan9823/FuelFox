/**
 * Generate FuelFox app icon - a cute fox face on warm gradient background
 * Run: cd app/server && node ../generate-icon.js
 */
const sharp = require('./server/node_modules/sharp');
const path = require('path');

const SIZE = 1024;

// SVG fox face icon
const svgIcon = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFB74D"/>
      <stop offset="50%" style="stop-color:#E8813A"/>
      <stop offset="100%" style="stop-color:#C66A28"/>
    </linearGradient>
    <linearGradient id="ear" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#E8813A"/>
      <stop offset="100%" style="stop-color:#C66A28"/>
    </linearGradient>
  </defs>

  <!-- Background with rounded corners -->
  <rect width="${SIZE}" height="${SIZE}" rx="220" ry="220" fill="url(#bg)"/>

  <!-- Subtle inner glow -->
  <rect width="${SIZE}" height="${SIZE}" rx="220" ry="220" fill="rgba(255,255,255,0.08)"/>

  <!-- LEFT EAR -->
  <path d="M 240 180 L 160 60 L 380 200 Z" fill="url(#ear)" stroke="#3A2A1A" stroke-width="8" stroke-linejoin="round"/>
  <path d="M 260 185 L 200 100 L 350 205 Z" fill="#F5C589"/>

  <!-- RIGHT EAR -->
  <path d="M 784 180 L 864 60 L 644 200 Z" fill="url(#ear)" stroke="#3A2A1A" stroke-width="8" stroke-linejoin="round"/>
  <path d="M 764 185 L 824 100 L 674 205 Z" fill="#F5C589"/>

  <!-- HEAD - main circle -->
  <circle cx="512" cy="440" r="290" fill="#E8813A" stroke="#3A2A1A" stroke-width="8"/>

  <!-- FACE - cream/white area -->
  <path d="M 340 400 Q 340 340 420 320 Q 470 308 512 305 Q 554 308 604 320 Q 684 340 684 400
           Q 684 500 604 580 Q 554 620 512 630 Q 470 620 420 580 Q 340 500 340 400 Z"
        fill="#F5C589"/>

  <!-- CHEEK FUR LEFT -->
  <path d="M 225 460 Q 210 440 220 410 Q 240 395 260 420 Q 245 450 225 460"
        fill="#E8813A" stroke="#3A2A1A" stroke-width="4"/>

  <!-- CHEEK FUR RIGHT -->
  <path d="M 799 460 Q 814 440 804 410 Q 784 395 764 420 Q 779 450 799 460"
        fill="#E8813A" stroke="#3A2A1A" stroke-width="4"/>

  <!-- LEFT EYE -->
  <ellipse cx="400" cy="400" rx="60" ry="68" fill="white" stroke="#3A2A1A" stroke-width="6"/>
  <circle cx="400" cy="400" r="40" fill="#1A1A1E"/>
  <circle cx="418" cy="380" r="16" fill="white"/>
  <circle cx="388" cy="420" r="7" fill="white"/>

  <!-- RIGHT EYE -->
  <ellipse cx="624" cy="400" rx="60" ry="68" fill="white" stroke="#3A2A1A" stroke-width="6"/>
  <circle cx="624" cy="400" r="40" fill="#1A1A1E"/>
  <circle cx="642" cy="380" r="16" fill="white"/>
  <circle cx="612" cy="420" r="7" fill="white"/>

  <!-- NOSE -->
  <path d="M 480 520 L 512 495 L 544 520 Q 532 540 512 545 Q 492 540 480 520 Z"
        fill="#1A1A1E" stroke="#3A2A1A" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="505" cy="512" rx="7" ry="5" fill="rgba(255,255,255,0.2)"/>

  <!-- MOUTH - W-shape fox smile -->
  <line x1="512" y1="545" x2="512" y2="555" stroke="#3A2A1A" stroke-width="6" stroke-linecap="round"/>
  <path d="M 450 565 Q 480 590 512 570 Q 544 590 574 565"
        fill="none" stroke="#3A2A1A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- TONGUE -->
  <ellipse cx="512" cy="582" rx="18" ry="14" fill="#F48FB1"/>

  <!-- BLUSH LEFT -->
  <ellipse cx="300" cy="480" rx="40" ry="24" fill="rgba(255,130,130,0.35)"/>

  <!-- BLUSH RIGHT -->
  <ellipse cx="724" cy="480" rx="40" ry="24" fill="rgba(255,130,130,0.35)"/>

  <!-- Small flame/energy symbol on forehead -->
  <path d="M 490 270 Q 500 240 512 255 Q 524 240 534 270 Q 540 295 512 315 Q 484 295 490 270 Z"
        fill="#FF9800" stroke="#3A2A1A" stroke-width="3" opacity="0.85"/>

  <!-- Subtle sparkle top-left -->
  <path d="M 150 150 L 160 175 L 170 150 L 160 125 Z" fill="rgba(255,255,255,0.5)"/>
  <path d="M 870 180 L 878 200 L 886 180 L 878 160 Z" fill="rgba(255,255,255,0.4)"/>

</svg>
`;

async function generateIcons() {
  const iconBuffer = Buffer.from(svgIcon);

  // Main icon (1024x1024)
  await sharp(iconBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'icon.png'));
  console.log('Generated icon.png (1024x1024)');

  // Splash icon (same design, good for splash)
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, 'assets', 'splash-icon.png'));
  console.log('Generated splash-icon.png (512x512)');

  // Favicon
  await sharp(iconBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(__dirname, 'assets', 'favicon.png'));
  console.log('Generated favicon.png (48x48)');

  // Android adaptive icon foreground
  await sharp(iconBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'android-icon-foreground.png'));
  console.log('Generated android-icon-foreground.png');

  // Android adaptive icon background (solid color)
  const bgSvg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" fill="#FFF0E0"/>
  </svg>`;
  await sharp(Buffer.from(bgSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'android-icon-background.png'));
  console.log('Generated android-icon-background.png');

  // Monochrome
  await sharp(iconBuffer)
    .resize(1024, 1024)
    .grayscale()
    .png()
    .toFile(path.join(__dirname, 'assets', 'android-icon-monochrome.png'));
  console.log('Generated android-icon-monochrome.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
