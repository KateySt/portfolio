"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { input, isLowPowerDevice, prefs, usePrefs } from "@/lib/interaction";
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
      <hemisphereLight args={["#fff6ee", "#d9ccff", lite ? 1.45 : 1.15]} />
      <directionalLight position={[-300, 500, 600]} intensity={1.7} color="#fff3ea" />
      <directionalLight position={[400, 120, -300]} intensity={0.9} color="#d8ccff" />
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
