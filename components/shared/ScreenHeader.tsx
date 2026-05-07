"use client";

import React from "react";

interface ScreenHeaderProps {
  icon: React.FC<{ size?: number }>;
  title: string;
  sub?: string;
  inset?: number;
}

export default function ScreenHeader({ icon: IconComp, title, sub, inset = 36 }: ScreenHeaderProps) {
  return (
    <div className="screen-header" style={{ padding: `24px ${inset}px 16px` }}>
      <div className="badge"><IconComp size={42}/></div>
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
    </div>
  );
}
