import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const robotSrc = readFile(join(process.cwd(), "public/robot-fallback.png")).then(
  (b) => `data:image/png;base64,${b.toString("base64")}`,
);

export async function renderOg({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const robot = await robotSrc;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #fff8f1 0%, #f6f1ff 45%, #fff3ec 100%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          color: "#2b2440",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "white",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 26,
              color: "#5a5170",
            }}
          >
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: title.length > 60 ? 54 : 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 760 }}>
            {title}
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 26, color: "#5a5170" }}>
            {footer.split(" · ").map((t, i) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  borderRadius: 999,
                  padding: "8px 18px",
                  background: ["#c9b8f5", "#ffc8b0", "#b8e6d2", "#bfddf7"][i % 4],
                  color: "#2b2440",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={robot} width={400} height={450} alt="" style={{ alignSelf: "center" }} />
      </div>
    ),
    ogSize,
  );
}
