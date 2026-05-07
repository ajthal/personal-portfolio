"use client";

import React from "react";

interface PlaceholderProps {
  label: string;
  aspect?: string;
  seed?: number;
  style?: React.CSSProperties;
}

export default function Placeholder({ label, aspect = "4/3", seed = 1, style = {} }: PlaceholderProps) {
  const angle = (seed * 37) % 180;
  return (
    <div style={{
      aspectRatio: aspect,
      background: `
        repeating-linear-gradient(${angle}deg, rgba(200,154,92,.08) 0 6px, transparent 6px 12px),
        linear-gradient(135deg, #1a1208 0%, #0a0705 70%)`,
      display: "grid", placeItems: "center",
      color: "var(--ink-dim)",
      fontFamily: "var(--body-font)",
      fontSize: 13,
      letterSpacing: ".08em",
      textAlign: "center",
      padding: 10,
      border: "1px solid var(--rule)",
      ...style
    }}>
      <span style={{ opacity: .7 }}>◆ {label}</span>
    </div>
  );
}
