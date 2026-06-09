"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "saved" | "alerts" | "contacted">("info");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("mohammedunusuxui@gmail.com");
  const [name, setName] = useState("Mohammed");
  const [surname, setSurname] = useState("Unus");
  const [isSaved, setIsSaved] = useState(false);

  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);
  const [isRentDropdownOpen, setIsRentDropdownOpen] = useState(false);
  const [isNewProjectsDropdownOpen, setIsNewProjectsDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMortgageDropdownOpen, setIsMortgageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      // If not logged in, redirect to home page
      router.push("/");
      return;
    }
    setIsLoggedIn(true);

    // Load credentials from local storage if available
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
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    // Notify main page of auth change
    window.dispatchEvent(new CustomEvent("authStateChange", { detail: { isLoggedIn: false } }));
    router.push("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#030102] flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-[#030102] text-white/90 font-sans overflow-y-auto selection:bg-white/20 selection:text-white relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none z-0" />

      {/* Premium Header */}
      <header className="relative z-50 w-full border-b border-white/5 bg-[#030102]/80 backdrop-blur-md px-6 md:px-12 py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="font-sans">
          <Link
            href="/"
            className="block select-none hover:opacity-80 transition-all duration-300"
          >
            <img
              src="/Logo/AA Real Estate.png"
              alt="AA Traders Logo"
              className="h-11 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Minimalist Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 bg-[#171717]/90 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/10 shadow-sm font-sans">
          <div
            className="flex items-center"
            onMouseEnter={() => setIsBuyDropdownOpen(true)}
            onMouseLeave={() => setIsBuyDropdownOpen(false)}
          >
            <Link
              href="/?section=1"
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isBuyDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Buy
            </Link>

            <AnimatePresence>
              {isBuyDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50"
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
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Apartments for Sale</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Villas for Sale</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Townhouses for Sale</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Penthouses for Sale</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Land / Plots for Sale</Link>
                        </div>
                      </div>

                      {/* Column 2: Buyer Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Buyer Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Mortgage Calculator</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Property Valuation</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sold House Prices</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sale Price Map</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Investment ROI Calculator</Link>
                        </div>
                      </div>

                      {/* Column 3: Buying Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Buying Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Buyer's Guide</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Area Insights</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Community Guides</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tower & Compound Guides</Link>
                          <Link href="/?section=1" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Schools & University Guides</Link>
                        </div>
                      </div>

                      {/* Column 4: Premium Mortgage Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1024] to-[#040206] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
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

                        <Link href="/?section=1" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Calculate Mortgage
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <Link href="/?section=1" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Buy Residential
                      </Link>
                      <Link href="/?section=1" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Buy Commercial
                      </Link>
                      <Link href="/?section=6" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Find an Agent
                      </Link>
                      <Link href="/?section=4" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Off-plan Projects
                      </Link>
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
            <Link
              href="/?section=2"
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isRentDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Rent
            </Link>

            <AnimatePresence>
              {isRentDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50"
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
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Apartments for Rent</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Studios for Rent</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Villas for Rent</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Townhouses for Rent</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Penthouses for Rent</Link>
                        </div>
                      </div>

                      {/* Column 2: Renter Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Renter Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rent vs Buy Calculator</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rented House Prices</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Price Map</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Budget Calculator</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tenant Rights Guide</Link>
                        </div>
                      </div>

                      {/* Column 3: Renting Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Renting Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Renter's Guide</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Area Insights</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Community Guides</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tower & Compound Guides</Link>
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Schools & University Guides</Link>
                        </div>
                      </div>

                      {/* Column 4: Premium Renting Guide Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#101b2b] to-[#02050a] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
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

                        <Link href="/?section=2" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Read Article
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <Link href="/?section=2" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Rent Residential
                      </Link>
                      <Link href="/?section=2" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Rent Commercial
                      </Link>
                      <Link href="/?section=6" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Find an Agent
                      </Link>
                      <Link href="/?section=2" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        Short-Term Rentals
                      </Link>
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
            <Link
              href="/?section=4"
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isNewProjectsDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              New Projects
            </Link>

            <AnimatePresence>
              {isNewProjectsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50"
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
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Dubai</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Abu Dhabi</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Sharjah</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Ras Al Khaimah</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">New Projects in Umm Al Quwain</Link>
                        </div>
                      </div>

                      {/* Column 2: Find Developers in the UAE */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Find Developers
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Emaar Properties</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Azizi Developments</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Aldar Properties</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Damac Properties</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sobha Realty</Link>
                        </div>
                      </div>

                      {/* Column 3: Investing Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Investing Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Investor's Guide</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Areas to Invest</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Latest Projects</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Off-Plan Market Reports</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Golden Visa Guidelines</Link>
                        </div>
                      </div>

                      {/* Column 4: Premium Discover Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#260e1d] to-[#040103] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
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

                        <Link href="/?section=4" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          All New Projects
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <Link href="/?section=4" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Find Developers
                      </Link>
                      <Link href="/?section=4" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Off-plan Properties
                      </Link>
                      <Link href="/?section=4" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                          </svg>
                        </span>
                        Market Trends
                      </Link>
                      <Link href="/?section=4" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </span>
                        Off-Plan Guides
                      </Link>
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
            <Link
              href="/?section=6"
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isToolsDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Tools & insights
            </Link>

            <AnimatePresence>
              {isToolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50"
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
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Mortgage Calculator</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rent vs Buy Calculator</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Transactions</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sale Transactions</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Investment ROI Tracker</Link>
                        </div>
                      </div>

                      {/* Column 2: Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Market Reports</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Renter Guides</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Buyer Guides</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Popular Communities</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Budget-Friendly Areas</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Property Blog</Link>
                        </div>
                      </div>

                      {/* Column 3: Area Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Area Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Dubai</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Abu Dhabi</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sharjah</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Ajman</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Ras Al Khaimah</Link>
                        </div>
                      </div>

                      {/* Column 4: Premium Blog Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1a2e] to-[#020509] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
                        {/* Glowing highlight */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="space-y-3.5">
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

                        <Link href="/?section=6" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Explore Blog
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <Link href="/?section=6" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </span>
                        Mortgage Calculator
                      </Link>
                      <Link href="/?section=6" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                          </svg>
                        </span>
                        Rent Vs Buy Calculator
                      </Link>
                      <Link href="/?section=6" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </span>
                        Area Insights
                      </Link>
                      <Link href="/?section=6" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        Popular Communities
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/?section=6"
            className="text-[12px] tracking-[0.25em] text-white/60 hover:text-white uppercase transition-colors font-bold"
          >
            Find agent
          </Link>

          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsMortgageDropdownOpen(true)}
            onMouseLeave={() => setIsMortgageDropdownOpen(false)}
          >
            <Link
              href="/?section=6"
              className={`text-[12px] tracking-[0.25em] uppercase transition-colors py-1 block font-bold ${
                isMortgageDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Mortgages
            </Link>

            <AnimatePresence>
              {isMortgageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[240px] z-50"
                >
                  <div className="bg-[#030102]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 text-left font-sans">
                    <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90 pb-2 border-b border-white/10">
                      Mortgages
                    </h4>
                    <div className="flex flex-col gap-3.5">
                      <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Mortgage Cashback</Link>
                      <Link href="/?section=6" className="flex items-center justify-between text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium group">
                        Mortgage Finder
                        <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2-2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Action Button: Avatar & Mobile Menu Trigger */}
        <div className="font-sans flex items-center gap-4 relative">
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
            className="fixed inset-0 z-40 bg-[#030102]/98 backdrop-blur-3xl px-6 pt-28 pb-12 flex flex-col justify-between md:hidden pointer-events-auto"
          >
            {/* Ambient glows inside mobile menu */}
            <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

            <div className="flex flex-col gap-6 font-sans relative z-10 pt-4">
              <Link
                href="/?section=1"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Buy
              </Link>
              <Link
                href="/?section=2"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Rent
              </Link>
              <Link
                href="/?section=4"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                New Projects
              </Link>
              <Link
                href="/?section=6"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Tools & Insights
              </Link>
              <Link
                href="/?section=6"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Find Agent
              </Link>
              <Link
                href="/?section=6"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white transition-colors py-2.5 border-b border-white/5"
              >
                Mortgages
              </Link>
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

      {/* Main Account Area */}
      <main className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-12 flex flex-col gap-10 min-h-[calc(100vh-88px)] justify-start">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans text-left">
            My account
          </h1>
        </div>

        {/* Tab Headers */}
        <div className="w-full border-b border-white/5 flex gap-8 md:gap-12 text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveTab("info")}
            className={`pb-4 transition-all relative cursor-pointer border-b-2 ${
              activeTab === "info"
                ? "text-white border-white"
                : "text-white/40 hover:text-white/70 border-transparent"
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-4 transition-all relative cursor-pointer border-b-2 ${
              activeTab === "saved"
                ? "text-white border-white"
                : "text-white/40 hover:text-white/70 border-transparent"
            }`}
          >
            Saved properties (0)
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-4 transition-all relative cursor-pointer border-b-2 ${
              activeTab === "alerts"
                ? "text-white border-white"
                : "text-white/40 hover:text-white/70 border-transparent"
            }`}
          >
            Search alerts (0)
          </button>
          <button
            onClick={() => setActiveTab("contacted")}
            className={`pb-4 transition-all relative cursor-pointer border-b-2 ${
              activeTab === "contacted"
                ? "text-white border-white"
                : "text-white/40 hover:text-white/70 border-transparent"
            }`}
          >
            Contacted properties (0)
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="w-full">
          {activeTab === "info" && (
            <div className="bg-gradient-to-br from-[#171717]/60 to-[#030102]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-xl w-full mt-2 relative overflow-hidden">
              {/* Glowing highlight */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              
              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h3 className="text-lg md:text-xl font-bold tracking-[0.15em] uppercase text-white/90 pb-4 border-b border-white/10">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#121212]/50 border border-white/10 rounded-xl px-5 py-4 text-[14px] md:text-[15px] text-white focus:outline-none focus:border-white/30 focus:bg-[#1a1a1a]/50 transition-all font-medium placeholder-white/20"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Surname field */}
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 block">
                      Surname
                    </label>
                    <input
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="w-full bg-[#121212]/50 border border-white/10 rounded-xl px-5 py-4 text-[14px] md:text-[15px] text-white focus:outline-none focus:border-white/30 focus:bg-[#1a1a1a]/50 transition-all font-medium placeholder-white/20"
                      placeholder="Enter your surname"
                    />
                  </div>

                  {/* Email address field - full-width */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-[#0d0d0d]/40 border border-white/5 rounded-xl px-5 py-4 text-[14px] md:text-[15px] text-white/40 cursor-not-allowed font-medium select-none"
                    />
                  </div>
                </div>

                {/* Save & Logout section centered below */}
                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4 max-w-md mx-auto">
                  <button
                    onClick={handleSave}
                    className="w-full py-4 bg-white text-black text-xs md:text-sm tracking-[0.25em] uppercase font-bold rounded-xl btn-animate-primary cursor-pointer shadow-lg active:scale-98 text-center"
                  >
                    {isSaved ? "Changes Saved" : "Save Changes"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-red-500 hover:text-red-400 hover:scale-105 active:scale-95 transition-all duration-300 py-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="bg-gradient-to-br from-[#171717]/60 to-[#030102]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-16 text-center shadow-xl flex flex-col items-center justify-center gap-4 w-full mt-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/3 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner relative z-10">
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <p className="text-white/60 text-sm font-semibold tracking-wide relative z-10">You don't have any saved properties yet.</p>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="bg-gradient-to-br from-[#171717]/60 to-[#030102]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-16 text-center shadow-xl flex flex-col items-center justify-center gap-4 w-full mt-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/3 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner relative z-10">
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-white/60 text-sm font-semibold tracking-wide relative z-10">No active search alerts.</p>
            </div>
          )}

          {activeTab === "contacted" && (
            <div className="bg-gradient-to-br from-[#171717]/60 to-[#030102]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-16 text-center shadow-xl flex flex-col items-center justify-center gap-4 w-full mt-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/3 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner relative z-10">
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white/60 text-sm font-semibold tracking-wide relative z-10">No contacted properties.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
