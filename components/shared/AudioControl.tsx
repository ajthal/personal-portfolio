"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/icons/Icon";
import { Audio$ } from "@/lib/audio";

interface AudioControlProps {
  audio: boolean;
  setAudio: React.Dispatch<React.SetStateAction<boolean>>;
  volume: number;
  setVolume: (v: number) => void;
  floating?: boolean;
}

export default function AudioControl({ audio, setAudio, volume, setVolume, floating }: AudioControlProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!audio) setOpen(false); }, [audio]);

  return (
    <div className={"audio-control" + (floating ? " floating" : "")}>
      <div
        className={"audio-toggle" + (audio ? " on" : "")}
        onClick={() => setAudio(a => !a)}
        title="Toggle sound (M)"
      >
        <span className="dot"/>
        <Icon.Volume size={14} muted={!audio}/>
        <span>{audio ? "SOUND ON" : "SOUND OFF"}</span>
      </div>

      {audio && (
        <div
          className={"vol-wrap" + (open ? " open" : "")}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            className="vol-btn"
            onClick={() => setOpen(o => !o)}
            title="Volume"
          >
            <span className="vol-icn">◆</span>
            <span className="vol-label">VOL {Math.round(volume * 100)}</span>
          </button>
          <div className="vol-slider-wrap">
            <input
              className="vol-slider"
              type="range"
              min="0" max="100" step="1"
              value={Math.round(volume * 100)}
              style={{ "--vp": `${Math.round(volume * 100)}%` } as React.CSSProperties}
              onChange={(e) => setVolume(parseInt(e.target.value, 10) / 100)}
              onMouseUp={() => Audio$.preview()}
              onKeyUp={() => Audio$.preview()}
              aria-label="Volume"
            />
            <div className="vol-ticks">
              {[0, 25, 50, 75, 100].map(n => <span key={n} style={{ left: `${n}%` }}/>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
