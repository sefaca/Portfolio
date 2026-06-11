import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Aurora de seda líquida: plano full-screen con fbm domain-warped
 * mapeado a la paleta iridiscente, fluyendo y reaccionando al ratón.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uDetail;

  // hash + value noise + fbm (compacto y rápido)
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      if (float(i) >= uDetail) break;
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y) * 1.7;
    float t = uTime * 0.055;

    // Influencia del ratón: empuja el campo de flujo
    vec2 m = uMouse * 0.55;

    vec2 q = vec2(
      fbm(p + t + m),
      fbm(p + vec2(5.2, 1.3) - t * 0.7)
    );
    vec2 r = vec2(
      fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.4 + m * 0.8),
      fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.3)
    );
    float f = fbm(p + 3.0 * r);

    // Paleta monocroma: tinta -> humo gris -> crestas blancas,
    // con un tinte mínimo del acento en los picos.
    vec3 ink    = vec3(0.02);
    vec3 smoke  = vec3(0.62);
    vec3 white  = vec3(0.97);
    vec3 accent = vec3(1.0, 0.266, 0.0);

    vec3 col = ink;
    col = mix(col, smoke, smoothstep(0.3, 0.95, f) * 0.42);
    col = mix(col, smoke * 0.7, clamp(q.x * q.y * 1.5, 0.0, 1.0) * 0.3);
    col = mix(col, white, smoothstep(0.68, 1.0, r.x * f) * 0.5);
    col = mix(col, accent, smoothstep(0.8, 1.05, r.y * f) * 0.1);

    // Profundidad + viñeta para que el texto respire
    float vign = smoothstep(1.25, 0.35, distance(uv, vec2(0.5, 0.46)));
    col *= mix(0.3, 1.0, vign);
    col *= 0.9 + 0.1 * f;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function AuroraPlane({ lowPower, visible }: { lowPower: boolean; visible: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));
  const size = useThree((s) => s.size);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uDetail: { value: lowPower ? 3 : 5 },
    }),
    [lowPower]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!mat.current || !visible) return;
    mat.current.uniforms.uTime.value += delta;
    mouse.current.lerp(target.current, 0.035);
    mat.current.uniforms.uMouse.value.copy(mouse.current);
    mat.current.uniforms.uAspect.value = size.width / size.height;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function AuroraScene() {
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
        dpr={[1, lowPower ? 1 : 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#050505" }}
      >
        <AuroraPlane lowPower={lowPower} visible={visible} />
      </Canvas>
    </div>
  );
}
