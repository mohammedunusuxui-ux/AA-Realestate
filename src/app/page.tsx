"use client";

import React from "react";
import ScrollytellingCanvas from "@/components/ScrollytellingCanvas";

export default function Home() {

  const handleNavClick = (e: React.MouseEvent, sectionIndex: number, openInquiry = false) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("scrollToSection", { detail: sectionIndex }));
    if (openInquiry) {
      // Small delay to allow the scroll animation to transition before displaying the modal
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openInquiryModal"));
      }, 300);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030102] selection:bg-white/20 selection:text-white overflow-hidden">


      {/* Premium Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 md:px-12 md:py-8 flex items-center justify-between pointer-events-none">
        {/* Brand Logo */}
        <div className="pointer-events-auto font-sans">
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 0)}
            className="block select-none hover:opacity-80 transition-all duration-300"
          >
            <img
              src="/Logo/Logo%20AA%20Traders.png"
              alt="AA Traders Logo"
              className="h-11 md:h-12 w-auto object-contain"
            />
          </a>
        </div>

        {/* Minimalist Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 pointer-events-auto bg-[#030102]/40 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/5 font-sans">
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 1)}
            className="text-[10px] tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors"
          >
            Villas
          </a>
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 2)}
            className="text-[10px] tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors"
          >
            Apartments
          </a>
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 4)}
            className="text-[10px] tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors"
          >
            Invest
          </a>
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 6)}
            className="text-[10px] tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors"
          >
            About
          </a>
        </nav>

        {/* Action Button */}
        <div className="pointer-events-auto font-sans">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("openAuthModal"))}
            className="px-6 py-2 border border-white/20 text-white text-[10px] tracking-[0.2em] uppercase rounded-full bg-[#030102]/20 cursor-pointer btn-animate-secondary"
          >
            Login / Signup
          </button>
        </div>
      </header>

      {/* Floating Vertical Branding Labels */}
      <div className="fixed left-6 bottom-12 z-35 hidden lg:block pointer-events-none select-none font-sans">
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 rotate-270 origin-left translate-y-full font-light">
          AA TRADERS DEVELOPMENTS &copy; 2026
        </p>
      </div>

      <div className="fixed right-6 bottom-12 z-35 hidden lg:block pointer-events-none select-none font-sans">
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 rotate-90 origin-right translate-y-full font-light">
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
