"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * The landing hero's 3D scene (D-021).
 *
 * One frosted-glass knot refracts three slowly orbiting light spheres in the
 * brand's blue, white and a third ice-cyan tone, so colour "flows" through
 * the glass without anything being drawn on it. It is abstract on purpose:
 * no product is depicted, so nothing in it can misrepresent the stock.
 *
 * Reactive, every frame and without React state:
 *   - the whole form leans toward the pointer (damped, never snapping)
 *   - pointer speed briefly quickens the flow, so the scene answers movement
 *   - scrolling the hero away eases the form back and down
 *
 * The parent decides `active`: off-screen, hidden tabs and reduced motion
 * stop the render loop entirely (frameloop "never").
 */

const BLUE = "#0759e8";
const DEEP = "#0b2463";
const ICE = "#7fd3ff";
// What the glass "sees" behind it: the page's lavender field, not black.
const FIELD = new THREE.Color("#eef2ff");

type Orb = {
  color: string;
  radius: number;
  size: number;
  speed: number;
  phase: number;
  tilt: number;
  intensity: number;
};

const orbs: Orb[] = [
  {
    color: BLUE,
    radius: 1.55,
    size: 0.62,
    speed: 0.32,
    phase: 0,
    tilt: 0.35,
    intensity: 2.2,
  },
  {
    color: ICE,
    radius: 1.25,
    size: 0.46,
    speed: -0.41,
    phase: 2.1,
    tilt: -0.5,
    intensity: 2.6,
  },
  {
    color: "#ffffff",
    radius: 1.8,
    size: 0.38,
    speed: 0.27,
    phase: 4.2,
    tilt: 0.9,
    intensity: 3,
  },
];

function LightOrb({ orb, flow }: { orb: Orb; flow: React.RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(orb.phase);
  useFrame((_, dt) => {
    t.current += dt * orb.speed * (1 + (flow.current ?? 0));
    const a = t.current;
    ref.current?.position.set(
      Math.cos(a) * orb.radius,
      Math.sin(a * 1.3) * orb.radius * 0.45 + Math.sin(a) * orb.tilt * 0.4,
      Math.sin(a) * orb.radius * 0.6 - 0.8,
    );
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[orb.size, 48, 48]} />
      <meshStandardMaterial
        color={orb.color}
        emissive={orb.color}
        emissiveIntensity={orb.intensity}
        toneMapped={false}
      />
    </mesh>
  );
}

function GlassKnot({ lite }: { lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const flow = useRef(0);
  const last = useRef(new THREE.Vector2());

  const geometry = useMemo(
    () =>
      new THREE.TorusKnotGeometry(
        1,
        0.34,
        lite ? 160 : 300,
        lite ? 24 : 48,
        2,
        3,
      ),
    [lite],
  );

  useFrame((state, dt) => {
    const { pointer } = state;
    // Pointer speed feeds the flow, then decays: movement makes it surge.
    const speed = pointer.distanceTo(last.current) / Math.max(dt, 1 / 120);
    last.current.copy(pointer);
    flow.current = THREE.MathUtils.damp(
      flow.current,
      Math.min(speed * 0.35, 2.5),
      3,
      dt,
    );

    const scroll =
      typeof window === "undefined"
        ? 0
        : Math.min(window.scrollY / window.innerHeight, 1);

    if (group.current) {
      const g = group.current;
      g.rotation.x = THREE.MathUtils.damp(
        g.rotation.x,
        -pointer.y * 0.45 + scroll * 0.6,
        4,
        dt,
      );
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.6, 4, dt);
      g.position.y = THREE.MathUtils.damp(g.position.y, -scroll * 1.4, 4, dt);
      const s = 1 - scroll * 0.18;
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt));
    }
    if (knot.current) {
      knot.current.rotation.z += dt * (0.12 + flow.current * 0.25);
      knot.current.rotation.x += dt * 0.05;
    }
  });

  return (
    <group ref={group}>
      {orbs.map((orb) => (
        <LightOrb key={orb.color} orb={orb} flow={flow} />
      ))}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={knot} geometry={geometry} scale={0.98}>
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.6}
            thickness={1.1}
            samples={lite ? 3 : 6}
            resolution={lite ? 256 : 768}
            transmission={1}
            roughness={0.12}
            ior={1.42}
            chromaticAberration={0.35}
            anisotropicBlur={0.25}
            distortion={0.45}
            distortionScale={0.4}
            temporalDistortion={0.18}
            clearcoat={1}
            attenuationDistance={1.6}
            attenuationColor="#b9cfff"
            color="#f4f8ff"
            background={FIELD}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function FlowScene({
  active,
  lite,
}: {
  active: boolean;
  lite: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 6.6], fov: 38 }}
      gl={{
        antialias: !lite,
        alpha: true,
        powerPreference: "high-performance",
      }}
      // Pointer is tracked on the page, not only the canvas, so the scene
      // reacts while the cursor is over the headline too.
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#ffffff" />
      <GlassKnot lite={lite} />
      <Sparkles
        count={lite ? 30 : 70}
        scale={[7, 4.5, 3]}
        size={2.2}
        speed={0.35}
        opacity={0.7}
        color={BLUE}
      />
      {/* Studio light made of shapes, so no HDR file is fetched at runtime. */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 4, -2]}
          scale={[10, 2, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-5, 0, 1]}
          rotation-y={Math.PI / 2}
          scale={[8, 3, 1]}
          color={ICE}
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[8, 3, 1]}
          color={BLUE}
        />
        <Lightformer
          form="ring"
          intensity={1.5}
          position={[0, -3, 3]}
          scale={3}
          color={DEEP}
        />
      </Environment>
    </Canvas>
  );
}
