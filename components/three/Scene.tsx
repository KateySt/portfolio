"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { input, isLowPowerDevice, prefs, usePrefs } from "@/lib/interaction";
import { night } from "@/lib/theme";
import { Robot } from "./Robot";

const IDLE_AFTER_MS = 2500;

/**
 * Drives the "demand" frameloop: full frame rate while anything is moving,
 * every other frame (~30fps) once the robot is just idling — the breathing
 * and blinking still look smooth, and phones stay cool.
 */
function FrameDriver() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let frame = 0;
    const loop = () => {
      frame++;
      const active = performance.now() - input.lastActivity < IDLE_AFTER_MS;
      if (active || frame % 2 === 0) invalidate();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);
  return null;
}

/* day → night: cooler lavender light, about as bright as by day — the robot must not sink into the dark page */
const DAY = { sky: new THREE.Color("#fff6ee"), ground: new THREE.Color("#d9ccff"), key: new THREE.Color("#fff3ea"), back: new THREE.Color("#d8ccff") };
const NIGHT = { sky: new THREE.Color("#e4d9ff"), ground: new THREE.Color("#8f7cd6"), key: new THREE.Color("#f1eaff"), back: new THREE.Color("#b8e6d2") };

function Lights({ lite }: { lite: boolean }) {
  const hemi = useRef<THREE.HemisphereLight>(null!);
  const key = useRef<THREE.DirectionalLight>(null!);
  const back = useRef<THREE.DirectionalLight>(null!);
  const hemiDay = lite ? 1.45 : 1.15;
  const last = useRef(-1);
  useFrame(({ scene }) => {
    const n = night.value;
    if (n === last.current) return;
    last.current = n;
    hemi.current.color.lerpColors(DAY.sky, NIGHT.sky, n);
    hemi.current.groundColor.lerpColors(DAY.ground, NIGHT.ground, n);
    hemi.current.intensity = THREE.MathUtils.lerp(hemiDay, hemiDay * 1.05, n);
    key.current.color.lerpColors(DAY.key, NIGHT.key, n);
    key.current.intensity = THREE.MathUtils.lerp(1.7, 1.55, n);
    back.current.color.lerpColors(DAY.back, NIGHT.back, n);
    back.current.intensity = THREE.MathUtils.lerp(0.9, 1.3, n);
    scene.environmentIntensity = THREE.MathUtils.lerp(1, 0.85, n);
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#fff6ee", "#d9ccff", hemiDay]} />
      <directionalLight ref={key} position={[-300, 500, 600]} intensity={1.7} color="#fff3ea" />
      <directionalLight ref={back} position={[400, 120, -300]} intensity={0.9} color="#d8ccff" />
    </>
  );
}

export default function Scene() {
  const motion = usePrefs((p) => p.motion);
  const touch = usePrefs((p) => p.touch);
  const [lite] = useState(isLowPowerDevice);

  useEffect(() => () => prefs.set({ sceneReady: false }), []);

  const dpr: [number, number] = lite ? [1, 1.25] : touch ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1000], zoom: 1, near: 1, far: 4000 }}
      dpr={dpr}
      // always "demand": FrameDriver paces frames while motion is on; with
      // reduced motion the robot only re-renders on scroll/resize
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: lite ? "default" : "high-performance" }}
      onCreated={() => prefs.set({ sceneReady: true })}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 20 }}
      aria-hidden
    >
      {motion && <FrameDriver />}
      <Lights lite={lite} />
      {!lite && (
        <Environment resolution={64} frames={1}>
          <Lightformer intensity={1.4} position={[0, 4, 4]} scale={[8, 4, 1]} color="#fff4ec" />
          <Lightformer intensity={0.8} position={[-5, 0, 2]} scale={[3, 6, 1]} color="#ffd9c9" />
          <Lightformer intensity={0.8} position={[5, 1, -2]} scale={[3, 6, 1]} color="#d6ccff" />
        </Environment>
      )}
      <Suspense fallback={null}>
        <Robot lite={lite} />
      </Suspense>
    </Canvas>
  );
}
