"use client";

import React from "react";
import { Icon } from "@/components/icons/Icon";

interface MobileTopBarProps {
  onBack: () => void;
  audio: boolean;
  setAudio: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileTopBar({ onBack, audio, setAudio }: MobileTopBarProps) {
  return (
    <div className="m-topbar">
      <button className="m-back" onClick={onBack} aria-label="Back">
        <Icon.Chevron dir="left" size={11} />
        <span>BACK</span>
      </button>
      <button
        className={"m-audio" + (audio ? " on" : "")}
        onClick={() => setAudio(a => !a)}
        aria-label="Toggle sound"
      >
        <span className="dot" />
        <Icon.Volume size={13} muted={!audio} />
        <span>{audio ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}
