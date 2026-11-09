"use client";

import { useState } from "react";

export function CopyLinkButton({ label, done }: { label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* ignore */
        }
      }}
      className="w-full rounded-full border border-rule px-4 py-2.5 text-sm text-ink-2 hover:bg-paper-2"
    >
      {copied ? done : label}
    </button>
  );
}
