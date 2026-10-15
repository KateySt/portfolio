"use client";

import type { RobotPose } from "@/components/RobotAnchor";

export type AnchorTarget = {
  /** centre in viewport px */
  cx: number;
  cy: number;
  /** box size in px (robot fits the height) */
  size: number;
  pose: RobotPose;
  id: string;
  /** which side of the viewport the anchor is on: -1 left, 1 right */
  side: -1 | 1;
};

/** Small corner spot used when the current section has no visible anchor (phones, tablets). */
export function dockTarget(): AnchorTarget {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const short = h < 500;
  const size = Math.round(Math.min(Math.max(Math.min(w, h) * (short ? 0.3 : 0.26), 92), 150));
  // peeks in from the right edge (about 60% visible) so it barely covers text
  return {
    cx: w - size * 0.2,
    cy: h - size * 0.62,
    size,
    pose: "idle",
    id: "dock",
    side: 1,
  };
}

let cache: HTMLElement[] = [];
export function refreshAnchors() {
  cache = Array.from(document.querySelectorAll<HTMLElement>("[data-robot-anchor]"));
}

/**
 * Pick the anchor closest to the viewport's focus line among those that are
 * rendered (not display:none) and mostly on screen; otherwise dock.
 */
export function pickAnchor(): AnchorTarget {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const focus = vh * 0.45;
  let best: AnchorTarget | null = null;
  let bestDist = Infinity;
  // nearest rendered anchor even if off screen — used on wide screens so the
  // robot "peeks" from the edge between sections instead of flying to a corner
  let near: AnchorTarget | null = null;
  let nearDist = Infinity;

  for (const el of cache) {
    if (!el.isConnected) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue; // hidden at this breakpoint
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const d = Math.abs(cy - focus);
    const t: AnchorTarget = {
      cx,
      cy,
      size: Math.min(r.width, r.height),
      pose: (el.dataset.pose as RobotPose) ?? "idle",
      id: el.dataset.robotAnchor ?? "",
      side: cx > vw / 2 ? 1 : -1,
    };
    if (d < nearDist) {
      nearDist = d;
      near = t;
    }
    const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (visible < r.height * 0.45) continue;
    if (d < bestDist) {
      bestDist = d;
      best = t;
    }
  }

  if (best) return best;
  if (near && vw >= 1024 && nearDist < vh * 1.1) {
    const half = near.size / 2;
    return { ...near, cy: Math.min(Math.max(near.cy, half + 72), vh - half - 12), pose: "idle" };
  }
  // Phones/tablets: sections without a visible anchor → robot waits in the dock corner.
  return dockTarget();
}
