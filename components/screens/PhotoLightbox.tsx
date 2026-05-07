"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FrameOrnaments } from "@/components/icons/Icon";
import type { GalleryItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import Placeholder from "@/components/shared/Placeholder";

interface PhotoLightboxProps {
  item: GalleryItem;
  sel: number;
  setSel: React.Dispatch<React.SetStateAction<number>>;
  aspectFor: (i: number) => string;
  onClose: () => void;
}

export default function PhotoLightbox({ item, sel, setSel, aspectFor, onClose }: PhotoLightboxProps) {
  const images = item.images || [];
  const count = images.length || item.count;
  const img = images[sel];
  const aspect = aspectFor(sel);

  useEffect(() => {
    document.body.classList.add("lightbox-open");
    return () => document.body.classList.remove("lightbox-open");
  }, []);

  return (
    <div
      className="lightbox"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button
        className="lb-nav lb-prev"
        onClick={() => { setSel(s => Math.max(0, s-1)); Audio$.move(); }}
        disabled={sel === 0}
        title="Previous (←)"
      >‹</button>

      <div className="lb-frame" onClick={(e) => e.stopPropagation()}>
        <FrameOrnaments />
        <div className="lb-image-wrap" style={img ? undefined : { aspectRatio: aspect.replace("/", " / ") }}>
          {img
            ? <Image
                src={img.src}
                alt={`${item.name} ${sel+1}`}
                width={img.width}
                height={img.height}
                sizes="1320px"
                style={{ display: "block", maxWidth: "100%", maxHeight: "640px", width: "auto", height: "auto", objectFit: "contain" }}
                draggable={false}
              />
            : <Placeholder
                label={`${item.name} №${String(sel+1).padStart(2,'0')}`}
                seed={(sel+1)*(item.seed||3)}
                aspect={aspect}
                style={{ width: "100%", height: "100%" }}
              />
          }
        </div>
        <div className="lb-caption">
          <div className="lb-title">{item.name} №{String(sel+1).padStart(2,'0')}</div>
          <div className="lb-frame-count">{sel+1} / {count}</div>
        </div>
      </div>

      <button
        className="lb-nav lb-next"
        onClick={() => { setSel(s => Math.min(count-1, s+1)); Audio$.move(); }}
        disabled={sel === count-1}
        title="Next (→)"
      >›</button>

      <button className="lb-close" onClick={onClose} title="Close (Esc)">✕ CLOSE</button>

      <div className="lb-hints">
        <span>← → NAVIGATE</span>
        <span>ESC CLOSE</span>
      </div>
    </div>
  );
}
