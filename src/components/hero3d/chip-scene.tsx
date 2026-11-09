"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Line,
  MeshTransmissionMaterial,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Landing hero scene, v2 (D-022): "the core".
 *
 * A frosted-glass processor floats over a circuit board. Light pulses run
 * along the board's traces into the chip, like data, and the glowing die
 * inside is seen through the glass. It speaks the business's language
 * (computers, repair, the inside of the machine) without depicting any
 * product, so nothing in it can misrepresent the stock.
 *
 * Fixes from the visual review (docs/design/VISUAL-REVIEW-2026-11-09.md):
 *   L1 flat discs: every light is an additive glow sprite with a soft
 *      falloff, so it reads as light without a post-processing dependency
 *   L2 hard canvas edges: the canvas fills the whole hero and its edges are
 *      faded by the parent's mask; nothing reaches a hard boundary
 *   L3 sliced on scroll: the scene lifts away and fades as the hero leaves
 *
 * Reactive every frame, without React state: the chip leans toward the
 * pointer, pointer speed makes the data surge, scrolling lifts it away.
 */

const BLUE = new THREE.Color("#0759e8");
const ICE = new THREE.Color("#7fd3ff");
const WHITE = new THREE.Color("#ffffff");
const FIELD = new THREE.Color("#eef2ff");

/** One soft round glow, shared by every light in the scene. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(255,255,255,0.85)");
    g.addColorStop(0.45, "rgba(255,255,255,0.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/** The die pattern: a fine grid of cells, drawn once to a texture. */
function useDieTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const bg = ctx.createRadialGradient(
      size / 2,
      size / 2,
      10,
      size / 2,
      size / 2,
      size * 0.7,
    );
    bg.addColorStop(0, "#7fd3ff");
    bg.addColorStop(0.45, "#2f73ff");
    bg.addColorStop(1, "#0b2463");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    const cells = 8;
    const step = size / cells;
    for (let i = 1; i < cells; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 24);
      ctx.lineTo(i * step, size - 24);
      ctx.moveTo(24, i * step);
      ctx.lineTo(size - 24, i * step);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    for (let x = 0; x < cells; x++) {
      for (let y = 0; y < cells; y++) {
        if ((x * 7 + y * 3) % 5 === 0) {
          ctx.fillRect(
            x * step + step * 0.3,
            y * step + step * 0.3,
            step * 0.4,
            step * 0.4,
          );
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

type Trace = { points: THREE.Vector3[]; length: number; lengths: number[] };

/**
 * Circuit traces radiating from the chip in right-angle runs, generated from
 * a fixed seed so the board looks the same on every load.
 */
function buildTraces(count: number): Trace[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const traces: Trace[] = [];
  const half = 1.35;
  const z = -0.45;
  for (let i = 0; i < count; i++) {
    const side = i % 4;
    const along = (rand() - 0.5) * 2 * (half - 0.25);
    const out = 0.45 + rand() * 1.0;
    const bend = (rand() - 0.5) * 1.6;
    const tail = 0.3 + rand() * 1.1;
    // Start on the chip's edge, run outward, jog sideways, run out again.
    const dir = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ][side]!;
    const normal = [dir[1]!, dir[0]!];
    const start = new THREE.Vector3(
      dir[0]! * half + normal[0]! * along,
      dir[1]! * half + normal[1]! * along,
      z,
    );
    const a = start
      .clone()
      .add(new THREE.Vector3(dir[0]! * out, dir[1]! * out, 0));
    const b = a
      .clone()
      .add(new THREE.Vector3(normal[0]! * bend, normal[1]! * bend, 0));
    const c = b
      .clone()
      .add(new THREE.Vector3(dir[0]! * tail, dir[1]! * tail, 0));
    // Points run from the far end INTO the chip, so data flows toward it.
    const points = [c, b, a, start];
    const lengths = points.slice(1).map((p, k) => p.distanceTo(points[k]!));
    traces.push({
      points,
      lengths,
      length: lengths.reduce((s, l) => s + l, 0),
    });
  }
  return traces;
}

function pointOn(trace: Trace, t: number, out: THREE.Vector3) {
  let d = t * trace.length;
  for (let k = 0; k < trace.lengths.length; k++) {
    const seg = trace.lengths[k]!;
    if (d <= seg)
      return out.lerpVectors(trace.points[k]!, trace.points[k + 1]!, d / seg);
    d -= seg;
  }
  return out.copy(trace.points[trace.points.length - 1]!);
}

function Board({ lite }: { lite: boolean }) {
  const glow = useGlowTexture();
  const die = useDieTexture();
  const traces = useMemo(() => buildTraces(lite ? 20 : 36), [lite]);
  const pulsesPerTrace = lite ? 1 : 2;
  const pulseCount = traces.length * pulsesPerTrace;

  const rig = useRef<THREE.Group>(null);
  const chip = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);
  const points = useRef<THREE.Points>(null);
  const flow = useRef(0);
  const last = useRef(new THREE.Vector2());
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const { viewport } = useThree();

  // Per-frame simulation state lives in a ref, never in render state.
  const offsets = useRef<number[]>([]);
  const speeds = useMemo(
    () =>
      Array.from({ length: pulseCount }, (_, i) => 0.12 + ((i * 37) % 11) / 60),
    [pulseCount],
  );
  const positions = useMemo(
    () => new Float32Array(pulseCount * 3),
    [pulseCount],
  );
  const colors = useMemo(() => {
    const c = new Float32Array(pulseCount * 3);
    for (let i = 0; i < pulseCount; i++) {
      const col = i % 3 === 0 ? WHITE : i % 3 === 1 ? ICE : BLUE;
      c.set([col.r, col.g, col.b], i * 3);
    }
    return c;
  }, [pulseCount]);

  // Pins: four rows of short metal legs under the glass.
  const pins = useMemo(() => {
    const list: [number, number, number, number][] = [];
    const n = 9;
    for (let s = 0; s < 4; s++) {
      for (let k = 0; k < n; k++) {
        const along = -1.0 + (2.0 * k) / (n - 1);
        const x = s === 0 ? 1.28 : s === 1 ? -1.28 : along;
        const y = s === 2 ? 1.28 : s === 3 ? -1.28 : along;
        list.push([x, y, -0.18, s < 2 ? 0 : Math.PI / 2]);
      }
    }
    return list;
  }, []);

  // Desktop: the scene sits right of the copy. Narrow: centred, lower.
  const wide = viewport.width > 6.5;
  const baseX = wide ? viewport.width * 0.24 : 0;
  const baseY = wide ? -0.1 : -viewport.height * 0.2;
  const baseScale = wide ? 0.8 : Math.min(0.85, viewport.width / 5.6);

  useFrame((state, dt) => {
    const { pointer } = state;
    const speed = pointer.distanceTo(last.current) / Math.max(dt, 1 / 120);
    last.current.copy(pointer);
    flow.current = THREE.MathUtils.damp(
      flow.current,
      Math.min(speed * 0.5, 3),
      3,
      dt,
    );

    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    state.gl.domElement.style.opacity = String(Math.max(0, 1 - scroll * 1.25));

    if (rig.current) {
      const r = rig.current;
      r.rotation.x = THREE.MathUtils.damp(
        r.rotation.x,
        -0.55 - pointer.y * 0.25 - scroll * 0.4,
        4,
        dt,
      );
      r.rotation.y = THREE.MathUtils.damp(
        r.rotation.y,
        0.35 + pointer.x * 0.35,
        4,
        dt,
      );
      r.rotation.z = THREE.MathUtils.damp(
        r.rotation.z,
        -0.18 + pointer.x * 0.05,
        4,
        dt,
      );
      r.position.x = baseX;
      r.position.y = THREE.MathUtils.damp(
        r.position.y,
        baseY + scroll * 1.6,
        4,
        dt,
      );
      r.scale.setScalar(baseScale * (1 - scroll * 0.12));
    }
    if (chip.current) {
      const t = state.clock.elapsedTime;
      chip.current.position.z = 0.35 + Math.sin(t * 0.9) * 0.06;
    }
    if (halo.current) {
      const pulse =
        1 +
        Math.sin(state.clock.elapsedTime * 1.6) * 0.06 +
        flow.current * 0.08;
      halo.current.scale.setScalar(3.1 * pulse);
    }

    // Move every pulse along its trace; faster when the pointer moves.
    const attr = points.current?.geometry.getAttribute("position");
    if (!attr) return;
    const buffer = attr.array as Float32Array;
    const o = offsets.current;
    if (o.length !== pulseCount) {
      for (let i = 0; i < pulseCount; i++) o[i] = (i * 0.6180339) % 1;
      o.length = pulseCount;
    }
    const rate = 1 + flow.current;
    for (let i = 0; i < pulseCount; i++) {
      o[i] = (o[i]! + dt * speeds[i]! * rate) % 1;
      pointOn(traces[i % traces.length]!, o[i]!, tmp);
      buffer[i * 3] = tmp.x;
      buffer[i * 3 + 1] = tmp.y;
      buffer[i * 3 + 2] = tmp.z + 0.02;
    }
    attr.needsUpdate = true;
  });

  return (
    <group ref={rig}>
      {/* Traces */}
      {traces.map((trace, i) => (
        <Line
          key={i}
          points={trace.points}
          color={i % 3 === 0 ? "#9db8ff" : "#c4d4ff"}
          lineWidth={1.1}
          transparent
          opacity={0.6}
        />
      ))}
      {/* Pads where the traces end */}
      {traces.map((trace, i) => (
        <mesh key={`pad-${i}`} position={trace.points[0]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color="#9db8ff" />
        </mesh>
      ))}

      {/* Data pulses: additive glow points */}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glow}
          size={lite ? 0.32 : 0.28}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Halo of light under the chip */}
      <sprite ref={halo} position={[0, 0, -0.3]} scale={3.1}>
        <spriteMaterial
          map={glow}
          color="#6f9dff"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <group ref={chip} position={[0, 0, 0.35]}>
        {/* Glowing die, seen through the glass */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[1.25, 1.25]} />
          <meshBasicMaterial map={die} toneMapped={false} />
        </mesh>
        {/* Pins */}
        {pins.map(([x, y, z, rot], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, 0, rot]}>
            <boxGeometry args={[0.2, 0.06, 0.05]} />
            <meshStandardMaterial
              color="#e8eef9"
              metalness={0.55}
              roughness={0.3}
            />
          </mesh>
        ))}
        {/* Glass package */}
        <RoundedBox
          args={[2.5, 2.5, 0.34]}
          radius={0.12}
          smoothness={lite ? 3 : 5}
        >
          <MeshTransmissionMaterial
            background={FIELD}
            transmission={1}
            thickness={0.55}
            roughness={0.08}
            ior={1.45}
            chromaticAberration={0.08}
            anisotropicBlur={0.05}
            distortion={0.04}
            distortionScale={0.3}
            temporalDistortion={0}
            clearcoat={1}
            attenuationColor="#c9d8ff"
            attenuationDistance={1.8}
            color="#f6f9ff"
            samples={lite ? 3 : 6}
            resolution={lite ? 256 : 768}
          />
        </RoundedBox>
      </group>
    </group>
  );
}

export default function ChipScene({
  active,
  lite,
}: {
  active: boolean;
  lite: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lite ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, 7.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 6]} intensity={1.3} />
      <Board lite={lite} />
      {/* Studio light made of shapes: no HDR file is fetched. */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 4, 2]}
          scale={[10, 2, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[-5, 0, 1]}
          rotation-y={Math.PI / 2}
          scale={[8, 3, 1]}
          color="#7fd3ff"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[8, 3, 1]}
          color="#0759e8"
        />
      </Environment>
    </Canvas>
  );
}
