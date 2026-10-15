"use client";

import { useSyncExternalStore } from "react";

/**
 * Per-frame interaction state. Mutated by DOM listeners, read inside useFrame.
 * Deliberately not React state — it changes every pointer move.
 */
export type ImpulseKind = "poke" | "squish" | "release" | "jump" | "hover" | "land";
export type Impulse = { kind: ImpulseKind; at: number; strength: number; dirX?: number };

export const input = {
  /** Where the robot should look, in NDC (-1..1). Fed by mouse, taps or device tilt. */
  look: { x: 0, y: 0 },
  pointerType: "mouse" as "mouse" | "touch" | "pen",
  lastPointerAt: 0,
  /** Device tilt, normalized -1..1. */
  tilt: { x: 0, y: 0, active: false },
  /** Smoothed scroll velocity in px/frame-ish units; sign = direction. */
  scrollVelocity: 0,
  /** Horizontal swipe velocity (touch only). */
  swipeVelocityX: 0,
  hover: false,
  /** finger/mouse held on the robot (long-press squish) */
  pressing: false,
  drag: { active: false, dx: 0, dy: 0 },
  impulses: [] as Impulse[],
  /** Robot's projected screen position, written by the scene for the DOM hit zone. */
  robotScreen: { x: -9999, y: -9999, r: 0, visible: false },
};

export function pushImpulse(kind: ImpulseKind, strength = 1, dirX?: number) {
  input.impulses.push({ kind, at: performance.now(), strength, dirX });
  if (input.impulses.length > 8) input.impulses.shift();
}

export function haptic(ms = 12) {
  if (!prefs.get().motion) return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported (iOS) */
  }
}

/* ---------- React-visible preferences ---------- */

type Prefs = {
  /** false when prefers-reduced-motion or the user switched animations off */
  motion: boolean;
  /** user override from ⌘K; null = follow the OS */
  motionOverride: boolean | null;
  /** primary input is touch (coarse pointer) */
  touch: boolean;
  /** tilt permission state on iOS */
  tilt: "unknown" | "granted" | "denied" | "unsupported";
  paletteOpen: boolean;
  /** palette chunk has been loaded at least once (keep it mounted) */
  paletteUsed: boolean;
  /** 3D scene loaded and running */
  sceneReady: boolean;
};

function createStore<T extends object>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(patch: Partial<T>) {
      state = { ...state, ...patch };
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

const serverPrefs: Prefs = {
  motion: true,
  motionOverride: null,
  touch: false,
  tilt: "unknown",
  paletteOpen: false,
  paletteUsed: false,
  sceneReady: false,
};

export const prefs = createStore<Prefs>(serverPrefs);

export function usePrefs<K>(select: (p: Prefs) => K): K {
  return useSyncExternalStore(
    prefs.subscribe,
    () => select(prefs.get()),
    () => select(serverPrefs),
  );
}

const MOTION_KEY = "ks:motion";
const TILT_KEY = "ks:tilt";

export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

export function setMotionOverride(on: boolean | null) {
  writeStored(MOTION_KEY, on === null ? "" : on ? "on" : "off");
  prefs.set({ motionOverride: on });
  recomputeMotion();
}

let reducedQuery: MediaQueryList | null = null;
export function recomputeMotion() {
  const os = reducedQuery ? !reducedQuery.matches : true;
  const { motionOverride } = prefs.get();
  prefs.set({ motion: motionOverride ?? os });
}

export function initPrefs() {
  reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const stored = readStored(MOTION_KEY);
  const tiltStored = readStored(TILT_KEY);
  prefs.set({
    motionOverride: stored === "on" ? true : stored === "off" ? false : null,
    touch: coarse.matches,
    tilt: tiltStored === "denied" ? "denied" : prefs.get().tilt,
  });
  recomputeMotion();
  const onReduced = () => recomputeMotion();
  const onCoarse = () => prefs.set({ touch: coarse.matches });
  reducedQuery.addEventListener("change", onReduced);
  coarse.addEventListener("change", onCoarse);
  return () => {
    reducedQuery?.removeEventListener("change", onReduced);
    coarse.removeEventListener("change", onCoarse);
  };
}

export function rememberTilt(state: "granted" | "denied") {
  writeStored(TILT_KEY, state);
  prefs.set({ tilt: state });
}
