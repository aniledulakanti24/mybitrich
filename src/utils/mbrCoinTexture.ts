import * as THREE from 'three';

/**
 * Generates an ultra-high-resolution (1024x1024), minted 24K gold MBR Coin Face Texture.
 * Features:
 * - Massive, chiseled, ultra-high-contrast "MBR" center lettering visible from extreme distances
 * - Arched "★ MYBITRICH ★" header
 * - Arched "150M HARD CAP · BEP-20" footer
 * - 64 perimeter golden denticle beads (classic sovereign coin teeth)
 * - Concentric embossed precision rim grooves
 * - Radiant 24K specular gold luster
 */
export function createMBRCoinTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 512;
  const cy = 512;

  // 1. Base Minted 24K Gold Specular Radial Gradient
  const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 512);
  grad.addColorStop(0, '#FFFFFF'); // Specular light highlight
  grad.addColorStop(0.15, '#FFF6C7'); // Lustrous pale gold
  grad.addColorStop(0.40, '#F5C042'); // Core 24K bullion gold
  grad.addColorStop(0.72, '#D97706'); // Deep amber luster
  grad.addColorStop(0.92, '#92400E'); // Rich dark bronze edge
  grad.addColorStop(1.0, '#451A03'); // Outer shadow rim
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 508, 0, Math.PI * 2);
  ctx.fill();

  // 2. Beaded Denticles / Perimeter Coin Teeth (64 minted gold beads)
  for (let i = 0; i < 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const bx = cx + Math.cos(angle) * 480;
    const by = cy + Math.sin(angle) * 480;
    ctx.fillStyle = i % 2 === 0 ? '#FFFBEB' : '#78350F';
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Concentric Precision Embossed Grooves
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 456, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 448, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Arched Curved Text Top: "★ MYBITRICH ★"
  ctx.save();
  ctx.translate(cx, cy);
  const textTop = "★  MYBITRICH  ★";
  ctx.font = "900 46px 'Arial Black', sans-serif";
  ctx.fillStyle = "#451A03";
  const rTop = 380;
  const sAngle = -Math.PI * 0.73;
  const eAngle = -Math.PI * 0.27;
  const step = (eAngle - sAngle) / (textTop.length - 1);
  for (let i = 0; i < textTop.length; i++) {
    const a = sAngle + i * step;
    ctx.save();
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(textTop[i], 0, -rTop);
    ctx.restore();
  }
  ctx.restore();

  // 5. Arched Curved Text Bottom: "150M SUPPLY · BEP-20"
  ctx.save();
  ctx.translate(cx, cy);
  const textBot = "150M SUPPLY · BEP-20";
  ctx.font = "bold 36px 'Arial Black', sans-serif";
  ctx.fillStyle = "#451A03";
  const rBot = 380;
  const sAngleB = Math.PI * 0.73;
  const eAngleB = Math.PI * 0.27;
  const stepB = (eAngleB - sAngleB) / (textBot.length - 1);
  for (let i = 0; i < textBot.length; i++) {
    const a = sAngleB + i * stepB;
    ctx.save();
    ctx.rotate(a - Math.PI / 2);
    ctx.fillText(textBot[i], 0, rBot);
    ctx.restore();
  }
  ctx.restore();

  // 6. Central Sunburst Crest Disc
  const crestGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 275);
  crestGrad.addColorStop(0, '#FFFFFF');
  crestGrad.addColorStop(0.28, '#FEF08A');
  crestGrad.addColorStop(0.68, '#F5C042');
  crestGrad.addColorStop(1.0, '#B45309');
  ctx.fillStyle = crestGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 270, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 10;
  ctx.stroke();

  // 7. ULTRA-BOLD, UNMISTAKABLE "MBR" CENTERPIECE (Massive 210px lettering!)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Chiseled Dark Deep Drop Shadow
  ctx.font = "900 200px 'Arial Black', sans-serif";
  ctx.fillStyle = "#271202";
  ctx.fillText("MBR", cx + 8, cy + 12);

  // Core Solid Specular Gold Contrast Gradient Fill
  const textGrad = ctx.createLinearGradient(cx - 200, cy - 80, cx + 200, cy + 80);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.20, '#FFFBEB');
  textGrad.addColorStop(0.50, '#F59E0B');
  textGrad.addColorStop(0.80, '#D97706');
  textGrad.addColorStop(1.0, '#78350F');
  ctx.fillStyle = textGrad;
  ctx.fillText("MBR", cx, cy);

  // Crisp Dark Embossed Outline so "MBR" jumps out on screen
  ctx.strokeStyle = '#271202';
  ctx.lineWidth = 8;
  ctx.strokeText("MBR", cx, cy);

  // Mini Stars Badge below MBR
  ctx.font = "bold 30px sans-serif";
  ctx.fillStyle = "#451A03";
  ctx.fillText("★ WEALTH PROTOCOL ★", cx, cy + 124);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

/**
 * Generates a realistic milled reed texture for the side edge of the 3D coin.
 */
export function createMBREdgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  for (let x = 0; x < 512; x += 4) {
    ctx.fillStyle = x % 8 === 0 ? '#FDE68A' : '#78350F';
    ctx.fillRect(x, 0, 4, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(16, 1);
  return texture;
}

/**
 * Spherical Linear Interpolation (SLERP) between two 3D vectors on a sphere.
 * Guarantees the shortest great-circle arc trajectory over the planet's surface.
 */
export function slerpVectors(v1: THREE.Vector3, v2: THREE.Vector3, t: number): THREE.Vector3 {
  const p1 = v1.clone().normalize();
  const p2 = v2.clone().normalize();
  
  let dot = p1.dot(p2);
  dot = Math.max(-1, Math.min(1, dot));
  const omega = Math.acos(dot);
  
  if (Math.abs(omega) < 0.0001) {
    return v1.clone();
  }
  
  const sinOmega = Math.sin(omega);
  const w1 = Math.sin((1 - t) * omega) / sinOmega;
  const w2 = Math.sin(t * omega) / sinOmega;
  
  return new THREE.Vector3(
    p1.x * w1 + p2.x * w2,
    p1.y * w1 + p2.y * w2,
    p1.z * w1 + p2.z * w2
  ).normalize();
}

/**
 * Calculates a point on the Great-Circle intercontinental routing arc at progress t [0, 1].
 * Altitude rises into space at mid-flight (zenith) and touches down exactly at origin and destination cities.
 * NEVER penetrates the globe!
 */
export function getRoutingPoint(
  fromVec: THREE.Vector3,
  toVec: THREE.Vector3,
  t: number,
  baseRadius: number,
  arcPeakHeight: number
): THREE.Vector3 {
  const dir = slerpVectors(fromVec, toVec, t);
  const altitude = baseRadius + Math.sin(Math.min(1, Math.max(0, t)) * Math.PI) * arcPeakHeight;
  return dir.multiplyScalar(altitude);
}
