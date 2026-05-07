"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "@/components/icons/Icon";
import { Audio$ } from "@/lib/audio";

interface MobileTitleProps {
  audioOn: boolean;
  setAudio: React.Dispatch<React.SetStateAction<boolean>>;
  onStart: (where: string) => void;
}

export default function MobileTitle({ audioOn, setAudio, onStart }: MobileTitleProps) {
  const introStartedRef = useRef(false);

  useEffect(() => {
    if (!audioOn) {
      introStartedRef.current = false;
      Audio$.stopIntro();
      return;
    }
    function tryStartIntro() {
      if (introStartedRef.current) return;
      const h = Audio$.intro({ duration: 9.0 });
      if (h) introStartedRef.current = true;
    }
    tryStartIntro();
    function gesture() { tryStartIntro(); }
    window.addEventListener("pointerdown", gesture);
    return () => window.removeEventListener("pointerdown", gesture);
  }, [audioOn]);

  useEffect(() => () => { Audio$.stopIntro(); }, []);

  const menu = [
    { id: "enter", label: "Enter Site", go: () => { Audio$.select(); onStart("main"); } },
    { id: "about", label: "About", go: () => { Audio$.select(); onStart("character"); } },
    { id: "contact", label: "Contact", go: () => { Audio$.select(); onStart("contact"); } },
    { id: "credits", label: "Credits", go: () => { Audio$.select(); onStart("credits"); } }
  ];

  return (
    <div className="m-title-screen">
      <button
        className={"m-audio m-audio-floating" + (audioOn ? " on" : "")}
        onClick={() => setAudio(a => !a)}
        aria-label="Toggle sound"
      >
        <span className="dot" />
        <Icon.Volume size={13} muted={!audioOn} />
        <span>{audioOn ? "ON" : "OFF"}</span>
      </button>

      <div className="m-title-logo">
        <div className="m-title-name">ANDREW</div>
        <div className="m-title-name">THALHEIMER</div>
        <div className="m-title-edition">— SOFTWARE ENGINEER —</div>
      </div>

      <div className="m-title-divider" />

      <div className="m-title-note">
        ◆ Best viewed on desktop ◆
      </div>

      <div className="m-title-menu">
        {menu.map(m => (
          <button key={m.id} className="m-menu-item" onClick={m.go}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="m-title-copyright">
        ANDREW THALHEIMER · © 2026 · CRAFTED IN CODE
      </div>
    </div>
  );
}
