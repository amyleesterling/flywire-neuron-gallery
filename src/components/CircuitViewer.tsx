import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface CircuitCell {
  segId: string;
  color: string;
}

interface Props {
  circuitId: string;
  cells: CircuitCell[];
  height?: number;
}

const BASE = import.meta.env.BASE_URL + "meshes/circuits/";
const BRAIN_URL = import.meta.env.BASE_URL + "meshes/neuropils/BRAIN.glb";

// Same FAFB → Three.js transform NeuropilBrain uses, kept here so the runtime
// normalization of BRAIN.glb (which ships in raw FAFB nm) lines up with the
// circuit cell meshes (pre-normalized in scripts/extract-circuit-meshes.py).
const CX = 521684, CY = 237139, CZ = 136601;
const SCALE = 1 / 332894;

function normalizeFafb(geometry: THREE.BufferGeometry) {
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  if (!pos) return;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      (pos.getX(i) - CX) * SCALE,
      -(pos.getY(i) - CY) * SCALE,
      (pos.getZ(i) - CZ) * SCALE,
    );
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
}

export default function CircuitViewer({ circuitId, cells, height = 280 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalCells = cells.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene + Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.01,
      50,
    );
    camera.position.set(0, 0.1, 2.4);
    camera.lookAt(0, 0, 0);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(2, 3, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8899ff, 0.3);
    fill.position.set(-2, 0, 1);
    scene.add(fill);

    // ── Controls ──────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.7;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });
    controls.addEventListener("end", () => {
      controls.autoRotate = true;
    });

    // ── Track loaded objects for cleanup ──────────────────────────────────
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let destroyed = false;

    const loader = new GLTFLoader();

    // ── Brain ghost shell (loaded once, shared across all CircuitViewers) ──
    loader.load(BRAIN_URL, (gltf) => {
      if (destroyed) return;
      gltf.scene.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const src = child as THREE.Mesh;
        const geo = src.geometry.clone();
        normalizeFafb(geo);
        const mat = new THREE.MeshBasicMaterial({
          color: 0xb8c8e0,
          transparent: true,
          opacity: 0.07,
          side: THREE.BackSide,
          depthWrite: false,
        });
        scene.add(new THREE.Mesh(geo, mat));
        geometries.push(geo);
        materials.push(mat);
      });
    });

    // ── Load each cell ────────────────────────────────────────────────────
    for (const cell of cells) {
      const url = `${BASE}${circuitId}/${cell.segId}.glb`;
      loader.load(url, (gltf) => {
        if (destroyed) return;
        gltf.scene.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const src = child as THREE.Mesh;
          const geo = src.geometry.clone();
          // Geometry is already FAFB-normalized + Y-flipped by the Python
          // pipeline, so faces wind correctly here — no winding fix needed.
          geo.computeVertexNormals();
          geo.computeBoundingSphere();

          const color = new THREE.Color(cell.color);
          const mat = new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.18,
            transparent: true,
            opacity: 0.92,
            roughness: 0.4,
            metalness: 0.05,
            side: THREE.DoubleSide,
          });
          scene.add(new THREE.Mesh(geo, mat));
          geometries.push(geo);
          materials.push(mat);
        });
        setLoadedCount((n) => n + 1);
      });
    }

    // ── Resize ───────────────────────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ── Animation loop ───────────────────────────────────────────────────
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      destroyed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [circuitId]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: `${height}px`, background: "rgba(4,6,12,0.6)" }}
      />
      {loadedCount < totalCells && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
            Loading {loadedCount}/{totalCells}
          </p>
        </div>
      )}
    </div>
  );
}
