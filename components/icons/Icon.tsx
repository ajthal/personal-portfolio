"use client";

import React from "react";

export type IconName =
  | "Sword" | "Camera" | "Palette" | "Gem" | "Scroll" | "Tome"
  | "Flame" | "Key" | "Shield" | "Helm" | "Ring" | "Diamond"
  | "Pen" | "Mail" | "Human" | "Volume" | "Chevron";

interface IconProps {
  size?: number;
}

interface ChevronProps extends IconProps {
  dir?: "right" | "left" | "up" | "down";
}

interface VolumeProps extends IconProps {
  muted?: boolean;
}

const CornerTL = ({ size = 100, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" fill="none" stroke={color} strokeWidth="1.1" opacity="0.85">
    <path d="M0 22 L0 0 L22 0" />
    <path d="M14 14 Q 28 22, 38 30" opacity="0.7"/>
    <circle cx="38" cy="30" r="1.4" fill={color} opacity="0.85"/>
    <path d="M14 14 Q 22 28, 30 38" opacity="0.7"/>
    <circle cx="30" cy="38" r="1.4" fill={color} opacity="0.85"/>
    <circle cx="14" cy="14" r="1.1" fill={color} opacity="0.6"/>
  </svg>
);

export const FrameOrnaments = () => (
  <div className="frame-ornaments">
    <CornerTL />
    <span className="c-tr"><CornerTL /></span>
    <span className="c-bl"><CornerTL /></span>
    <span className="c-br"><CornerTL /></span>
    <style>{`
      .frame-ornaments > svg { position: absolute; top: -1px; left: -1px; }
      .frame-ornaments .c-tr svg, .frame-ornaments .c-bl svg, .frame-ornaments .c-br svg { position: absolute; top: -1px; left: -1px; }
      .frame-ornaments .c-tr { position: absolute; top: 0; right: 0; width: 100px; height: 100px; transform: scaleX(-1); }
      .frame-ornaments .c-bl { position: absolute; bottom: 0; left: 0; width: 100px; height: 100px; transform: scaleY(-1); }
      .frame-ornaments .c-br { position: absolute; bottom: 0; right: 0; width: 100px; height: 100px; transform: scale(-1,-1); }
    `}</style>
  </div>
);

const Flame = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 C 10 6, 6 8, 6 13 a6 6 0 0 0 12 0 c 0 -3 -2 -5 -3 -8 c -1 3 -3 3 -3 0 z M 12 12 C 11 14, 9 15, 9 17 a3 3 0 0 0 6 0 c 0 -2 -2 -2 -3 -5 z" opacity=".9"/>
  </svg>
);

const Sword = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M14 3 L21 3 L21 10 L10 21 L7 21 L3 17 L3 14 Z"/>
    <path d="M8 16 L12 20"/>
  </svg>
);

const Shield = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M12 2 L20 5 L20 12 Q 20 19, 12 22 Q 4 19, 4 12 L4 5 Z"/>
    <path d="M12 7 L12 16" opacity=".6"/>
  </svg>
);

const Scroll = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 4 h 12 a 3 3 0 0 1 3 3 v 11 a 2 2 0 0 1 -2 2 H 7 a 2 2 0 0 1 -2 -2 V 6 a 2 2 0 0 1 2 -2 z"/>
    <path d="M20 7 H 10" opacity=".6"/>
    <path d="M7 10 L 14 10" opacity=".6"/>
    <path d="M7 14 L 14 14" opacity=".6"/>
    <path d="M7 18 L 12 18" opacity=".6"/>
  </svg>
);

const Helm = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 13 Q 4 6, 12 4 Q 20 6, 20 13 L 20 17 L 4 17 Z"/>
    <path d="M9 12 L 9 16 M 12 12 L 12 16 M 15 12 L 15 16" opacity=".6"/>
  </svg>
);

const Ring = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="14" r="7"/>
    <path d="M9 7 L 12 3 L 15 7" />
  </svg>
);

const Gem = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M6 9 L 12 3 L 18 9 L 12 21 Z"/>
    <path d="M6 9 L 18 9 M 9 9 L 12 3 M 15 9 L 12 3 M 9 9 L 12 21 M 15 9 L 12 21" opacity=".5"/>
  </svg>
);

const Key = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="8" cy="10" r="4"/>
    <path d="M12 10 L 22 10 L 22 13 M 18 10 L 18 14"/>
  </svg>
);

const Tome = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 4 H 12 Q 13 6, 12 7 H 4 Z M 20 4 H 12 Q 11 6, 12 7 H 20 Z"/>
    <path d="M4 4 V 20 H 12 V 7 M 20 4 V 20 H 12" />
    <path d="M7 10 H 10 M 14 10 H 17 M 7 13 H 10 M 14 13 H 17 M 7 16 H 10 M 14 16 H 17" opacity=".5"/>
  </svg>
);

const Camera = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M3 7 H 7 L 9 5 H 15 L 17 7 H 21 V 19 H 3 Z"/>
    <circle cx="12" cy="13" r="4"/>
    <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
  </svg>
);

const Palette = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M12 3 a 9 9 0 0 0 0 18 c 2 0 2 -2 1 -3 c -1 -1 0 -3 2 -3 h 3 a 4 4 0 0 0 4 -4 a 8 8 0 0 0 -10 -8 z"/>
    <circle cx="7" cy="10" r="1.2" fill="currentColor"/>
    <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
    <circle cx="16" cy="8" r="1.2" fill="currentColor"/>
  </svg>
);

const Mail = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="3" y="5" width="18" height="14"/>
    <path d="M3 6 L 12 13 L 21 6"/>
  </svg>
);

const Human = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="7" r="3.5"/>
    <path d="M5 21 Q 5 14, 12 14 Q 19 14, 19 21"/>
  </svg>
);

const Chevron = ({ size = 14, dir = "right" }: ChevronProps) => {
  const rotation = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M9 6 L 15 12 L 9 18" strokeLinecap="round"/>
    </svg>
  );
};

const Diamond = ({ size = 12 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 0 L 12 6 L 6 12 L 0 6 Z"/>
  </svg>
);

const Volume = ({ size = 16, muted = false }: VolumeProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 10 V 14 H 6 L 11 18 V 6 L 6 10 Z" fill="currentColor"/>
    {!muted && <>
      <path d="M14 9 Q 16 12, 14 15" opacity=".7"/>
      <path d="M17 7 Q 20 12, 17 17" opacity=".5"/>
    </>}
    {muted && <path d="M15 9 L 21 15 M 21 9 L 15 15" strokeLinecap="round"/>}
  </svg>
);

const Pen = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 20 L 16 8 L 20 12 L 8 24" transform="translate(0 -4)"/>
    <path d="M14 6 L 18 10"/>
  </svg>
);

export const Icon: Record<IconName, React.FC<IconProps & ChevronProps & VolumeProps>> = {
  Flame,
  Sword,
  Shield,
  Scroll,
  Helm,
  Ring,
  Gem,
  Key,
  Tome,
  Camera,
  Palette,
  Mail,
  Human,
  Chevron,
  Diamond,
  Volume,
  Pen,
};

export function getIcon(name: IconName): React.FC<IconProps> {
  return Icon[name] || Icon.Flame;
}
