import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

// Brand colors
const BG      = '#f5f0e8'
const ACCENT  = '#8b5c2a'
const PAPER   = '#faf7f2'
const INK     = '#2c2416'

// SVG for icon (coffee cup silhouette on warm background)
function iconSvg(size) {
  const pad = size * 0.18
  const inner = size - pad * 2
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${ACCENT}"/>
  <text x="${size / 2}" y="${size * 0.68}" font-size="${inner * 0.72}" text-anchor="middle" dominant-baseline="auto" font-family="serif">☕</text>
</svg>`.trim()
}

// OGP image 1200x630
function ogSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <!-- grain texture approximation -->
  <rect width="1200" height="630" fill="${ACCENT}" opacity="0.04"/>
  <!-- decorative border -->
  <rect x="32" y="32" width="1136" height="566" rx="24" fill="none" stroke="${ACCENT}" stroke-width="1.5" opacity="0.3"/>
  <!-- icon -->
  <text x="600" y="240" font-size="120" text-anchor="middle" dominant-baseline="auto" font-family="serif">☕</text>
  <!-- title -->
  <text x="600" y="340" font-size="72" font-weight="300" text-anchor="middle" dominant-baseline="hanging"
        font-family="Georgia, serif" fill="${INK}" letter-spacing="8">Drip Guide</text>
  <!-- subtitle -->
  <text x="600" y="430" font-size="28" text-anchor="middle" dominant-baseline="hanging"
        font-family="sans-serif" fill="${ACCENT}" letter-spacing="4" font-weight="400">HAND DRIP CALCULATOR</text>
  <!-- description -->
  <text x="600" y="500" font-size="22" text-anchor="middle" dominant-baseline="hanging"
        font-family="sans-serif" fill="${INK}" opacity="0.55">豆のグラム数を入れるだけでレシピが即計算</text>
</svg>`.trim()
}

async function generate() {
  // icon-192
  await sharp(Buffer.from(iconSvg(192)))
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'))
  console.log('icon-192.png generated')

  // icon-512
  await sharp(Buffer.from(iconSvg(512)))
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'))
  console.log('icon-512.png generated')

  // og-image
  await sharp(Buffer.from(ogSvg()))
    .png()
    .toFile(path.join(publicDir, 'og-image.png'))
  console.log('og-image.png generated')
}

generate().catch(console.error)
