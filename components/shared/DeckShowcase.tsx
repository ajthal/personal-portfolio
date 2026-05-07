"use client";

import React from "react";
import type { ProjectItem } from "@/lib/data";

function DeckCardComposition({ w, h, label }: { w: number; h: number; label: string }) {
  const card = (rot: number, dx: number, dy: number, z: number, dim?: { op?: number; bg?: number; in?: number }): React.CSSProperties => ({
    position: "absolute",
    width: w, height: h,
    left: `calc(50% + ${dx}px)`,
    top: `calc(50% + ${dy}px)`,
    transform: `translate(-50%, -50%) rotate(${rot}deg)`,
    zIndex: z,
    border: "1px solid var(--gold)",
    background: `linear-gradient(180deg, rgba(38,30,22,${dim?.bg ?? .92}), rgba(20,16,12,${dim?.bg ?? .92}))`,
    boxShadow: `0 ${10 + Math.abs(rot)}px ${22 + Math.abs(rot)*1.2}px rgba(0,0,0,.5), inset 0 0 0 4px rgba(226,88,34,${dim?.in ?? .12})`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: 10, gap: 6,
    opacity: dim?.op ?? 1
  });
  const innerArt: React.CSSProperties = {
    width: "90%", flex: 1,
    background: "repeating-linear-gradient(45deg, rgba(226,88,34,.10) 0 6px, rgba(226,88,34,.04) 6px 12px)",
    border: "1px dashed rgba(226,88,34,.35)"
  };
  const titleBar: React.CSSProperties = {
    width: "90%", height: 18,
    background: "linear-gradient(90deg, rgba(226,88,34,.18), rgba(226,88,34,.04))",
    border: "1px solid rgba(226,88,34,.4)"
  };
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={card(-14, -86, 6, 1, { op: .85, bg: .78, in: .08 })}>
        <div style={titleBar}/><div style={innerArt}/><div style={{ ...titleBar, height: 10 }}/>
      </div>
      <div style={card(14, 86, 6, 2, { op: .9, bg: .82, in: .1 })}>
        <div style={titleBar}/><div style={innerArt}/><div style={{ ...titleBar, height: 10 }}/>
      </div>
      <div style={card(0, 0, -8, 3)}>
        <div style={titleBar}/><div style={innerArt}/>
        <div style={{
          fontFamily: "var(--display-font)", fontSize: 10, letterSpacing: ".18em",
          color: "var(--ink-dim)", textTransform: "uppercase", textAlign: "center",
          width: "90%", padding: "2px 4px", borderTop: "1px solid var(--rule)"
        }}>{label}</div>
      </div>
    </div>
  );
}

export default function DeckShowcase({ item }: { item: ProjectItem }) {
  const hasImage = !!item.showcase;
  const cardW = 168, cardH = 234;
  return (
    <div style={{
      position: "relative",
      aspectRatio: "16/10",
      background: "radial-gradient(ellipse at center, rgba(226,88,34,.06) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(20,17,14,.55), rgba(12,10,8,.85))",
      border: "1px solid var(--rule)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: .35,
        backgroundImage: "repeating-linear-gradient(45deg, rgba(226,88,34,.04) 0 1px, transparent 1px 6px), repeating-linear-gradient(-45deg, rgba(226,88,34,.03) 0 1px, transparent 1px 8px)",
      }}/>
      {[
        { top: 8, left: 8, rot: 0 },
        { top: 8, right: 8, rot: 90 },
        { bottom: 8, right: 8, rot: 180 },
        { bottom: 8, left: 8, rot: 270 }
      ].map((c, i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 22 22" style={{
          position: "absolute", ...c, transform: `rotate(${c.rot}deg)`, color: "var(--gold)"
        } as React.CSSProperties}>
          <path d="M2 2 L10 2 M2 2 L2 10" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        </svg>
      ))}

      {hasImage ? (
        <img src={item.showcase as string} alt={item.name}
          style={{ position: "relative", maxWidth: "82%", maxHeight: "88%", objectFit: "contain", filter: "drop-shadow(0 14px 24px rgba(0,0,0,.55))" }}/>
      ) : (
        <DeckCardComposition w={cardW} h={cardH} label={item.hero || item.name}/>
      )}

      <div style={{
        position: "absolute", left: 14, bottom: 10,
        fontFamily: "var(--display-font)", fontSize: 11, letterSpacing: ".22em",
        color: "var(--ink-dim)", textTransform: "uppercase"
      }}>◆ Showcase</div>
    </div>
  );
}
