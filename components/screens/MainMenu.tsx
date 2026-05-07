"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/icons/Icon";
import { FrameOrnaments } from "@/components/icons/Icon";
import { CATEGORIES } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import PromptBar from "@/components/shared/PromptBar";
import type { IconName } from "@/components/icons/Icon";

interface MainMenuProps {
  labelMode: string;
  onPick: (e: { kind: string; id: string }) => void;
  onBack: () => void;
}

export default function MainMenu({ labelMode, onPick, onBack }: MainMenuProps) {
  const entries = [
    ...CATEGORIES.map(c => ({ id: c.id, label: c.label, sub: c.subtitle, flavor: c.flavor, icon: c.icon, kind: "category" })),
    { id: "character", label: { rpg: "CHARACTER", plain: "ABOUT" }, sub: "The one who wrote these lines.", flavor: "A brief ledger of the maker.", icon: "Human" as IconName, kind: "character" },
    { id: "contact", label: { rpg: "COVENANTS", plain: "CONTACT" }, sub: "Channels by which I may be summoned.", flavor: "Swear an oath — send a message.", icon: "Mail" as IconName, kind: "contact" },
    { id: "keys", label: { rpg: "KEY SETTINGS", plain: "KEY BINDINGS" }, sub: "How this archive is traversed.", flavor: "The old inputs remain true.", icon: "Key" as IconName, kind: "keys" },
    { id: "quit", label: { rpg: "RETURN TO TITLE", plain: "RETURN TO TITLE" }, sub: "Back to the beginning.", flavor: "Rest at the bonfire, if you must.", icon: "Flame" as IconName, kind: "back" }
  ];
  const [sel, setSel] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") { setSel(s => (s+1) % entries.length); Audio$.move(); }
      else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") { setSel(s => (s-1+entries.length) % entries.length); Audio$.move(); }
      else if (e.key === "Enter" || e.key === " ") { Audio$.select(); pick(sel); }
      else if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  function pick(i: number) {
    const e = entries[i];
    if (e.kind === "back") return onBack();
    onPick(e);
  }

  const current = entries[sel];
  const CurrentIcon = Icon[current.icon] || Icon.Flame;

  return (
    <div className="screen" style={{ padding: "60px 80px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60 }}>
      <div>
        <div style={{
          fontFamily: "var(--display-font)",
          fontWeight: 600, fontSize: 44, letterSpacing: ".14em",
          color: "var(--ink)",
          marginBottom: 6,
          textTransform: "uppercase"
        }}>
          Archive
        </div>
        <div style={{ color: "var(--ink-dim)", fontStyle: "italic", marginBottom: 28, fontSize: 16 }}>
          Select a record to examine.
        </div>
        <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 6 }}>
          {entries.map((e, i) => (
            <div
              key={e.id}
              className={"menu-item" + (i === sel ? " selected" : "")}
              style={{ padding: "12px 18px 12px 32px", fontSize: 22 }}
              onMouseEnter={() => { if (sel !== i) { setSel(i); Audio$.move(); } }}
              onClick={() => { Audio$.select(); pick(i); }}
            >
              {labelMode === "rpg" ? e.label.rpg : e.label.plain}
            </div>
          ))}
        </div>
      </div>

      <div className="frame" style={{ padding: 48, alignSelf: "start", position: "relative", minHeight: 460 }}>
        <FrameOrnaments />
        <div key={sel} style={{ animation: "fadeIn .28s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ color: "var(--gold)" }}><CurrentIcon size={58}/></div>
            <div>
              <div style={{
                fontFamily: "var(--display-font)", fontSize: 28, letterSpacing: ".1em",
                color: "var(--ink)", textTransform: "uppercase", fontWeight: 600
              }}>
                {labelMode === "rpg" ? current.label.rpg : current.label.plain}
              </div>
              <div style={{ color: "var(--ink-dim)", fontStyle: "italic", marginTop: 4 }}>{current.sub}</div>
            </div>
          </div>
          <div className="rule-h" />
          <div style={{
            fontFamily: "var(--body-font)",
            fontStyle: "italic",
            fontSize: 20,
            color: "var(--ink-mid)",
            lineHeight: 1.6,
            marginTop: 20
          }}>
            {current.flavor}
          </div>
        </div>
      </div>

      <PromptBar hints={[
        { key: "↑↓", label: "Navigate" },
        { key: "↵", label: "Select" },
        { key: "Esc", label: "Back" }
      ]}/>
    </div>
  );
}
