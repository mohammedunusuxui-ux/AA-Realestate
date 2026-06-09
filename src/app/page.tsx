"use client";

import React from "react";
import ScrollytellingCanvas from "@/components/ScrollytellingCanvas";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Home() {

  const [scrolled, setScrolled] = React.useState(false);
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = React.useState(false);
  const [isRentDropdownOpen, setIsRentDropdownOpen] = React.useState(false);
  const [isNewProjectsDropdownOpen, setIsNewProjectsDropdownOpen] = React.useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = React.useState(false);
  const [isMortgageDropdownOpen, setIsMortgageDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  React.useEffect(() => {
    // Check initial login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setUserEmail(localStorage.getItem("userEmail") || "");

    const handleScrollChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setScrolled(customEvent.detail);
    };

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isLoggedIn: boolean }>;
      setIsLoggedIn(customEvent.detail.isLoggedIn);
      setUserEmail(localStorage.getItem("userEmail") || "");
    };

    window.addEventListener("headerScrollChange", handleScrollChange);
    window.addEventListener("authStateChange", handleAuthChange);

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

    return () => {
      window.removeEventListener("headerScrollChange", handleScrollChange);
      window.removeEventListener("authStateChange", handleAuthChange);
    };
  }, []);

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
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex items-center justify-between pointer-events-none ${
        scrolled 
          ? "bg-[#030102]/65 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12" 
          : "bg-transparent py-6 md:py-8 px-6 md:px-12"
      }`}>
        {/* Brand Logo */}
        <div className="pointer-events-auto font-sans">
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 0)}
            className="block select-none hover:opacity-80 transition-all duration-300"
          >
            <img
              src="/Logo/AA Real Estate.png"
              alt="AA Traders Logo"
              className="h-11 md:h-12 w-auto object-contain"
            />
          </a>
        </div>

        {/* Minimalist Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-14 pointer-events-auto bg-[#171717]/90 backdrop-blur-md px-12 py-4 rounded-full border border-white/10 shadow-sm font-sans">
          <div
            className="flex items-center"
            onMouseEnter={() => setIsBuyDropdownOpen(true)}
            onMouseLeave={() => setIsBuyDropdownOpen(false)}
          >
            <a
              href="#"
              onClick={(e) => handleNavClick(e, 1)}
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isBuyDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Buy
            </a>

            <AnimatePresence>
              {isBuyDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50 pointer-events-auto"
                >
                  <div className="bg-[#030102]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-4 gap-10">
                      {/* Column 1: Residential Properties for Sale */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Residential Properties
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/properties?type=buy&category=apartments" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Apartments for Sale</Link>
                          <Link href="/properties?type=buy&category=villas" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Villas for Sale</Link>
                          <Link href="/properties?type=buy&category=townhouses" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Townhouses for Sale</Link>
                          <Link href="/properties?type=buy&category=penthouses" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Penthouses for Sale</Link>
                          <Link href="/properties?type=buy&category=plots" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Land / Plots for Sale</Link>
                        </div>
                      </div>

                      {/* Column 2: Buyer Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Buyer Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Mortgage Calculator</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Property Valuation</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sold House Prices</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sale Price Map</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Investment ROI Calculator</a>
                        </div>
                      </div>

                      {/* Column 3: Buying Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Buying Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Buyer's Guide</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Area Insights</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Community Guides</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tower & Compound Guides</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Schools & University Guides</a>
                        </div>
                      </div>

                      {/* Column 4: Premium Mortgage Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1024] to-[#040206] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
                          {/* Icon */}
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h5 className="text-[14px] md:text-[15px] font-bold tracking-tight text-white leading-snug">
                            Get the right mortgage for you
                          </h5>
                          <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed font-light">
                            Find competitive UAE mortgage rates and estimate your monthly payment.
                          </p>
                        </div>

                        <button className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Calculate Mortgage
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Buy Residential
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Buy Commercial
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Find an Agent
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Off-plan Projects
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="flex items-center"
            onMouseEnter={() => setIsRentDropdownOpen(true)}
            onMouseLeave={() => setIsRentDropdownOpen(false)}
          >
            <a
              href="#"
              onClick={(e) => handleNavClick(e, 2)}
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isRentDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Rent
            </a>

            <AnimatePresence>
              {isRentDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50 pointer-events-auto"
                >
                  <div className="bg-[#030102]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-4 gap-10">
                      {/* Column 1: Residential Properties for Rent */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Residential Properties
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/properties?type=rent&category=apartments" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Apartments for Rent</Link>
                          <Link href="/properties?type=rent&category=studios" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Studios for Rent</Link>
                          <Link href="/properties?type=rent&category=villas" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Villas for Rent</Link>
                          <Link href="/properties?type=rent&category=townhouses" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Townhouses for Rent</Link>
                          <Link href="/properties?type=rent&category=penthouses" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Penthouses for Rent</Link>
                        </div>
                      </div>

                      {/* Column 2: Renter Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Renter Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rent vs Buy Calculator</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rented House Prices</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Price Map</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Budget Calculator</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tenant Rights Guide</a>
                        </div>
                      </div>

                      {/* Column 3: Renting Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Renting Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Renter's Guide</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Area Insights</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Community Guides</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tower & Compound Guides</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Schools & University Guides</a>
                        </div>
                      </div>

                      {/* Column 4: Premium Renting Guide Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#101b2b] to-[#02050a] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
                          {/* Icon */}
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <h5 className="text-[14px] md:text-[15px] font-bold tracking-tight text-white leading-snug">
                            Your Renting in Dubai Guide
                          </h5>
                          <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed font-light">
                            Having a renting in Dubai Guide is your optimum way to keep things organized.
                          </p>
                        </div>

                        <button className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Read Article
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Rent Residential
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Rent Commercial
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Find an Agent
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        Short-Term Rentals
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className="flex items-center"
            onMouseEnter={() => setIsNewProjectsDropdownOpen(true)}
            onMouseLeave={() => setIsNewProjectsDropdownOpen(false)}
          >
            <a
              href="#"
              onClick={(e) => handleNavClick(e, 4)}
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isNewProjectsDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              New Projects
            </a>

            <AnimatePresence>
              {isNewProjectsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50 pointer-events-auto"
                >
                  <div className="bg-[#030102]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-4 gap-10">
                      {/* Column 1: All New Projects */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          All New Projects
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Dubai</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Abu Dhabi</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Sharjah</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Ras Al Khaimah</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Umm Al Quwain</a>
                        </div>
                      </div>

                      {/* Column 2: Find Developers in the UAE */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Find Developers
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Emaar Properties</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Azizi Developments</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Aldar Properties</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Damac Properties</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sobha Realty</a>
                        </div>
                      </div>

                      {/* Column 3: Investing Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Investing Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Investor's Guide</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Areas to Invest</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Latest Projects</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Off-Plan Market Reports</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Golden Visa Guidelines</a>
                        </div>
                      </div>

                      {/* Column 4: Premium Discover Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#260e1d] to-[#040103] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
                          {/* Icon */}
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <h5 className="text-[14px] md:text-[15px] font-bold tracking-tight text-white leading-snug">
                            Discover New Projects
                          </h5>
                          <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed font-light">
                            New Off-Plan Projects in UAE
                          </p>
                        </div>

                        <button className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          All New Projects
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Find Developers
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Off-plan Properties
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                          </svg>
                        </span>
                        Market Trends
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </span>
                        Off-Plan Guides
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className="flex items-center"
            onMouseEnter={() => setIsToolsDropdownOpen(true)}
            onMouseLeave={() => setIsToolsDropdownOpen(false)}
          >
            <a
              href="#"
              onClick={(e) => handleNavClick(e, 6)}
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isToolsDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Tools & insights
            </a>

            <AnimatePresence>
              {isToolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50 pointer-events-auto"
                >
                  <div className="bg-[#030102]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-4 gap-10">
                      {/* Column 1: Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Mortgage Calculator</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rent vs Buy Calculator</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Transactions</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sale Transactions</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Investment ROI Tracker</a>
                        </div>
                      </div>

                      {/* Column 2: Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Market Reports</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Renter Guides</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Buyer Guides</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Popular Communities</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Budget-Friendly Areas</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Property Blog</a>
                        </div>
                      </div>

                      {/* Column 3: Area Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Area Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Dubai</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Abu Dhabi</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sharjah</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Ajman</a>
                          <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Ras Al Khaimah</a>
                        </div>
                      </div>

                      {/* Column 4: Premium Blog Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1a2e] to-[#020509] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
                          {/* Icon */}
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2H9z" />
                            </svg>
                          </div>
                          <h5 className="text-[14px] md:text-[15px] font-bold tracking-tight text-white leading-snug">
                            Your Renting in Dubai Guide
                          </h5>
                          <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed font-light">
                            Whether you're buying, renting, or exploring off-plan, every confident decision starts here.
                          </p>
                        </div>

                        <button className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Explore Blog
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </span>
                        Mortgage Calculator
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                          </svg>
                        </span>
                        Rent Vs Buy Calculator
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </span>
                        Area Insights
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Popular Communities
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 6)}
            className="text-[12px] tracking-[0.25em] text-white/60 hover:text-white uppercase transition-colors font-bold"
          >
            Find agent
          </a>
          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsMortgageDropdownOpen(true)}
            onMouseLeave={() => setIsMortgageDropdownOpen(false)}
          >
            <a
              href="#"
              onClick={(e) => handleNavClick(e, 6)}
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isMortgageDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Mortgages
            </a>

            <AnimatePresence>
              {isMortgageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[240px] z-50 pointer-events-auto"
                >
                  <div className="bg-[#030102]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 text-left font-sans">
                    <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90 pb-2 border-b border-white/10">
                      Mortgages
                    </h4>
                    <div className="flex flex-col gap-3.5">
                      <a href="#" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Mortgage Cashback</a>
                      <a href="#" className="flex items-center justify-between text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium group">
                        Mortgage Finder
                        <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2-2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Action Button & Mobile Menu Trigger */}
        <div className="pointer-events-auto font-sans flex items-center gap-4 relative">
          {isLoggedIn ? (
            <Link href="/profile" className="block relative">
              {/* Profile Image Trigger */}
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 shadow-lg hover:border-white/40 hover:scale-105 cursor-pointer transition-all duration-300 relative select-none">
                <img
                  src="/avatar1.png"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
                {/* Online luxury status indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#030102] rounded-full" />
              </div>
            </Link>
          ) : (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("openAuthModal"))}
              className="px-6 py-2 border border-white/20 text-white text-[10px] tracking-[0.2em] uppercase rounded-full bg-[#030102]/20 cursor-pointer btn-animate-secondary"
            >
              Login / Signup
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#030102]/98 backdrop-blur-3xl px-6 pt-28 pb-12 flex flex-col justify-between md:hidden pointer-events-auto"
          >
            {/* Ambient glows inside mobile menu */}
            <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

            <div className="flex flex-col gap-6 font-sans relative z-10 pt-4">
              <a
                href="#"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 1);
                }}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Buy
              </a>
              <a
                href="#"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 2);
                }}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Rent
              </a>
              <a
                href="#"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 4);
                }}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                New Projects
              </a>
              <a
                href="#"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 6);
                }}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Tools & Insights
              </a>
              <a
                href="#"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 6);
                }}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Find Agent
              </a>
              <a
                href="#"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, 6);
                }}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Mortgages
              </a>
            </div>

            {/* Footer details in mobile menu */}
            <div className="font-sans text-center relative z-10">
              <p className="text-[9px] tracking-[0.25em] uppercase text-white/20 font-light">
                AA TRADERS DEVELOPMENTS &copy; 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
