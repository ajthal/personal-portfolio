"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import MobileLightbox from "./MobileLightbox";

interface MobileGalleryProps {
  item: GalleryItem;
}

export default function MobileGallery({ item }: MobileGalleryProps) {
  const images = item.images || [];
  const count = images.length;
  const [sel, setSel] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setZoom(false); Audio$.back(); }
      else if (e.key === "ArrowRight") { setSel(s => Math.min(count - 1, s + 1)); Audio$.move(); }
      else if (e.key === "ArrowLeft") { setSel(s => Math.max(0, s - 1)); Audio$.move(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, count]);

  return (
    <div>
      <div className="m-screen-header">
        <div>
          <h1>{item.name}</h1>
          <div className="sub">{item.subtitle ? `${item.subtitle} · ` : ""}{count} exposures</div>
        </div>
      </div>

      {item.flavor && <div className="m-flavor" style={{ marginBottom: 14 }}>{item.flavor}</div>}

      {count === 0 ? (
        <div className="m-empty">— No images yet —</div>
      ) : (
        <div className="m-gallery">
          {images.map((img, i) => (
            <button
              key={img.src}
              className="m-photo"
              onClick={() => { Audio$.select(); setSel(i); setZoom(true); }}
              aria-label={`Open photo ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={`${item.name} ${i + 1}`}
                width={img.width}
                height={img.height}
                sizes="(max-width: 600px) 50vw, 280px"
                style={{ width: "100%", height: "auto", display: "block" }}
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <MobileLightbox
          item={item}
          sel={sel}
          setSel={setSel}
          onClose={() => { Audio$.back(); setZoom(false); }}
        />
      )}
    </div>
  );
}
