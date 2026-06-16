"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useTheme } from "@/components/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTIES_DATA } from "@/data/properties";
import { usePreferences } from "@/components/PreferencesContext";

// ─── Icons ───────────────────────────────────────────────────────────────────
const BedIcon = ({ theme }: { theme: string }) => (
  <svg className={`w-3.5 h-3.5 shrink-0 ${theme === "light" ? "text-neutral-400" : "text-white/50"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const BathIcon = ({ theme }: { theme: string }) => (
  <svg className={`w-3.5 h-3.5 shrink-0 ${theme === "light" ? "text-neutral-400" : "text-white/50"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { formatPrice } = usePreferences();

  const [activeTab, setActiveTab] = useState<"info" | "saved" | "alerts" | "contacted">("info");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("mohammedunusuxui@gmail.com");
  const [name, setName] = useState("Mohammed");
  const [surname, setSurname] = useState("Unus");
  const [isSaved, setIsSaved] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSaved = JSON.parse(localStorage.getItem("savedProperties") || "[]");
      setSavedIds(storedSaved);

      const handleSavedChange = (e: Event) => {
        const customEvent = e as CustomEvent<number[]>;
        setSavedIds(customEvent.detail || []);
      };

      window.addEventListener("savedPropertiesChange", handleSavedChange);
      return () => {
        window.removeEventListener("savedPropertiesChange", handleSavedChange);
      };
    }
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/");
      return;
    }
    setIsLoggedIn(true);

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "saved" || tabParam === "info" || tabParam === "alerts" || tabParam === "contacted") {
      setActiveTab(tabParam as "info" | "saved" | "alerts" | "contacted");
    }

    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);

    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);

    const storedSurname = localStorage.getItem("userSurname");
    if (storedSurname) setSurname(storedSurname);
  }, [router]);

  const handleSave = () => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userSurname", surname);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.dispatchEvent(new CustomEvent("authStateChange", { detail: { isLoggedIn: false } }));
    router.push("/");
  };

  // ── Loading spinner ─────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${theme === "light" ? "bg-white" : "bg-[#0A0A0A]"}`}>
        <div className={`w-6 h-6 border-2 rounded-full animate-spin ${theme === "light" ? "border-neutral-200 border-t-neutral-800" : "border-white/30 border-t-white"}`} />
      </div>
    );
  }

  // ── Derived color tokens ────────────────────────────────────────────────────
  const isLight = theme === "light";
  const bg         = isLight ? "bg-white"                                        : "bg-[#0A0A0A]";
  const cardBg     = isLight ? "bg-white border-neutral-200"                     : "bg-[#161616]/80 border-white/8 backdrop-blur-3xl";
  const headingClr = isLight ? "text-neutral-900"                                : "text-white";
  const subClr     = isLight ? "text-neutral-500"                                : "text-white/50";
  const divider    = isLight ? "border-neutral-200"                              : "border-white/8";
  const tabActive  = isLight ? "text-neutral-900 border-neutral-900"             : "text-white border-white";
  const tabInactive = isLight ? "text-neutral-400 border-transparent hover:text-neutral-700" : "text-white/40 border-transparent hover:text-white/70";
  const inputBg    = isLight ? "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white" : "bg-[#121212]/70 border-white/10 text-white placeholder-white/20 focus:border-white/30 focus:bg-[#1a1a1a]/50";
  const inputDis   = isLight ? "bg-neutral-100 border-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-[#0d0d0d]/40 border-white/5 text-white/30 cursor-not-allowed";
  const labelClr   = isLight ? "text-neutral-500"                                : "text-white/40";

  return (
    <div className={`min-h-screen h-full ${bg} font-sans overflow-y-auto selection:bg-amber-400/20 relative transition-colors duration-300`}>
      {/* Ambient glows — only in dark mode */}
      {!isLight && (
        <>
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none z-0" />
        </>
      )}

      {/* Fixed Header */}
      <Header />

      {/* ──── Main content — padded below fixed header ──── */}
      <main className="relative z-10 w-full px-6 md:px-12 lg:px-16 pt-28 pb-16 flex flex-col gap-10 min-h-[calc(100vh-88px)] justify-start">

        {/* Page title */}
        <div className="w-full">
          <h1 className={`text-3xl md:text-5xl font-bold tracking-tight font-sans text-left ${headingClr}`}>
            My account
          </h1>
        </div>

        {/* ── Tab Nav ─────────────────────────────────────────────────────── */}
        <div className={`w-full border-b ${divider} flex gap-8 md:gap-12 text-[11px] md:text-[12px] font-bold tracking-[0.18em] uppercase overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5`}>
          {(["info", "saved", "alerts", "contacted"] as const).map((tab) => {
            const labels: Record<typeof tab, string> = {
              info: "Personal Information",
              saved: `Saved properties (${savedIds.length})`,
              alerts: "Search alerts (0)",
              contacted: "Contacted properties (0)",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 transition-all relative cursor-pointer border-b-2 ${
                  activeTab === tab ? tabActive : tabInactive
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >

            {/* Personal Information Tab */}
            {activeTab === "info" && (
              <div className={`border ${cardBg} rounded-3xl p-8 md:p-12 shadow-sm w-full relative overflow-hidden`}>
                {/* Subtle corner highlight */}
                <div className={`absolute top-0 right-0 w-72 h-72 ${isLight ? "bg-amber-50" : "bg-white/[0.02]"} rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`} />

                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                  {/* Section heading */}
                  <div>
                    <h3 className={`text-base md:text-lg font-bold tracking-[0.12em] uppercase pb-4 border-b ${divider} ${headingClr}`}>
                      Personal Information
                    </h3>
                  </div>

                  {/* Fields grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase block ${labelClr}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full border rounded-xl px-5 py-4 text-[14px] md:text-[15px] focus:outline-none transition-all font-medium ${inputBg}`}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase block ${labelClr}`}>
                        Surname
                      </label>
                      <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className={`w-full border rounded-xl px-5 py-4 text-[14px] md:text-[15px] focus:outline-none transition-all font-medium ${inputBg}`}
                        placeholder="Enter your surname"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className={`text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase block ${labelClr}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className={`w-full border rounded-xl px-5 py-4 text-[14px] md:text-[15px] font-medium select-none ${inputDis}`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`pt-6 border-t ${divider} flex flex-col items-center gap-4 max-w-md mx-auto`}>
                    <button
                      onClick={handleSave}
                      className={`w-full py-4 text-xs md:text-sm tracking-[0.25em] uppercase font-bold rounded-xl cursor-pointer shadow-md active:scale-[0.98] transition-all duration-300 text-center
                        ${isLight
                          ? "bg-neutral-900 text-white hover:bg-neutral-700"
                          : "bg-white text-black hover:bg-neutral-100 btn-animate-primary"
                        }`}
                    >
                      {isSaved ? "✓ Changes Saved" : "Save Changes"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-red-500 hover:text-red-400 hover:scale-105 active:scale-95 transition-all duration-300 py-2 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === "saved" && (
              savedIds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {PROPERTIES_DATA.filter((p) => savedIds.includes(p.id)).map((prop) => (
                    <Link
                      key={prop.id}
                      href={`/properties/${prop.id}`}
                      className={`group flex flex-col border rounded-[1.75rem] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer
                        ${isLight
                          ? "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
                          : "bg-[#1A1A1A]/60 border-white/10 hover:border-white/20 shadow-xl backdrop-blur-sm"
                        }`}
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Blur gradient overlay at bottom of image */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent z-10" />
                        <div className={`absolute top-3 right-3 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-full shadow-md z-20
                          ${isLight ? "bg-neutral-900 text-white" : "bg-white text-black"}`}
                        >
                          {prop.type === "buy" ? "For Sale" : "For Rent"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col gap-2.5 text-left">
                        <h4 className={`text-sm font-semibold tracking-tight line-clamp-1 transition-colors ${isLight ? "text-neutral-900 group-hover:text-amber-700" : "text-white/90 group-hover:text-white"}`}>
                          {prop.title}
                        </h4>
                        <p className={`text-[10px] tracking-wider uppercase font-medium ${subClr}`}>
                          {prop.location}
                        </p>
                        <div className={`flex items-center justify-between border-t pt-3.5 mt-1 ${divider}`}>
                          <span className={`text-sm font-bold ${isLight ? "text-neutral-900" : "text-white"}`}>
                            {formatPrice(prop.priceVal, prop.type as "buy" | "rent")}
                          </span>
                          <div className={`flex items-center gap-2 text-[10px] font-semibold ${isLight ? "text-neutral-500" : "text-white/60"}`}>
                            <span className="flex items-center gap-0.5"><BedIcon theme={theme} /><span>{prop.beds}</span></span>
                            <span className={isLight ? "text-neutral-200" : "opacity-30"}>|</span>
                            <span className="flex items-center gap-0.5"><BathIcon theme={theme} /><span>{prop.baths}</span></span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  theme={theme}
                  icon={
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  }
                  message="You don't have any saved properties yet."
                />
              )
            )}

            {/* Search Alerts Tab */}
            {activeTab === "alerts" && (
              <EmptyState
                theme={theme}
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                }
                message="No active search alerts."
              />
            )}

            {/* Contacted Properties Tab */}
            {activeTab === "contacted" && (
              <EmptyState
                theme={theme}
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                }
                message="No contacted properties."
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Empty state helper ───────────────────────────────────────────────────────
function EmptyState({
  theme,
  icon,
  message,
}: {
  theme: string;
  icon: React.ReactNode;
  message: string;
}) {
  const isLight = theme === "light";
  return (
    <div className={`border rounded-3xl p-16 text-center shadow-sm flex flex-col items-center justify-center gap-4 w-full relative overflow-hidden
      ${isLight
        ? "bg-neutral-50 border-neutral-200"
        : "bg-[#1A1A1A]/60 border-white/8 backdrop-blur-3xl"
      }`}
    >
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20
        ${isLight ? "bg-amber-50" : "bg-white/[0.03]"}`} />
      <div className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-inner relative z-10
        ${isLight ? "bg-neutral-100 border-neutral-200" : "bg-white/5 border-white/10"}`}
      >
        <svg className={`w-6 h-6 ${isLight ? "text-neutral-400" : "text-white/50"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon}
        </svg>
      </div>
      <p className={`text-sm font-semibold tracking-wide relative z-10 ${isLight ? "text-neutral-500" : "text-white/60"}`}>
        {message}
      </p>
    </div>
  );
}
