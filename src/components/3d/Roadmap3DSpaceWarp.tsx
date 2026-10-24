import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Roadmap3DSpaceWarp: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // Multi-Directional Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfffaed, 3.4);
    mainSun.position.set(6, 7, 7);
    scene.add(mainSun);

    const goldRim = new THREE.DirectionalLight(0xf5c042, 3.8);
    goldRim.position.set(-6, -4, 4);
    scene.add(goldRim);

    const thrusterCyan = new THREE.DirectionalLight(0x38bdf8, 2.5);
    thrusterCyan.position.set(0, -5, -4);
    scene.add(thrusterCyan);

    // Deep Space Starfield
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount; s++) {
      starPos[s * 3] = (Math.random() - 0.5) * 24;
      starPos[s * 3 + 1] = (Math.random() - 0.5) * 20;
      starPos[s * 3 + 2] = -2 - Math.random() * 8;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.038, transparent: true, opacity: 0.8 });
    const starsMesh = new THREE.Points(starGeo, starMat);
    scene.add(starsMesh);

    // Master Spacecraft Group
    const shipGroup = new THREE.Group();
    shipGroup.rotation.x = 0.25;
    shipGroup.rotation.y = -0.35;
    scene.add(shipGroup);

    // 1. Central Aerodynamic Fuselage (Titanium & Champagne Gold Plating)
    const bodyGeo = new THREE.ConeGeometry(0.55, 2.4, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0.2,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.rotation.x = Math.PI / 2;
    shipGroup.add(bodyMesh);

    // Gold Foil Nose Cone & Thermal Shield
    const noseGeo = new THREE.ConeGeometry(0.35, 0.9, 32);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xF5C042,
      metalness: 0.98,
      roughness: 0.15,
      emissive: 0xB45309,
      emissiveIntensity: 0.35,
    });
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.rotation.x = Math.PI / 2;
    noseMesh.position.z = 0.85;
    shipGroup.add(noseMesh);

    // 2. Dual Photovoltaic Solar Array Wings (Sapphire Solar Panels)
    const wingGeo = new THREE.BoxGeometry(2.8, 0.04, 0.75);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x004BA0,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0284C7,
      emissiveIntensity: 0.45,
    });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.z = -0.3;
    shipGroup.add(wingMesh);

    // Gold wing struts and joints
    const strutMat = new THREE.MeshStandardMaterial({ color: 0xF5C042, metalness: 0.95, roughness: 0.15 });
    const strutLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16), strutMat);
    strutLeft.rotation.z = Math.PI / 2;
    strutLeft.position.set(-1.45, 0, -0.3);
    shipGroup.add(strutLeft);

    const strutRight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16), strutMat);
    strutRight.rotation.z = Math.PI / 2;
    strutRight.position.set(1.45, 0, -0.3);
    shipGroup.add(strutRight);

    // 3. High-Gain Communications Dish Antenna
    const dishGeo = new THREE.SphereGeometry(0.32, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xFFFBEB,
      metalness: 0.95,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.45, 0.1);
    dish.rotation.x = -Math.PI / 3;
    shipGroup.add(dish);

    const dishNeedle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0xF5C042, metalness: 0.95, roughness: 0.15 })
    );
    dishNeedle.position.set(0, 0.55, 0.22);
    dishNeedle.rotation.x = Math.PI / 6;
    shipGroup.add(dishNeedle);

    // 4. Rear Rocket Ion Engine & Radiant Plasma Thruster Plume
    const thrusterGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.3, 24, 1, true);
    const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.95, roughness: 0.2 });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.z = -1.35;
    shipGroup.add(thruster);

    // Glowing Plasma Plume (Animated Cone)
    const plumeGeo = new THREE.ConeGeometry(0.22, 1.4, 24);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.85,
    });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.rotation.x = -Math.PI / 2;
    plume.position.z = -2.1;
    shipGroup.add(plume);

    // Inner Core Plasma (Golden intense flame)
    const innerPlumeGeo = new THREE.ConeGeometry(0.12, 0.9, 16);
    const innerPlumeMat = new THREE.MeshBasicMaterial({ color: 0xFFFBEB, transparent: true, opacity: 0.95 });
    const innerPlume = new THREE.Mesh(innerPlumeGeo, innerPlumeMat);
    innerPlume.rotation.x = -Math.PI / 2;
    innerPlume.position.z = -1.85;
    shipGroup.add(innerPlume);

    // 5. Celestial 2035 Horizon Milestone Gateway Ring (The Destination)
    const gatewayGeo = new THREE.TorusGeometry(2.35, 0.05, 16, 80);
    const gatewayMat = new THREE.MeshStandardMaterial({
      color: 0xF5C042,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0xB45309,
      emissiveIntensity: 0.55,
    });
    const gateway = new THREE.Mesh(gatewayGeo, gatewayMat);
    gateway.position.set(0, 0, -2.5);
    scene.add(gateway);

    const gatewayInner = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.02, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.7 })
    );
    gatewayInner.position.set(0, 0, -2.5);
    scene.add(gatewayInner);

    // 6. Interactive Steering Parallax (Mouse movement tilts and steers the spacecraft in 3D!)
    let targetRotY = -0.35;
    let targetRotX = 0.25;
    let targetRotZ = 0;
    let currentRotY = -0.35;
    let currentRotX = 0.25;
    let currentRotZ = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = -0.35 + normX * 0.65;
      targetRotX = 0.25 + normY * 0.45;
      targetRotZ = -normX * 0.35; // Aerodynamic banking roll!
    };

    container.addEventListener('mousemove', onPointerMove);

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth steering lerp
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotZ += (targetRotZ - currentRotZ) * 0.05;

      shipGroup.rotation.x = currentRotX;
      shipGroup.rotation.y = currentRotY;
      shipGroup.rotation.z = currentRotZ;

      // Gentle orbital bobbing
      shipGroup.position.y = Math.sin(time * 1.5) * 0.08;

      // Thruster plasma flicker
      const pulseScale = 1.0 + Math.sin(time * 24) * 0.12;
      plume.scale.set(1, pulseScale, 1);
      innerPlume.scale.set(1, pulseScale * 1.05, 1);

      // Rotate milestone gateway ring
      gateway.rotation.z += 0.4 * delta;
      gatewayInner.rotation.z -= 0.6 * delta;

      starsMesh.rotation.z += 0.015 * delta;

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
