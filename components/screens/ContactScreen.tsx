"use client";

import React, { useState, useEffect } from "react";
import { Icon, FrameOrnaments } from "@/components/icons/Icon";
import { CHARACTER } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import ScreenHeader from "@/components/shared/ScreenHeader";
import PromptBar from "@/components/shared/PromptBar";

export default function ContactScreen({ onBack }: { onBack: () => void }) {
  const [sel, setSel] = useState(0);
  const rows = CHARACTER.contacts;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
      else if (e.key === "ArrowDown") { setSel(s => (s+1)%rows.length); Audio$.move(); }
      else if (e.key === "ArrowUp") { setSel(s => (s-1+rows.length)%rows.length); Audio$.move(); }
      else if (e.key === "Enter" || e.key === " ") { Audio$.select(); window.open(rows[sel].href, "_blank"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <ScreenHeader icon={Icon.Mail} title="Covenants" sub="Channels by which I may be summoned." inset={80} />

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "0 80px 80px", alignItems: "start" }}>
        <div className="frame" style={{ padding: "48px 44px", position: "relative" }}>
          <FrameOrnaments />
          <div className="flavor" style={{ fontSize: 18 }}>
            &quot;Swear an oath at any one of these shrines, and a reply shall come in due time.&quot;
          </div>
          <div className="rule-h" style={{ margin: "20px 0" }}/>
          {rows.map((r, i) => {
            const Ic = Icon[r.icon] || Icon.Scroll;
            return (
              <div
                key={i}
                className={"menu-item" + (i === sel ? " selected" : "")}
                style={{ display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 14, alignItems: "center",
                  padding: "14px 18px 14px 44px", fontSize: 18 }}
                onMouseEnter={() => { if (sel !== i) { setSel(i); Audio$.move(); } }}
                onClick={() => { Audio$.select(); window.open(r.href, "_blank"); }}
              >
                <Ic size={20}/>
                <span>{r.label}</span>
                <span style={{ fontFamily: "var(--body-font)", letterSpacing: ".04em", color: "var(--ink-mid)",
                  textTransform: "none", fontSize: 15 }}>{r.val}</span>
              </div>
            );
          })}
        </div>

        <div className="frame" style={{ padding: "48px 44px", position: "relative" }}>
          <FrameOrnaments />
          <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", color: "var(--gold-hi)",
            fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>
            ◆ Seeking
          </div>
          <div className="stat-row hi"><span className="icn"><Icon.Sword size={16}/></span><span className="label">Role</span><span className="val">Software Engineer</span></div>
          <div className="stat-row"><span className="icn"><Icon.Shield size={16}/></span><span className="label">Location</span><span className="val">Open / Remote</span></div>
          <div className="stat-row"><span className="icn"><Icon.Flame size={16}/></span><span className="label">Status</span><span className="val">Open to work</span></div>
          <div className="stat-row"><span className="icn"><Icon.Scroll size={16}/></span><span className="label">Stack</span><span className="val">Full-stack / product</span></div>
          <div className="rule-h" style={{ margin: "16px 0" }}/>
          <div className="flavor" style={{ fontSize: 15 }}>
            If the cause is good and the hearth is warm, I will walk the long road.
          </div>
        </div>
      </div>

      <PromptBar hints={[
        { key: "↑↓", label: "Navigate" },
        { key: "↵", label: "Open" },
        { key: "Esc", label: "Back" }
      ]}/>
    </div>
  );
}
