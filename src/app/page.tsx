"use client";

import React from "react";
import ScrollytellingCanvas from "@/components/ScrollytellingCanvas";
import Header from "@/components/Header";

export default function Home() {

  // Force homepage to always render in dark mode — override any saved theme preference
  React.useEffect(() => {
    const root = document.documentElement;
    const previousClass = root.classList.contains("light") ? "light" : "dark";

    // Apply dark unconditionally while on homepage
    root.classList.remove("light");
    root.classList.add("dark");

    return () => {
      // Restore the previous theme class when navigating away
      root.classList.remove("dark");
      root.classList.add(previousClass);
    };
  }, []);

  React.useEffect(() => {
    // Read query parameters to scroll to specific sections on mount
    const params = new URLSearchParams(window.location.search);
    const sectionParam = params.get("section");
    if (sectionParam !== null) {
      const sectionIndex = parseInt(sectionParam, 10);
      if (!isNaN(sectionIndex)) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("scrollToSection", { detail: sectionIndex }));
        }, 600);
      }
    }

    const openAuthParam = params.get("openAuth");
    if (openAuthParam === "true") {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openAuthModal"));
      }, 600);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] selection:bg-white/20 selection:text-white overflow-hidden">


      <Header />

      {/* Floating Vertical Branding Labels */}
      <div className="fixed left-6 bottom-12 z-35 hidden lg:block pointer-events-none select-none font-sans">
        <p className="text-[9px] tracking-[0.3em] uppercase rotate-270 origin-left translate-y-full font-light text-white/30">
          AA TRADERS DEVELOPMENTS &copy; 2026
        </p>
      </div>

      <div className="fixed right-6 bottom-12 z-35 hidden lg:block pointer-events-none select-none font-sans">
        <p className="text-[9px] tracking-[0.3em] uppercase rotate-90 origin-right translate-y-full font-light text-white/30">
          DUBAI, UAE
        </p>
      </div>

      {/* Main High-Performance Canvas Scroll Track & Content */}
      <main className="relative z-30">
        {/* Scrollytelling Hero Section */}
        <ScrollytellingCanvas />
      </main>
    </div>
  );
}
