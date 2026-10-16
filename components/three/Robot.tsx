"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { input, haptic, prefs } from "@/lib/interaction";
import { night } from "@/lib/theme";
import { pickAnchor, type AnchorTarget } from "@/lib/anchors";
import type { RobotPose } from "../RobotAnchor";

const ROBOT_H = 2.47; // model height in GLB units (feet at y=0)
const FIT = 2.6; // model units that should fill the anchor box

/* ---------- tiny spring helpers ---------- */
type S = { x: number; v: number };
const s = (x = 0): S => ({ x, v: 0 });
function step(sp: S, target: number, k: number, c: number, dt: number) {
  const a = k * (target - sp.x) - c * sp.v;
  sp.v += a * dt;
  sp.x += sp.v * dt;
}
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ---------- marshmallow material with jelly wobble + soft rim ---------- */
const shared = {
  uTime: { value: 0 },
  uWobble: { value: 0 },
  uNight: { value: 0 }, // mirrors night.value: 0 day … 1 night
};
const SOFT_PARTS = new Set(["Body", "Head", "ArmL", "ArmR", "Tummy", "EarL", "EarR"]);
// at night the face turns into a softly lit screen; the antenna ball and cheeks glow a little too
const NIGHT_GLOW: Record<string, number> = { Face: 0.5, AntennaBall: 0.7, CheekL: 0.3, CheekR: 0.3, Tummy: 0.1 };
const NIGHT_RIM = new THREE.Color("#d9c8ff");

function marshmallow(src: THREE.MeshStandardMaterial, soft: boolean, name: string, lite: boolean) {
  const ink = name.startsWith("Eye") && !name.startsWith("EyeShine");
  const base = {
    color: src.color,
    roughness: ink || name === "Mouth" ? 0.35 : 0.78,
    metalness: 0,
    emissive: name.startsWith("EyeShine") ? new THREE.Color("#ffffff") : new THREE.Color("#000000"),
    emissiveIntensity: name.startsWith("EyeShine") ? 0.9 : 1,
  };
  // lite (weak devices): plain standard material — the rim light below keeps the soft look
  const m = lite
    ? new THREE.MeshStandardMaterial(base)
    : new THREE.MeshPhysicalMaterial({
        ...base,
        sheen: ink ? 0 : 0.8,
        sheenRoughness: 0.75,
        sheenColor: new THREE.Color("#ffffff"),
      });
  const rimColor = new THREE.Color("#fff1f7");
  const glow = NIGHT_GLOW[name] ?? 0;
  // night: same hues, more saturated, so the robot pops on the dark page like the UI pastels
  const nightColor = src.color.clone();
  if (!ink && name !== "Face") {
    const hsl = { h: 0, s: 0, l: 0 };
    nightColor.getHSL(hsl);
    nightColor.setHSL(hsl.h, Math.min(1, hsl.s * 1.7 + 0.15), hsl.l * 0.9);
  }
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = shared.uTime;
    shader.uniforms.uWobble = shared.uWobble;
    shader.uniforms.uNight = shared.uNight;
    shader.uniforms.uRim = { value: ink ? 0 : 0.55 };
    shader.uniforms.uRimColor = { value: rimColor };
    shader.uniforms.uNightRim = { value: NIGHT_RIM };
    shader.uniforms.uGlow = { value: glow };
    shader.uniforms.uGlowColor = { value: src.color.clone() };
    shader.uniforms.uNightColor = { value: nightColor };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uTime; uniform float uWobble;`,
      )
      .replace(
        "#include <begin_vertex>",
        soft
          ? `#include <begin_vertex>
float w = sin(uTime * 9.0 + position.y * 7.0 + position.x * 3.0) * 0.6
        + sin(uTime * 13.0 - position.x * 6.0 + position.z * 5.0) * 0.4;
transformed += objectNormal * w * uWobble;`
          : "#include <begin_vertex>",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uRim; uniform vec3 uRimColor; uniform vec3 uNightRim;
uniform float uTime; uniform float uNight; uniform float uGlow; uniform vec3 uGlowColor; uniform vec3 uNightColor;`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
diffuseColor.rgb = mix(diffuseColor.rgb, uNightColor, uNight);`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
vec3 vdir = isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition);
float rim = pow(1.0 - clamp(dot(normal, vdir), 0.0, 1.0), 2.4);
// night: lavender rim so the silhouette reads on the dark page
totalEmissiveRadiance += mix(uRimColor, uNightRim, uNight) * rim * uRim;
// night: the screen "breathes" slowly
float breathe = 0.86 + 0.14 * sin(uTime * 1.7);
totalEmissiveRadiance += uGlowColor * uGlow * uNight * breathe;`,
      );
  };
  m.customProgramCacheKey = () => `marsh-${soft}-${ink}-${lite}`;
  return m;
}

/** Soft round blob (rgb "r,g,b") fading to transparent — shadows and night glows. */
function radialTexture(rgb: string, alpha: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${rgb},${alpha})`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; // keep the pastel hue instead of washing it to grey
  return tex;
}

/* ---------- poses ---------- */
function poseTargets(pose: RobotPose | "fly", t: number, side: number) {
  // arm angles: right arm raises with +, left arm with −
  switch (pose) {
    case "wave":
      return { l: -0.15, r: 2.15 + Math.sin(t * 9) * 0.4, headZ: -0.08, headY: 0 };
    case "bye":
      return { l: -0.15, r: 2.05 + Math.sin(t * 6) * 0.45, headZ: 0.1 * Math.sin(t * 3), headY: 0 };
    case "point":
      // point towards the content (away from the screen edge)
      return side > 0
        ? { l: -1.55 + Math.sin(t * 4) * 0.08, r: 0.1, headZ: 0.06, headY: -0.35 }
        : { l: -0.1, r: 1.55 + Math.sin(t * 4) * 0.08, headZ: -0.06, headY: 0.35 };
    case "think":
      return { l: -2.35, r: 0.2, headZ: 0.16 + Math.sin(t * 1.5) * 0.03, headY: 0.1 };
    case "build": {
      const h = Math.max(0, Math.sin(t * 7));
      return { l: -0.6 - h * 1.1, r: 0.6 + Math.max(0, Math.sin(t * 7 + Math.PI)) * 1.1, headZ: 0, headY: 0 };
    }
    case "signal":
      return { l: -0.9 + Math.sin(t * 3) * 0.15, r: 0.9 - Math.sin(t * 3) * 0.15, headZ: Math.sin(t * 2) * 0.05, headY: 0 };
    case "fly":
      return { l: -1.25, r: 1.25, headZ: 0, headY: 0 };
    default:
      return { l: -0.08 - Math.sin(t * 1.6) * 0.06, r: 0.08 + Math.sin(t * 1.6 + 1) * 0.06, headZ: 0, headY: 0 };
  }
}

export function Robot({ lite = false }: { lite?: boolean }) {
  const { scene } = useGLTF("/robot.glb");
  const { size, invalidate } = useThree();

  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.material = marshmallow(
          mesh.material as THREE.MeshStandardMaterial,
          SOFT_PARTS.has(mesh.name),
          mesh.name,
          lite,
        );
      }
    });
    return root;
  }, [scene, lite]);

  const sheened = useMemo(() => {
    const list: THREE.MeshPhysicalMaterial[] = [];
    model.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial | undefined;
      if (m?.isMeshPhysicalMaterial && m.sheen > 0) list.push(m);
    });
    return list;
  }, [model]);

  const parts = useMemo(() => {
    const get = (n: string) => model.getObjectByName(n)!;
    const p = {
      head: get("Head"),
      armL: get("ArmL"),
      armR: get("ArmR"),
      eyeL: get("EyeL"),
      eyeR: get("EyeR"),
      mouth: get("Mouth"),
      antenna: get("Antenna"),
      ball: get("AntennaBall"),
    };
    return {
      ...p,
      base: {
        armL: p.armL.rotation.clone(),
        armR: p.armR.rotation.clone(),
        eyeL: p.eyeL.position.clone(),
        eyeR: p.eyeR.position.clone(),
        eyeScale: p.eyeL.scale.clone(),
        mouthScale: p.mouth.scale.clone(),
        ball: p.ball.scale.clone(),
      },
    };
  }, [model]);

  const root = useRef<THREE.Group>(null!);
  const squash = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Mesh>(null!);
  const floorGlow = useRef<THREE.Mesh>(null!);

  // the face "screen" lights the arms and tummy at night. Always mounted (intensity 0 by day):
  // adding a light later would recompile every material mid-transition.
  const faceLight = useMemo(() => {
    const l = new THREE.PointLight("#fff0e4", 0, 0, 0);
    l.position.set(0, 0.42, 0.95); // head-local, just in front of the screen
    return l;
  }, []);
  useEffect(() => {
    parts.head.add(faceLight);
    return () => void parts.head.remove(faceLight);
  }, [parts, faceLight]);

  // theme switches need a frame even when the loop is idle / motion is off
  useEffect(() => {
    const off = prefs.subscribe(() => invalidate());
    return () => void off();
  }, [invalidate]);

  // all physics state in one ref
  const st = useRef({
    px: s(), py: s(), sc: s(0.01), // position (px) & fit scale
    j: s(), // squash/stretch jiggle
    lean: s(), turn: s(), spin: s(), spinTarget: 0,
    headX: s(), headY: s(), headZ: s(),
    armL: s(), armR: s(),
    antX: s(), antZ: s(),
    hop: 0, hopV: 0, airborne: false,
    wobble: 0,
    prevVx: 0, prevScroll: 0,
    target: null as AnchorTarget | null,
    pickAt: 0,
    blinkAt: 2000, blinkEnd: 0, happyUntil: 0, winkUntil: 0,
    lastImpulse: 0,
    init: false,
  });

  // keep frames coming when motion is off (frameloop="demand")
  useEffect(() => {
    const kick = () => invalidate();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [invalidate]);

  const shadowTex = useMemo(() => radialTexture("43,36,64", 0.32), []);

  // night: soft lavender light spill on the "floor" instead of a dark shadow
  const glowTex = useMemo(() => radialTexture("201,184,245", 0.55), []);

  // night halos: one behind the head (the screen's light around the silhouette), one around the antenna ball
  const halos = useMemo(() => {
    const make = (rgb: string, w: number, h: number) =>
      new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ map: radialTexture(rgb, 1), transparent: true, depthWrite: false, opacity: 0 }),
      );
    const head = make("214,196,255", 2.1, 1.75);
    head.position.set(0, 0.46, -0.35); // behind the head: the head itself hides the middle
    const ball = make("184,230,210", 0.75, 0.75);
    ball.position.set(0, 0, -0.05);
    return { head, ball };
  }, []);
  useEffect(() => {
    parts.head.add(halos.head);
    // the ball is scaled in the GLB — undo it so the halo size is in model units
    halos.ball.scale.setScalar(1 / Math.max(parts.base.ball.x, 1e-3));
    parts.ball.add(halos.ball);
    return () => {
      parts.head.remove(halos.head);
      parts.ball.remove(halos.ball);
    };
  }, [parts, halos]);

  useFrame((state, rawDt) => {
    const S = st.current;
    const motion = prefs.get().motion;
    const now = performance.now();
    const t = state.clock.elapsedTime;
    const dt = Math.min(rawDt, 1 / 30);
    const W = size.width;
    const H = size.height;

    // --- day ↔ night: ease ~1s towards the theme (snap with reduced motion) ---
    const nightT = prefs.get().theme === "dark" ? 1 : 0;
    const dn = nightT - night.value;
    if (!motion || Math.abs(dn) < 0.002) night.value = nightT;
    else {
      night.value += dn * (1 - Math.exp(-rawDt * 4));
      input.lastActivity = now; // full frame rate during the fade
    }
    shared.uNight.value = night.value;
    // white sheen washes the candy colors out on a dark page: soften it at night
    for (const m of sheened) m.sheen = 0.8 - 0.55 * night.value;
    faceLight.intensity = night.value * 1.1;
    const breathe = 0.86 + 0.14 * Math.sin(t * 1.7); // same rhythm as the screen shader
    halos.head.visible = halos.ball.visible = night.value > 0.01;
    (halos.head.material as THREE.MeshBasicMaterial).opacity = night.value * 0.28 * breathe;
    (halos.ball.material as THREE.MeshBasicMaterial).opacity = night.value * 0.6 * breathe;

    // --- target anchor (cheap: ~10 rect reads, throttled) ---
    if (now > S.pickAt || !S.target) {
      S.target = pickAnchor();
      S.pickAt = now + 90;
    }
    const T = S.target;
    let tx = T.cx - W / 2;
    let ty = H / 2 - T.cy;
    const tScale = T.size / FIT;

    if (input.drag.active) {
      tx += input.drag.dx;
      ty -= input.drag.dy;
    }

    if (!S.init) document.documentElement.classList.add("robot-live");
    if (!S.init || !motion) {
      // snap (first frame, or reduced motion)
      S.px.x = tx; S.py.x = ty; S.sc.x = tScale;
      S.px.v = S.py.v = S.sc.v = 0;
      S.init = true;
    }

    // --- impulses ---
    for (const imp of input.impulses) {
      if (imp.at <= S.lastImpulse) continue;
      S.lastImpulse = imp.at;
      if (!motion) continue;
      const k = imp.strength;
      switch (imp.kind) {
        case "poke":
          S.j.v -= 5.5 * k;
          S.headZ.v += (Math.random() > 0.5 ? 1 : -1) * 7 * k;
          S.antZ.v += (Math.random() > 0.5 ? 1 : -1) * 14 * k;
          S.happyUntil = now + 750;
          break;
        case "hover":
          S.j.v -= 2.2;
          S.antZ.v += 6;
          S.winkUntil = now + 260;
          break;
        case "squish":
          S.antX.v += 8;
          break;
        case "release":
          S.j.v += 7 * k;
          S.antZ.v += 12 * (Math.random() - 0.5) * 2;
          S.happyUntil = now + 600;
          break;
        case "jump":
          if (!S.airborne) {
            S.hopV = 2.4 * k; // in robot heights / s
            S.airborne = true;
            S.j.v += 5;
            if (k > 1.05) S.spinTarget += Math.PI * 2;
            S.happyUntil = now + 1200;
          }
          break;
      }
    }

    if (motion) {
      // position & scale springs: soft, slightly underdamped → jelly lag
      const k = input.drag.active ? 260 : 70;
      const c = input.drag.active ? 22 : 13;
      step(S.px, tx, k, c, dt);
      step(S.py, ty, k, c, dt);
      step(S.sc, tScale, 60, 14, dt);
    }

    const vx = S.px.v;
    const vy = S.py.v;
    const speed = Math.hypot(vx, vy);
    const accelX = (vx - S.prevVx) / Math.max(dt, 1e-3);
    S.prevVx = vx;
    const flying = motion && speed > 380 && !input.drag.active;
    // keep full frame rate while the robot itself is still moving or wobbling
    if (motion && (speed > 25 || S.airborne || Math.abs(S.j.v) > 0.4 || Math.abs(S.sc.v) > 0.02)) {
      input.lastActivity = now;
    }

    // hop physics (units: robot heights)
    if (S.airborne) {
      S.hopV -= 9.5 * dt;
      S.hop += S.hopV * dt;
      if (S.hop <= 0) {
        S.hop = 0;
        S.hopV = 0;
        S.airborne = false;
        S.j.v -= 6.5;
        haptic(14);
      }
    }

    // --- squash & stretch jiggle ---
    const scrollV = input.scrollVelocity;
    if (motion) {
      const dragDist = input.drag.active ? Math.hypot(input.drag.dx, input.drag.dy) : 0;
      let jT = Math.sin(t * 2.2) * 0.018; // breathing
      if (input.pressing && !input.drag.active) jT = -0.3; // long-press squish
      jT += clamp(speed / 5000, 0, 0.14); // stretch while flying
      jT += clamp(dragDist / 450, 0, 0.28); // pull like taffy
      if (S.airborne) jT += clamp(S.hopV * 0.05, -0.1, 0.12);
      S.j.v += (scrollV - S.prevScroll) * 0.06; // scroll changes shake it
      step(S.j, jT, 190, 7.5, dt);
    } else {
      S.j.x = 0;
    }
    S.prevScroll = scrollV;

    // jelly wobble amplitude (surface ripples)
    const wobbleT = motion
      ? clamp(Math.abs(scrollV) * 0.0011 + Math.abs(S.j.v) * 0.004 + Math.abs(input.swipeVelocityX) * 0.0012, 0, 0.055)
      : 0;
    S.wobble += (wobbleT - S.wobble) * (wobbleT > S.wobble ? 0.35 : 0.06);
    shared.uWobble.value = S.wobble;
    shared.uTime.value = t;

    // --- look direction relative to the robot itself ---
    const rx = ((S.px.x + W / 2) / W) * 2 - 1;
    const ry = ((S.py.x) / (H / 2));
    const lookX = motion ? clamp((input.look.x - rx) * 1.2, -1, 1) : 0;
    const lookY = motion ? clamp((input.look.y - ry) * 1.2, -1, 1) : 0;

    // --- pose ---
    const pose: RobotPose | "fly" = flying ? "fly" : T.pose;
    const P = motion ? poseTargets(pose, t, T.side) : poseTargets("idle", 0, 1);

    if (motion) {
      const swipeLean = clamp(-input.swipeVelocityX * 0.012, -0.35, 0.35);
      const dragLean = input.drag.active ? clamp(-input.drag.dx * 0.0025, -0.5, 0.5) : 0;
      const peek = T.id === "dock" ? 0.38 : 0; // lean in from the screen edge
      step(S.lean, clamp(-vx * 0.0006, -0.4, 0.4) + swipeLean + dragLean + peek, 120, 9, dt);
      step(S.turn, lookX * 0.32, 60, 10, dt);
      step(S.spin, S.spinTarget, 26, 7, dt);
      step(S.headY, lookX * 0.5 + P.headY, 110, 10, dt);
      step(S.headX, -lookY * 0.32, 110, 10, dt);
      step(S.headZ, P.headZ, 140, 6, dt);
      step(S.armL, P.l, 150, 9, dt);
      step(S.armR, P.r, 150, 9, dt);
      // antenna: driven by body acceleration & head motion → floppy secondary motion
      S.antZ.v += (accelX * 0.0009 + S.headZ.v * 0.4) * dt * 60 * 0.016;
      step(S.antZ, clamp(-S.lean.x * 0.8, -0.6, 0.6), 90, 4.2, dt);
      step(S.antX, clamp(-S.j.x * 1.5 + S.hopV * 0.04, -0.5, 0.5), 90, 4.5, dt);
    }

    // --- apply transforms ---
    const g = root.current;
    const sc = Math.max(S.sc.x, 0.001);
    g.position.set(S.px.x, S.py.x + S.hop * ROBOT_H * sc + (motion ? Math.sin(t * 1.8) * 0.035 * ROBOT_H * sc : 0), 0);
    g.scale.setScalar(sc);
    g.rotation.set(0, S.turn.x + S.spin.x, S.lean.x);

    const sy = 1 + S.j.x;
    const sxz = 1 / Math.sqrt(Math.max(sy, 0.3));
    squash.current.scale.set(sxz, sy, sxz);

    parts.head.rotation.set(S.headX.x, S.headY.x, S.headZ.x);
    // raised arms also swing forward (towards the camera) so they don't hide behind the head
    const fwd = (a: number) => -0.95 * clamp(Math.abs(a) / 1.8, 0, 1);
    parts.armL.rotation.set(parts.base.armL.x + fwd(S.armL.x), parts.base.armL.y, parts.base.armL.z + S.armL.x);
    parts.armR.rotation.set(parts.base.armR.x + fwd(S.armR.x), parts.base.armR.y, parts.base.armR.z + S.armR.x);
    parts.antenna.rotation.set(S.antX.x, 0, S.antZ.x);

    // eyes: follow, blink, happy squint, wink
    const ex = lookX * 0.045;
    const ey = lookY * 0.035;
    parts.eyeL.position.set(parts.base.eyeL.x + ex, parts.base.eyeL.y + ey, parts.base.eyeL.z);
    parts.eyeR.position.set(parts.base.eyeR.x + ex, parts.base.eyeR.y + ey, parts.base.eyeR.z);
    if (motion && now > S.blinkAt) {
      S.blinkEnd = now + 130;
      S.blinkAt = now + 2200 + Math.random() * 3200;
    }
    const blinking = motion && now < S.blinkEnd;
    const happy = motion && now < S.happyUntil;
    const wink = motion && now < S.winkUntil;
    const open = (closed: boolean) => (closed ? 0.12 : happy ? 0.4 : 1);
    // eye "Y" in the GLB is the old Blender Z (height) → local scale axis y
    parts.eyeL.scale.set(parts.base.eyeScale.x, parts.base.eyeScale.y * open(blinking || wink), parts.base.eyeScale.z);
    parts.eyeR.scale.set(parts.base.eyeScale.x, parts.base.eyeScale.y * open(blinking), parts.base.eyeScale.z);
    const ms = happy ? 1.35 : 1;
    parts.mouth.scale.set(parts.base.mouthScale.x * ms, parts.base.mouthScale.y * ms, parts.base.mouthScale.z * ms);

    // antenna ball pulses while "signalling"
    const pulse = motion && T.pose === "signal" ? 1 + Math.max(0, Math.sin(t * 5)) * 0.25 : 1;
    parts.ball.scale.copy(parts.base.ball).multiplyScalar(pulse);

    // ground shadow
    const sh = shadow.current;
    const shrink = 1 / (1 + S.hop * 2.2);
    sh.scale.set(1.5 * shrink * (1 - S.j.x * 0.6), 0.32 * shrink, 1);
    (sh.material as THREE.MeshBasicMaterial).opacity = 0.9 * shrink * (1 - night.value * 0.6);
    const fg = floorGlow.current;
    fg.visible = night.value > 0.01;
    fg.scale.set(2.2 * shrink * (1 - S.j.x * 0.6), 0.5 * shrink, 1);
    (fg.material as THREE.MeshBasicMaterial).opacity = night.value * (0.75 + 0.25 * shrink);

    // --- publish projected position for the DOM hit zone ---
    const centerY = H / 2 - (g.position.y);
    input.robotScreen.x = S.px.x + W / 2;
    input.robotScreen.y = centerY;
    input.robotScreen.r = (ROBOT_H * sc) * 0.36;
    input.robotScreen.visible = centerY > -50 && centerY < H + 50;
  });

  return (
    <group ref={root}>
      {/* shadow sits at the feet, outside the squash group */}
      <mesh ref={shadow} position={[0, -ROBOT_H / 2 - 0.02, -1]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <mesh ref={floorGlow} position={[0, -ROBOT_H / 2 - 0.02, -1.1]} renderOrder={-2} visible={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTex} transparent depthWrite={false} />
      </mesh>
      {/* squash pivots at the feet */}
      <group ref={squash} position={[0, -ROBOT_H / 2, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload("/robot.glb");
