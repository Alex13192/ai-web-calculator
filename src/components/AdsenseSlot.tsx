"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdsenseSlotProps = {
  slotId: string;
  format?: string;
  className?: string;
};

export default function AdsenseSlot({
  slotId,
  format = "auto",
  className = "",
}: AdsenseSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-nscript="adsense"]',
    );

    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.nscript = "adsense";
      document.head.appendChild(script);
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or missing publisher id should not break the calculator.
    }
  }, [clientId, slotId]);

  return (
    <aside
      className={`overflow-hidden rounded-xl border border-cyan-400/15 bg-black/40 ${className}`}
      aria-label="Sponsored Advertisement"
    >
      <p className="border-b border-cyan-400/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/70">
        Sponsored Advertisement
      </p>
      {clientId ? (
        <ins
          className="adsbygoogle block min-h-[90px] w-full"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex min-h-[90px] items-center justify-center px-4 py-6 text-center font-mono text-xs text-zinc-500">
          Ad slot {slotId} — set NEXT_PUBLIC_ADSENSE_CLIENT_ID to enable ads.
        </div>
      )}
    </aside>
  );
}
