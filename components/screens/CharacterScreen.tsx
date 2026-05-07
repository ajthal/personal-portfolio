"use client";

import React, { useEffect } from "react";
import { Icon, FrameOrnaments } from "@/components/icons/Icon";
import { CHARACTER } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import ScreenHeader from "@/components/shared/ScreenHeader";
import PromptBar from "@/components/shared/PromptBar";

export default function CharacterScreen({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const c = CHARACTER;
  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <ScreenHeader icon={Icon.Human} title="Character" sub="An accounting of the maker." />

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "320px 1fr 360px", gap: 24, padding: "0 36px 80px", minHeight: 0 }}>
        <div className="frame" style={{ padding: "48px 44px", position: "relative", alignSelf: "start" }}>
          <FrameOrnaments />
          <div style={{ aspectRatio: "3/4", border: "1px solid var(--rule)", overflow: "hidden", background: "#0a0705" }}>
            <img src="/portrait.jpg" alt={c.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              draggable={false} /></div>
          <div style={{ textAlign: "center", marginTop: 14, fontFamily: "var(--display-font)", fontWeight: 700,
            fontSize: 20, letterSpacing: ".14em", color: "var(--ink)", textTransform: "uppercase" }}>
            {c.name}
          </div>
          <div style={{ textAlign: "center", color: "var(--ink-dim)", fontStyle: "italic", marginTop: 4 }}>{c.title}</div>
          <div className="rule-h" style={{ margin: "14px 4px" }}/>
          <div className="stat-row"><span className="icn"><Icon.Flame size={16}/></span><span className="label">Covenant</span><span className="val">{c.covenant}</span></div>
          <div className="stat-row"><span className="icn"><Icon.Gem size={16}/></span><span className="label">Level</span><span className="val">26</span></div>
        </div>

        <div className="desc-panel" style={{ borderLeft: "none", border: "1px solid var(--rule)", padding: 24, overflow: "auto" }}>
          <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", color: "var(--gold-hi)",
            fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>
            ◆ Lore
          </div>
          <div className="flavor" style={{ fontSize: 19 }}>{c.flavor}</div>
          {c.bio.map((p, i) => <p key={i} style={{ marginTop: 12, fontSize: 16 }}>{p}</p>)}

          <div className="rule-h" style={{ margin: "24px 0 16px" }}/>
          <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", color: "var(--gold-hi)",
            fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>
            ◆ Proficiencies
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
            {c.attrs.map((a, i) => (
              <div className="stat-row" key={i}>
                <span className="icn"><Icon.Diamond size={10}/></span>
                <span className="label">{a.label}</span>
                <span className="val">{a.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="frame" style={{ padding: "44px 40px", position: "relative", alignSelf: "start" }}>
          <FrameOrnaments />
          <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", color: "var(--gold-hi)",
            fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>
            ◆ Attributes
          </div>
          {c.stats.map((s, i) => {
            const Ic = Icon[s.icon] || Icon.Diamond;
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div className="stat-row hi" style={{ padding: "4px 0" }}>
                  <span className="icn"><Ic size={16}/></span>
                  <span className="label">{s.label}</span>
                  <span className="val">{s.val}</span>
                </div>
                <div className="bar" style={{ height: 4, background: "rgba(0,0,0,.5)", border: "1px solid var(--rule)" }}>
                  <span style={{ display: "block", height: "100%", width: (s.val/20*100) + "%",
                    background: "linear-gradient(90deg, var(--accent), var(--gold-hi))", boxShadow: "0 0 8px var(--accent)" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PromptBar hints={[{ key: "Esc", label: "Back" }]}/>
    </div>
  );
}
