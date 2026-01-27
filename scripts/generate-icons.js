import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Function to generate icon with specific size
function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create gradient background (modern blue to purple gradient)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');

  // Draw rounded rectangle background
  const padding = size * 0.1;
  const radius = size * 0.2;
  ctx.fillStyle = gradient;

  // Rounded rectangle
  ctx.beginPath();
  ctx.roundRect(padding, padding, size - padding * 2, size - padding * 2, radius);
  ctx.fill();

  // Draw "et" text
  const fontSize = size * 0.5;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add subtle shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = size * 0.05;
  ctx.shadowOffsetY = size * 0.02;

  ctx.fillText('ET', size / 2, size / 2 + fontSize * 0.1);

  return canvas;
}

// Generate all three sizes
const sizes = [16, 48, 128];
const assetsDir = path.join(process.cwd(), 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

sizes.forEach(size => {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(assetsDir, `icon-${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
});

console.log('✓ All icons generated successfully!');
