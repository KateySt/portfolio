"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { input, usePrefs } from "@/lib/interaction";

gsap.registerPlugin(ScrollTrigger);

const TINTS: Record<string, string> = {
  cream: "#fff8f1",
  lavender: "#f6f1ff",
  peach: "#fff3ec",
  mint: "#effaf5",
  sky: "#f0f7fe",
  butter: "#fffbe6",
  blush: "#fff2f6",
};

/**
 * Lenis on mouse devices only (touch keeps native momentum scrolling),
 * section background tints, scroll-reveal, scroll velocity for the jelly,
 * and ScrollTrigger refresh on resize / orientation change.
 */
export function SmoothScroll() {
  const motion = usePrefs((p) => p.motion);
  const touch = usePrefs((p) => p.touch);

  useEffect(() => {
    const root = document.documentElement;
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (motion && !touch) {
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, syncTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // scroll velocity (works with and without Lenis)
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const v = ((window.scrollY - lastY) / dt) * 16; // px per ~frame
      input.scrollVelocity = input.scrollVelocity * 0.6 + v * 0.4;
      input.lastActivity = now;
      lastY = window.scrollY;
      lastT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const decay = setInterval(() => {
      if (performance.now() - lastT > 80) input.scrollVelocity *= 0.8;
    }, 50);

    const ctx = gsap.context(() => {
      // background tint per section
      gsap.utils.toArray<HTMLElement>("[data-tint]").forEach((el) => {
        const tint = TINTS[el.dataset.tint ?? "cream"] ?? TINTS.cream;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) root.style.setProperty("--page-tint", tint);
          },
        });
      });

      if (motion) {
        // this boots on the first interaction, so anything already on (or above)
        // the screen stays visible instead of blinking out and back in
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.removeAttribute("data-reveal");
        });
        root.classList.add("motion-ready");
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "elastic.out(1, 0.75)",
              stagger: 0.07,
              overwrite: true,
            }),
        });
      }
    });

    // orientation / resize: debounce then recompute triggers
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 180);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    // fonts shift layout once they load
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // in-page anchor links through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !lenis) return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
      history.replaceState(null, "", a.getAttribute("href"));
    };
    document.addEventListener("click", onClick);

    return () => {
      ctx.revert();
      root.classList.remove("motion-ready");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      document.removeEventListener("click", onClick);
      clearInterval(decay);
      clearTimeout(t);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [motion, touch]);

  return null;
}

/** Scroll helper usable outside the component (command palette). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
