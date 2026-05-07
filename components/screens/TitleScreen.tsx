"use client";

import React, { useState, useEffect, useRef } from "react";
import { Audio$ } from "@/lib/audio";

interface TitleScreenProps {
  labelMode: string;
  audioOn: boolean;
  onStart: (where: string) => void;
}

export default function TitleScreen({ onStart, labelMode, audioOn }: TitleScreenProps) {
  const [phase, setPhase] = useState(0);
  const [sel, setSel] = useState(0);
  const introStartedRef = useRef(false);

  const menu = [
    { id: "enter", rpg: "NEW GAME", plain: "ENTER SITE", go: () => onStart("main") },
    { id: "about", rpg: "LOAD GAME", plain: "ABOUT", go: () => onStart("character") },
    { id: "contact", rpg: "COVENANTS", plain: "CONTACT", go: () => onStart("contact") },
    { id: "credits", rpg: "CREDITS", plain: "CREDITS", go: () => onStart("credits") }
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800);
    return () => clearTimeout(t1);
  }, []);

  function tryStartIntro() {
    if (!Audio$.isEnabled()) return;
    if (introStartedRef.current) return;
    const h = Audio$.intro({ duration: 9.0 });
    if (h) introStartedRef.current = true;
  }

  useEffect(() => {
    if (!audioOn) {
      introStartedRef.current = false;
      Audio$.stopIntro();
      return;
    }
    tryStartIntro();
    function gesture() { tryStartIntro(); }
    window.addEventListener("pointerdown", gesture);
    window.addEventListener("keydown", gesture);
    return () => {
      window.removeEventListener("pointerdown", gesture);
      window.removeEventListener("keydown", gesture);
    };
  }, [audioOn]);

  useEffect(() => {
    return () => { Audio$.stopIntro(); };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase === 1) {
        setPhase(2);
        Audio$.start();
        return;
      }
      if (phase !== 2) return;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        setSel(s => (s + 1) % menu.length); Audio$.move();
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        setSel(s => (s - 1 + menu.length) % menu.length); Audio$.move();
      } else if (e.key === "Enter" || e.key === " ") {
        Audio$.select();
        menu[sel].go();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, sel]);

  const handleAnyClick = () => {
    if (phase === 1) { setPhase(2); Audio$.start(); }
  };

  return (
    <div className="screen title-screen" onClick={handleAnyClick} style={{ cursor: phase === 1 ? "pointer" : "default" }}>
      <div className="title-logo">
        <div className="logo-inner" style={{ animation: "logo-in 1.8s ease forwards", opacity: 0 }}>
          <div className="name">ANDREW</div>
          <div className="name" style={{ marginTop: 10 }}>THALHEIMER</div>
          <div className="edition">— SOFTWARE ENGINEER —</div>
        </div>
      </div>

      {phase === 1 && (
        <div className="title-press">◆ PRESS ANY KEY ◆</div>
      )}

      {phase === 2 && (
        <div className="title-menu" style={{ animation: "menu-in .5s ease forwards" }}>
          {menu.map((m, i) => (
            <div
              key={m.id}
              className={"menu-item" + (i === sel ? " selected" : "")}
              onMouseEnter={() => { if (sel !== i) { setSel(i); Audio$.move(); } }}
              onClick={() => { Audio$.select(); m.go(); }}
            >
              {labelMode === "rpg" ? m.rpg : m.plain}
            </div>
          ))}
        </div>
      )}

      <div className="title-copyright">
        ANDREW THALHEIMER™ · PORTFOLIO EDITION · © 2026 · CRAFTED IN CODE
      </div>
    </div>
  );
}
