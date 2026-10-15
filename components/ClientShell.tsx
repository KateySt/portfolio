"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { initPrefs, usePrefs } from "@/lib/interaction";
import { SceneLoader } from "./three/SceneLoader";
import { CommandPalette } from "./CommandPalette";

// Nothing below is needed for the first paint, so none of it ships in the
// startup bundle: the interactive layer (scroll fx, input tracking, cursor/tap
// fx, robot hit zone) boots with the first interaction, analytics after load.
const SmoothScroll = dynamic(() => import("./motion/SmoothScroll").then((m) => m.SmoothScroll), { ssr: false });
const InputTracker = dynamic(() => import("./motion/InputTracker").then((m) => m.InputTracker), { ssr: false });
const PointerFx = dynamic(() => import("./motion/PointerFx").then((m) => m.PointerFx), { ssr: false });
const RobotHitZone = dynamic(() => import("./three/RobotHitZone").then((m) => m.RobotHitZone), { ssr: false });
const Analytics = dynamic(() => import("@vercel/analytics/next").then((m) => m.Analytics), { ssr: false });
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights), {
  ssr: false,
});

/** Fires once the page has fully loaded and gone idle — for non-essential scripts. */
function useAfterLoad(delay = 2500) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const go = () => (t = setTimeout(() => setReady(true), delay));
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", go);
    };
  }, [delay]);
  return ready;
}

/** `t` carries only the strings the client layer renders (palette, robot) — not the whole dictionary. */
export function ClientShell({
  children,
  t,
}: {
  children: React.ReactNode;
  t: { palette: Dictionary["palette"]; robot: Dictionary["robot"] };
}) {
  useEffect(() => initPrefs(), []);
  const live = usePrefs((p) => p.live);
  // web-vitals reads buffered entries, so late loading still reports LCP/CLS
  const analytics = useAfterLoad();

  return (
    <>
      {live && <SmoothScroll />}
      {live && <InputTracker />}
      <SceneLoader />
      {live && <PointerFx />}
      {children}
      {live && <RobotHitZone t={t.robot} />}
      <CommandPalette t={t.palette} />
      {analytics && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}
