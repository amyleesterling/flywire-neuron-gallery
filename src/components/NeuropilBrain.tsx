import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { NEUROPILS } from "../data/neuropilMap";

interface Props {
  highlighted: string[];
}

// FAFB coordinate normalization.
// Brain bounding box: X [188790, 854578], Y [75002, 399276], Z [2007, 271196] nm
// We subtract the brain center and divide by half the X extent so brain fits ±1 in X.
const CX = 521684, CY = 237139, CZ = 136601;
const SCALE = 1 / 332894;

function normalizePositions(geometry: THREE.BufferGeometry) {
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
  // Y-flip mirrors winding order; recompute normals so lighting matches.
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
}

const BASE = import.meta.env.BASE_URL + "meshes/neuropils/";

export default function NeuropilBrain({ highlighted }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<string[]>(highlighted);

  useEffect(() => {
    highlightedRef.current = highlighted;
  }, [highlighted]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene + Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40, container.clientWidth / container.clientHeight, 0.01, 50
    );
    camera.position.set(0, 0.1, 2.4);
    camera.lookAt(0, 0, 0);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(2, 3, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8899ff, 0.35);
    fill.position.set(-2, 0, 1);
    scene.add(fill);

    // ── Controls (click-drag rotate, gentle auto-spin when idle) ──────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.7;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    // Pause auto-rotate while user is dragging; resume when they let go.
    controls.addEventListener("start", () => { controls.autoRotate = false; });
    controls.addEventListener("end", () => { controls.autoRotate = true; });

    // ── Pivot group (kept for hierarchy; rotation now driven by camera) ───
    const pivot = new THREE.Group();
    scene.add(pivot);

    // ── Track loaded objects for cleanup ──────────────────────────────────
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    type Entry = {
      mat: THREE.MeshStandardMaterial;
      id: string;
    };
    const entries: Entry[] = [];

    let destroyed = false;
    const loader = new GLTFLoader();

    // ── Brain ghost shell ─────────────────────────────────────────────────
    loader.load(BASE + "BRAIN.glb", (gltf) => {
      if (destroyed) return;
      gltf.scene.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const src = child as THREE.Mesh;
        const geo = src.geometry.clone();
        normalizePositions(geo);
        const mat = new THREE.MeshBasicMaterial({
          color: 0x99aacc,
          transparent: true,
          opacity: 0.045,
          side: THREE.BackSide,
          depthWrite: false,
        });
        pivot.add(new THREE.Mesh(geo, mat));
        geometries.push(geo);
        materials.push(mat);
      });
    });

    // ── Neuropil meshes ───────────────────────────────────────────────────
    for (const np of NEUROPILS) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(np.color),
        emissive: new THREE.Color(np.color),
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0.15,
        roughness: 0.35,
        metalness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      materials.push(mat);
      entries.push({ mat, id: np.id });

      loader.load(BASE + np.id + ".glb", (gltf) => {
        if (destroyed) return;
        gltf.scene.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const src = child as THREE.Mesh;
          const geo = src.geometry.clone();
          normalizePositions(geo);
          pivot.add(new THREE.Mesh(geo, mat));
          geometries.push(geo);
        });
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

      const hl = highlightedRef.current;
      const anyHl = hl.length > 0;
      for (const e of entries) {
        const isHl = hl.includes(e.id);
        const targetOpacity = isHl ? 0.88 : (anyHl ? 0.035 : 0.15);
        const targetEmissive = isHl ? 0.65 : 0;
        e.mat.opacity += (targetOpacity - e.mat.opacity) * 0.1;
        e.mat.emissiveIntensity += (targetEmissive - e.mat.emissiveIntensity) * 0.1;
      }

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
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ height: "280px", background: "rgba(4,6,12,0.5)" }}
    />
  );
}
