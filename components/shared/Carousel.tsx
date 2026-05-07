"use client";

import React, { useState, useEffect, useRef } from "react";
import { Audio$ } from "@/lib/audio";

interface CarouselProps {
  images: string[];
  title: string;
  alt?: string;
}

export default function Carousel({ images, title, alt }: CarouselProps) {
  const total = images.length;
  const [active, setActive] = useState(0);
  const lockRef = useRef(false);

  function go(dir: "next" | "prev") {
    if (lockRef.current || total < 2) return;
    lockRef.current = true;
    setActive(a => dir === "next" ? (a + 1) % total : (a - 1 + total) % total);
    Audio$.move();
    setTimeout(() => { lockRef.current = false; }, 220);
  }

  useEffect(() => {
    if (total < 2) return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go("next"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go("prev"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (total === 0) {
    return (
      <div className="carousel">
        <div className="carousel-frame empty">
          <div className="carousel-stage">
            <div className="carousel-empty">— screenshots forthcoming —</div>
          </div>
          <div className="carousel-tag">◆ {title}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel">
      <div className="carousel-frame">
        <div className="carousel-stage">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === active ? (alt ?? `${title} screenshot ${active + 1}`) : ""}
              className={`carousel-slide${i === active ? " on" : ""}`}
              aria-hidden={i !== active}
              draggable={false}
            />
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow left"
              onClick={() => go("prev")}
              aria-label="Previous screenshot"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                <path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel-arrow right"
              onClick={() => go("next")}
              aria-label="Next screenshot"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                <path d="M9 6 L15 12 L9 18" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        <div className="carousel-index">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div className="carousel-tag">◆ {title}</div>
      </div>

      {total > 1 && (
        <div className="carousel-markers">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`marker${i === active ? " on" : ""}`}
              onClick={() => { if (i !== active && !lockRef.current) { lockRef.current = true; setActive(i); Audio$.move(); setTimeout(() => { lockRef.current = false; }, 220); } }}
              aria-label={`Go to screenshot ${i + 1}`}
              aria-current={i === active}
            />
          ))}
        </div>
      )}
    </div>
  );
}
