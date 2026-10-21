import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/** Animated composition: bouncing, pulsing square on a rotating gradient. */
export const MotionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 120], [0, 1], "clamp");

  const hue = interpolate(frame, [0, 120], [0, 360], "clamp");
  const x = interpolate(progress, [0, 1], [-200, 1400], "clamp");
  const scale = interpolate(
    Math.sin((progress * Math.PI * 2) / 2),
    [-1, 1],
    [0.5, 1],
    "clamp"
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `conic-gradient(from ${hue}deg, #0ea5e9, #7c3fed, #ec4899, #0ea5e9)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 240,
          height: 240,
          background: "linear-gradient(135deg, #fb7185, #fb923c)",
          borderRadius: 32,
          transform: `translateX(${x}px) scale(${scale})`,
          boxShadow: "0 30px 80px 20px rgba(251,113,133,0.5)",
        }}
      />
    </div>
  );
};
