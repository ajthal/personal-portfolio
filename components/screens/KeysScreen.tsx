"use client";

import React, { useEffect } from "react";
import { Icon, FrameOrnaments } from "@/components/icons/Icon";
import { Audio$ } from "@/lib/audio";
import ScreenHeader from "@/components/shared/ScreenHeader";
import PromptBar from "@/components/shared/PromptBar";

export default function KeysScreen({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows = [
    { action: "Navigate menus", kb: "↑ ↓ ← →", alt: "W A S D", mouse: "Hover" },
    { action: "Select / Confirm", kb: "Enter", alt: "Space", mouse: "Click" },
    { action: "Back / Close", kb: "Esc", alt: "Backspace", mouse: "Back button" },
    { action: "Switch category", kb: "Q / E", alt: "—", mouse: "Tab strip" },
    { action: "Toggle sound", kb: "M", alt: "—", mouse: "Top-right toggle" }
  ];

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <ScreenHeader icon={Icon.Key} title="Key Bindings" sub="How this archive is traversed." inset={80} />
      <div className="frame" style={{ margin: "0 80px 40px", padding: "48px 56px", position: "relative" }}>
        <FrameOrnaments />
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          color: "var(--ink-dim)", fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase",
          padding: "0 0 10px", borderBottom: "1px solid var(--rule)" }}>
          <div>Action</div><div>Keyboard</div><div>Alt</div><div>Mouse</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
            padding: "14px 0", borderBottom: "1px solid var(--rule)",
            color: "var(--ink-mid)", fontSize: 16, alignItems: "center" }}>
            <div style={{ color: "var(--ink)" }}>{r.action}</div>
            <div><span className="kbd" style={{ marginRight: 4 }}>{r.kb}</span></div>
            <div>{r.alt}</div>
            <div>{r.mouse}</div>
          </div>
        ))}
      </div>
      <PromptBar hints={[{ key: "Esc", label: "Back" }]}/>
    </div>
  );
}
