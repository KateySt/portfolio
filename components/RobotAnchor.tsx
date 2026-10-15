import Image from "next/image";

export type RobotPose = "wave" | "idle" | "think" | "point" | "build" | "signal" | "bye";

/**
 * Invisible placeholder that tells the 3D robot where to sit and what to do.
 * CSS decides the box per breakpoint/orientation, so the robot's layout is
 * responsive for free. A hidden anchor (display:none) hands off to the dock.
 *
 * `poster` renders a static robot image in server HTML, shown until the 3D
 * robot takes over (3D loads on the first interaction to keep LCP/TBT low).
 */
export function RobotAnchor({
  pose,
  className = "",
  id,
  poster = false,
}: {
  pose: RobotPose;
  className?: string;
  id?: string;
  poster?: boolean;
}) {
  return (
    <div
      aria-hidden
      data-robot-anchor={id ?? pose}
      data-pose={pose}
      className={`pointer-events-none relative ${className}`}
    >
      {poster && (
        // Inline low-res copy (app/poster.css) paints with the first frame and is
        // the LCP element; the sharp image has the same box, so it never becomes
        // a larger LCP candidate when it lands on top.
        <div
          data-robot-poster
          data-robot-poster-bg
          className="absolute inset-0 m-auto aspect-[640/720] h-[92%] transition-opacity duration-500"
        >
          <Image
            src="/robot-fallback.png"
            alt=""
            fill
            loading="eager"
            preload={false}
            fetchPriority="low"
            sizes="(max-width: 767px) 72vw, 34rem"
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
