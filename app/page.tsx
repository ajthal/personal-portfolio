import fs from "node:fs";
import path from "node:path";
import App from "@/components/App";
import { CATEGORIES, isProjectItem, type GalleryItem } from "@/lib/data";

const IMAGE_RE = /\.(png|jpe?g|webp|gif|avif)$/i;

function listProjectImages(projectId: string): string[] {
  const dir = path.join(process.cwd(), "public", "projects", projectId);
  try {
    return fs.readdirSync(dir)
      .filter(f => IMAGE_RE.test(f) && !f.startsWith("."))
      .sort()
      .map(f => `/projects/${projectId}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

function buildProjectImages(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const cat of CATEGORIES) {
    for (const it of cat.items) {
      if (isProjectItem(it) && it.images !== undefined) {
        out[it.id] = listProjectImages(it.id);
      }
    }
  }
  return out;
}

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled";
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h % 1000) + 1;
}

type PhotoMeta = { subtitle?: unknown; flavor?: unknown };

function readPhotoMeta(dir: string): { subtitle?: string; flavor?: string } {
  try {
    const raw = fs.readFileSync(path.join(dir, "meta.json"), "utf8");
    const parsed = JSON.parse(raw) as PhotoMeta;
    return {
      subtitle: typeof parsed.subtitle === "string" ? parsed.subtitle : undefined,
      flavor: typeof parsed.flavor === "string" ? parsed.flavor : undefined,
    };
  } catch {
    return {};
  }
}

function listPhotoGalleries(): GalleryItem[] {
  const root = path.join(process.cwd(), "public", "photos");
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return [];
  }

  const galleries: GalleryItem[] = [];
  for (const ent of entries) {
    if (!ent.isDirectory() || ent.name.startsWith(".") || ent.name.startsWith("_")) continue;
    const dir = path.join(root, ent.name);
    const files = fs.readdirSync(dir)
      .filter(f => IMAGE_RE.test(f) && !f.startsWith("."))
      .sort();
    if (files.length === 0) continue;

    const images = files.map(f => `/photos/${encodeURIComponent(ent.name)}/${encodeURIComponent(f)}`);
    const meta = readPhotoMeta(dir);
    galleries.push({
      id: slugify(ent.name),
      name: ent.name,
      subtitle: meta.subtitle,
      flavor: meta.flavor,
      count: images.length,
      seed: hashSeed(ent.name),
      images,
    });
  }

  galleries.sort((a, b) => a.name.localeCompare(b.name));
  return galleries;
}

export default function Home() {
  return <App projectImages={buildProjectImages()} photoGalleries={listPhotoGalleries()} />;
}
