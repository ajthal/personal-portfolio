"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/icons/Icon";
import type { GalleryItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import PromptBar from "@/components/shared/PromptBar";
import Placeholder from "@/components/shared/Placeholder";
import PhotoLightbox from "./PhotoLightbox";

interface PhotoGalleryProps {
  item: GalleryItem;
  onBack: () => void;
}

export default function PhotoGallery({ item, onBack }: PhotoGalleryProps) {
  const images = item.images || [];
  const count = images.length || item.count;
  const [sel, setSel] = useState(0);
  const [zoom, setZoom] = useState(false);

  const aspects = ["3/4", "4/3", "1/1", "3/2", "2/3", "16/10"];
  const aspectFor = (i: number) => aspects[(i * 7 + (item.seed || 3)) % aspects.length];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (zoom) {
        if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); setZoom(false); }
        else if (e.key === "ArrowRight") { setSel(s => Math.min(count-1, s+1)); Audio$.move(); }
        else if (e.key === "ArrowLeft") { setSel(s => Math.max(0, s-1)); Audio$.move(); }
        return;
      }
      if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
      else if (e.key === "Enter") { Audio$.select(); setZoom(true); }
      else if (e.key === "ArrowRight") { setSel(s => Math.min(count-1, s+1)); Audio$.move(); }
      else if (e.key === "ArrowLeft") { setSel(s => Math.max(0, s-1)); Audio$.move(); }
      else if (e.key === "ArrowDown") { setSel(s => Math.min(count-1, s+5)); Audio$.move(); }
      else if (e.key === "ArrowUp") { setSel(s => Math.max(0, s-5)); Audio$.move(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, zoom]);

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 36px 8px", display: "flex", alignItems: "center", gap: 24 }}>
        <div>
          <div style={{
            fontFamily: "var(--display-font)", fontSize: 30, letterSpacing: ".1em",
            color: "var(--ink)", fontWeight: 600, textTransform: "uppercase"
          }}>{item.name}</div>
          <div style={{ color: "var(--ink-dim)", fontStyle: "italic" }}>{item.subtitle ? `${item.subtitle} · ` : ""}{count} exposures</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, padding: "0 36px 80px", minHeight: 0 }}>
        <div className="photo-grid" style={{ overflow: "auto", border: "1px solid var(--rule)" }}>
          {Array.from({ length: count }).map((_, i) => {
            const aspect = aspectFor(i);
            const src = images[i];
            return (
              <div
                key={src || i}
                className={"photo-tile" + (i === sel ? " selected" : "")}
                onMouseEnter={() => { if (sel !== i) { setSel(i); Audio$.move(); } }}
                onClick={() => { Audio$.select(); setSel(i); setZoom(true); }}
                style={src ? undefined : { aspectRatio: aspect.replace("/", " / ") }}
                title="Click to examine"
              >
                {src
                  ? <img src={src} alt={`${item.name} ${i+1}`} style={{ width: "100%", height: "auto", display: "block" }} draggable={false} loading="lazy" />
                  : <Placeholder label={`${item.name} №${String(i+1).padStart(2,'0')}`} seed={(i+1)*(item.seed||3)} aspect={aspect} style={{ height: "100%" }} />
                }
              </div>
            );
          })}
        </div>

        <div className="desc-panel" style={{ minHeight: 0 }}>
          <h2 style={{ fontSize: 20 }}>{item.name} №{String(sel+1).padStart(2,'0')}</h2>
          {item.flavor && <div className="flavor" style={{ fontSize: 15 }}>{item.flavor}</div>}
          <div className="rule-h"/>
          <div className="stat-row hi"><span className="icn"><Icon.Camera size={16}/></span><span className="label">Frame</span><span className="val">{sel+1} / {count}</span></div>
          <div className="stat-row"><span className="icn"><Icon.Gem size={16}/></span><span className="label">Location</span><span className="val">{item.name}</span></div>
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => { Audio$.select(); setZoom(true); }}
              style={{ fontFamily: "var(--body-font)", letterSpacing: ".14em", fontSize: 12, textTransform: "uppercase",
                color: "var(--gold-hi)", background: "transparent", border: "1px solid var(--rule)",
                padding: "10px 16px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              ◆ Examine
            </button>
          </div>
        </div>
      </div>

      <PromptBar hints={[
        { key: "←→↑↓", label: "Browse" },
        { key: "↵", label: "Examine" },
        { key: "Esc", label: "Back" }
      ]}/>

      {zoom && (
        <PhotoLightbox
          item={item}
          sel={sel}
          setSel={setSel}
          aspectFor={aspectFor}
          onClose={() => { Audio$.back(); setZoom(false); }}
        />
      )}
    </div>
  );
}
