"use client";

import React, { useEffect } from "react";
import { Icon, FrameOrnaments } from "@/components/icons/Icon";
import { Audio$ } from "@/lib/audio";
import ScreenHeader from "@/components/shared/ScreenHeader";
import PromptBar from "@/components/shared/PromptBar";

export default function CreditsScreen({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <ScreenHeader icon={Icon.Scroll} title="Credits" sub="Those without whom this archive would not be." inset={200} />
      <div className="frame" style={{ margin: "0 200px 40px", padding: "56px 60px", position: "relative", textAlign: "center" }}>
        <FrameOrnaments />
        <div className="flavor" style={{ fontSize: 19, marginBottom: 20 }}>
          &quot;All things return, in time, to the flame.&quot;
        </div>
        <div className="rule-h"/>
        <div style={{ marginTop: 20, display: "grid", gap: 14, color: "var(--ink-mid)" }}>
          <div><div style={{ color: "var(--ink-dim)", fontSize: 12, letterSpacing: ".2em" }}>DESIGNED & BUILT BY</div>
            <div style={{ fontFamily: "var(--display-font)", fontSize: 22, letterSpacing: ".12em", color: "var(--ink)" }}>ANDREW THALHEIMER</div></div>
          <div><div style={{ color: "var(--ink-dim)", fontSize: 12, letterSpacing: ".2em" }}>ART DIRECTION</div>
            <div>Dark-fantasy RPG-menu homage, drawn from scratch.</div></div>
          <div><div style={{ color: "var(--ink-dim)", fontSize: 12, letterSpacing: ".2em" }}>SOUND</div>
            <div>Synthesized in Web Audio, on the fly.</div></div>
          <div><div style={{ color: "var(--ink-dim)", fontSize: 12, letterSpacing: ".2em" }}>TYPE</div>
            <div>Cinzel · IM Fell English · EB Garamond</div></div>
        </div>
      </div>
      <PromptBar hints={[{ key: "Esc", label: "Back" }]}/>
    </div>
  );
}
