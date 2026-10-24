import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Calculator3DStack: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 8.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // Multi-Directional Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    sunLight.position.set(6, 8, 6);
    scene.add(sunLight);

    const goldRim = new THREE.DirectionalLight(0xf5c042, 3.6);
    goldRim.position.set(-6, 2, 4);
    scene.add(goldRim);

    const emeraldFill = new THREE.DirectionalLight(0x10b981, 2.4);
    emeraldFill.position.set(0, -6, -4);
    scene.add(emeraldFill);

    const stackGroup = new THREE.Group();
    scene.add(stackGroup);

    // 1. Futuristic Dark Vault Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(2.3, 2.5, 0.28, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xF1F5FB,
      metalness: 0.94,
      roughness: 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0.3,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.6;
    stackGroup.add(baseMesh);

    // Glowing Gold Rim on Base
    const baseRimGeo = new THREE.TorusGeometry(2.35, 0.04, 16, 64);
    const baseRimMat = new THREE.MeshStandardMaterial({
      color: 0xF5C042,
      emissive: 0xB45309,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.2,
    });
    const baseRim = new THREE.Mesh(baseRimGeo, baseRimMat);
    baseRim.rotation.x = Math.PI / 2;
    baseRim.position.y = -1.46;
    stackGroup.add(baseRim);

    // 2. Exponential Compounding Coin Stacks (6 Physical Gold Pillars)
    const coinTextureCanvas = document.createElement('canvas');
    coinTextureCanvas.width = 256;
    coinTextureCanvas.height = 256;
    const ctx = coinTextureCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#2A1C06';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#F5C042';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(128, 128, 116, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#F5C042';
      ctx.font = 'bold 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MBR', 128, 130);
    }
    const coinTex = new THREE.CanvasTexture(coinTextureCanvas);

    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xF5C042,
      metalness: 0.96,
      roughness: 0.18,
      emissive: 0xB45309,
      emissiveIntensity: 0.25,
    });

    const pillars = [
      { height: 0.45, angle: 0 },
      { height: 0.8, angle: Math.PI / 3 },
      { height: 1.25, angle: (Math.PI / 3) * 2 },
      { height: 1.75, angle: (Math.PI / 3) * 3 },
      { height: 2.35, angle: (Math.PI / 3) * 4 },
      { height: 3.1, angle: (Math.PI / 3) * 5 }, // Apex Compounding Stack
    ];

    pillars.forEach((p) => {
      const radius = 1.35;
      const x = Math.cos(p.angle) * radius;
      const z = Math.sin(p.angle) * radius;

      const pGeo = new THREE.CylinderGeometry(0.38, 0.38, p.height, 32);
      const capMat = new THREE.MeshStandardMaterial({ map: coinTex, metalness: 0.95, roughness: 0.2 });
      const pMesh = new THREE.Mesh(pGeo, [pillarMat, capMat, capMat]);
      pMesh.position.set(x, -1.46 + p.height / 2, z);
      stackGroup.add(pMesh);

      // Top glowing coin rim
      const capGeo = new THREE.TorusGeometry(0.36, 0.02, 16, 32);
      const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0xFFE899, metalness: 0.95, roughness: 0.2 }));
      cap.rotation.x = Math.PI / 2;
      cap.position.set(x, -1.46 + p.height + 0.01, z);
      stackGroup.add(cap);
    });

    // 3. Central Hovering Giant MBR Coin / Crown Medallion
    const apexCoinGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.16, 48);
    const apexCoinFaceMat = new THREE.MeshStandardMaterial({
      map: coinTex,
      metalness: 0.98,
      roughness: 0.15,
      emissive: 0xD97706,
      emissiveIntensity: 0.35,
    });
    const apexCoin = new THREE.Mesh(apexCoinGeo, [pillarMat, apexCoinFaceMat, apexCoinFaceMat]);
    apexCoin.position.set(0, 0.9, 0);
    apexCoin.rotation.x = Math.PI / 3.2;
    stackGroup.add(apexCoin);

    // Glowing Emerald Compounding Rings
    const compRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.25, 0.025, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x10B981, metalness: 0.95, roughness: 0.2, emissive: 0x059669, emissiveIntensity: 0.6 })
    );
    compRing.rotation.x = Math.PI / 2.8;
    stackGroup.add(compRing);

    // 4. Interactive Pointer Mouse Tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = normX * 0.45;
      targetRotX = normY * 0.25;
    };

    container.addEventListener('mousemove', onPointerMove);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      stackGroup.rotation.y += 0.3 * delta;
      stackGroup.rotation.x = currentRotX;

      apexCoin.rotation.y += 1.2 * delta;
      compRing.rotation.z += 0.8 * delta;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 460;
      const h = container.clientHeight || 460;
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
      ref={containerRef}
      className={`w-full aspect-square max-w-[480px] mx-auto cursor-grab active:cursor-grabbing ${className}`}
    />
  );
};
