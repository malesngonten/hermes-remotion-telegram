import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/** Minimal "Hello World" text animation. */
export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], "clamp");
  const y = interpolate(frame, [0, 15], [60, 0], "clamp", "high");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          fontSize: 96,
          opacity,
          transform: `translateY(${y}px)`,
          textShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        HERMES x REMOTION
      </h1>
    </div>
  );
};
