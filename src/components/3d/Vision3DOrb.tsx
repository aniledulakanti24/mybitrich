import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import continentPoints from '../../data/continentPoints.json';
import { createMBRCoinTexture, getRoutingPoint } from '../../utils/mbrCoinTexture';

interface CityHub {
  name: string;
  lat: number;
  lng: number;
  role: string;
}

const FINANCIAL_CAPITALS: CityHub[] = [
  { name: 'Zurich', lat: 47.3769, lng: 8.5417, role: 'Sovereign Vaults' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, role: 'Global Capital' },
  { name: 'London', lat: 51.5074, lng: -0.1278, role: 'Institutional Desk' },
  { name: 'New York', lat: 40.7128, lng: -74.006, role: 'Reserve Market' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, role: 'Liquidity Gateway' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, role: 'Digital Asset Hub' },
];

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const Vision3DOrb: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // 1. Scene & Low-FOV Telephoto Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(0, 0, 11); // fits the globe plus the highest coin arc with a margin

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Multi-Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.4);
    sunLight.position.set(6, 7, 6);
    scene.add(sunLight);

    const goldRimLight = new THREE.DirectionalLight(0xf5c042, 3.8);
    goldRimLight.position.set(-6, -3, 3);
    scene.add(goldRimLight);

    const blueBackLight = new THREE.DirectionalLight(0x0071e3, 2.6);
    blueBackLight.position.set(0, -6, -4);
    scene.add(blueBackLight);

    // 3. Deep Space Starfield
    const starCount = 300;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount; s++) {
      starPos[s * 3] = (Math.random() - 0.5) * 24;
      starPos[s * 3 + 1] = (Math.random() - 0.5) * 24;
      starPos[s * 3 + 2] = -3 - Math.random() * 8;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.7 });
    const starsMesh = new THREE.Points(starGeo, starMat);
    scene.add(starsMesh);

    // 4. Master Luxury Black & Gold Globe Group
    const globeRadius = 1.95;
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = 0.22;
    globeGroup.rotation.y = -0.8;
    scene.add(globeGroup);

    // Base Sphere: soft steel-blue body with subtle golden atmospheric rim
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x2A4A7F,
      roughness: 0.6,
      metalness: 0.15,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.4,
    });
    const baseSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(baseSphere);

    // Atmosphere Glow Halo
    const atmoGeo = new THREE.SphereGeometry(globeRadius * 1.025, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xF5C042,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // 5. Golden Continents Dot Matrix (5,496 High-Precision Gold Points)
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 32;
    dotCanvas.height = 32;
    const dctx = dotCanvas.getContext('2d');
    if (dctx) {
      const grad = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.35, '#FFE082');
      grad.addColorStop(0.7, '#F5C042');
      grad.addColorStop(1, 'rgba(245, 192, 66, 0)');
      dctx.fillStyle = grad;
      dctx.fillRect(0, 0, 32, 32);
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    const pointsCount = continentPoints.length;
    const matrixCoords = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      const [lat, lng] = continentPoints[i] as [number, number];
      const pos = latLngToVec3(lat, lng, globeRadius * 1.015);
      matrixCoords[i * 3] = pos.x;
      matrixCoords[i * 3 + 1] = pos.y;
      matrixCoords[i * 3 + 2] = pos.z;
    }

    const matrixGeo = new THREE.BufferGeometry();
    matrixGeo.setAttribute('position', new THREE.BufferAttribute(matrixCoords, 3));
    const matrixMat = new THREE.PointsMaterial({
      size: 0.052,
      map: dotTexture,
      color: 0xF5C042,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const matrixMesh = new THREE.Points(matrixGeo, matrixMat);
    globeGroup.add(matrixMesh);

    // 6. Financial Capital Hubs (Pulsing Beacons)
    const hubsGroup = new THREE.Group();
    globeGroup.add(hubsGroup);

    const hubPositions: THREE.Vector3[] = [];
    FINANCIAL_CAPITALS.forEach((hub) => {
      const pos = latLngToVec3(hub.lat, hub.lng, globeRadius * 1.02);
      hubPositions.push(pos);

      // Gold Core Beacon
      const bMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xFFFBEB, emissive: 0xF5C042, emissiveIntensity: 1.0 })
      );
      bMesh.position.copy(pos);
      hubsGroup.add(bMesh);

      // Pulsing Ring
      const rMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.06, 0.085, 24),
        new THREE.MeshBasicMaterial({ color: 0xF5C042, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
      );
      rMesh.position.copy(pos.clone().multiplyScalar(1.002));
      rMesh.lookAt(pos.clone().multiplyScalar(2));
      hubsGroup.add(rMesh);
    });

    // 7. Golden Wealth Capital Arcs with Traveling Minted MBR Gold Coins
    const mbrCoinTexture = createMBRCoinTexture();

    function createOrbCoin(): THREE.Group {
      const g = new THREE.Group();
      const r = 0.145;
      const t = 0.034;
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, t, 32),
        [
          new THREE.MeshStandardMaterial({ color: 0xf5c042, metalness: 0.98, roughness: 0.12, emissive: 0x92400e, emissiveIntensity: 0.25 }),
          new THREE.MeshStandardMaterial({ map: mbrCoinTexture, metalness: 0.95, roughness: 0.15, emissive: 0xf5c042, emissiveIntensity: 0.35 }),
          new THREE.MeshStandardMaterial({ map: mbrCoinTexture, metalness: 0.95, roughness: 0.15, emissive: 0xf5c042, emissiveIntensity: 0.35 }),
        ]
      );
      g.add(cyl);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(r + 0.003, 0.013, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0xffdf6d, metalness: 0.98, roughness: 0.12, emissive: 0xd97706, emissiveIntensity: 0.38 })
      );
      rim.rotation.x = Math.PI / 2;
      g.add(rim);

      const light = new THREE.PointLight(0xf5c042, 2.2, 1.4);
      g.add(light);
      return g;
    }

    const arcPairs = [
      [0, 1], // Zurich -> Dubai
      [1, 2], // Dubai -> London
      [2, 3], // London -> New York
      [1, 4], // Dubai -> Singapore
      [4, 5], // Singapore -> Tokyo
      [3, 0], // New York -> Zurich
    ];

    interface OrbCoinTransmission {
      fromVec: THREE.Vector3;
      toVec: THREE.Vector3;
      arcPeakHeight: number;
      mesh: THREE.Group;
      progress: number;
      speed: number;
    }

    const arcCoins: OrbCoinTransmission[] = [];

    arcPairs.forEach(([i1, i2]) => {
      const p1 = hubPositions[i1];
      const p2 = hubPositions[i2];
      const dist = p1.distanceTo(p2);
      const arcPeakHeight = Math.min(0.55, Math.max(0.3, dist * 0.16)); // capped so arcs + coins stay in frame

      const routePoints: THREE.Vector3[] = [];
      for (let s = 0; s <= 50; s++) {
        routePoints.push(getRoutingPoint(p1, p2, s / 50, globeRadius * 1.018, arcPeakHeight));
      }
      const routeCurve = new THREE.CatmullRomCurve3(routePoints);

      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(routeCurve, 50, 0.013, 8, false),
        new THREE.MeshStandardMaterial({ color: 0xF5C042, emissive: 0xB45309, emissiveIntensity: 0.65, transparent: true, opacity: 0.85 })
      );
      globeGroup.add(tube);

      const coin = createOrbCoin();
      globeGroup.add(coin);
      arcCoins.push({
        fromVec: p1,
        toVec: p2,
        arcPeakHeight,
        mesh: coin,
        progress: Math.random(),
        speed: 0.22 + Math.random() * 0.15,
      });
    });

    // 8. Orbiting 3D Gold MBR Master Medallion
    const coinGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.05, 32);
    const coinMatSide = new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.95, roughness: 0.2 });
    const coinMatFace = new THREE.MeshStandardMaterial({ map: mbrCoinTexture, metalness: 0.95, roughness: 0.15, emissive: 0xf5c042, emissiveIntensity: 0.2 });
    const coinMesh = new THREE.Mesh(coinGeo, [coinMatSide, coinMatFace, coinMatFace]);
    globeGroup.add(coinMesh);

    let coinAngle = 0;
    const coinOrbitRadius = globeRadius * 1.25; // stays inside the camera frame

    // 9. Interactive Pointer Mouse Tracking (Smooth Parallax Tilt)
    let targetRotX = 0.22;
    let targetRotY = -0.8;
    let currentRotX = 0.22;
    let currentRotY = -0.8;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = -0.8 + normX * 0.55;
      targetRotX = 0.22 + normY * 0.45;
    };

    container.addEventListener('mousemove', onPointerMove);

    // 10. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Mouse lerping
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      globeGroup.rotation.x = currentRotX;
      globeGroup.rotation.y += 0.28 * delta;

      // Orbit coin
      coinAngle += 0.8 * delta;
      coinMesh.position.x = Math.cos(coinAngle) * coinOrbitRadius;
      coinMesh.position.z = Math.sin(coinAngle) * coinOrbitRadius;
      coinMesh.position.y = Math.sin(coinAngle * 2) * 0.35;
      coinMesh.rotation.y += 2.0 * delta;
      coinMesh.rotation.x += 1.0 * delta;

      // Travel 3D gold coins along financial capital arcs with true Great-Circle routing
      arcCoins.forEach((p) => {
        p.progress = (p.progress + p.speed * delta) % 1;
        const currentPos = getRoutingPoint(p.fromVec, p.toVec, p.progress, globeRadius * 1.018, p.arcPeakHeight);
        p.mesh.position.copy(currentPos);

        // Smooth launch and landing scale envelope
        const scale = Math.sin(Math.min(1.0, Math.max(0.0, p.progress)) * Math.PI);
        p.mesh.scale.set(scale, scale, scale);

        // Orient coin radially outward so "MBR" face faces directly into the sky and camera
        const normal = currentPos.clone().normalize();
        p.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        p.mesh.rotateY(clock.getElapsedTime() * 2.8);
      });

      starsMesh.rotation.y += 0.015 * delta;

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
