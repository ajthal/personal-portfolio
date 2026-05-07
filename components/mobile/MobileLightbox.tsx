"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";

interface MobileLightboxProps {
  item: GalleryItem;
  sel: number;
  setSel: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

export default function MobileLightbox({ item, sel, setSel, onClose }: MobileLightboxProps) {
  const images = item.images || [];
  const count = images.length;
  const img = images[sel];

  useEffect(() => {
    document.body.classList.add("lightbox-open");
    return () => document.body.classList.remove("lightbox-open");
  }, []);

  if (!img) return null;

  return (
    <div className="m-lightbox" onClick={onClose}>
      <div className="m-lb-top">
        <span>{item.name} №{String(sel + 1).padStart(2, "0")}</span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }}>✕ CLOSE</button>
      </div>

      <div className="m-lb-image" onClick={(e) => e.stopPropagation()}>
        <Image
          src={img.src}
          alt={`${item.name} ${sel + 1}`}
          width={img.width}
          height={img.height}
          sizes="100vw"
          style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain" }}
          draggable={false}
        />
      </div>

      <div className="m-lb-nav" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => { setSel(s => Math.max(0, s - 1)); Audio$.move(); }}
          disabled={sel === 0}
          aria-label="Previous"
        >‹</button>
        <span className="m-lb-count">{sel + 1} / {count}</span>
        <button
          onClick={() => { setSel(s => Math.min(count - 1, s + 1)); Audio$.move(); }}
          disabled={sel === count - 1}
          aria-label="Next"
        >›</button>
      </div>
    </div>
  );
}
