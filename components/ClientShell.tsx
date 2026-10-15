"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { initPrefs } from "@/lib/interaction";
import { InputTracker } from "./motion/InputTracker";
import { PointerFx } from "./motion/PointerFx";
import { SceneLoader } from "./three/SceneLoader";
import { RobotHitZone } from "./three/RobotHitZone";
import { CommandPalette } from "./CommandPalette";

// gsap + ScrollTrigger + Lenis are the biggest client chunk — load after first paint, when idle
const SmoothScroll = dynamic(() => import("./motion/SmoothScroll").then((m) => m.SmoothScroll), {
  ssr: false,
});

function useIdle(timeout = 1200) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: typeof requestIdleCallback };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 200);
    return () => clearTimeout(id);
  }, [timeout]);
  return idle;
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  useEffect(() => initPrefs(), []);
  const idle = useIdle();

  return (
    <>
      {idle && <SmoothScroll />}
      <InputTracker />
      <SceneLoader />
      <PointerFx />
      {children}
      <RobotHitZone />
      <CommandPalette />
    </>
  );
}
