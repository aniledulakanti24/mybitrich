import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Contracts3DShield: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // Multi-Directional Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.4);
    keyLight.position.set(6, 6, 7);
    scene.add(keyLight);

    const emeraldLight = new THREE.DirectionalLight(0x10b981, 3.6);
    emeraldLight.position.set(-6, -3, 4);
    scene.add(emeraldLight);

    const goldBack = new THREE.DirectionalLight(0xf5c042, 2.8);
    goldBack.position.set(0, -6, -4);
    scene.add(goldBack);

    // Master Vault Safe Assembly
    const vaultGroup = new THREE.Group();
    vaultGroup.rotation.x = 0.22;
    vaultGroup.rotation.y = -0.3;
    scene.add(vaultGroup);

    // 1. Heavy Machined Steel Vault Outer Frame & Rim
    const frameGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.45, 48);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xE9EEF6,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0.2,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.rotation.x = Math.PI / 2;
    vaultGroup.add(frameMesh);

    // Polished Brass Outer Bezel
    const bezelGeo = new THREE.TorusGeometry(2.1, 0.07, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xF5C042,
      metalness: 0.98,
      roughness: 0.16,
      emissive: 0xB45309,
      emissiveIntensity: 0.4,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    vaultGroup.add(bezelMesh);

    // 2. Heavy Brushed Steel Inner Door
    const doorGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.25, 48);
    
    // Create authentic circular brushed steel texture
    const steelCanvas = document.createElement('canvas');
    steelCanvas.width = 512;
    steelCanvas.height = 512;
    const sctx = steelCanvas.getContext('2d');
    if (sctx) {
      const grad = sctx.createRadialGradient(256, 256, 20, 256, 256, 256);
      grad.addColorStop(0, '#334155');
      grad.addColorStop(0.5, '#E2E8F0');
      grad.addColorStop(1, '#CBD5E1');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 512, 512);

      // Lathe scratch rings
      for (let r = 30; r < 250; r += 8) {
        sctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        sctx.lineWidth = 1.5;
        sctx.beginPath();
        sctx.arc(256, 256, r, 0, Math.PI * 2);
        sctx.stroke();
      }
    }
    const steelTex = new THREE.CanvasTexture(steelCanvas);

    const doorMat = new THREE.MeshStandardMaterial({
      map: steelTex,
      metalness: 0.94,
      roughness: 0.22,
    });
    const doorMesh = new THREE.Mesh(doorGeo, [
      new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.92, roughness: 0.2 }),
      doorMat,
      doorMat,
    ]);
    doorMesh.rotation.x = Math.PI / 2;
    doorMesh.position.z = 0.12;
    vaultGroup.add(doorMesh);

    // 3. 6 Heavy Solid Steel Locking Bolts (Extend into the frame)
    const boltGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 16);
    const boltMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.96, roughness: 0.15 });
    const bolts: THREE.Mesh[] = [];

    for (let b = 0; b < 6; b++) {
      const angle = (b / 6) * Math.PI * 2;
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0.12);
      bolt.rotation.z = angle + Math.PI / 2;
      vaultGroup.add(bolt);
      bolts.push(bolt);
    }

    // 4. Central Heavy 4-Spoke Vault Wheel (Physical Bank Safe Handle)
    const wheelGroup = new THREE.Group();
    wheelGroup.position.z = 0.35;
    vaultGroup.add(wheelGroup);

    // Center Hub
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.18, 32),
      new THREE.MeshStandardMaterial({ color: 0xF5C042, metalness: 0.98, roughness: 0.15, emissive: 0xB45309, emissiveIntensity: 0.3 })
    );
    hub.rotation.x = Math.PI / 2;
    wheelGroup.add(hub);

    // Outer Turning Ring
    const wheelRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.055, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0xF5C042, metalness: 0.98, roughness: 0.15, emissive: 0xD97706, emissiveIntensity: 0.35 })
    );
    wheelGroup.add(wheelRing);

    // 4 Heavy Wheel Spokes
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, metalness: 0.96, roughness: 0.15 });
    for (let sp = 0; sp < 4; sp++) {
      const angle = (sp / 4) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.9, 16), spokeMat);
      spoke.position.set(Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0);
      spoke.rotation.z = angle + Math.PI / 2;
      wheelGroup.add(spoke);
    }

    // 5. Authentic Etched Combination Dial
    const dialCanvas = document.createElement('canvas');
    dialCanvas.width = 256;
    dialCanvas.height = 256;
    const dctx = dialCanvas.getContext('2d');
    if (dctx) {
      dctx.fillStyle = '#F1F5F9';
      dctx.beginPath();
      dctx.arc(128, 128, 120, 0, Math.PI * 2);
      dctx.fill();

      dctx.strokeStyle = '#F5C042';
      dctx.lineWidth = 6;
      dctx.beginPath();
      dctx.arc(128, 128, 112, 0, Math.PI * 2);
      dctx.stroke();

      // Tick marks and numbers
      dctx.fillStyle = '#0F2349';
      dctx.font = 'bold 20px monospace';
      dctx.textAlign = 'center';
      dctx.textBaseline = 'middle';

      for (let t = 0; t < 12; t++) {
        const rad = (t / 12) * Math.PI * 2;
        const x = 128 + Math.cos(rad) * 90;
        const y = 128 + Math.sin(rad) * 90;
        dctx.fillText(String(t * 10), x, y);
      }
    }
    const dialTex = new THREE.CanvasTexture(dialCanvas);

    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32),
      [
        new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.9, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ map: dialTex, metalness: 0.9, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x94A3B8 }),
      ]
    );
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0, 0, 0.45);
    wheelGroup.add(dial);

    // 6. Glowing Digital Emerald Verification HUD Display Ring (PinkLock 5-Year Status)
    const hudRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.02, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x10B981, emissive: 0x34D399, emissiveIntensity: 0.85, metalness: 0.9, roughness: 0.2 })
    );
    hudRing.position.z = 0.26;
    vaultGroup.add(hudRing);

    // 5 Holographic Verification Node Crystals (Representing each locked year)
    const nodeGeo = new THREE.OctahedronGeometry(0.12, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      emissive: 0x34D399,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.2,
    });
    const nodes: { mesh: THREE.Mesh; angle: number }[] = [];

    for (let n = 0; n < 5; n++) {
      const nm = new THREE.Mesh(nodeGeo, nodeMat);
      nm.position.z = 0.28;
      vaultGroup.add(nm);
      nodes.push({ mesh: nm, angle: (n / 5) * Math.PI * 2 });
    }

    // 7. Interactive Mouse Parallax Tracking
    let targetRotY = -0.3;
    let targetRotX = 0.22;
    let currentRotY = -0.3;
    let currentRotX = 0.22;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = -0.3 + normX * 0.55;
      targetRotX = 0.22 + normY * 0.45;
    };

    container.addEventListener('mousemove', onPointerMove);

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerping
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      vaultGroup.rotation.x = currentRotX;
      vaultGroup.rotation.y = currentRotY;

      // Vault wheel smooth turn & lock mechanism
      wheelGroup.rotation.z += 0.35 * delta;

      // Mechanical bolt in-out micro-pulse
      const boltPulse = 1.8 + Math.sin(time * 2) * 0.06;
      bolts.forEach((b, i) => {
        const angle = (i / 6) * Math.PI * 2;
        b.position.set(Math.cos(angle) * boltPulse, Math.sin(angle) * boltPulse, 0.12);
      });

      // Orbit 5-year verification crystals
      nodes.forEach((nd) => {
        nd.angle += 0.5 * delta;
        nd.mesh.position.x = Math.cos(nd.angle) * 1.4;
        nd.mesh.position.y = Math.sin(nd.angle) * 1.4;
        nd.mesh.rotation.x += 1.5 * delta;
        nd.mesh.rotation.y += 1.2 * delta;
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
