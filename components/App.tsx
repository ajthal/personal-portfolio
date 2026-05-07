"use client";

import React, { useState, useEffect } from "react";
import type { GalleryItem } from "@/lib/data";
import DesktopShell from "./DesktopShell";
import MobileShell from "./mobile/MobileShell";

interface AppProps {
  projectImages?: Record<string, string[]>;
  photoGalleries?: GalleryItem[];
}

const MOBILE_BREAKPOINT = 900;

export default function App(props: AppProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    function check() { setIsMobile(window.innerWidth < MOBILE_BREAKPOINT); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) {
    return <div style={{ position: "fixed", inset: 0, background: "#050403" }} />;
  }

  return isMobile ? <MobileShell {...props} /> : <DesktopShell {...props} />;
}
