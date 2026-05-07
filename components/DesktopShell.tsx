"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Icon } from "@/components/icons/Icon";
import { CATEGORIES, type ProjectItem, type GalleryItem, type Category } from "@/lib/data";
import { Audio$ } from "@/lib/audio";
import AudioControl from "@/components/shared/AudioControl";
import TitleScreen from "@/components/screens/TitleScreen";
import MainMenu from "@/components/screens/MainMenu";
import CategoryScreen from "@/components/screens/CategoryScreen";
import ProjectDetail from "@/components/screens/ProjectDetail";
import PhotoGallery from "@/components/screens/PhotoGallery";
import CharacterScreen from "@/components/screens/CharacterScreen";
import ContactScreen from "@/components/screens/ContactScreen";
import KeysScreen from "@/components/screens/KeysScreen";
import CreditsScreen from "@/components/screens/CreditsScreen";

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

interface DesktopShellProps {
  projectImages?: Record<string, string[]>;
  photoGalleries?: GalleryItem[];
}

export default function DesktopShell({ projectImages = {}, photoGalleries = [] }: DesktopShellProps) {
  const categories = useMemo<Category[]>(
    () => CATEGORIES.map(c => c.id === "photo" ? { ...c, items: photoGalleries } : c),
    [photoGalleries]
  );
  const [view, setView] = useState<View>({ name: "title" });
  const [audio, setAudio] = useState(false);
  const [volume, setVolumeState] = useState(0.7);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dfp_view") || "null") as View | null;
      if (saved && isValidView(saved, categories)) setView(saved);
    } catch {}

    setAudio(localStorage.getItem("dfp_audio") === "1");
    setVolumeState(Audio$.getVolume());
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("dfp_view", JSON.stringify(view));
  }, [view]);

  useEffect(() => {
    localStorage.setItem("dfp_audio", audio ? "1" : "0");
    if (audio) {
      Audio$.enable();
      Audio$.setVolume(volume);
    } else {
      Audio$.disable();
    }
  }, [audio]);

  function setVolume(v: number) {
    setVolumeState(v);
    Audio$.setVolume(v);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "m" || e.key === "M") setAudio(a => !a);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function fit() {
      if (!stageRef.current) return;
      const s = Math.min(window.innerWidth/1600, window.innerHeight/900);
      stageRef.current.style.transform = `scale(${s})`;
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function go(v: View) { setView(v); }
  function back() {
    if (view.name === "title") return;
    if (view.name === "main") return go({ name: "title" });
    if (view.name === "category") return go({ name: "main" });
    if (view.name === "item" || view.name === "gallery") return go({ name: "category", categoryId: (view as { categoryId: string }).categoryId });
    go({ name: "main" });
  }

  const LABEL_MODE = "plain";

  let screen = null;
  if (view.name === "title") {
    screen = <TitleScreen
      labelMode={LABEL_MODE}
      audioOn={audio}
      onStart={(where) => {
        if (where === "main") go({ name: "main" });
        else if (where === "character") go({ name: "character" });
        else if (where === "contact") go({ name: "contact" });
        else if (where === "credits") go({ name: "credits" });
      }}
    />;
  } else if (view.name === "main") {
    screen = <MainMenu
      labelMode={LABEL_MODE}
      onBack={() => go({ name: "title" })}
      onPick={(e) => {
        if (e.kind === "category") go({ name: "category", categoryId: e.id });
        else if (e.kind === "character") go({ name: "character" });
        else if (e.kind === "contact") go({ name: "contact" });
        else if (e.kind === "keys") go({ name: "keys" });
      }}
    />;
  } else if (view.name === "category") {
    const cat = categories.find(c => c.id === view.categoryId) || categories[0];
    screen = <CategoryScreen
      category={cat}
      categories={categories}
      labelMode={LABEL_MODE}
      onBack={() => go({ name: "main" })}
      onSwitchCategory={(c) => go({ name: "category", categoryId: c.id })}
      onOpenItem={(it) => {
        if (cat.layout === "gallery") go({ name: "gallery", categoryId: cat.id, itemId: it.id });
        else go({ name: "item", categoryId: cat.id, itemId: it.id });
      }}
    />;
  } else if (view.name === "item") {
    const cat = categories.find(c => c.id === view.categoryId);
    const item = cat?.items.find(i => i.id === view.itemId) as ProjectItem | undefined;
    if (item) screen = <ProjectDetail item={item} screenshots={projectImages[item.id] || []} onBack={() => go({ name: "category", categoryId: view.categoryId })} />;
  } else if (view.name === "gallery") {
    const cat = categories.find(c => c.id === view.categoryId);
    const item = cat?.items.find(i => i.id === view.itemId) as GalleryItem | undefined;
    if (item) screen = <PhotoGallery item={item} onBack={() => go({ name: "category", categoryId: view.categoryId })} />;
  } else if (view.name === "character") {
    screen = <CharacterScreen onBack={() => go({ name: "main" })} />;
  } else if (view.name === "contact") {
    screen = <ContactScreen onBack={() => go({ name: "main" })} />;
  } else if (view.name === "keys") {
    screen = <KeysScreen onBack={() => go({ name: "main" })} />;
  } else if (view.name === "credits") {
    screen = <CreditsScreen onBack={() => go({ name: "title" })} />;
  }

  const viewKey = view.name + ("categoryId" in view ? view.categoryId : "") + ("itemId" in view ? view.itemId : "");

  return (
    <div id="root">
      <div
        ref={stageRef}
        className="stage"
        data-mood="amber"
        data-font="cinzel"
        data-fx="full"
      >
        <div className="bg-smoke"/>
        <div className="bg-embers">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="ember" style={{
              left: (i*5.3 + 3) % 100 + "%",
              "--dur": (8 + (i*1.1 % 9)) + "s",
              "--delay": (-i*0.7) + "s",
              "--drift": ((i%2===0?1:-1) * (20 + i*3)) + "px"
            } as React.CSSProperties}/>
          ))}
        </div>
        <div className="bg-vignette"/>

        {view.name !== "title" && (
          <div className="top-chrome">
            <div
              className="back-button"
              onClick={() => { Audio$.back(); back(); }}
              title="Back (Esc)"
            >
              <Icon.Chevron dir="left" size={12}/>
              <span>BACK</span>
            </div>
            <AudioControl audio={audio} setAudio={setAudio} volume={volume} setVolume={setVolume} />
          </div>
        )}

        {view.name === "title" && (
          <AudioControl audio={audio} setAudio={setAudio} volume={volume} setVolume={setVolume} floating />
        )}

        <div
          key={viewKey}
          className={view.name === "title" ? "content-area title" : "content-area"}
          style={{ animation: "screen-in .35s ease" }}
        >
          {screen}
        </div>

        <div className="fx-scanlines"/>
        <div className="fx-grain"/>
        <div className="fx-flicker"/>
      </div>
    </div>
  );
}
