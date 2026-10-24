import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import continentPoints from '../../data/continentPoints.json';

/**
 * ParallaxGlobe — a complete, slowly rotating Earth centred in its stage.
 * MBR transfers fly between financial hubs: a faint route draws itself, a bright
 * comet packet races along it, and the receiving city ripples on arrival.
 */

interface CityHub {
  name: string;
  lat: number;
  lng: number;
}

const HUBS: CityHub[] = [
  { name: 'New York', lat: 40.71, lng: -74.0 },
  { name: 'Toronto', lat: 43.65, lng: -79.38 },
  { name: 'San Francisco', lat: 37.77, lng: -122.42 },
  { name: 'Miami', lat: 25.76, lng: -80.19 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63 },
  { name: 'London', lat: 51.51, lng: -0.13 },
  { name: 'Paris', lat: 48.86, lng: 2.35 },
  { name: 'Zurich', lat: 47.38, lng: 8.54 },
  { name: 'Frankfurt', lat: 50.11, lng: 8.68 },
  { name: 'Madrid', lat: 40.42, lng: -3.7 },
  { name: 'Istanbul', lat: 41.01, lng: 28.98 },
  { name: 'Lagos', lat: 6.52, lng: 3.38 },
  { name: 'Cairo', lat: 30.04, lng: 31.24 },
  { name: 'Dubai', lat: 25.2, lng: 55.27 },
  { name: 'Mumbai', lat: 19.08, lng: 72.88 },
  { name: 'Moscow', lat: 55.76, lng: 37.62 },
  { name: 'Johannesburg', lat: -26.2, lng: 28.05 },
  { name: 'Nairobi', lat: -1.29, lng: 36.82 },
  { name: 'Singapore', lat: 1.35, lng: 103.82 },
  { name: 'Hong Kong', lat: 22.32, lng: 114.17 },
  { name: 'Shanghai', lat: 31.23, lng: 121.47 },
  { name: 'Seoul', lat: 37.57, lng: 126.98 },
  { name: 'Tokyo', lat: 35.68, lng: 139.65 },
  { name: 'Sydney', lat: -33.87, lng: 151.21 },
  { name: 'Mexico City', lat: 19.43, lng: -99.13 },
  { name: 'Buenos Aires', lat: -34.6, lng: -58.38 },
];

const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function createGlowTexture(inner: string, outer: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.25, outer);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const TRAIL_VERTEX = /* glsl */ `
  varying float vT;
  void main() {
    vT = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Faint route line that draws itself up to the packet, then fades out as a whole.
const ROUTE_FRAGMENT = /* glsl */ `
  uniform float uReveal;
  uniform float uAlpha;
  uniform vec3 uColor;
  varying float vT;
  void main() {
    if (vT > uReveal) discard;
    float ends = smoothstep(0.0, 0.04, vT) * smoothstep(1.0, 0.96, vT);
    gl_FragColor = vec4(uColor, uAlpha * ends);
  }
`;

// Short comet streak between uTail and uHead: hot white-gold head fading into a gold tail.
const COMET_FRAGMENT = /* glsl */ `
  uniform float uHead;
  uniform float uTail;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying float vT;
  void main() {
    if (vT > uHead || vT < uTail) discard;
    float k = (vT - uTail) / max(uHead - uTail, 0.0001);
    float alpha = pow(k, 2.2) * uIntensity;
    vec3 col = mix(uColor, vec3(1.0, 0.97, 0.9), smoothstep(0.75, 1.0, k));
    gl_FragColor = vec4(col, alpha);
  }
`;

interface Transfer {
  from: THREE.Vector3;
  to: THREE.Vector3;
  curve: THREE.CatmullRomCurve3;
  route: THREE.Mesh<THREE.TubeGeometry, THREE.ShaderMaterial>;
  comet: THREE.Mesh<THREE.TubeGeometry, THREE.ShaderMaterial>;
  bloom: THREE.Mesh<THREE.TubeGeometry, THREE.ShaderMaterial>;
  packet: THREE.Sprite;
  sendRing: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  recvRings: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>[];
  start: number;
  travel: number; // ms for the packet to cross the route
  rest: number; // ms idle before the next transfer on this slot
}

const TAIL_LENGTH = 0.22; // comet length as a fraction of the route
const SETTLE_MS = 1100; // tail catches up, route fades, ripples finish

export const ParallaxGlobe: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const sun = new THREE.DirectionalLight(0xfff4dd, 1.6);
    sun.position.set(-5, 6, 4);
    scene.add(sun);
    const rimLight = new THREE.DirectionalLight(0x6d8cff, 0.6);
    rimLight.position.set(4, 2, -6);
    scene.add(rimLight);

    // Full sphere centred in the stage; its radius scales with the smaller viewport side
    const pivot = new THREE.Group(); // position, scale and tilt
    const globe = new THREE.Group(); // spins about the earth's axis
    pivot.add(globe);
    scene.add(pivot);
    pivot.rotation.x = 0.28; // slight northern tilt; every continent rotates through view
    globe.rotation.y = -1.9; // Atlantic & Europe toward the viewer

    const layout = () => {
      const vH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const vW = vH * (width / height);
      pivot.scale.setScalar(Math.min(vH, vW) * 0.4); // leaves room for the atmosphere and arcs
    };
    layout();

    // Earth — unit sphere, scaled by the pivot
    const loader = new THREE.TextureLoader();
    const day = loader.load('/assets/earth-day.jpg');
    day.colorSpace = THREE.SRGBColorSpace;
    const lights = loader.load('/assets/earth-lights.png');
    lights.colorSpace = THREE.SRGBColorSpace;
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 128),
      new THREE.MeshStandardMaterial({
        map: day,
        color: new THREE.Color(0x5a6b88),
        roughness: 0.9,
        metalness: 0,
        emissiveMap: lights,
        emissive: new THREE.Color(0xffc45a),
        emissiveIntensity: 1.1,
      }),
    );
    globe.add(earth);

    // Dotted continent overlay so every landmass reads clearly against the oceans
    const dots = new Float32Array(continentPoints.length * 3);
    (continentPoints as [number, number][]).forEach(([lat, lng], i) => {
      const v = latLngToVector3(lat, lng, 1.004);
      dots.set([v.x, v.y, v.z], i * 3);
    });
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dots, 3));
    globe.add(
      new THREE.Points(
        dotGeo,
        new THREE.PointsMaterial({ color: 0xffe2a0, size: 0.035, sizeAttenuation: true, transparent: true, opacity: 0.55, depthWrite: false }),
      ),
    );

    // Atmosphere — thin fresnel glow on the limb
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 96, 96),
      new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          varying vec3 vN;
          varying vec3 vP;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vP = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vN;
          varying vec3 vP;
          void main() {
            float f = 1.0 - max(dot(normalize(-vP), vN), 0.0);
            gl_FragColor = vec4(vec3(0.38, 0.58, 1.0), pow(f, 3.5) * 0.9);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    pivot.add(atmo);

    const glowTexBlue = createGlowTexture('rgba(90,130,255,0.35)', 'rgba(60,100,230,0.12)');
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTexBlue, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
    );
    halo.scale.setScalar(2.9);
    halo.position.z = -0.2;
    pivot.add(halo);

    // Hubs — small gold beacons with a soft pulse
    const hubVecs = HUBS.map((h) => latLngToVector3(h.lat, h.lng, 1.002));
    const beaconGeo = new THREE.SphereGeometry(0.008, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffd36e });
    const pulseGeo = new THREE.RingGeometry(0.012, 0.018, 40);
    const pulses: { mesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>; offset: number }[] = [];
    hubVecs.forEach((v, i) => {
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(v);
      globe.add(beacon);
      const ring = new THREE.Mesh(
        pulseGeo,
        new THREE.MeshBasicMaterial({ color: 0xffd36e, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }),
      );
      ring.position.copy(v.clone().multiplyScalar(1.001));
      ring.lookAt(v.clone().multiplyScalar(2));
      globe.add(ring);
      pulses.push({ mesh: ring, offset: i * 0.37 });
    });

    const GOLD = new THREE.Color(0xf2b84b);
    const glowTexGold = createGlowTexture('rgba(255,244,214,1)', 'rgba(255,196,80,0.45)');
    const ringGeo = new THREE.RingGeometry(0.8, 1, 48);

    // Prefer hubs on the side facing the viewer so transfers are seen end to end
    const tmp = new THREE.Vector3();
    const pickRoute = (): [THREE.Vector3, THREE.Vector3] => {
      const visibleIdx = hubVecs
        .map((v, i) => {
          tmp.copy(v).applyMatrix4(globe.matrixWorld);
          return tmp.z > 0.3 * pivot.scale.x ? i : -1;
        })
        .filter((i) => i >= 0);
      const pool = visibleIdx.length >= 3 ? visibleIdx : hubVecs.map((_, i) => i);
      for (let tries = 0; tries < 24; tries++) {
        const a = pool[Math.floor(Math.random() * pool.length)];
        const b = pool[Math.floor(Math.random() * pool.length)];
        const ang = hubVecs[a].angleTo(hubVecs[b]);
        if (a !== b && ang > 0.25 && ang < 1.4) return [hubVecs[a], hubVecs[b]];
      }
      return [hubVecs[0], hubVecs[5]];
    };

    // Great-circle path lifted into a gentle arc; longer hops fly higher
    const buildCurve = (from: THREE.Vector3, to: THREE.Vector3) => {
      const ang = from.angleTo(to);
      const lift = 0.03 + ang * 0.14;
      const a = from.clone().normalize();
      const b = to.clone().normalize();
      const sinA = Math.sin(ang);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const p = a.clone().multiplyScalar(Math.sin((1 - t) * ang) / sinA).add(b.clone().multiplyScalar(Math.sin(t * ang) / sinA));
        pts.push(p.multiplyScalar(1.003 + Math.sin(Math.PI * t) * lift));
      }
      return new THREE.CatmullRomCurve3(pts);
    };

    const routeMaterial = () =>
      new THREE.ShaderMaterial({
        vertexShader: TRAIL_VERTEX,
        fragmentShader: ROUTE_FRAGMENT,
        uniforms: { uReveal: { value: 0 }, uAlpha: { value: 0 }, uColor: { value: GOLD } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    const cometMaterial = (intensity: number) =>
      new THREE.ShaderMaterial({
        vertexShader: TRAIL_VERTEX,
        fragmentShader: COMET_FRAGMENT,
        uniforms: { uHead: { value: 0 }, uTail: { value: 0 }, uIntensity: { value: intensity }, uColor: { value: GOLD } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    const ringMaterial = () =>
      new THREE.MeshBasicMaterial({ color: 0xffd987, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });

    const orientRing = (ring: THREE.Mesh, at: THREE.Vector3) => {
      ring.position.copy(at).multiplyScalar(1.003);
      ring.lookAt(tmp.copy(at).multiplyScalar(2));
    };

    const setGeometry = (tr: Transfer) => {
      tr.route.geometry.dispose();
      tr.comet.geometry.dispose();
      tr.bloom.geometry.dispose();
      tr.route.geometry = new THREE.TubeGeometry(tr.curve, 120, 0.0022, 5, false);
      tr.comet.geometry = new THREE.TubeGeometry(tr.curve, 120, 0.0042, 6, false);
      tr.bloom.geometry = new THREE.TubeGeometry(tr.curve, 120, 0.013, 6, false);
      orientRing(tr.sendRing, tr.from);
      tr.recvRings.forEach((r) => orientRing(r, tr.to));
    };

    const plan = (tr: Transfer, now: number, initialDelay = 0) => {
      const [from, to] = pickRoute();
      tr.from = from;
      tr.to = to;
      tr.curve = buildCurve(from, to);
      tr.start = now + initialDelay;
      tr.travel = 1500 + from.angleTo(to) * 1400 + Math.random() * 400;
      tr.rest = 150 + Math.random() * 900;
      setGeometry(tr);
    };

    const createTransfer = (now: number, delay: number): Transfer => {
      const empty = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(0, 0, 0.001)]), 1, 0.001, 3);
      const route = new THREE.Mesh(empty, routeMaterial());
      const comet = new THREE.Mesh(empty.clone(), cometMaterial(1.0));
      const bloom = new THREE.Mesh(empty.clone(), cometMaterial(0.22));
      globe.add(route, bloom, comet);
      const packet = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glowTexGold, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
      );
      globe.add(packet);
      const sendRing = new THREE.Mesh(ringGeo, ringMaterial());
      const recvRings = [new THREE.Mesh(ringGeo, ringMaterial()), new THREE.Mesh(ringGeo, ringMaterial())];
      globe.add(sendRing, ...recvRings);
      const tr = { route, comet, bloom, packet, sendRing, recvRings } as Transfer;
      plan(tr, now, delay);
      return tr;
    };

    const transfers: Transfer[] = [];
    const COUNT = 8;
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const now = performance.now();
      const time = now / 1000;

      if (!reduceMotion) globe.rotation.y += dt * 0.1;
      scene.updateMatrixWorld(true);

      if (transfers.length === 0) {
        for (let i = 0; i < COUNT; i++) transfers.push(createTransfer(now, i * 450 + Math.random() * 300));
      }

      pulses.forEach((p) => {
        const k = (time * 0.6 + p.offset) % 1;
        p.mesh.scale.setScalar(1 + k * 2.2);
        p.mesh.material.opacity = 0.4 * (1 - k);
      });

      for (const tr of transfers) {
        const ms = now - tr.start;
        const ru = tr.route.material.uniforms;
        const cu = tr.comet.material.uniforms;
        const bu = tr.bloom.material.uniforms;

        if (ms < 0) {
          ru.uAlpha.value = 0;
          cu.uHead.value = cu.uTail.value = 0;
          bu.uHead.value = bu.uTail.value = 0;
          tr.packet.visible = false;
          tr.sendRing.material.opacity = 0;
          tr.recvRings.forEach((r) => (r.material.opacity = 0));
          continue;
        }
        if (ms > tr.travel + SETTLE_MS + tr.rest) {
          plan(tr, now);
          continue;
        }

        // Packet position along the route (eased), comet tail trailing behind
        const p = Math.min(1, ms / tr.travel);
        const head = easeInOut(p);
        const after = Math.max(0, ms - tr.travel) / SETTLE_MS; // 0..1 after arrival
        const tail = p < 1 ? Math.max(0, head - TAIL_LENGTH) : Math.min(1, 1 - TAIL_LENGTH + after * TAIL_LENGTH * 2.5);
        cu.uHead.value = bu.uHead.value = head;
        cu.uTail.value = bu.uTail.value = Math.min(tail, head);

        // Route line: draws in with the packet, lingers briefly, then fades
        ru.uReveal.value = head;
        ru.uAlpha.value = 0.28 * Math.min(1, ms / 250) * (1 - Math.min(1, after * 1.2));

        // Glowing packet at the comet head
        tr.packet.visible = p < 1;
        if (tr.packet.visible) {
          tr.curve.getPointAt(head, tr.packet.position);
          const flicker = 0.9 + Math.sin(time * 30 + tr.travel) * 0.1;
          tr.packet.scale.setScalar(0.07 * flicker);
        }

        // Sender flash
        const send = ms / 600;
        tr.sendRing.scale.setScalar(0.004 + Math.min(1, send) * 0.035);
        tr.sendRing.material.opacity = send < 1 ? 0.7 * (1 - send) : 0;

        // Receiver: two staggered ripples
        tr.recvRings.forEach((ring, idx) => {
          const k = (after - idx * 0.22) / 0.75;
          if (k > 0 && k < 1) {
            ring.scale.setScalar(0.004 + k * 0.05);
            ring.material.opacity = 0.85 * (1 - k);
          } else {
            ring.material.opacity = 0;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      layout();
    };
    window.addEventListener('resize', onResize);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      clock.getDelta();
    });
    io.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      [day, lights, glowTexGold, glowTexBlue].forEach((t) => t.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className={`w-full h-full absolute inset-0 pointer-events-none select-none ${className}`} />
  );
};

export default ParallaxGlobe;
