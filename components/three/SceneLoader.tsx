"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { pickAnchor, refreshAnchors } from "@/lib/anchors";
import { input, prefs } from "@/lib/interaction";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static robot image that follows the anchors when WebGL is unavailable. */
function FallbackRobot() {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    document.documentElement.classList.add("robot-live");
    let raf = 0;
    const loop = () => {
      const t = pickAnchor();
      const el = ref.current;
      if (el) {
        const h = t.size;
        const w = h * (640 / 720);
        el.style.width = `${w}px`;
        el.style.transform = `translate3d(${t.cx - w / 2}px, ${t.cy - h / 2}px, 0)`;
        input.robotScreen.x = t.cx;
        input.robotScreen.y = t.cy;
        input.robotScreen.r = h * 0.36;
        input.robotScreen.visible = true;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/robot-fallback.png"
      alt=""
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-20"
      decoding="async"
    />
  );
}

/**
 * Loads three.js only after the page is idle so text (LCP) is never blocked by 3D.
 */
export function SceneLoader() {
  const pathname = usePathname();
  const [mode, setMode] = useState<"none" | "3d" | "fallback">("none");

  // three.js is heavy on low-end phones, so it boots on the first sign of a
  // human (move, touch, scroll, key). Until then the hero shows a static poster.
  useEffect(() => {
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      events.forEach((e) => window.removeEventListener(e, start));
      // let the triggering interaction paint first
      setTimeout(() => {
        prefs.set({ live: true });
        setMode(hasWebGL() ? "3d" : "fallback");
      }, 30);
    };
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    // already scrolled (back/forward, anchor link) → start right away
    if (window.scrollY > 0) start();
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, []);

  // anchors differ per page; re-scan after navigation and on layout changes
  useEffect(() => {
    refreshAnchors();
    const id = setTimeout(refreshAnchors, 300);
    const onResize = () => refreshAnchors();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  if (mode === "3d") return <Scene />;
  if (mode === "fallback") return <FallbackRobot />;
  return null;
}
