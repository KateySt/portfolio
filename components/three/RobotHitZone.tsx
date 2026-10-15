"use client";

import { useEffect, useRef, useState } from "react";
import { haptic, input, prefs, pushImpulse, rememberTilt, usePrefs } from "@/lib/interaction";

type IOSOrientation = { requestPermission?: () => Promise<"granted" | "denied"> };

/**
 * Invisible DOM circle that follows the robot's projected position.
 * Only here does a finger drag the robot instead of the page (touch-action: none),
 * so swipes everywhere else keep scrolling natively.
 *
 *  tap / click      → jelly poke        double tap → jump with a spin
 *  long press       → squish ("hug")    release    → bounce
 *  drag             → taffy stretch, springs back on release
 *  hover (mouse)    → happy squish + wink
 */
export function RobotHitZone() {
  const ref = useRef<HTMLDivElement>(null);
  const tilt = usePrefs((p) => p.tilt);
  const [askTilt, setAskTilt] = useState(false);
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const el = ref.current;
      const r = input.robotScreen;
      if (el) {
        const d = Math.max(r.r * 2, 64);
        el.style.width = el.style.height = `${d}px`;
        el.style.transform = `translate3d(${r.x - d / 2}px, ${r.y - d / 2}px, 0)`;
        el.style.display = r.visible ? "block" : "none";
      }
      if (bubble.current) {
        // above the robot, or below it when that would hit the header
        const above = r.y - r.r * 1.6 > 90;
        const bx = Math.min(Math.max(r.x, 130), window.innerWidth - 130);
        bubble.current.style.transform = above
          ? `translate3d(${bx}px, ${r.y - r.r * 1.6}px, 0) translate(-50%, -100%)`
          : `translate3d(${bx}px, ${r.y + r.r * 1.5}px, 0) translate(-50%, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = ref.current!;
    let downAt = 0;
    let startX = 0;
    let startY = 0;
    let longTimer: ReturnType<typeof setTimeout> | undefined;
    let longFired = false;
    let lastTap = 0;
    let pointerId = -1;

    const onDown = (e: PointerEvent) => {
      pointerId = e.pointerId;
      el.setPointerCapture(e.pointerId);
      downAt = performance.now();
      startX = e.clientX;
      startY = e.clientY;
      longFired = false;
      input.pressing = true;
      longTimer = setTimeout(() => {
        if (input.drag.active) return;
        longFired = true;
        pushImpulse("squish");
        haptic(25);
      }, 420);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId || !input.pressing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!input.drag.active && Math.hypot(dx, dy) > 8) {
        input.drag.active = true;
        clearTimeout(longTimer);
      }
      if (input.drag.active) {
        // rubber-band: the further you pull, the harder it resists
        const k = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), 0.82);
        input.drag.dx = k(dx);
        input.drag.dy = k(dy);
      }
    };
    const end = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      clearTimeout(longTimer);
      const wasDrag = input.drag.active;
      const dist = Math.hypot(input.drag.dx, input.drag.dy);
      input.pressing = false;
      input.drag.active = false;
      input.drag.dx = input.drag.dy = 0;
      pointerId = -1;
      if (e.type === "pointercancel") return;

      if (wasDrag) {
        pushImpulse("release", Math.min(1.6, 0.6 + dist / 200));
        haptic(12);
        return;
      }
      if (longFired) {
        pushImpulse("jump", 1);
        return;
      }
      const now = performance.now();
      if (now - lastTap < 320) {
        pushImpulse("jump", 1.25);
        haptic(18);
        lastTap = 0;
      } else {
        pushImpulse("poke");
        haptic(10);
        lastTap = now;
        maybeAskTilt(e.pointerType);
      }
      void downAt;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        input.hover = true;
        pushImpulse("hover");
      }
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") input.hover = false;
    };

    const maybeAskTilt = (type: string) => {
      if (type !== "touch" || !prefs.get().motion) return;
      const DOE = (typeof DeviceOrientationEvent !== "undefined" ? DeviceOrientationEvent : undefined) as unknown as
        | IOSOrientation
        | undefined;
      if (DOE?.requestPermission && prefs.get().tilt === "unknown") setAskTilt(true);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      clearTimeout(longTimer);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const requestTilt = async () => {
    setAskTilt(false);
    const DOE = DeviceOrientationEvent as unknown as IOSOrientation;
    try {
      const res = await DOE.requestPermission!();
      rememberTilt(res === "granted" ? "granted" : "denied");
      if (res === "granted") pushImpulse("jump", 1);
    } catch {
      rememberTilt("denied");
    }
  };

  return (
    <>
      <div
        ref={ref}
        role="button"
        tabIndex={-1}
        aria-label="Poke the robot"
        className="fixed left-0 top-0 z-30 cursor-grab touch-none select-none rounded-full active:cursor-grabbing"
        style={{ display: "none", WebkitTouchCallout: "none" }}
        onContextMenu={(e) => e.preventDefault()}
      />
      {askTilt && tilt === "unknown" && (
        <div
          ref={bubble}
          className="fixed left-0 top-0 z-40 flex items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-lift"
        >
          <button
            type="button"
            onClick={requestTilt}
            className="min-h-11 rounded-full bg-lavender px-4 text-sm font-semibold text-ink"
          >
            Wanna tilt me? ✦
          </button>
          <button
            type="button"
            aria-label="No thanks"
            onClick={() => {
              setAskTilt(false);
              rememberTilt("denied");
            }}
            className="grid size-11 place-items-center rounded-full text-ink-soft"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
