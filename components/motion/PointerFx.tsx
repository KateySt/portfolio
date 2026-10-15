"use client";

import { useEffect, useRef } from "react";
import { usePrefs } from "@/lib/interaction";

const RIPPLE_COLORS = ["#c9b8f5", "#ffc8b0", "#b8e6d2", "#bfddf7", "#ffc6d9"];

/**
 * Mouse: a soft pastel aura that trails the cursor, magnetic buttons and
 * tilting cards. Touch: a pastel "drop-wave" ripple where the finger lands.
 */
export function PointerFx() {
  const motion = usePrefs((p) => p.motion);
  const aura = useRef<HTMLDivElement>(null);
  const ripples = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motion) return;
    const el = aura.current!;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const pos = { ...target };
    let shown = false;
    let raf = 0;
    let colorIdx = 0;

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.09;
      pos.y += (target.y - pos.y) * 0.09;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let magnet: HTMLElement | null = null;
    let tiltEl: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!shown) {
        el.style.opacity = "1";
        shown = true;
      }
      const t = e.target as HTMLElement;

      const m = t.closest?.<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== m) magnet.style.transform = "";
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
      }

      const c = t.closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (tiltEl && tiltEl !== c) tiltEl.style.transform = "";
      tiltEl = c;
      if (c) {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
      }
    };
    const onLeave = () => {
      el.style.opacity = "0";
      shown = false;
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const r = document.createElement("span");
      const size = Math.max(140, Math.min(window.innerWidth, window.innerHeight) * 0.45);
      r.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle, ${RIPPLE_COLORS[colorIdx++ % RIPPLE_COLORS.length]}cc 0%, transparent 65%);animation:ripple .75s cubic-bezier(.2,.7,.3,1) forwards;`;
      ripples.current?.appendChild(r);
      setTimeout(() => r.remove(), 800);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (magnet) magnet.style.transform = "";
      if (tiltEl) tiltEl.style.transform = "";
    };
  }, [motion]);

  if (!motion) return null;
  return (
    <>
      <div
        ref={aura}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-0 hidden size-[34rem] rounded-full opacity-0 blur-3xl transition-opacity duration-700 mouse:block"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgb(201 184 245 / .55), rgb(255 200 176 / .35) 45%, transparent 70%)",
        }}
      />
      <div ref={ripples} aria-hidden className="pointer-events-none fixed inset-0 z-[60]" />
    </>
  );
}
