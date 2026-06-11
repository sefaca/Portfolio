import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const APPS = [
  { src: "/assets/FoodSaver.webp", name: "FoodSaver" },
  { src: "/assets/CookMate.webp", name: "CookMate" },
  { src: "/assets/WeatherAI.webp", name: "WeatherAIApp" },
  { src: "/assets/ExpenseTracker.webp", name: "ExpenseTracker" },
];

interface PhoneProps {
  reduced: boolean;
  visible: boolean;
  onCommit: (i: number) => void;
}

function Phone({ reduced, visible, onCommit }: PhoneProps) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const invalidate = useThree((s) => s.invalidate);

  const textures = useTexture(APPS.map((a) => a.src)) as THREE.Texture[];

  // Espacio de color correcto (efecto, no memo)
  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
  }, [textures]);

  const idx = useRef(0);
  const phase = useRef<"hold" | "out" | "in">("hold");
  const t = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Ciclo de pantallas (solo con movimiento y sección visible)
  useEffect(() => {
    if (reduced || !visible) return;
    const id = setInterval(() => {
      if (phase.current === "hold") {
        phase.current = "out";
        t.current = 0;
      }
    }, 3800);
    return () => clearInterval(id);
  }, [reduced, visible]);

  // Si se activa reduced-motion a media transición, dejamos la pantalla en reposo limpio
  useEffect(() => {
    if (!reduced) return;
    const m = screenMat.current;
    if (m) {
      m.opacity = 1;
      m.needsUpdate = true;
    }
    phase.current = "hold";
    t.current = 0;
    invalidate();
  }, [reduced, invalidate]);

  useFrame((_, dt) => {
    if (group.current && visible) {
      const baseY = -0.32;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        baseY + pointer.current.x * 0.4,
        0.05
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -pointer.current.y * 0.25,
        0.05
      );
    }

    const m = screenMat.current;
    if (!m) return;
    if (phase.current === "out") {
      t.current += dt / 0.28;
      m.opacity = 1 - Math.min(t.current, 1);
      if (t.current >= 1) {
        idx.current = (idx.current + 1) % textures.length;
        m.map = textures[idx.current];
        m.needsUpdate = true;
        onCommit(idx.current);
        phase.current = "in";
        t.current = 0;
      }
    } else if (phase.current === "in") {
      t.current += dt / 0.28;
      m.opacity = Math.min(t.current, 1);
      if (t.current >= 1) {
        phase.current = "hold";
        m.opacity = 1;
      }
    }
  });

  return (
    <Float
      speed={reduced ? 0 : 1.1}
      rotationIntensity={reduced ? 0 : 0.25}
      floatIntensity={reduced ? 0 : 0.8}
    >
      <group ref={group} rotation={[0.04, -0.32, 0]}>
        <RoundedBox args={[2.18, 3.18, 0.22]} radius={0.16} smoothness={6}>
          <meshPhysicalMaterial
            color="#1b1b22"
            metalness={0.6}
            roughness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.25}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.122]}>
          <planeGeometry args={[2.0, 3.0]} />
          <meshBasicMaterial
            ref={screenMat}
            map={textures[0]}
            toneMapped={false}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function PhoneScene() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [lowPower] = useState(() => {
    if (typeof window === "undefined") return false;
    const cores = navigator.hardwareConcurrency || 4;
    return window.matchMedia("(pointer: coarse)").matches || cores <= 4;
  });
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="phone-stage" ref={host}>
      <Canvas
        frameloop={visible && !reduced ? "always" : "demand"}
        dpr={[1, lowPower ? 1.3 : 1.8]}
        camera={{ position: [0, 0, 7], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Phone reduced={reduced} visible={visible} onCommit={setCurrent} />
          <Environment resolution={128}>
            <Lightformer intensity={2} position={[0, 3, 4]} scale={[6, 6, 1]} color="#ffffff" />
            <Lightformer intensity={1.5} position={[-4, 0, 2]} scale={[4, 6, 1]} color="#d8d8d8" />
            <Lightformer intensity={1.3} position={[4, 1, 1]} scale={[4, 6, 1]} color="#bfbfbf" />
          </Environment>
        </Suspense>
      </Canvas>

      <div className="phone-apps" aria-hidden="true">
        {APPS.map((a, i) => (
          <span key={a.name} className={i === current ? "is-active" : ""}>
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}
