"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { prefs, usePrefs } from "@/lib/interaction";
import { Robot } from "./Robot";

export default function Scene() {
  const motion = usePrefs((p) => p.motion);
  const touch = usePrefs((p) => p.touch);

  useEffect(() => () => prefs.set({ sceneReady: false }), []);

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1000], zoom: 1, near: 1, far: 4000 }}
      dpr={touch ? [1, 1.5] : [1, 2]}
      frameloop={motion ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => prefs.set({ sceneReady: true })}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 20 }}
      aria-hidden
    >
      <hemisphereLight args={["#fff6ee", "#d9ccff", 1.15]} />
      <directionalLight position={[-300, 500, 600]} intensity={1.7} color="#fff3ea" />
      <directionalLight position={[400, 120, -300]} intensity={0.9} color="#d8ccff" />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={1.4} position={[0, 4, 4]} scale={[8, 4, 1]} color="#fff4ec" />
        <Lightformer intensity={0.8} position={[-5, 0, 2]} scale={[3, 6, 1]} color="#ffd9c9" />
        <Lightformer intensity={0.8} position={[5, 1, -2]} scale={[3, 6, 1]} color="#d6ccff" />
      </Environment>
      <Suspense fallback={null}>
        <Robot />
      </Suspense>
    </Canvas>
  );
}
