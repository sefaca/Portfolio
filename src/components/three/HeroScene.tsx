import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/** Color que "ve" la refracción del cristal: evita que el interior se renderice casi negro. */
const TRANSMISSION_BG = new THREE.Color("#1a1a28");

interface Quality {
  lowPower: boolean;
  visible: boolean;
}

/** El objeto de cristal iridiscente que flota en el héroe. */
function GlassGem({ lowPower }: { lowPower: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.18;
    mesh.current.rotation.x += delta * 0.06;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh ref={mesh} scale={2.15}>
        <icosahedronGeometry args={[1, lowPower ? 3 : 4]} />
        <MeshTransmissionMaterial
          background={TRANSMISSION_BG}
          transmission={1}
          thickness={1.4}
          roughness={0.06}
          ior={1.42}
          chromaticAberration={0.5}
          anisotropy={0.2}
          distortion={0.4}
          distortionScale={0.4}
          temporalDistortion={0.18}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[120, 420]}
          samples={lowPower ? 3 : 6}
          resolution={lowPower ? 192 : 384}
          backside={!lowPower}
          color="#eef3ff"
          attenuationColor="#a78bfa"
          attenuationDistance={3}
        />
      </mesh>
    </Float>
  );
}

/** Grupo que se inclina suavemente siguiendo el puntero (escuchado a nivel ventana). */
function Tilt({ lowPower, visible }: Quality) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current || !visible) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.current.x * 0.45,
      0.045
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.current.y * 0.35,
      0.045
    );
  });

  return (
    <group ref={group}>
      <GlassGem lowPower={lowPower} />
    </group>
  );
}

export default function HeroScene() {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [lowPower] = useState(() => {
    const cores = navigator.hardwareConcurrency || 4;
    return window.matchMedia("(pointer: coarse)").matches || cores <= 4;
  });
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Pausa el render cuando el héroe sale de pantalla
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

  if (reduced) {
    return <div className="hero__static" aria-hidden="true" />;
  }

  return (
    <div ref={host} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={visible ? "always" : "demand"}
        dpr={[1, lowPower ? 1.3 : 1.8]}
        camera={{ position: [0, 0, 6.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />

        <Tilt lowPower={lowPower} visible={visible} />

        {/* Entorno de luces para los reflejos del cristal (sin HDR remoto) */}
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 2.5, 4]} scale={[7, 7, 1]} color="#6ff7ff" />
          <Lightformer intensity={1.8} position={[-4, -1, 2]} scale={[5, 5, 1]} color="#a78bfa" />
          <Lightformer intensity={1.6} position={[4, 1, -2]} scale={[5, 5, 1]} color="#f472d0" />
          <Lightformer intensity={1.2} position={[0, -3, 1]} scale={[6, 3, 1]} color="#6aa8ff" />
        </Environment>
      </Canvas>
    </div>
  );
}
