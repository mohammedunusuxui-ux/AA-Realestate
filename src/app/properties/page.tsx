"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeContext";
import { PROPERTIES_DATA, FAQ_DATA, TOP_CATEGORIES } from "@/data/properties";

// ─── Component ────────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const router = useRouter();
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);
  const [isRentDropdownOpen, setIsRentDropdownOpen] = useState(false);
  const [isNewProjectsDropdownOpen, setIsNewProjectsDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Filters
  const [activeType, setActiveType] = useState<"all" | "buy" | "rent">("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [activeBeds, setActiveBeds] = useState<string>("all");
  const [activePriceRange, setActivePriceRange] = useState<string>("all");
  const [activeLocation, setActiveLocation] = useState<string>("all");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  // Inquiry Modal
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<typeof PROPERTIES_DATA[0] | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Category Horizontal Scroll Ref and States
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkScrollPosition = () => {
    const container = categoryScrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftScroll(scrollLeft > 2);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  const scrollCategories = (direction: "left" | "right") => {
    const container = categoryScrollRef.current;
    if (container) {
      const scrollAmount = 240;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");
    const categoryParam = params.get("category");
    if (typeParam === "buy" || typeParam === "rent") setActiveType(typeParam);
    if (categoryParam) setActiveCategory(categoryParam.toLowerCase());

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const container = pageContainerRef.current;
    const handleScroll = () => {
      if (container) setScrolled(container.scrollTop > 50);
    };
    if (container) container.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target as Node)) {
        setIsViewDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Initial check and resize tracking for scroll indicators
    const timer = setTimeout(checkScrollPosition, 350);
    window.addEventListener("resize", checkScrollPosition);

    return () => { 
      if (container) container.removeEventListener("scroll", handleScroll); 
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timer);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  const selectFilter = (type: "all" | "buy" | "rent", category: string) => {
    setActiveType(type);
    setActiveCategory(category);
    setIsBuyDropdownOpen(false);
    setIsRentDropdownOpen(false);
    setIsMobileMenuOpen(false);
    const p = new URLSearchParams();
    if (type !== "all") p.set("type", type);
    if (category !== "all") p.set("category", category);
    router.push(`/properties?${p.toString()}`, { scroll: false });
    setTimeout(checkScrollPosition, 100);
  };

  const clearAllFilters = () => {
    setActiveType("all"); setActiveCategory("all"); setActiveLocation("all");
    setActivePriceRange("all"); setActiveBeds("all"); setSearchQuery(""); setSortBy("default");
  };



  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setIsInquiryModalOpen(false); setInquirySubmitted(false); setSelectedProperty(null);
      setInquiryName(""); setInquiryEmail(""); setInquiryPhone(""); setInquiryMessage("");
    }, 2500);
  };

  // ─── Filtering & Sorting ───────────────────────────────────────────────────
  const filtered = PROPERTIES_DATA.filter((p) => {
    const matchType     = activeType === "all" || p.type === activeType;
    const matchCat      = activeCategory === "all" || p.category === activeCategory;
    const matchSearch   = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLoc      = activeLocation === "all" || p.location.toLowerCase().includes(activeLocation.toLowerCase());
    let matchPrice      = true;
    if (activePriceRange === "0-10m")   matchPrice = p.priceVal <= 10000000;
    if (activePriceRange === "10m-30m") matchPrice = p.priceVal > 10000000 && p.priceVal <= 30000000;
    if (activePriceRange === "30m-50m") matchPrice = p.priceVal > 30000000 && p.priceVal <= 50000000;
    if (activePriceRange === "50m+")    matchPrice = p.priceVal > 50000000;
    let matchBeds = true;
    if (activeBeds !== "all") matchBeds = activeBeds === "4+" ? p.beds >= 4 : p.beds === parseInt(activeBeds);
    return matchType && matchCat && matchSearch && matchLoc && matchPrice && matchBeds;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.priceVal - b.priceVal;
    if (sortBy === "price-desc") return b.priceVal - a.priceVal;
    return 0;
  });

  // ─── Shared Icon SVGs ─────────────────────────────────────────────────────
  const BedIcon  = () => <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12V7a1 1 0 011-1h5a1 1 0 011 1v5M3 12h18M3 12v5m18-5v5M7 7h.01M3 17h18" /></svg>;
  const BathIcon = () => <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5zM4 12V6a2 2 0 012-2h3v4M4 12h1" /></svg>;
  const AreaIcon = () => (
    <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18M3 9h18" />
    </svg>
  );
  const GridIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
  const ListIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
  const PriceSqftIcon = () => (
    <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
  const CategoryIcon = () => (
    <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
  const PhoneIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52C8.36 2.65 7.64 2 6.77 2H4.14C3.26 2 2.5 2.77 2.5 3.65c0 10.15 8.24 18.39 18.39 18.39.88 0 1.65-.76 1.65-1.64v-2.63c0-.87-.65-1.59-1.51-1.71z" />
    </svg>
  );
  const WhatsAppIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 1.973 14.113.95 11.49.95c-5.447 0-9.877 4.371-9.881 9.799-.001 1.77.483 3.5 1.397 5.006L1.879 21.05l5.241-1.362z" />
      <path d="M15.42 12.92c-.27-.13-1.58-.78-1.82-.87-.24-.09-.42-.13-.6.13-.18.27-.69.87-.84 1.04-.15.17-.3.2-.57.07-.27-.13-1.14-.42-2.18-1.35-.8-.72-1.35-1.61-1.5-1.88-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.13-.15.18-.26.27-.43.09-.17.04-.32-.02-.45-.07-.13-.6-1.44-.82-1.97-.22-.53-.47-.46-.64-.47-.17 0-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.39s1.03 2.77 1.17 2.96c.14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.32.19 1.82.11.56-.08 1.58-.65 1.8-1.28.23-.63.23-1.17.16-1.28-.07-.1-.26-.18-.53-.31z" />
    </svg>
  );
  const getHighlights = (category: string, beds: number) => {
    switch (category) {
      case "penthouses":
        return `Skyline View | Private Terrace | Smart Automation | Maid's Room`;
      case "villas":
        return `Private Pool | Landscaped Garden | Corner Plot | Extended Majlis`;
      case "apartments":
        return `High Floor | Spacious Balcony | Canal View | Semi-closed Kitchen`;
      case "townhouses":
        return `Gated Community | Private Garden | Balcony | Parking Garage`;
      case "plots":
        return `Waterfront Plot | Gated Island | Ready to Build | Exclusive Location`;
      default:
        return `Premium Finish | Modern Layout | Balcony | Fully Fitted Kitchen`;
    }
  };

  // ─── Pill button helper ───────────────────────────────────────────────────
  const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-[9px] tracking-widest font-extrabold uppercase transition-all cursor-pointer border ${active ? "bg-white border-white text-black" : "bg-[#030102]/40 border-white/5 text-white/40 hover:text-white/70 hover:border-white/10"}`}>{children}</button>
  );

  return (
    <div ref={pageContainerRef} className="properties-page min-h-screen h-full bg-[#030102] text-white/90 font-sans overflow-y-auto selection:bg-white/20 selection:text-white relative scroll-smooth">

      {/* ── Ambient glows ── */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none z-0" />

      {/* ═══════════════════════════════════════════════════════════════════════
          NAV
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex items-center justify-between pointer-events-none ${scrolled ? "bg-[#030102]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12" : "bg-transparent py-6 md:py-8 px-6 md:px-12"}`}>
        {/* Logo */}
        <div className="pointer-events-auto">
          <Link href="/" className="block hover:opacity-80 transition-opacity">
            <img src="/Logo/AA Real Estate.png" alt="AA Traders" className="h-11 md:h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-14 pointer-events-auto bg-[#171717]/90 backdrop-blur-md px-12 py-4 rounded-full border border-white/10 shadow-sm font-sans">
          {/* Buy dropdown */}
          <div
            className="flex items-center"
            onMouseEnter={() => setIsBuyDropdownOpen(true)}
            onMouseLeave={() => setIsBuyDropdownOpen(false)}
          >
            <button
              onClick={() => selectFilter("buy", "all")}
              className={`text-[12px] tracking-[0.25em] uppercase py-1 font-bold cursor-pointer transition-colors ${
                isBuyDropdownOpen || activeType === "buy" ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Buy
            </button>

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
                          <button onClick={() => selectFilter("buy", "apartments")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Apartments for Sale</button>
                          <button onClick={() => selectFilter("buy", "villas")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Villas for Sale</button>
                          <button onClick={() => selectFilter("buy", "townhouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Townhouses for Sale</button>
                          <button onClick={() => selectFilter("buy", "penthouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Penthouses for Sale</button>
                          <button onClick={() => selectFilter("buy", "plots")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Land / Plots for Sale</button>
                        </div>
                      </div>

                      {/* Column 2: Buyer Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Buyer Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Mortgage Calculator</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Property Valuation</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sold House Prices</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sale Price Map</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Investment ROI Calculator</Link>
                        </div>
                      </div>

                      {/* Column 3: Buying Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Buying Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Buyer's Guide</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Area Insights</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Community Guides</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tower & Compound Guides</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Schools & University Guides</Link>
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

                        <Link href="/?section=6" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Calculate Mortgage
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <button onClick={() => selectFilter("buy", "all")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold cursor-pointer text-left">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Buy Residential
                      </button>
                      <button onClick={() => selectFilter("buy", "all")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold cursor-pointer text-left">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Buy Commercial
                      </button>
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

          {/* Rent dropdown */}
          <div
            className="flex items-center"
            onMouseEnter={() => setIsRentDropdownOpen(true)}
            onMouseLeave={() => setIsRentDropdownOpen(false)}
          >
            <button
              onClick={() => selectFilter("rent", "all")}
              className={`text-[12px] tracking-[0.25em] uppercase py-1 font-bold cursor-pointer transition-colors ${
                isRentDropdownOpen || activeType === "rent" ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Rent
            </button>

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
                          <button onClick={() => selectFilter("rent", "apartments")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Apartments for Rent</button>
                          <button onClick={() => selectFilter("rent", "studios")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Studios for Rent</button>
                          <button onClick={() => selectFilter("rent", "villas")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Villas for Rent</button>
                          <button onClick={() => selectFilter("rent", "townhouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Townhouses for Rent</button>
                          <button onClick={() => selectFilter("rent", "penthouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left cursor-pointer">Penthouses for Rent</button>
                        </div>
                      </div>

                      {/* Column 2: Renter Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Renter Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rent vs Buy Calculator</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rented House Prices</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Price Map</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rental Budget Calculator</Link>
                          <Link href="/?section=6" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tenant Rights Guide</Link>
                        </div>
                      </div>

                      {/* Column 3: Renting Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Renting Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Renter's Guide</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Area Insights</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Community Guides</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tower & Compound Guides</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Schools & University Guides</Link>
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

                        <Link href="/?section=4" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Read Article
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <button onClick={() => selectFilter("rent", "all")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold cursor-pointer text-left">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Rent Residential
                      </button>
                      <button onClick={() => selectFilter("rent", "all")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold cursor-pointer text-left">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        Rent Commercial
                      </button>
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

          {/* New Projects dropdown */}
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
                          {/* Icon */}
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <h5 className="text-[14px] md:text-[15px] font-bold tracking-tight text-white font-sans leading-snug">
                            Discover New Projects
                          </h5>
                          <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed font-light font-sans">
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

          {/* Tools & Insights dropdown */}
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
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Property Blog</Link>
                        </div>
                      </div>

                      {/* Column 3: Area Insights */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Area Insights
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Dubai</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Abu Dhabi</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sharjah</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Ajman</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Ras Al Khaimah</Link>
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

                        <Link href="/?section=4" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95 font-sans">
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
                      <Link href="/?section=4" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </span>
                        Area Insights
                      </Link>
                      <Link href="/?section=4" className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
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
            className="text-[12px] tracking-[0.25em] text-white/60 hover:text-white uppercase font-bold"
          >
            Find Agent
          </Link>

          <Link
            href="/?section=6"
            className="text-[12px] tracking-[0.25em] text-white/60 hover:text-white uppercase font-bold"
          >
            Mortgages
          </Link>
        </nav>

        {/* Right actions */}
        <div className="pointer-events-auto flex items-center gap-3">

          {/* ── Theme Toggle ── */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95
              ${theme === "dark"
                ? "bg-black border-white/10 text-white/60 hover:text-white hover:bg-neutral-900"
                : "bg-white border-black/10 text-black/60 hover:text-black hover:bg-neutral-100"}`}
          >
            {theme === "dark" ? (
              /* Sun icon for switching to light */
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon icon for switching to dark */
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {isLoggedIn ? (
            <Link href="/profile" className="block relative">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 hover:border-white/40 hover:scale-105 cursor-pointer transition-all duration-300 relative select-none">
                <img src="/avatar1.png" alt="Profile" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#030102] rounded-full" />
              </div>
            </Link>
          ) : (
            <Link href="/?openAuth=true" className="px-6 py-2 border border-white/20 text-white text-[10px] tracking-[0.2em] uppercase rounded-full bg-[#030102]/20 cursor-pointer hover:bg-white/10 transition-colors">
              Login / Signup
            </Link>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-all" aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#030102]/98 backdrop-blur-3xl px-6 pt-28 pb-12 flex flex-col justify-between md:hidden pointer-events-auto">
            <div className="flex flex-col gap-6">
              {[["Buy Properties", () => selectFilter("buy","all")],["Rent Properties", () => selectFilter("rent","all")]].map(([label, fn]: any) => (
                <button key={label} onClick={fn} className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white py-2.5 border-b border-white/5 text-left">{label}</button>
              ))}
              <Link href="/?section=4" className="text-lg tracking-[0.2em] uppercase font-bold text-white/80 hover:text-white py-2.5 border-b border-white/5" onClick={() => setIsMobileMenuOpen(false)}>New Projects</Link>
            </div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-white/20 text-center">AA Real Estate © 2026</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTENT — heading + sidebar + grid
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 w-full pt-36 pb-0">
        <div className="w-full px-6 md:px-12">

          {/* ── Page header row ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-white/40 mb-4 select-none">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                  Home
                </Link>
                <span className="text-white/20">›</span>
                <span className="text-white/70">{activeType === "rent" ? "Properties for Rent" : activeType === "buy" ? "Properties for Sale" : "All Properties"}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Discover homes<br />
                <span className="text-white">that fit your lifestyle</span>
              </h1>
            </div>
            <div className="max-w-xs">
              <p className="text-sm text-white/40 font-light leading-relaxed">
                Explore a curated range of properties built for comfort, location, and everyday living across the UAE.
              </p>

            </div>
          </div>

          {/* ── Sidebar + Grid layout ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left Sidebar ── */}
            <aside className="w-full lg:w-[340px] shrink-0 bg-[#111]/80 backdrop-blur-xl border border-white/8 rounded-[1.75rem] p-7 shadow-xl flex flex-col gap-1 text-left font-sans lg:sticky lg:top-28">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white text-sm font-black tracking-tight uppercase">Filters</h3>
                <button onClick={clearAllFilters} className="text-[9px] tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer">Clear all</button>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <input type="text" placeholder="Search location, title…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030102]/60 border border-white/10 rounded-xl px-4 py-2.5 pl-9 text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors" />
                <svg className="w-3.5 h-3.5 text-white/25 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              {/* Offer type */}
              <div className="pt-4 pb-4 border-t border-white/5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/50 font-bold block mb-3">Offer Type</label>
                <div className="flex flex-wrap gap-2">
                  {(["all","buy","rent"] as const).map(t => <Pill key={t} active={activeType === t} onClick={() => setActiveType(t)}>{t === "all" ? "All" : t === "buy" ? "Buy" : "Rent"}</Pill>)}
                </div>
              </div>

              {/* Location */}
              <div className="pt-4 pb-4 border-t border-white/5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/50 font-bold block mb-3">Location</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","All"],["Palm Jumeirah","Palm"],["Downtown Dubai","Downtown"],["Dubai Marina","Marina"],["Business Bay","Business Bay"],["Dubai Hills","Dubai Hills"]].map(([id, label]) => (
                    <Pill key={id} active={activeLocation === id} onClick={() => setActiveLocation(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="pt-4 pb-4 border-t border-white/5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/50 font-bold block mb-3">Price Range</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","All"],["0-10m","Under 10M"],["10m-30m","10M–30M"],["30m-50m","30M–50M"],["50m+","50M+"]].map(([id, label]) => (
                    <Pill key={id} active={activePriceRange === id} onClick={() => setActivePriceRange(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div className="pt-4 pb-4 border-t border-white/5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/50 font-bold block mb-3">Property Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","All"],["apartments","Apt"],["villas","Villa"],["townhouses","Townhouse"],["penthouses","Penthouse"],["plots","Plot"]].map(([id, label]) => (
                    <Pill key={id} active={activeCategory === id} onClick={() => setActiveCategory(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="pt-4 pb-4 border-t border-white/5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/50 font-bold block mb-3">Bedrooms</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","Any"],["1","1"],["2","2"],["3","3"],["4+","4+"]].map(([id, label]) => (
                    <Pill key={id} active={activeBeds === id} onClick={() => setActiveBeds(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="pt-4 border-t border-white/5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/50 font-bold block mb-3">Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-[#030102]/60 border border-white/10 rounded-xl px-3 py-2.5 text-[10px] text-white/70 focus:outline-none cursor-pointer">
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </aside>

            {/* ── Cards grid ── */}
            <div className="flex-1 w-full">
              {/* Category Pills Bar (visible on all filter states) */}
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6 category-pill-bar">
                {/* Scrollable Container Wrapper with Left/Right Scroll Chevrons */}
                <div className="relative min-w-0 flex-1 group flex items-center">
                  
                  {/* Left Scroll Gradient Overlay and Button */}
                  {showLeftScroll && (
                    <div className={`absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none flex items-center justify-start rounded-l-full bg-gradient-to-r ${
                      theme === "dark" 
                        ? "from-[#030102] via-[#030102]/65 to-transparent" 
                        : "from-white via-white/65 to-transparent"
                    }`}>
                      <button
                        onClick={() => scrollCategories("left")}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto cursor-pointer shadow-lg
                          ${theme === "dark"
                            ? "bg-neutral-900 border-white/10 text-white hover:bg-neutral-800"
                            : "bg-white border-black/10 text-black hover:bg-neutral-100"}`}
                        aria-label="Scroll categories left"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Scrollable Chips Div */}
                  <div 
                    ref={categoryScrollRef}
                    onScroll={checkScrollPosition}
                    className="flex items-center gap-2.5 overflow-x-auto scroll-smooth py-1 w-full no-scrollbar"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <style>{`
                      .no-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {TOP_CATEGORIES.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => selectFilter(activeType, cat.id)}
                          className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all border shrink-0 cursor-pointer ${
                            isActive
                              ? "bg-white border-white text-black shadow-lg"
                              : "bg-[#030102]/60 border-white/10 text-white/55 hover:text-white hover:border-white/20 hover:bg-white/5"
                          }`}
                        >
                          <span>{cat.label}</span>
                          {cat.count && (
                            <span className={`text-[10px] ml-0.5 ${isActive ? "text-black/50 font-extrabold" : "text-white/30"}`}>
                              • {cat.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    {/* End Spacer to preserve right padding on scroll */}
                    <div className="w-6 shrink-0" />
                  </div>

                  {/* Right Scroll Gradient Overlay and Button */}
                  {showRightScroll && (
                    <div className={`absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none flex items-center justify-end rounded-r-full bg-gradient-to-l ${
                      theme === "dark" 
                        ? "from-[#030102] via-[#030102]/65 to-transparent" 
                        : "from-white via-white/65 to-transparent"
                    }`}>
                      <button
                        onClick={() => scrollCategories("right")}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto cursor-pointer shadow-lg
                          ${theme === "dark"
                            ? "bg-neutral-900 border-white/10 text-white hover:bg-neutral-800"
                            : "bg-white border-black/10 text-black hover:bg-neutral-100"}`}
                        aria-label="Scroll categories right"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                </div>
                
                {/* View Switcher Dropdown */}
                <div className="relative shrink-0 hidden sm:block" ref={viewDropdownRef}>
                  <button
                    onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                    className="view-switcher-btn flex items-center gap-2 px-4.5 py-2.5 rounded-full border border-white/10 bg-[#030102]/60 hover:bg-white/5 hover:border-white/20 text-[11px] font-bold tracking-wider uppercase text-white/75 transition-all cursor-pointer shadow-sm animate-fade-in"
                  >
                    {viewMode === "grid" ? (
                      <>
                        <GridIcon />
                        <span>Grid View</span>
                      </>
                    ) : (
                      <>
                        <ListIcon />
                        <span>List View</span>
                      </>
                    )}
                    <svg className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isViewDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isViewDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="view-switcher-menu absolute right-0 mt-2 w-40 rounded-2xl bg-[#171717] border border-white/10 p-1.5 shadow-2xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setViewMode("grid");
                            setIsViewDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                            viewMode === "grid"
                              ? "active-view bg-white text-black font-extrabold"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <GridIcon />
                          <span>Grid View</span>
                        </button>
                        <button
                          onClick={() => {
                            setViewMode("list");
                            setIsViewDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                            viewMode === "list"
                              ? "active-view bg-white text-black font-extrabold"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <ListIcon />
                          <span>List View</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {sorted.length === 0 ? (
                <div className="bg-white/3 rounded-[2rem] border border-white/5 py-24 px-6 text-center">
                  <h3 className="text-white/60 text-lg font-bold">No properties match your criteria</h3>
                  <p className="text-white/30 text-xs mt-2">Try adjusting your filters</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                  {sorted.map((prop, i) => (
                    <motion.div key={prop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }}
                      onClick={() => router.push(`/properties/${prop.id}`)}
                      className="relative rounded-[1.75rem] overflow-hidden border border-white/10 hover:border-white/25 aspect-[3/4] shadow-lg group transition-all duration-500 bg-neutral-950 cursor-pointer property-card-container">
                      <img src={prop.image} alt={prop.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                      {/* FOR BUY / FOR RENT badge */}
                      <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-md z-20">
                        <svg className="w-3.5 h-3.5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>{prop.type === "buy" ? "For Sale" : "For Rent"}</span>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 z-20">
                        <h3 className="text-white text-base font-semibold tracking-tight line-clamp-1 mb-1.5 opacity-90">{prop.title}</h3>
                        <p className="text-white text-2xl font-bold tracking-tight leading-none mb-4">
                          {prop.price.startsWith("AED") ? prop.price : `AED ${prop.price}`}
                        </p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 gap-2">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-white/90">
                            {prop.beds > 0 ? (
                              <>
                                <span className="flex items-center gap-1"><BedIcon /><span className="text-white font-bold">{prop.beds}+</span></span>
                                <span className="text-white/25">|</span>
                                <span className="flex items-center gap-1"><BathIcon /><span className="text-white font-bold">{prop.baths}</span></span>
                                <span className="text-white/25">|</span>
                                <span className="flex items-center gap-1"><AreaIcon /><span className="text-white/80">{prop.area}</span></span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1"><AreaIcon /><span className="text-white/80">{prop.area}</span></span>
                            )}
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedProperty(prop); setIsInquiryModalOpen(true); }}
                            className="w-11 h-11 bg-white/20 hover:bg-white text-white hover:text-black rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shrink-0 shadow-md">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5 animate-fade-in">
                  {sorted.map((prop, i) => (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      onClick={() => router.push(`/properties/${prop.id}`)}
                      className="relative rounded-[1.75rem] overflow-hidden border border-white/10 hover:border-white/25 shadow-lg group transition-all duration-500 bg-neutral-950 flex flex-col md:flex-row property-card-list select-none min-h-[260px] cursor-pointer"
                    >
                      {/* Left: Image Container */}
                      <div className="relative w-full md:w-[320px] lg:w-[380px] shrink-0 h-[220px] md:h-auto overflow-hidden">
                        <img src={prop.image} alt={prop.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" />
                        <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-l from-transparent via-black/10 to-black/50 z-10" />

                        {/* FOR BUY / FOR RENT badge */}
                        <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-md z-20">
                          <svg className="w-3.5 h-3.5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{prop.type === "buy" ? "For Sale" : "For Rent"}</span>
                        </div>
                      </div>

                      {/* Right: Content details */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between z-20 relative bg-neutral-900/40 backdrop-blur-sm">
                        <div>
                          {/* Listed age & Developer/Tag row */}
                          <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                            <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
                              Listed {((prop.id * 3) % 12) + 2} days ago
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              {prop.developer && (
                                <span className="bg-white/10 text-white/80 text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md">
                                  {prop.developer}
                                </span>
                              )}
                              {prop.tag && (
                                <span className="bg-amber-500/10 text-amber-400 text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md border border-amber-500/20">
                                  {prop.tag}
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-1 opacity-95 group-hover:text-white transition-colors line-clamp-1">
                            {prop.title}
                          </h3>

                          {/* Highlights subtitle */}
                          <p className="text-white/60 text-xs md:text-[13px] font-medium tracking-wide mb-3 line-clamp-1">
                            {getHighlights(prop.category, prop.beds)}
                          </p>

                          <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-4">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{prop.location}</span>
                          </div>
                        </div>

                        {/* Price & specifications */}
                        <div>
                          <div className="text-white text-2xl md:text-3xl font-extrabold tracking-tight mb-5 leading-none">
                            {prop.price.startsWith("AED") ? prop.price : `AED ${prop.price}`}
                          </div>

                          {/* Specifications detail bar */}
                          <div className="flex items-center justify-between border-t border-white/10 pt-5 gap-4">
                            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px] font-semibold text-white/90">
                              {prop.beds > 0 ? (
                                <>
                                  <span className="flex items-center gap-1.5"><BedIcon /><span className="text-white font-bold">{prop.beds}</span></span>
                                  <span className="text-white/20">|</span>
                                  <span className="flex items-center gap-1.5"><BathIcon /><span className="text-white font-bold">{prop.baths}</span></span>
                                  <span className="text-white/20">|</span>
                                  <span className="flex items-center gap-1.5"><AreaIcon /><span className="text-white/80">{prop.area}</span></span>
                                </>
                              ) : (
                                <span className="flex items-center gap-1.5"><AreaIcon /><span className="text-white/80">{prop.area}</span></span>
                              )}
                              
                              <span className="text-white/20">|</span>
                              <span className="flex items-center gap-1.5">
                                <PriceSqftIcon />
                                <span className="text-white/80">
                                  {Math.round(prop.priceVal / parseFloat(prop.area.replace(/,/g, "").replace(" sq ft", "").replace(" sqft", ""))).toLocaleString()} AED/sqft
                                </span>
                              </span>

                              <span className="text-white/20">|</span>
                              <span className="flex items-center gap-1.5">
                                <CategoryIcon />
                                <span className="text-white/80 uppercase tracking-wider text-[11px] font-extrabold">
                                  {prop.category.replace("apartments", "Apartment").replace("villas", "Villa").replace("townhouses", "Townhouse").replace("penthouses", "Penthouse").replace("plots", "Land Plot")}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <a
                                href="tel:+97145558888"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProperty(prop);
                                  setIsInquiryModalOpen(true);
                                }}
                                className="px-6 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 font-semibold text-xs tracking-normal list-action-btn"
                              >
                                <PhoneIcon />
                                <span className="text-white">Call</span>
                              </a>
                              
                              <a
                                href={`https://wa.me/97145558888?text=I%20am%20interested%20in%20${encodeURIComponent(prop.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="px-6 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 font-semibold text-xs tracking-normal list-action-btn"
                              >
                                <WhatsAppIcon />
                                <span className="text-white">WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            THINGS YOU SHOULD KNOW — FAQ accordion
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="w-full px-6 md:px-12 mt-24 mb-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <div className="lg:w-[320px] shrink-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Buying in UAE</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-snug">
                Things You<br />Should Know
              </h2>
              <p className="text-sm text-white/40 font-light leading-relaxed mt-4">
                Answers to the most common questions from buyers and renters navigating the UAE property market.
              </p>
            </div>
            <div className="flex-1 flex flex-col divide-y divide-white/8">
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className="py-5">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group">
                    <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{faq.q}</span>
                    <span className={`shrink-0 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${openFaq === i ? "bg-white text-black rotate-45" : "text-white/40"}`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="text-sm text-white/45 font-light leading-relaxed mt-3 overflow-hidden">
                        {faq.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          BANNER + FOOTER — same as home page
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="properties-footer relative w-full bg-[#171717] px-6 sm:px-10 md:px-14 lg:px-16 py-24 md:py-32 overflow-hidden text-white font-sans border-t border-white/5">

        {/* Background Image Banner */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Footer Banner Image/AD8Qpts9AmNOiGQ1XK4D2QuFM.png"
            alt="Footer Banner Background"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/95 via-[#171717]/80 to-[#171717] z-10 pointer-events-none" />
        </div>

        {/* Subtle ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-5" />

        <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-8 md:gap-10">
          {/* Accent badge */}
          <div className="flex items-center gap-2 text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase">
              AA Real Estate Developments
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight text-white leading-[1.1] max-w-4xl">
            See Tomorrow <br className="sm:hidden" />
            Before Invest
          </h2>

          {/* Micro-description */}
          <p className="text-xs sm:text-sm text-white/40 max-w-md leading-relaxed font-light uppercase tracking-wider">
            Discover off-market opportunities and secure premium real estate portfolios in the UAE.
          </p>

          {/* CTA Button */}
          <div className="mt-4">
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="px-8 py-4 bg-white text-black text-[11px] tracking-[0.25em] uppercase rounded-full hover:bg-neutral-200 active:scale-95 transition-all duration-300 font-semibold cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-white/10 hover:-translate-y-0.5"
            >
              Get In Touch
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Detailed Premium Footer (Full Width) */}
        <div className="relative z-10 w-full border-t border-white/10 mt-20 pt-16 flex flex-col gap-12 text-left">
          {/* Footer Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">

            {/* Left Column: Logo & Tagline */}
            <div className="flex flex-col gap-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src="/Logo/AA Real Estate.png"
                  alt="AA Traders Logo"
                  className="h-11 md:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-xs md:text-sm text-white/40 leading-relaxed font-light uppercase tracking-wider max-w-[280px]">
                Luxury Real Estate & Extraordinary Living Across UAE.
              </p>
            </div>

            {/* Middle Column 1: AA Real Estate links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white">AA Real Estate</h4>
              <div className="flex flex-col gap-3">
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">About us</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Careers</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Press Office</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Contact Us</a>
              </div>
            </div>

            {/* Middle Column 2: Professionals links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white">Real estate professionals</h4>
              <div className="flex flex-col gap-3">
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Partner Hub</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">AA Expert</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Agent Portal</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Developer Services</a>
              </div>
            </div>

            {/* Middle Column 3: Discover links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white">Luxury Discoveries</h4>
              <div className="flex flex-col gap-3">
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Villas Collection</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Penthouses</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Waterfront Properties</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="text-sm md:text-[15px] text-white/50 hover:text-white transition-colors font-medium tracking-wide">Off-Market Portfolios</a>
              </div>
            </div>

          </div>

          {/* Footer Bottom Row */}
          <div className="w-full border-t border-white/5 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs md:text-[13px] tracking-wider uppercase font-light text-white/30">

            {/* Left: T&C, Privacy Policy etc. */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center lg:justify-start">
              <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="hover:text-white transition-colors">Cookies Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryModalOpen(true); }} className="hover:text-white transition-colors">Sitemap</a>
            </div>

            {/* Right: Language switch, Country switch, Social Icons */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Arabic Switcher */}
              <a href="#" onClick={(e) => { e.preventDefault(); }} className="hover:text-white transition-colors text-sm md:text-base font-semibold normal-case tracking-normal">
                عربي
              </a>

              {/* UAE Country Dropdown */}
              <div className="relative flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl select-none">
                <svg className="w-6 rounded-sm overflow-hidden shrink-0" viewBox="0 0 24 16">
                  <rect width="24" height="16" fill="#FFF" />
                  <rect x="6" width="18" height="5.33" fill="#00732F" />
                  <rect x="6" y="5.33" width="18" height="5.33" fill="#FFF" />
                  <rect x="6" y="10.67" width="18" height="5.33" fill="#000" />
                  <rect width="6" height="16" fill="#FF0000" />
                </svg>
                <span className="text-white text-xs md:text-[13px] tracking-widest font-semibold">UAE</span>
                <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Social Media Links */}
              <div className="flex gap-2">
                {/* Instagram */}
                <a href="#" onClick={(e) => { e.preventDefault(); }} className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                {/* Facebook */}
                <a href="#" onClick={(e) => { e.preventDefault(); }} className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="#" onClick={(e) => { e.preventDefault(); }} className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" onClick={(e) => { e.preventDefault(); }} className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer active:scale-95">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="w-full flex justify-center text-xs md:text-[12px] tracking-widest text-white/20 uppercase font-light -mt-4">
            <p>© 2026 AA Real Estate. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          INQUIRY MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInquiryModalOpen(false)} className="absolute inset-0 bg-[#030102]/85 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className="inquiry-modal relative bg-[#171717] border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl p-8 z-10 font-sans">
              <button onClick={() => setIsInquiryModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="space-y-6">
                <div>
                  <span className="bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full text-white/60 font-semibold mb-2 inline-block">
                    {selectedProperty ? "Inquire Property" : "General Inquiry"}
                  </span>
                  <h3 className="text-white text-xl font-bold">
                    {selectedProperty ? selectedProperty.title : "Begin Your AA Traders Experience"}
                  </h3>
                  <p className="text-white/40 text-xs">
                    {selectedProperty ? selectedProperty.location : "Luxury Real Estate & Extraordinary Living Across UAE"}
                  </p>
                </div>
                {inquirySubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h4 className="text-white font-bold">Inquiry Sent!</h4>
                    <p className="text-white/40 text-xs max-w-xs mx-auto">Our consultant will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div><label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Your Name</label>
                      <input type="text" required value={inquiryName} onChange={e => setInquiryName(e.target.value)} className="w-full mt-1 bg-[#030102]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Email</label>
                        <input type="email" required value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)} className="w-full mt-1 bg-[#030102]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30" /></div>
                      <div><label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Phone</label>
                        <input type="tel" required value={inquiryPhone} onChange={e => setInquiryPhone(e.target.value)} className="w-full mt-1 bg-[#030102]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30" /></div>
                    </div>
                    <div><label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Message</label>
                      <textarea rows={3} required value={inquiryMessage} onChange={e => setInquiryMessage(e.target.value)}
                        placeholder={selectedProperty ? `I am interested in ${selectedProperty.title}.` : "I would like to inquire about properties in the UAE."}
                        className="w-full mt-1 bg-[#030102]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30 resize-none" /></div>
                    <button type="submit" className="w-full py-3.5 bg-white text-black text-[11px] tracking-[0.2em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-lg active:scale-[0.98] cursor-pointer">
                      Request Details
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
