import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Tokenomics3DFlywheel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 1.55, 9.9); // far enough that the outermost orbiting coins stay in frame
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // Multi-Directional Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.4);
    sunLight.position.set(6, 8, 6);
    scene.add(sunLight);

    const goldRim = new THREE.DirectionalLight(0xf5c042, 3.8);
    goldRim.position.set(-6, 3, 4);
    scene.add(goldRim);

    const emeraldFill = new THREE.DirectionalLight(0x10b981, 2.4);
    emeraldFill.position.set(0, -6, -4);
    scene.add(emeraldFill);

    // Treasury Master Group
    const treasuryGroup = new THREE.Group();
    scene.add(treasuryGroup);

    // 1. Heavy Obsidian & Brass Vault Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(2.35, 2.55, 0.28, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xF1F5FB,
      metalness: 0.94,
      roughness: 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.55;
    treasuryGroup.add(baseMesh);

    // Polished Brass Trim Ring on Base
    const baseRimGeo = new THREE.TorusGeometry(2.4, 0.045, 16, 64);
    const baseRimMat = new THREE.MeshStandardMaterial({
      color: 0xF5C042,
      emissive: 0xB45309,
      emissiveIntensity: 0.45,
      metalness: 0.96,
      roughness: 0.18,
    });
    const baseRim = new THREE.Mesh(baseRimGeo, baseRimMat);
    baseRim.rotation.x = Math.PI / 2;
    baseRim.position.y = -1.41;
    treasuryGroup.add(baseRim);

    // 2. Texture Loader for Official Minted MBR Coin
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/assets/logo.png');
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    // Physical Gold Coin Materials
    const goldSideMat = new THREE.MeshStandardMaterial({
      color: 0xD97706,
      metalness: 0.98,
      roughness: 0.15,
      emissive: 0x78350F,
      emissiveIntensity: 0.2,
    });
    const goldFaceMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x92400E,
      emissiveIntensity: 0.15,
    });
    const coinMaterials = [goldSideMat, goldFaceMat, goldFaceMat];

    // 3. Stacks of Physical Minted Gold Coins (arranged circularly around pedestal)
    const coinStacksCount = 8;
    const coinRadius = 0.32;
    const coinThickness = 0.055;
    const coinGeo = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 32);

    for (let s = 0; s < coinStacksCount; s++) {
      const angle = (s / coinStacksCount) * Math.PI * 2;
      const stackRadius = 1.45;
      const stackHeight = 3 + (s % 4) * 2; // 3 to 9 coins per stack

      for (let c = 0; c < stackHeight; c++) {
        const coin = new THREE.Mesh(coinGeo, coinMaterials);
        const slightJitter = (Math.sin(s * 10 + c) * 0.02);
        coin.position.set(
          Math.cos(angle) * stackRadius + slightJitter,
          -1.38 + c * (coinThickness + 0.005),
          Math.sin(angle) * stackRadius + slightJitter
        );
        coin.rotation.y = angle + c * 0.15;
        treasuryGroup.add(coin);
      }
    }

    // 4. Central Hovering Master MBR Medallion (Large Minted Sovereign Bullion Coin)
    const masterCoinGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.16, 48);
    const masterCoin = new THREE.Mesh(masterCoinGeo, coinMaterials);
    masterCoin.position.set(0, 0.45, 0);
    masterCoin.rotation.x = Math.PI / 3.2;
    treasuryGroup.add(masterCoin);

    // Glowing Concentric Aura Rings (2% Reflection Emerald, 2% LP Sapphire, 2% Treasury Gold)
    const aura1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.25, 0.025, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x10B981, metalness: 0.9, roughness: 0.2, emissive: 0x059669, emissiveIntensity: 0.6 })
    );
    aura1.rotation.x = Math.PI / 2.8;
    treasuryGroup.add(aura1);

    const aura2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.02, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x38BDF8, metalness: 0.9, roughness: 0.2, emissive: 0x0284C7, emissiveIntensity: 0.5 })
    );
    aura2.rotation.y = Math.PI / 3.5;
    treasuryGroup.add(aura2);

    // 5. Circulating 3D Flying Gold Coins (Wealth Flow Vortex)
    const flyingCount = 6;
    const flyingCoins: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; yOffset: number }[] = [];
    const flyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24);

    for (let f = 0; f < flyingCount; f++) {
      const fc = new THREE.Mesh(flyGeo, coinMaterials);
      treasuryGroup.add(fc);
      flyingCoins.push({
        mesh: fc,
        orbitRadius: 1.6 + (f % 3) * 0.35, // 1.6–2.3, inside the 2.55 platform radius
        speed: (f % 2 === 0 ? 1 : -1) * (0.7 + (f % 3) * 0.2),
        angle: (f / flyingCount) * Math.PI * 2,
        yOffset: -0.2 + (f % 3) * 0.45,
      });
    }

    // 6. Interactive Mouse Pointer Parallax Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = normX * 0.45;
      targetRotX = normY * 0.25;
    };

    container.addEventListener('mousemove', onPointerMove);

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      treasuryGroup.rotation.y += 0.3 * delta;
      treasuryGroup.rotation.x = currentRotX;

      // Master coin spin
      masterCoin.rotation.y += 0.8 * delta;
      aura1.rotation.z += 0.6 * delta;
      aura2.rotation.z -= 0.5 * delta;

      // Orbit flying coins
      flyingCoins.forEach((fc) => {
        fc.angle += fc.speed * delta;
        fc.mesh.position.x = Math.cos(fc.angle) * fc.orbitRadius;
        fc.mesh.position.z = Math.sin(fc.angle) * fc.orbitRadius;
        fc.mesh.position.y = fc.yOffset + Math.sin(fc.angle * 2) * 0.25;
        fc.mesh.rotation.y += 2.5 * delta;
        fc.mesh.rotation.x += 1.5 * delta;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onPointerMove);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full aspect-square max-w-[480px] mx-auto cursor-grab active:cursor-grabbing ${className}`}
    />
  );
};
