"use client";

import React from "react";
import { Icon } from "@/components/icons/Icon";
import { CHARACTER } from "@/lib/data";

export default function MobileCharacter() {
  const c = CHARACTER;
  return (
    <div>
      <div className="m-screen-header">
        <div className="badge"><Icon.Human size={32} /></div>
        <div>
          <h1>Character</h1>
          <div className="sub">An accounting of the maker.</div>
        </div>
      </div>

      <div className="m-frame" style={{ textAlign: "center" }}>
        <div className="m-portrait">
          <img src="/portrait.jpg" alt={c.name} draggable={false} />
        </div>
        <div style={{
          fontFamily: "var(--display-font)", fontWeight: 700,
          fontSize: 18, letterSpacing: ".14em", color: "var(--ink)", textTransform: "uppercase"
        }}>
          {c.name}
        </div>
        <div style={{ color: "var(--ink-dim)", fontStyle: "italic", marginTop: 4, fontSize: 14 }}>{c.title}</div>
        <div className="rule-h" style={{ margin: "12px 0" }} />
        <div className="m-stats" style={{ textAlign: "left" }}>
          <div className="stat-row"><span className="icn"><Icon.Flame size={15} /></span><span className="label">Covenant</span><span className="val">{c.covenant}</span></div>
          <div className="stat-row"><span className="icn"><Icon.Gem size={15} /></span><span className="label">Level</span><span className="val">26</span></div>
        </div>
      </div>

      <div className="m-frame">
        <div className="m-section-h">◆ Lore</div>
        <div className="m-flavor">{c.flavor}</div>
        <div className="m-body">
          {c.bio.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="m-frame">
        <div className="m-section-h">◆ Attributes</div>
        {c.stats.map((s, i) => {
          const Ic = Icon[s.icon] || Icon.Diamond;
          return (
            <div key={i} style={{ marginBottom: 8 }}>
              <div className="stat-row hi" style={{ padding: "4px 0" }}>
                <span className="icn"><Ic size={15} /></span>
                <span className="label">{s.label}</span>
                <span className="val">{s.val}</span>
              </div>
              <div className="bar" style={{ height: 4, background: "rgba(0,0,0,.5)", border: "1px solid var(--rule)" }}>
                <span style={{
                  display: "block", height: "100%", width: (s.val / 20 * 100) + "%",
                  background: "linear-gradient(90deg, var(--accent), var(--gold-hi))", boxShadow: "0 0 8px var(--accent)"
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="m-frame">
        <div className="m-section-h">◆ Proficiencies</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
          {c.attrs.map((a, i) => (
            <div className="stat-row" key={i}>
              <span className="icn"><Icon.Diamond size={9} /></span>
              <span className="label">{a.label}</span>
              <span className="val">{a.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
