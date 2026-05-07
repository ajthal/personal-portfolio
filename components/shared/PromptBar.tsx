"use client";

import React from "react";

interface Hint {
  key: string;
  label: string;
}

export default function PromptBar({ hints }: { hints: Hint[] }) {
  return (
    <div className="prompt-bar">
      {hints.map((h, i) => (
        <span className="ph" key={i}>
          <span className="kbd">{h.key}</span>
          <span>{h.label}</span>
        </span>
      ))}
    </div>
  );
}
