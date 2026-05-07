"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@/components/icons/Icon";
import { type Category, type ProjectItem, type GalleryItem, isGalleryItem } from "@/lib/data";
import { Audio$ } from "@/lib/audio";

interface MobileCategoryProps {
  category: Category;
  categories: Category[];
  onOpenItem: (item: ProjectItem | GalleryItem) => void;
  onSwitchCategory: (c: Category) => void;
}

export default function MobileCategory({ category, categories, onOpenItem, onSwitchCategory }: MobileCategoryProps) {
  const HeaderIcon = Icon[category.icon] || Icon.Scroll;
  return (
    <div>
      <div className="m-screen-header">
        <div className="badge"><HeaderIcon size={32} /></div>
        <div>
          <h1>{category.label.plain}</h1>
          <div className="sub">{category.subtitle}</div>
        </div>
      </div>

      <div className="m-tabs" role="tablist">
        {categories.map(c => {
          const Ic = Icon[c.icon] || Icon.Scroll;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={c.id === category.id}
              className={"m-tab" + (c.id === category.id ? " active" : "")}
              onClick={() => { if (c.id !== category.id) { Audio$.move(); onSwitchCategory(c); } }}
            >
              <Ic size={16} />
              <span>{c.label.plain}</span>
            </button>
          );
        })}
      </div>

      {category.items.length === 0 ? (
        <div className="m-empty">— No archives yet —</div>
      ) : (
        <div className="m-list">
          {category.items.map(it => {
            if (isGalleryItem(it)) return <GalleryRow key={it.id} item={it} onOpen={() => { Audio$.select(); onOpenItem(it); }} />;
            const ItIcon = Icon[it.icon] || Icon.Ring;
            const locked = !!it.locked;
            return (
              <button
                key={it.id}
                className="m-card"
                disabled={locked}
                style={{ opacity: locked ? 0.4 : 1 }}
                onClick={() => { if (locked) { Audio$.error(); return; } Audio$.select(); onOpenItem(it); }}
              >
                <div className="m-card-icon"><ItIcon size={26} /></div>
                <div className="m-card-body">
                  <div className="m-card-title">{it.name}</div>
                  {it.subtitle && <div className="m-card-sub">{it.subtitle}</div>}
                </div>
                {!locked && <div className="m-chevron"><Icon.Chevron dir="right" size={12} /></div>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GalleryRow({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const cover = item.images && item.images[0];
  return (
    <button className="m-gallery-row" onClick={onOpen}>
      <div className="m-gallery-cover">
        {cover && (
          <Image
            src={cover.src}
            alt={item.name}
            fill
            sizes="(max-width: 600px) 100vw, 600px"
            style={{ objectFit: "cover" }}
            draggable={false}
          />
        )}
      </div>
      <div className="m-gallery-row-meta">
        <div className="m-card-title">{item.name}</div>
        <div className="m-card-sub">× {item.count} exposures</div>
      </div>
    </button>
  );
}
