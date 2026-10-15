"use client";

import { useEffect } from "react";
import { input, prefs, usePrefs } from "@/lib/interaction";

const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Global input → `input` state. Pointer type is checked per event, so iPads
 * with trackpads and touch laptops behave correctly.
 */
export function InputTracker() {
  const tilt = usePrefs((p) => p.tilt);

  useEffect(() => {
    let tapHoldUntil = 0;

    const toNdc = (x: number, y: number) => ({
      x: (x / window.innerWidth) * 2 - 1,
      y: -((y / window.innerHeight) * 2 - 1),
    });

    const onMove = (e: PointerEvent) => {
      input.pointerType = e.pointerType as typeof input.pointerType;
      if (e.pointerType === "touch") return; // touch handled by down/swipe
      input.lastPointerAt = performance.now();
      Object.assign(input.look, toNdc(e.clientX, e.clientY));
    };

    const onDown = (e: PointerEvent) => {
      input.pointerType = e.pointerType as typeof input.pointerType;
      input.lastPointerAt = performance.now();
      if (e.pointerType === "touch") {
        // robot glances at the tap point for a moment
        Object.assign(input.look, toNdc(e.clientX, e.clientY));
        tapHoldUntil = performance.now() + 2200;
      }
    };

    // horizontal swipe velocity for the robot's lean (touch only)
    let lastX = 0;
    let lastT = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastX = e.touches[0].clientX;
      lastT = performance.now();
    };
    const onTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      const x = e.touches[0].clientX;
      const v = ((x - lastX) / Math.max(8, now - lastT)) * 16;
      input.swipeVelocityX = input.swipeVelocityX * 0.5 + v * 0.5;
      lastX = x;
      lastT = now;
    };

    let raf = 0;
    const loop = () => {
      input.swipeVelocityX *= 0.9;
      // on touch, drift look back to tilt (or centre) after a tap
      if (input.pointerType === "touch" && performance.now() > tapHoldUntil) {
        const tx = input.tilt.active ? input.tilt.x : 0;
        const ty = input.tilt.active ? input.tilt.y : 0;
        input.look.x += (tx - input.look.x) * 0.06;
        input.look.y += (ty - input.look.y) * 0.06;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Device tilt. Android: no permission needed. iOS: only after "granted".
  useEffect(() => {
    if (typeof DeviceOrientationEvent === "undefined") {
      prefs.set({ tilt: "unsupported" });
      return;
    }
    const needsPermission =
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown })
        .requestPermission === "function";
    if (needsPermission && tilt !== "granted") return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    let base: number | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (!prefs.get().motion) {
        input.tilt.active = false;
        return;
      }
      base ??= e.beta; // calibrate to how the phone is held
      const portrait = window.innerHeight >= window.innerWidth;
      const gx = portrait ? e.gamma : e.beta;
      const gy = portrait ? e.beta - base : e.gamma;
      const dead = (v: number) => (Math.abs(v) < 2 ? 0 : v);
      input.tilt.x = clamp(dead(gx) / 28);
      input.tilt.y = clamp(-dead(gy) / 28);
      input.tilt.active = true;
    };
    const onOrientChange = () => (base = null);
    window.addEventListener("deviceorientation", onOrient);
    window.addEventListener("orientationchange", onOrientChange);
    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("orientationchange", onOrientChange);
      input.tilt.active = false;
    };
  }, [tilt]);

  return null;
}
