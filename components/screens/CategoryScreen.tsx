"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons/Icon";
import { type Category, type ProjectItem, type GalleryItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import ScreenHeader from "@/components/shared/ScreenHeader";
import PromptBar from "@/components/shared/PromptBar";
import Placeholder from "@/components/shared/Placeholder";

interface CategoryScreenProps {
  category: Category;
  categories: Category[];
  labelMode: string;
  onOpenItem: (item: ProjectItem | GalleryItem) => void;
  onBack: () => void;
  onSwitchCategory: (c: Category) => void;
}

export default function CategoryScreen({ category, categories, labelMode, onOpenItem, onBack, onSwitchCategory }: CategoryScreenProps) {
  const items = category.items;
  const [sel, setSel] = useState(0);

  useEffect(() => { setSel(0); }, [category.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const cols = category.layout === "gallery" ? 3 : 4;
      if (e.key === "ArrowRight" || e.key === "d") { setSel(s => Math.min(items.length-1, s+1)); Audio$.move(); }
      else if (e.key === "ArrowLeft" || e.key === "a") { setSel(s => Math.max(0, s-1)); Audio$.move(); }
      else if (e.key === "ArrowDown" || e.key === "s") { setSel(s => Math.min(items.length-1, s+cols)); Audio$.move(); }
      else if (e.key === "ArrowUp" || e.key === "w") { setSel(s => Math.max(0, s-cols)); Audio$.move(); }
      else if (e.key === "Enter" || e.key === " ") {
        const it = items[sel];
        if ("locked" in it && it.locked) { Audio$.error(); return; }
        Audio$.select();
        onOpenItem(it);
      }
      else if (e.key === "Escape" || e.key === "Backspace") { Audio$.back(); onBack(); }
      else if (e.key === "q" || e.key === "Q") { cycleCategory(-1); }
      else if (e.key === "e" || e.key === "E") { cycleCategory(1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, category]);

  function cycleCategory(dir: number) {
    const idx = categories.findIndex(c => c.id === category.id);
    const next = categories[(idx + dir + categories.length) % categories.length];
    Audio$.move();
    onSwitchCategory(next);
  }

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <ScreenHeader
        icon={Icon[category.icon] || Icon.Scroll}
        title={labelMode === "rpg" ? category.label.rpg : category.label.plain}
        sub={category.subtitle}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "4px 36px 14px" }}>
        <button
          onClick={() => cycleCategory(-1)}
          style={{ color: "var(--ink-dim)", padding: "4px 10px", border: "1px solid var(--rule)", background: "transparent", fontFamily: "var(--body-font)", letterSpacing: ".14em", fontSize: 12, textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          title="Previous category (Q)"
        >
          <Icon.Chevron dir="left"/> Q
        </button>
        <div className="tab-strip" style={{ flex: 1, margin: 0 }}>
          {categories.map(c => {
            const Ic = Icon[c.icon] || Icon.Scroll;
            return (
              <div
                key={c.id}
                className={"tab" + (c.id === category.id ? " active" : "")}
                onClick={() => { if (c.id !== category.id) { Audio$.move(); onSwitchCategory(c); } }}
              >
                <Ic size={32}/>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => cycleCategory(1)}
          style={{ color: "var(--ink-dim)", padding: "4px 10px", border: "1px solid var(--rule)", background: "transparent", fontFamily: "var(--body-font)", letterSpacing: ".14em", fontSize: 12, textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          title="Next category (E)"
        >
          E <Icon.Chevron dir="right"/>
        </button>
      </div>

      {category.layout === "inventory"
        ? <InventoryBody items={items as ProjectItem[]} sel={sel} setSel={setSel} onOpen={onOpenItem} />
        : <GalleryBody items={items as GalleryItem[]} sel={sel} setSel={setSel} onOpen={onOpenItem} />}

      <PromptBar hints={[
        { key: "↑↓←→", label: "Navigate" },
        { key: "↵", label: "Select" },
        { key: "Esc", label: "Back" },
        { key: "Q/E", label: "Switch Category" }
      ]}/>
    </div>
  );
}

function InventoryBody({ items, sel, setSel, onOpen }: { items: ProjectItem[]; sel: number; setSel: (s: number | ((s: number) => number)) => void; onOpen: (item: ProjectItem) => void }) {
  const current = items[sel];
  const CurIcon = Icon[current?.icon] || Icon.Ring;
  return (
    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "460px 1fr", gap: 2, margin: "0 36px 70px", overflow: "hidden" }}>
      <div>
        <div className="inv-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {items.map((it, i) => {
            const ItIcon = Icon[it.icon] || Icon.Ring;
            return (
              <div
                key={it.id}
                className={"inv-tile" + (i === sel ? " selected" : "")}
                onMouseEnter={() => { if (sel !== i) { setSel(i); Audio$.move(); } }}
                onClick={() => { if (!it.locked) { Audio$.select(); onOpen(it); } else Audio$.error(); }}
                style={{ opacity: it.locked ? .3 : 1 }}
              >
                <ItIcon size={46} />
              </div>
            );
          })}
          {Array.from({ length: Math.max(0, 16 - items.length) }).map((_, i) => (
            <div key={"e"+i} className="inv-tile" style={{ opacity: .25 }} />
          ))}
        </div>
      </div>

      <div className="desc-panel" style={{ minHeight: 0, overflow: "auto" }}>
        {current?.locked ? (
          <div style={{ color: "var(--ink-dim)", fontStyle: "italic", padding: "40px 0" }}>
            — Empty slot. Nothing to examine. —
          </div>
        ) : (
          <div style={{ animation: "fadeIn .25s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
              <div style={{ color: "var(--gold)" }}><CurIcon size={36}/></div>
              <h2 style={{ margin: 0 }}>{current.name}</h2>
            </div>
            <div style={{ color: "var(--ink-dim)", fontStyle: "italic", marginBottom: 14 }}>{current.subtitle}</div>
            {current.flavor && <div className="flavor">{current.flavor}</div>}
            <div className="rule-h"/>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 8px", marginTop: 14 }}>
              {(current.stats || []).slice(0, 6).map((s, i) => {
                const Ic = Icon[s.icon] || Icon.Diamond;
                return (
                  <span className="tech-chip" key={i}>
                    <span className="icn"><Ic size={13}/></span>
                    <span>{s.label}</span>
                  </span>
                );
              })}
            </div>
            <div style={{ marginTop: 18, color: "var(--ink-dim)", fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>
              Press <span className="kbd">↵</span> to examine →
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryBody({ items, sel, setSel, onOpen }: { items: GalleryItem[]; sel: number; setSel: (s: number | ((s: number) => number)) => void; onOpen: (item: GalleryItem) => void }) {
  const current = items[sel];

  if (items.length === 0) {
    return (
      <div style={{ flex: 1, display: "grid", placeItems: "center", margin: "0 36px 70px", color: "var(--ink-dim)", textAlign: "center" }}>
        <div style={{ maxWidth: 540, fontFamily: "var(--body-font)", letterSpacing: ".06em", lineHeight: 1.7 }}>
          <div style={{ fontFamily: "var(--display-font)", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold-hi)", fontSize: 14, marginBottom: 14 }}>
            ◆ No archives yet
          </div>
          <div>Add a folder under <code style={{ color: "var(--ink)" }}>public/photos/</code> — the folder name becomes the gallery title, and any images inside fill it.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 420px", gap: 24, margin: "0 36px 70px", overflow: "hidden" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "1fr",
        gap: 14,
        padding: 6,
        overflow: "auto"
      }}>
        {items.map((it, i) => {
          const cover = it.images && it.images[0];
          return (
            <div
              key={it.id}
              className={"photo-tile" + (i === sel ? " selected" : "")}
              onMouseEnter={() => { if (sel !== i) { setSel(i); Audio$.move(); } }}
              onClick={() => { Audio$.select(); onOpen(it); }}
            >
              {cover
                ? <Image
                    src={cover.src}
                    alt={it.name}
                    fill
                    sizes="360px"
                    style={{ objectFit: "cover" }}
                    draggable={false}
                  />
                : <Placeholder label={it.name} seed={it.seed || i+1} aspect="4/3" style={{ height: "100%" }} />
              }
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                padding: "8px 12px",
                background: "linear-gradient(to top, rgba(0,0,0,.85), transparent)",
                display: "flex", justifyContent: "space-between", alignItems: "baseline"
              }}>
                <span style={{
                  fontFamily: "var(--display-font)", letterSpacing: ".12em",
                  textTransform: "uppercase", color: "var(--ink)", fontSize: 15
                }}>{it.name}</span>
                <span style={{ color: "var(--ink-dim)", fontSize: 12 }}>× {it.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="desc-panel" style={{ minHeight: 0 }}>
        {current && (
          <div key={current.id} style={{ animation: "fadeIn .25s ease" }}>
            <h2>{current.name}</h2>
            {current.subtitle && <div style={{ color: "var(--ink-dim)", fontStyle: "italic", marginBottom: 14 }}>{current.subtitle}</div>}
            {current.flavor && <div className="flavor">{current.flavor}</div>}
            <div className="rule-h"/>
            <div className="stat-row hi"><span className="icn"><Icon.Camera size={16}/></span><span className="label">Exposures</span><span className="val">{current.count}</span></div>
            <div style={{ marginTop: 20, color: "var(--ink-dim)", fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>
              Press <span className="kbd">↵</span> to open gallery →
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
