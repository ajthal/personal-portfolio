"use client";

import React, { useState, useEffect } from "react";
import { Icon, FrameOrnaments } from "@/components/icons/Icon";
import type { ProjectItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import PromptBar from "@/components/shared/PromptBar";
import DeckShowcase from "@/components/shared/DeckShowcase";
import Carousel from "@/components/shared/Carousel";
import Placeholder from "@/components/shared/Placeholder";

interface ProjectDetailProps {
  item: ProjectItem;
  screenshots?: string[];
  onBack: () => void;
}

export default function ProjectDetail({ item, screenshots = [], onBack }: ProjectDetailProps) {
  const [sel, setSel] = useState(0);
  const links = item.links || [];
  const useCarousel = item.images !== undefined;
  const carouselImages = screenshots.length ? screenshots : (item.images || []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
      else if (!useCarousel && e.key === "ArrowRight" && links.length) { setSel(s => (s+1) % links.length); Audio$.move(); }
      else if (!useCarousel && e.key === "ArrowLeft" && links.length) { setSel(s => (s-1+links.length) % links.length); Audio$.move(); }
      else if (e.key === "Enter" && links.length) { Audio$.select(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, links.length, useCarousel, onBack]);

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 36px 8px", display: "flex", alignItems: "baseline", gap: 24 }}>
        <div>
          <div style={{
            fontFamily: "var(--display-font)", fontSize: 30, letterSpacing: ".1em",
            color: "var(--ink)", fontWeight: 600, textTransform: "uppercase"
          }}>{item.name}</div>
          <div style={{ color: "var(--ink-dim)", fontStyle: "italic" }}>{item.subtitle}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, padding: "0 36px 90px", minHeight: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 0, overflowY: "auto", paddingRight: 8, paddingBottom: 16 }}>
          {useCarousel
            ? <Carousel images={carouselImages} title={item.name} alt={item.subtitle} />
            : item.showcase !== false
              ? <DeckShowcase item={item}/>
              : <Placeholder label={item.hero || item.name} aspect="16/9" seed={5} />}
          <div className="desc-panel" style={{ borderLeft: "none", border: "1px solid var(--rule)", padding: "16px 20px" }}>
            {item.flavor && <div className="flavor">{item.flavor}</div>}
            {(item.body || []).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div style={{ minHeight: 0, overflowY: "auto", paddingRight: 8, paddingBottom: 16 }}>
          <div className="frame" style={{ padding: "44px 48px", position: "relative" }}>
            <FrameOrnaments />
            <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", color: "var(--gold-hi)",
              fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>
              ◆ Tech & Tools
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
              {(item.stats || []).map((s, i) => {
                const Ic = Icon[s.icon] || Icon.Diamond;
                return (
                  <span className="tech-chip" key={i}>
                    <span className="icn"><Ic size={13}/></span>
                    <span>{s.label}</span>
                  </span>
                );
              })}
            </div>

            <div className="rule-h" style={{ margin: "16px 0" }}/>

            <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", color: "var(--gold-hi)",
              fontSize: 13, textTransform: "uppercase", marginBottom: 8 }}>
              ◆ Requisites
            </div>
            {(item.req || []).map((r, i) => (
              <div className="stat-row" key={i} style={{ padding: "4px 0" }}>
                <span className="icn"><Icon.Diamond size={10}/></span>
                <span className="label">{r.label}</span>
                <span className="val">{r.val}</span>
              </div>
            ))}

            {links.length > 0 && <>
              <div className="rule-h" style={{ margin: "16px 0" }}/>
              <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", color: "var(--gold-hi)",
                fontSize: 13, textTransform: "uppercase", marginBottom: 10 }}>
                ◆ Summon
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {links.map((l, i) => {
                  const Ic = Icon[l.icon] || Icon.Scroll;
                  return (
                    <a key={i} href={l.href} className="link-row" target="_blank" rel="noreferrer"
                      style={i === sel ? { borderColor: "var(--gold)", color: "var(--gold-hi)", background: "rgba(226,88,34,.08)" } : {}}>
                      <Ic size={14}/> {l.label}
                    </a>
                  );
                })}
              </div>
            </>}
          </div>
        </div>
      </div>

      <PromptBar hints={[
        { key: "←→", label: useCarousel ? "Pages" : "Links" },
        { key: "↵", label: "Open" },
        { key: "Esc", label: "Back" }
      ]}/>
    </div>
  );
}
