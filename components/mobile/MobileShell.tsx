"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CATEGORIES, type ProjectItem, type GalleryItem, type Category } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import MobileTopBar from "./MobileTopBar";
import MobileTitle from "./MobileTitle";
import MobileMain from "./MobileMain";
import MobileCategory from "./MobileCategory";
import MobileProject from "./MobileProject";
import MobileGallery from "./MobileGallery";
import MobileCharacter from "./MobileCharacter";
import MobileContact from "./MobileContact";
import MobileCredits from "./MobileCredits";

type View =
  | { name: "title" }
  | { name: "main" }
  | { name: "category"; categoryId: string }
  | { name: "item"; categoryId: string; itemId: string }
  | { name: "gallery"; categoryId: string; itemId: string }
  | { name: "character" }
  | { name: "contact" }
  | { name: "keys" }
  | { name: "credits" };

function isValidView(saved: View, categories: Category[]): boolean {
  const valid = ["title", "main", "character", "contact", "keys", "credits", "category", "item", "gallery"];
  if (!saved || typeof saved.name !== "string") return false;
  if (!valid.includes(saved.name)) return false;
  if (saved.name === "category" || saved.name === "item" || saved.name === "gallery") {
    const cat = categories.find(c => c.id === (saved as { categoryId: string }).categoryId);
    if (!cat) return false;
    if ((saved.name === "item" || saved.name === "gallery") && !cat.items.find(i => i.id === (saved as { itemId: string }).itemId)) {
      return false;
    }
  }
  return true;
}

interface MobileShellProps {
  projectImages?: Record<string, string[]>;
  photoGalleries?: GalleryItem[];
}

export default function MobileShell({ projectImages = {}, photoGalleries = [] }: MobileShellProps) {
  const categories = useMemo<Category[]>(
    () => CATEGORIES.map(c => c.id === "photo" ? { ...c, items: photoGalleries } : c),
    [photoGalleries]
  );
  const [view, setView] = useState<View>({ name: "title" });
  const [audio, setAudio] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dfp_view") || "null") as View | null;
      if (saved && isValidView(saved, categories)) {
        if (saved.name === "keys") setView({ name: "main" });
        else setView(saved);
      }
    } catch {}
    setAudio(localStorage.getItem("dfp_audio") === "1");
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("dfp_view", JSON.stringify(view));
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    localStorage.setItem("dfp_audio", audio ? "1" : "0");
    if (audio) Audio$.enable();
    else Audio$.disable();
  }, [audio]);

  function go(v: View) { setView(v); }
  function back() {
    if (view.name === "title") return;
    if (view.name === "main") return go({ name: "title" });
    if (view.name === "category") return go({ name: "main" });
    if (view.name === "item" || view.name === "gallery") return go({ name: "category", categoryId: (view as { categoryId: string }).categoryId });
    go({ name: "main" });
  }

  let screen = null;
  if (view.name === "title") {
    screen = <MobileTitle audioOn={audio} setAudio={setAudio} onStart={(where) => {
      if (where === "main") go({ name: "main" });
      else if (where === "character") go({ name: "character" });
      else if (where === "contact") go({ name: "contact" });
      else if (where === "credits") go({ name: "credits" });
    }}/>;
  } else if (view.name === "main") {
    screen = <MobileMain onPick={(e) => {
      if (e.kind === "category") go({ name: "category", categoryId: e.id });
      else if (e.kind === "character") go({ name: "character" });
      else if (e.kind === "contact") go({ name: "contact" });
      else if (e.kind === "credits") go({ name: "credits" });
    }}/>;
  } else if (view.name === "category") {
    const cat = categories.find(c => c.id === view.categoryId) || categories[0];
    screen = <MobileCategory category={cat} categories={categories}
      onSwitchCategory={(c) => go({ name: "category", categoryId: c.id })}
      onOpenItem={(it) => {
        if (cat.layout === "gallery") go({ name: "gallery", categoryId: cat.id, itemId: it.id });
        else go({ name: "item", categoryId: cat.id, itemId: it.id });
      }}/>;
  } else if (view.name === "item") {
    const cat = categories.find(c => c.id === view.categoryId);
    const item = cat?.items.find(i => i.id === view.itemId) as ProjectItem | undefined;
    if (item) screen = <MobileProject item={item} screenshots={projectImages[item.id] || []} />;
  } else if (view.name === "gallery") {
    const cat = categories.find(c => c.id === view.categoryId);
    const item = cat?.items.find(i => i.id === view.itemId) as GalleryItem | undefined;
    if (item) screen = <MobileGallery item={item} />;
  } else if (view.name === "character") {
    screen = <MobileCharacter />;
  } else if (view.name === "contact") {
    screen = <MobileContact />;
  } else if (view.name === "credits") {
    screen = <MobileCredits />;
  }

  const viewKey = view.name + ("categoryId" in view ? view.categoryId : "") + ("itemId" in view ? view.itemId : "");

  return (
    <div className="m-shell">
      <div className="m-bg" aria-hidden />
      {view.name !== "title" && (
        <MobileTopBar
          onBack={() => { Audio$.back(); back(); }}
          audio={audio}
          setAudio={setAudio}
        />
      )}
      <div key={viewKey} className={"m-content" + (view.name === "title" ? " title" : "")}>
        {screen}
      </div>
    </div>
  );
}
