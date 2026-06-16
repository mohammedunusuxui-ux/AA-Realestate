"use client";

import React from "react";

interface DeveloperLogoProps {
  developer: string;
  theme?: string;
}

export default function DeveloperLogo({ developer, theme }: DeveloperLogoProps) {
  const isLight = theme === "light";
  const colorClass = isLight ? "text-neutral-900 fill-neutral-900" : "text-white fill-white";

  switch (developer.toLowerCase()) {
    case "emaar":
      return (
        <div className="flex items-center select-none">
          <span
            className={`text-[11px] font-extrabold uppercase ${isLight ? "text-neutral-900" : "text-white"}`}
            style={{
              fontFamily: "'Times New Roman', Times, 'Didot', Georgia, serif",
              letterSpacing: "0.26em",
            }}
          >
            EMAAR
          </span>
        </div>
      );
    case "nakheel":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5-5 5-13 0-18-5 5-5 13 0 18z" />
            <path strokeLinecap="round" d="M12 8c2.5.5 4.5 2 5 4.5M12 8c-2.5.5-4.5 2-5 4.5M12 13c1.5.5 3 1.5 3.5 3M12 13c-1.5.5-3 1.5-3.5 3" />
          </svg>
          <span className={`text-[9px] font-sans tracking-[0.16em] font-black uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>Nakheel</span>
        </div>
      );
    case "damac":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 12h10" />
          </svg>
          <span className={`text-[9.5px] font-sans tracking-[0.25em] font-black uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>Damac</span>
        </div>
      );
    case "sobha realty":
    case "meydan sobha":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="10" cy="12" r="5" />
            <circle cx="14" cy="12" r="5" />
          </svg>
          <span className={`text-[9.5px] font-serif tracking-[0.18em] font-extrabold uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>Sobha</span>
        </div>
      );
    case "omniyat":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          <span className={`text-[9.5px] font-mono tracking-[0.2em] font-extrabold uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>Omniyat</span>
        </div>
      );
    case "meraas":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M5 8h8M5 12h14M5 16h5" />
          </svg>
          <span className={`text-[11px] font-sans tracking-[0.06em] font-black uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>
            Meraas
          </span>
        </div>
      );
    case "select group":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className={`text-[9px] font-sans tracking-[0.12em] font-extrabold uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>Select Group</span>
        </div>
      );
    case "al barari":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M12 3v18M12 3a9 9 0 00-9 9h9M12 21a9 9 0 009-9h-9" />
          </svg>
          <span className={`text-[9.5px] font-serif tracking-[0.2em] font-semibold uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>Al Barari</span>
        </div>
      );
    case "majid al futtaim":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <span className={`text-[9.5px] font-sans tracking-[0.22em] font-black uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>MAF</span>
        </div>
      );
    case "dubai properties":
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="4" y="4" width="6" height="6" />
            <rect x="14" y="4" width="6" height="6" />
            <rect x="4" y="14" width="6" height="6" />
            <rect x="14" y="14" width="6" height="6" />
          </svg>
          <span className={`text-[9px] font-sans tracking-[0.18em] font-bold uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>Dubai Prop</span>
        </div>
      );
    case "ahs properties":
    case "ahs":
      return (
        <div className="flex items-center justify-center select-none w-10 h-10">
          <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="12" stroke="currentColor" strokeWidth="4" />
            <path d="M35 65 V35 L50 50 L65 35 V65" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="28" r="4" fill="currentColor" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 select-none">
          <svg className={`w-3.5 h-3.5 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className={`text-[9px] font-sans tracking-widest font-bold uppercase ${isLight ? "text-neutral-900" : "text-white"}`}>{developer}</span>
        </div>
      );
  }
}
