"use client";

import React from "react";
import { Icon } from "@/components/icons/Icon";
import { CATEGORIES } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import type { IconName } from "@/components/icons/Icon";

interface MobileMainProps {
  onPick: (e: { kind: string; id: string }) => void;
}

export default function MobileMain({ onPick }: MobileMainProps) {
  const entries = [
    ...CATEGORIES.map(c => ({ id: c.id, label: c.label.plain, sub: c.subtitle, icon: c.icon, kind: "category" })),
    { id: "character", label: "About", sub: "The one who wrote these lines.", icon: "Human" as IconName, kind: "character" },
    { id: "contact", label: "Contact", sub: "Channels by which I may be summoned.", icon: "Mail" as IconName, kind: "contact" },
    { id: "credits", label: "Credits", sub: "Those without whom this archive would not be.", icon: "Scroll" as IconName, kind: "credits" }
  ];

  return (
    <div>
      <div className="m-screen-header">
        <div>
          <h1>Archive</h1>
          <div className="sub">Select a record to examine.</div>
        </div>
      </div>

      <div className="m-list">
        {entries.map(e => {
          const Ic = Icon[e.icon] || Icon.Scroll;
          return (
            <button
              key={e.id}
              className="m-card"
              onClick={() => { Audio$.select(); onPick(e); }}
            >
              <div className="m-card-icon"><Ic size={26} /></div>
              <div className="m-card-body">
                <div className="m-card-title">{e.label}</div>
                <div className="m-card-sub">{e.sub}</div>
              </div>
              <div className="m-chevron"><Icon.Chevron dir="right" size={12} /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
