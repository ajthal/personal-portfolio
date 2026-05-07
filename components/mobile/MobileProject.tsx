"use client";

import React, { useState } from "react";
import { Icon } from "@/components/icons/Icon";
import type { ProjectItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import DeckShowcase from "@/components/shared/DeckShowcase";

interface MobileProjectProps {
  item: ProjectItem;
  screenshots?: string[];
}

export default function MobileProject({ item, screenshots = [] }: MobileProjectProps) {
  const links = item.links || [];
  const useCarousel = item.images !== undefined;
  const carouselImages = screenshots.length ? screenshots : (item.images || []);

  return (
    <div>
      <div className="m-screen-header">
        <div>
          <h1>{item.name}</h1>
          {item.subtitle && <div className="sub">{item.subtitle}</div>}
        </div>
      </div>

      <div className="m-hero">
        {useCarousel
          ? (carouselImages.length > 0
              ? <MobileCarousel images={carouselImages} title={item.name} alt={item.subtitle} />
              : <div className="m-hero-empty">— screenshots forthcoming —</div>)
          : (item.showcase !== false
              ? <DeckShowcase item={item} />
              : <div className="m-hero-empty">{item.hero || item.name}</div>)}
      </div>

      <div className="m-frame">
        {item.flavor && <div className="m-flavor">{item.flavor}</div>}
        <div className="m-body">
          {(item.body || []).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      {(item.stats || []).length > 0 && (
        <div className="m-frame">
          <div className="m-section-h">◆ Tech & Tools</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(item.stats || []).map((s, i) => {
              const Ic = Icon[s.icon] || Icon.Diamond;
              return (
                <span className="tech-chip" key={i}>
                  <span className="icn"><Ic size={12} /></span>
                  <span>{s.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {(item.req || []).length > 0 && (
        <div className="m-frame">
          <div className="m-section-h">◆ Requisites</div>
          {(item.req || []).map((r, i) => (
            <div className="stat-row" key={i} style={{ padding: "4px 0" }}>
              <span className="icn"><Icon.Diamond size={10} /></span>
              <span className="label">{r.label}</span>
              <span className="val">{r.val}</span>
            </div>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="m-frame">
          <div className="m-section-h">◆ Summon</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {links.map((l, i) => {
              const Ic = Icon[l.icon] || Icon.Scroll;
              return (
                <a key={i} href={l.href} className="link-row" target="_blank" rel="noreferrer">
                  <Ic size={14} /> {l.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileCarousel({ images, title, alt }: { images: string[]; title: string; alt?: string }) {
  const total = images.length;
  const [active, setActive] = useState(0);

  function go(dir: 1 | -1) {
    if (total < 2) return;
    setActive(a => (a + dir + total) % total);
    Audio$.move();
  }

  return (
    <div className="m-carousel">
      <div className="m-carousel-stage">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === active ? (alt ?? `${title} screenshot ${active + 1}`) : ""}
            className={"m-carousel-slide" + (i === active ? " on" : "")}
            aria-hidden={i !== active}
            draggable={false}
          />
        ))}
        {total > 1 && (
          <>
            <button className="m-carousel-arrow left" onClick={() => go(-1)} aria-label="Previous">‹</button>
            <button className="m-carousel-arrow right" onClick={() => go(1)} aria-label="Next">›</button>
          </>
        )}
        <div className="m-carousel-index">{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
      </div>
    </div>
  );
}
