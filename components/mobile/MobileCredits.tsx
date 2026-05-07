"use client";

import React from "react";
import { Icon } from "@/components/icons/Icon";

export default function MobileCredits() {
  return (
    <div>
      <div className="m-screen-header">
        <div className="badge"><Icon.Scroll size={32} /></div>
        <div>
          <h1>Credits</h1>
          <div className="sub">Those without whom this archive would not be.</div>
        </div>
      </div>

      <div className="m-frame" style={{ textAlign: "center" }}>
        <div className="m-flavor" style={{ fontSize: 16 }}>
          &quot;All things return, in time, to the flame.&quot;
        </div>
        <div className="rule-h" style={{ margin: "14px 0" }} />
        <div style={{ display: "grid", gap: 14, color: "var(--ink-mid)", fontSize: 14 }}>
          <div>
            <div style={{ color: "var(--ink-dim)", fontSize: 11, letterSpacing: ".18em" }}>DESIGNED &amp; BUILT BY</div>
            <div style={{ fontFamily: "var(--display-font)", fontSize: 18, letterSpacing: ".12em", color: "var(--ink)" }}>ANDREW THALHEIMER</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-dim)", fontSize: 11, letterSpacing: ".18em" }}>ART DIRECTION</div>
            <div>Dark-fantasy RPG-menu homage, drawn from scratch.</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-dim)", fontSize: 11, letterSpacing: ".18em" }}>SOUND</div>
            <div>Synthesized in Web Audio, on the fly.</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-dim)", fontSize: 11, letterSpacing: ".18em" }}>TYPE</div>
            <div>Cinzel · IM Fell English · EB Garamond</div>
          </div>
        </div>
      </div>
    </div>
  );
}
