import fs from "node:fs";
import path from "node:path";
import App from "@/components/App";
import { CATEGORIES, isProjectItem, type GalleryImage, type GalleryItem } from "@/lib/data";

const IMAGE_RE = /\.(png|jpe?g|webp|gif|avif)$/i;

function readImageDim(filePath: string): { width: number; height: number } | null {
  try {
    const fd = fs.openSync(filePath, "r");
    const head = Buffer.alloc(24);
    fs.readSync(fd, head, 0, 24, 0);

    if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) {
      fs.closeSync(fd);
      return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
    }

    if (head[0] === 0xff && head[1] === 0xd8) {
      const fileSize = fs.fstatSync(fd).size;
      const buf = Buffer.alloc(Math.min(fileSize, 256 * 1024));
      fs.readSync(fd, buf, 0, buf.length, 0);
      fs.closeSync(fd);
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        while (i < buf.length && buf[i] === 0xff) i++;
        const marker = buf[i];
        if (marker === 0x00 || marker === 0xd8 || marker === 0xd9) { i++; continue; }
        if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) ||
            (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
          return { height: buf.readUInt16BE(i + 4), width: buf.readUInt16BE(i + 6) };
        }
        const segLen = buf.readUInt16BE(i + 1);
        i += 1 + segLen;
      }
      return null;
    }

    fs.closeSync(fd);
    return null;
  } catch {
    return null;
  }
}

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

    const images: GalleryImage[] = files.flatMap(f => {
      const dim = readImageDim(path.join(dir, f));
      if (!dim) return [];
      return [{
        src: `/photos/${encodeURIComponent(ent.name)}/${encodeURIComponent(f)}`,
        width: dim.width,
        height: dim.height,
      }];
    });
    if (images.length === 0) continue;
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
