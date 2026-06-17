"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeContext";
import { usePreferences } from "@/components/PreferencesContext";
import Header from "@/components/Header";
import { PROPERTIES_DATA, FAQ_DATA, TOP_CATEGORIES } from "@/data/properties";

import DeveloperLogo from "@/components/DeveloperLogo";
import { InteractiveMenu } from "@/components/ui/modern-mobile-menu";

// ─── Component ────────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const router = useRouter();
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();
  const { formatPrice, formatArea, currency } = usePreferences();


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
  const [activeStatus, setActiveStatus] = useState<"all" | "off-plan" | "ready">("all");

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isBedsDropdownOpen, setIsBedsDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const closeAllDropdowns = () => {
    setIsTypeDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsBedsDropdownOpen(false);
    setIsPriceDropdownOpen(false);
    setIsLocationDropdownOpen(false);
  };


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
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timer);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  const selectFilter = (type: "all" | "buy" | "rent", category: string) => {
    setActiveType(type);
    setActiveCategory(category);

    const p = new URLSearchParams();
    if (type !== "all") p.set("type", type);
    if (category !== "all") p.set("category", category);
    router.push(`/properties?${p.toString()}`, { scroll: false });
    setTimeout(checkScrollPosition, 100);
  };

  const clearAllFilters = () => {
    setActiveType("all"); setActiveCategory("all"); setActiveLocation("all");
    setActivePriceRange("all"); setActiveBeds("all"); setSearchQuery(""); setSortBy("default");
    setActiveStatus("all");
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
    
    let matchStatus = true;
    if (activeStatus === "off-plan") matchStatus = p.tag?.toLowerCase() === "off-plan";
    if (activeStatus === "ready")    matchStatus = p.tag?.toLowerCase() === "ready";

    return matchType && matchCat && matchSearch && matchLoc && matchPrice && matchBeds && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.priceVal - b.priceVal;
    if (sortBy === "price-desc") return b.priceVal - a.priceVal;
    return 0;
  });

  // ─── Shared Icon SVGs ─────────────────────────────────────────────────────
  const SearchIcon = () => (
    <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-3.5 h-3.5 text-inherit shrink-0 transition-transform duration-250" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const FiltersIcon = () => (
    <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );

  const SortIcon = () => (
    <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );

  const BellIcon = () => (
    <svg className="w-4.5 h-4.5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );

  const MapIcon = () => (
    <svg className="w-4.5 h-4.5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v11.382a1 1 0 01-.553.894L15 20l-6-3z" />
    </svg>
  );

  const BedIcon  = ({ className = "" }: { className?: string }) => <svg className={`w-4 h-4 shrink-0 ${className || (theme === "light" ? "text-neutral-600" : "text-white")}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12V7a1 1 0 011-1h5a1 1 0 011 1v5M3 12h18M3 12v5m18-5v5M7 7h.01M3 17h18" /></svg>;
  const BathIcon = ({ className = "" }: { className?: string }) => <svg className={`w-4 h-4 shrink-0 ${className || (theme === "light" ? "text-neutral-600" : "text-white")}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5zM4 12V6a2 2 0 012-2h3v4M4 12h1" /></svg>;
  const AreaIcon = ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 shrink-0 ${className || (theme === "light" ? "text-neutral-600" : "text-white")}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
  const PriceSqftIcon = ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 shrink-0 ${className || (theme === "light" ? "text-neutral-600" : "text-white")}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
  const CategoryIcon = () => (
    <svg className={`w-4 h-4 shrink-0 ${theme === "light" ? "text-neutral-600" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
  const PhoneIcon = ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52C8.36 2.65 7.64 2 6.77 2H4.14C3.26 2 2.5 2.77 2.5 3.65c0 10.15 8.24 18.39 18.39 18.39.88 0 1.65-.76 1.65-1.64v-2.63c0-.87-.65-1.59-1.51-1.71z" />
    </svg>
  );
  const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24">
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
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all cursor-pointer border
        ${active
          ? "active-pill bg-[#EFBF04] border-[#EFBF04] text-black shadow-sm font-bold"
          : theme === "light"
            ? "inactive-pill bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-350"
            : "inactive-pill bg-[#0A0A0A]/40 border-white/5 text-white/40 hover:text-white/70 hover:border-white/10"
        }`}
    >
      {children}
    </button>
  );

  return (
    <div
      ref={pageContainerRef}
      className={`properties-page min-h-screen h-full font-sans overflow-y-auto selection:bg-white/20 selection:text-white relative scroll-smooth transition-colors duration-500
        ${theme === "light" ? "bg-white text-neutral-800" : "bg-[#0A0A0A] text-white/90"}`}
    >

      {/* ── Ambient glows ── */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none z-0" />

      {/* ═══════════════════════════════════════════════════════════════════════
          NAV
      ═══════════════════════════════════════════════════════════════════════ */}
      <Header activeType={activeType} onSelectFilter={(type, category) => selectFilter(type, category)} />

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTENT — heading + sidebar + grid
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 w-full pt-[68px] md:pt-36 pb-0">
        <div className="w-full px-6 md:px-12">

          {/* ── Page header row ── */}
          <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              {/* Breadcrumbs */}
              <div className={`flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold mb-4 select-none
                ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>
                <Link href="/" className={`transition-colors flex items-center gap-1
                  ${theme === "light" ? "hover:text-neutral-800 text-neutral-400" : "hover:text-white text-white/40"}`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                  Home
                </Link>
                <span className={theme === "light" ? "text-neutral-300" : "text-white/20"}>›</span>
                <span className={theme === "light" ? "text-neutral-600" : "text-white/70"}>
                  {activeType === "rent" ? "Properties for Rent" : activeType === "buy" ? "Properties for Sale" : "All Properties"}
                </span>
              </div>
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight transition-colors
                ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                Discover homes<br />
                <span className={theme === "light" ? "text-neutral-900" : "text-white"}>that fit your lifestyle</span>
              </h1>
            </div>
            <div className="max-w-xs">
              <p className={`text-sm font-light leading-relaxed transition-colors
                ${theme === "light" ? "text-neutral-500" : "text-white/40"}`}>
                Explore a curated range of properties built for comfort, location, and everyday living across the UAE.
              </p>

            </div>
          </div>

          {/* Search & Filter Header card (Image 2) */}
          <div className="w-full mb-8 select-none font-sans">
            {/* Header Content Card */}
            <div className={`w-full rounded-[1.75rem] border shadow-lg p-5 md:p-6 transition-all duration-350 text-left
              ${theme === "light" 
                ? "bg-white border-neutral-200/80 shadow-neutral-100/50 shadow-md" 
                : "bg-[#0e0a0d] border-white/10 shadow-black/40 shadow-md"}`}
            >
              {/* Header Title Row */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 mb-4">
                <span className={`text-base sm:text-lg font-extrabold tracking-tight
                  ${theme === "light" ? "text-neutral-900" : "text-white"}`}
                >
                  {(() => {
                    const typeLabel = activeType === "buy" ? "for sale" : activeType === "rent" ? "for rent" : "for sale & rent";
                    const catLabel = activeCategory === "all" ? "Properties" : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
                    return `${catLabel} ${typeLabel} in UAE`;
                  })()}
                </span>
                <span className={`text-xs font-medium tracking-wide
                  ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}
                >
                  {sorted.length.toLocaleString("en-US")} listed
                </span>
              </div>

              {/* Search input field */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="City, community or building"
                  className={`w-full pl-11 pr-12 py-3 text-sm font-semibold rounded-2xl border outline-none transition-all duration-350
                    ${theme === "light"
                      ? "bg-neutral-50 border-neutral-200 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-[#EFBF04]/60 focus:ring-2 focus:ring-[#EFBF04]/10"
                      : "bg-[#161214] border-white/5 text-white placeholder-white/20 focus:bg-[#1a1618] focus:border-[#EFBF04] focus:ring-2 focus:ring-[#EFBF04]/10"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute inset-y-0 right-3 flex items-center justify-center w-8 h-8 my-auto rounded-xl transition-all duration-200 active:scale-95 cursor-pointer
                    ${showFilters
                      ? "bg-[#EFBF04] text-black"
                      : theme === "light"
                        ? "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  title="Show all filters"
                >
                  <FiltersIcon />
                </button>
              </div>

              {/* Collapsible Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden hidden md:block"
                  >
                    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3 pt-4 border-t border-neutral-100 dark:border-white/5 mt-4">
                      {/* Buy / Rent Selector */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setIsTypeDropdownOpen(!isTypeDropdownOpen);
                          }}
                          className={`flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all cursor-pointer select-none active:scale-95
                            ${theme === "light"
                              ? isTypeDropdownOpen 
                                ? "bg-[#EFBF04]/8 border-[#EFBF04]/40 text-[#1D1D1F]"
                                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-350"
                              : isTypeDropdownOpen
                                ? "bg-[#EFBF04]/10 border-[#EFBF04]/30 text-[#EFBF04]"
                                : "bg-[#161214] border-white/5 text-white/80 hover:border-white/10"
                            }`}
                        >
                          <span>{activeType === "all" ? "Type" : activeType === "buy" ? "Buy" : "Rent"}</span>
                          <ChevronDownIcon />
                        </button>
                        <AnimatePresence>
                          {isTypeDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsTypeDropdownOpen(false)} />
                              <motion.div
                                 initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-full left-0 mt-2 z-50 w-36 rounded-2xl border p-2 shadow-2xl backdrop-blur-md
                                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-800" : "bg-[#130f11] border-white/10 text-white"}`}
                              >
                                {(["all", "buy", "rent"] as const).map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => {
                                      setActiveType(t);
                                      setIsTypeDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl tracking-normal transition-colors cursor-pointer
                                      ${theme === "light"
                                        ? activeType === t ? "bg-[#EFBF04]/10 text-[#1D1D1F] font-bold" : "hover:bg-neutral-100 text-neutral-700"
                                        : activeType === t ? "bg-[#EFBF04]/10 text-[#EFBF04]" : "hover:bg-white/5 text-white/80"}`}
                                  >
                                    {t === "all" ? "All Types" : t === "buy" ? "Buy" : "Rent"}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Category Selector */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                          }}
                          className={`flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all cursor-pointer select-none active:scale-95
                            ${theme === "light"
                              ? isCategoryDropdownOpen 
                                ? "bg-[#EFBF04]/8 border-[#EFBF04]/40 text-[#1D1D1F]"
                                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-350"
                              : isCategoryDropdownOpen
                                ? "bg-[#EFBF04]/10 border-[#EFBF04]/30 text-[#EFBF04]"
                                : "bg-[#161214] border-white/5 text-white/80 hover:border-white/10"
                            }`}
                        >
                          <span>{activeCategory === "all" ? "Property Type" : activeCategory === "plots" ? "Land" : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</span>
                          <ChevronDownIcon />
                        </button>
                        <AnimatePresence>
                          {isCategoryDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-full left-0 mt-2 z-50 w-44 rounded-2xl border p-2 shadow-2xl backdrop-blur-md
                                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-800" : "bg-[#130f11] border-white/10 text-white"}`}
                              >
                                {["all", "apartments", "villas", "penthouses", "townhouses", "plots"].map((cat) => (
                                  <button
                                    key={cat}
                                    onClick={() => {
                                      setActiveCategory(cat);
                                      setIsCategoryDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl tracking-normal transition-colors cursor-pointer
                                      ${theme === "light"
                                        ? activeCategory === cat ? "bg-[#EFBF04]/10 text-[#1D1D1F] font-bold" : "hover:bg-neutral-100 text-neutral-700"
                                        : activeCategory === cat ? "bg-[#EFBF04]/10 text-[#EFBF04]" : "hover:bg-white/5 text-white/80"}`}
                                  >
                                    {cat === "all" ? "All Types" : cat === "plots" ? "Land" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Beds & Baths Selector */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setIsBedsDropdownOpen(!isBedsDropdownOpen);
                          }}
                          className={`flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all cursor-pointer select-none active:scale-95
                            ${theme === "light"
                              ? isBedsDropdownOpen 
                                ? "bg-[#EFBF04]/8 border-[#EFBF04]/40 text-[#1D1D1F]"
                                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-350"
                              : isBedsDropdownOpen
                                ? "bg-[#EFBF04]/10 border-[#EFBF04]/30 text-[#EFBF04]"
                                : "bg-[#161214] border-white/5 text-white/80 hover:border-white/10"
                            }`}
                        >
                          <span>{activeBeds === "all" ? "Beds & Baths" : `${activeBeds} Bed`}</span>
                          <ChevronDownIcon />
                        </button>
                        <AnimatePresence>
                          {isBedsDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsBedsDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-full left-0 mt-2 z-50 w-40 rounded-2xl border p-2 shadow-2xl backdrop-blur-md
                                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-800" : "bg-[#130f11] border-white/10 text-white"}`}
                              >
                                {["all", "1", "2", "3", "4+"].map((beds) => (
                                  <button
                                    key={beds}
                                    onClick={() => {
                                      setActiveBeds(beds);
                                      setIsBedsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl tracking-normal transition-colors cursor-pointer
                                      ${theme === "light"
                                        ? activeBeds === beds ? "bg-[#EFBF04]/10 text-[#1D1D1F] font-bold" : "hover:bg-neutral-100 text-neutral-700"
                                        : activeBeds === beds ? "bg-[#EFBF04]/10 text-[#EFBF04]" : "hover:bg-white/5 text-white/80"}`}
                                  >
                                    {beds === "all" ? "All Beds" : `${beds} Bedrooms`}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Price Selector */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setIsPriceDropdownOpen(!isPriceDropdownOpen);
                          }}
                          className={`flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all cursor-pointer select-none active:scale-95
                            ${theme === "light"
                              ? isPriceDropdownOpen 
                                ? "bg-[#EFBF04]/8 border-[#EFBF04]/40 text-[#1D1D1F]"
                                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-350"
                              : isPriceDropdownOpen
                                ? "bg-[#EFBF04]/10 border-[#EFBF04]/30 text-[#EFBF04]"
                                : "bg-[#161214] border-white/5 text-white/80 hover:border-white/10"
                            }`}
                        >
                          <span>{activePriceRange === "all" ? "Price" : activePriceRange === "0-10m" ? "< 10M AED" : activePriceRange === "10m-30m" ? "10M-30M AED" : activePriceRange === "30m-50m" ? "30M-50M AED" : "> 50M AED"}</span>
                          <ChevronDownIcon />
                        </button>
                        <AnimatePresence>
                          {isPriceDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsPriceDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-full left-0 mt-2 z-50 w-48 rounded-2xl border p-2 shadow-2xl backdrop-blur-md
                                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-800" : "bg-[#130f11] border-white/10 text-white"}`}
                              >
                                {[
                                  { id: "all", label: "All Prices" },
                                  { id: "0-10m", label: "Under 10M AED" },
                                  { id: "10m-30m", label: "10M - 30M AED" },
                                  { id: "30m-50m", label: "30M - 50M AED" },
                                  { id: "50m+", label: "Above 50M AED" },
                                ].map((range) => (
                                  <button
                                    key={range.id}
                                    onClick={() => {
                                      setActivePriceRange(range.id);
                                      setIsPriceDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl tracking-normal transition-colors cursor-pointer
                                      ${theme === "light"
                                        ? activePriceRange === range.id ? "bg-[#EFBF04]/10 text-[#1D1D1F] font-bold" : "hover:bg-neutral-100 text-neutral-700"
                                        : activePriceRange === range.id ? "bg-[#EFBF04]/10 text-[#EFBF04]" : "hover:bg-white/5 text-white/80"}`}
                                  >
                                    {range.label}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Location Selector */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setIsLocationDropdownOpen(!isLocationDropdownOpen);
                          }}
                          className={`flex items-center justify-between w-full sm:w-auto gap-2 px-4 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all cursor-pointer select-none active:scale-95
                            ${theme === "light"
                              ? isLocationDropdownOpen 
                                ? "bg-[#EFBF04]/8 border-[#EFBF04]/40 text-[#1D1D1F]"
                                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-350"
                              : isLocationDropdownOpen
                                ? "bg-[#EFBF04]/10 border-[#EFBF04]/30 text-[#EFBF04]"
                                : "bg-[#161214] border-white/5 text-white/80 hover:border-white/10"
                            }`}
                        >
                          <span>{activeLocation === "all" ? "Location" : activeLocation}</span>
                          <ChevronDownIcon />
                        </button>
                        <AnimatePresence>
                          {isLocationDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsLocationDropdownOpen(false)} />
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute top-full left-0 mt-2 z-50 w-44 rounded-2xl border p-2 shadow-2xl backdrop-blur-md
                                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-800" : "bg-[#130f11] border-white/10 text-white"}`}
                              >
                                {[
                                  { id: "all", label: "All Locations" },
                                  { id: "Palm Jumeirah", label: "Palm Jumeirah" },
                                  { id: "Downtown Dubai", label: "Downtown Dubai" },
                                  { id: "Dubai Marina", label: "Dubai Marina" },
                                  { id: "Business Bay", label: "Business Bay" },
                                  { id: "Dubai Hills", label: "Dubai Hills" },
                                ].map((loc) => (
                                  <button
                                    key={loc.id}
                                    onClick={() => {
                                      setActiveLocation(loc.id);
                                      setIsLocationDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl tracking-normal transition-colors cursor-pointer
                                      ${theme === "light"
                                        ? activeLocation === loc.id ? "bg-[#EFBF04]/10 text-[#1D1D1F] font-bold" : "hover:bg-neutral-100 text-neutral-700"
                                        : activeLocation === loc.id ? "bg-[#EFBF04]/10 text-[#EFBF04]" : "hover:bg-white/5 text-white/80"}`}
                                  >
                                    {loc.label}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Off-Plan / Ready Segments */}
                      <div className={`flex items-center justify-between w-full sm:w-auto rounded-full border overflow-hidden p-0.5 select-none
                        ${theme === "light" ? "bg-neutral-50 border-neutral-200/80" : "bg-[#161214] border-white/5"}`}
                      >
                        <button
                          onClick={() => setActiveStatus(activeStatus === "off-plan" ? "all" : "off-plan")}
                          className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs tracking-normal font-semibold transition-all duration-250 cursor-pointer
                            ${activeStatus === "off-plan"
                              ? "bg-[#EFBF04] text-black shadow-sm font-bold border-none"
                              : theme === "light" ? "text-neutral-400 hover:text-neutral-600 font-medium" : "text-white/40 hover:text-white/70 font-medium"
                            }`}
                        >
                          Off-plan
                        </button>
                        <button
                          onClick={() => setActiveStatus(activeStatus === "ready" ? "all" : "ready")}
                          className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs tracking-normal font-semibold transition-all duration-250 cursor-pointer
                            ${activeStatus === "ready"
                              ? "bg-[#EFBF04] text-black shadow-sm font-bold border-none"
                              : theme === "light" ? "text-neutral-400 hover:text-neutral-600 font-medium" : "text-white/40 hover:text-white/70 font-medium"
                            }`}
                        >
                          Ready
                        </button>
                      </div>

                      {/* Divider Line */}
                      <div className={`hidden sm:block w-px h-6
                        ${theme === "light" ? "bg-neutral-200" : "bg-white/10"}`}
                      />

                      {/* Actions Container */}
                      <div className="col-span-2 flex items-center justify-start gap-3 pt-2 mt-1 sm:pt-0 sm:mt-0 sm:col-span-1 sm:w-auto">
                        {/* Filters Icon Button */}
                        <button
                          onClick={clearAllFilters}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 cursor-pointer
                            ${theme === "light"
                              ? "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                              : "bg-[#161214] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                          title="Clear All Filters"
                        >
                          <FiltersIcon />
                        </button>

                        {/* Sort Icon Button */}
                        <button
                          onClick={() => {
                            const nextSort = sortBy === "default" ? "price-asc" : sortBy === "price-asc" ? "price-desc" : "default";
                            setSortBy(nextSort);
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 cursor-pointer
                            ${theme === "light"
                              ? "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                              : "bg-[#161214] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                          title="Cycle Sorting Order"
                        >
                          <SortIcon />
                        </button>

                        {/* Bell Alert Button */}
                        <button
                          onClick={() => alert("Search alert created successfully!")}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 cursor-pointer
                            ${theme === "light"
                              ? "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                              : "bg-[#161214] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                          title="Create Search Alert"
                        >
                          <BellIcon />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Sidebar + Grid layout ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left Sidebar ── */}
            <aside className={`hidden lg:flex lg:w-[340px] shrink-0 backdrop-blur-xl rounded-[1.75rem] p-7 shadow-xl flex-col gap-1 text-left font-sans lg:sticky lg:top-28 transition-colors duration-300
              ${theme === "light"
                ? "bg-white/90 border border-neutral-200/80 shadow-neutral-100/40"
                : "bg-[#1A1A1A]/80 border border-white/8 shadow-black/40"
              }`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-sm font-black tracking-tight uppercase transition-colors
                  ${theme === "light" ? "text-neutral-900" : "text-white"}`}>Filters</h3>
                <button onClick={clearAllFilters} className={`text-[9px] tracking-[0.15em] uppercase transition-colors cursor-pointer
                  ${theme === "light" ? "text-neutral-450 hover:text-neutral-800" : "text-white/60 hover:text-white"}`}>Clear all</button>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <input type="text" placeholder="Search location, title…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 pl-9 text-xs transition-colors outline-none
                    ${theme === "light"
                      ? "bg-neutral-50 border-neutral-200 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-[#EFBF04]/60"
                      : "bg-[#0A0A0A]/60 border-white/10 text-white placeholder-white/25 focus:border-[#EFBF04]"
                    }`} />
                <svg className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2
                  ${theme === "light" ? "text-neutral-450" : "text-white/25"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              {/* Offer type */}
              <div className={`pt-4 pb-4 border-t ${theme === "light" ? "border-neutral-200/60" : "border-white/5"}`}>
                <label className={`text-[11px] font-bold block mb-2
                  ${theme === "light" ? "text-neutral-600" : "text-white/70"}`}>Offer Type</label>
                <div className="flex flex-wrap gap-2">
                  {(["all","buy","rent"] as const).map(t => <Pill key={t} active={activeType === t} onClick={() => setActiveType(t)}>{t === "all" ? "All" : t === "buy" ? "Buy" : "Rent"}</Pill>)}
                </div>
              </div>

              {/* Location */}
              <div className={`pt-4 pb-4 border-t ${theme === "light" ? "border-neutral-200/60" : "border-white/5"}`}>
                <label className={`text-[11px] font-bold block mb-2
                  ${theme === "light" ? "text-neutral-600" : "text-white/70"}`}>Location</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","All"],["Palm Jumeirah","Palm"],["Downtown Dubai","Downtown"],["Dubai Marina","Marina"],["Business Bay","Business Bay"],["Dubai Hills","Dubai Hills"]].map(([id, label]) => (
                    <Pill key={id} active={activeLocation === id} onClick={() => setActiveLocation(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className={`pt-4 pb-4 border-t ${theme === "light" ? "border-neutral-200/60" : "border-white/5"}`}>
                <label className={`text-[11px] font-bold block mb-2
                  ${theme === "light" ? "text-neutral-600" : "text-white/70"}`}>Price Range</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","All"],["0-10m","Under 10M"],["10m-30m","10M–30M"],["30m-50m","30M–50M"],["50m+","50M+"]].map(([id, label]) => (
                    <Pill key={id} active={activePriceRange === id} onClick={() => setActivePriceRange(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div className={`pt-4 pb-4 border-t ${theme === "light" ? "border-neutral-200/60" : "border-white/5"}`}>
                <label className={`text-[11px] font-bold block mb-2
                  ${theme === "light" ? "text-neutral-600" : "text-white/70"}`}>Property Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","All"],["apartments","Apt"],["villas","Villa"],["townhouses","Townhouse"],["penthouses","Penthouse"],["plots","Plot"]].map(([id, label]) => (
                    <Pill key={id} active={activeCategory === id} onClick={() => setActiveCategory(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className={`pt-4 pb-4 border-t ${theme === "light" ? "border-neutral-200/60" : "border-white/5"}`}>
                <label className={`text-[11px] font-bold block mb-2
                  ${theme === "light" ? "text-neutral-600" : "text-white/70"}`}>Bedrooms</label>
                <div className="flex flex-wrap gap-1.5">
                  {[["all","Any"],["1","1"],["2","2"],["3","3"],["4+","4+"]].map(([id, label]) => (
                    <Pill key={id} active={activeBeds === id} onClick={() => setActiveBeds(id)}>{label}</Pill>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className={`pt-4 border-t ${theme === "light" ? "border-neutral-200/60" : "border-white/5"}`}>
                <label className={`text-[11px] font-bold block mb-2
                  ${theme === "light" ? "text-neutral-600" : "text-white/70"}`}>Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-[10px] focus:outline-none cursor-pointer
                    ${theme === "light"
                      ? "bg-neutral-50 border-neutral-200 text-neutral-700 focus:border-[#EFBF04]/60"
                      : "bg-[#0A0A0A]/60 border-white/10 text-white/70 focus:border-[#EFBF04]"
                    }`}>
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
                        ? "from-[#0A0A0A] via-[#0A0A0A]/65 to-transparent" 
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
                          className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-xs font-semibold tracking-normal transition-all border shrink-0 cursor-pointer ${
                            isActive
                              ? "active-category-pill bg-[#EFBF04] border-[#EFBF04] text-black shadow-lg font-bold"
                              : theme === "light"
                                ? "inactive-category-pill bg-white border-neutral-200 text-neutral-600 hover:border-neutral-350 hover:text-neutral-900 font-medium"
                                : "inactive-category-pill bg-[#0A0A0A]/60 border-white/10 text-white/55 hover:text-white hover:border-white/20 hover:bg-white/5 font-medium"
                          }`}
                        >
                          <span>{cat.label}</span>
                          {cat.count && (
                            <span className={`text-[10px] ml-0.5 ${isActive ? "text-black/60 font-bold" : "text-white/30"}`}>
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
                      theme === "light" 
                        ? "from-white via-white/65 to-transparent"
                        : "from-[#0A0A0A] via-[#0A0A0A]/65 to-transparent" 
                    }`}>
                      <button
                        onClick={() => scrollCategories("right")}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto cursor-pointer shadow-lg
                          ${theme === "light"
                            ? "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-150"
                            : "bg-neutral-900 border-white/10 text-white hover:bg-neutral-800"}`}
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
                    className={`view-switcher-btn flex items-center gap-2 px-4.5 py-2.5 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-sm animate-fade-in
                      ${theme === "light"
                        ? "border-neutral-200 bg-neutral-55 hover:bg-neutral-100 text-neutral-700"
                        : "border-white/10 bg-[#0A0A0A]/60 hover:bg-white/5 hover:border-white/20 text-white/75"
                      }`}
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
                        className={`view-switcher-menu absolute right-0 mt-2 w-40 rounded-2xl border p-1.5 shadow-2xl z-50 overflow-hidden
                          ${theme === "light"
                            ? "bg-white border-neutral-200"
                            : "bg-[#1A1A1A] border-white/10"
                          }`}
                      >
                        <button
                          onClick={() => {
                            setViewMode("grid");
                            setIsViewDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                            viewMode === "grid"
                              ? theme === "light"
                                ? "active-view bg-[#EFBF04] text-[#1D1D1F] font-extrabold"
                                : "active-view bg-[#EFBF04] text-neutral-900 font-extrabold"
                              : theme === "light"
                                ? "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
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
                              ? theme === "light"
                                ? "active-view bg-[#EFBF04] text-[#1D1D1F] font-extrabold"
                                : "active-view bg-[#EFBF04] text-neutral-900 font-extrabold"
                              : theme === "light"
                                ? "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
                  {sorted.map((prop, i) => (
                    <motion.div key={prop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }}
                      onClick={() => router.push(`/properties/${prop.id}`)}
                      className="relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden border border-white/10 hover:border-white/25 shadow-lg group transition-all duration-500 bg-neutral-950 cursor-pointer property-card-container flex flex-col md:block md:aspect-[3/4] animate-fade-in">
                      
                      {/* Image container: absolute overlay on desktop, block/relative top on mobile */}
                      <div className="relative w-full h-[220px] sm:h-[260px] md:absolute md:inset-0 md:w-full md:h-full overflow-hidden shrink-0">
                        <img src={prop.image} alt={prop.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                        {/* Developer Logo capsule overlay in top-left */}
                        {prop.developer && (
                          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 sm:px-3.5 sm:py-2 rounded-full flex items-center shadow-md z-20 transition-all duration-350 group-hover:bg-black/80">
                            <DeveloperLogo developer={prop.developer} theme="dark" />
                          </div>
                        )}

                        {/* FOR BUY / FOR RENT badge */}
                        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-white text-black text-[8px] sm:text-[10px] font-semibold px-2 py-1 sm:px-3.5 sm:py-2 rounded-full flex items-center gap-1 shadow-md z-20">
                          <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{prop.type === "buy" ? "For Sale" : "For Rent"}</span>
                        </div>
                      </div>

                      {/* Desktop Content Overlay (hidden on mobile card container) */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 pb-4 sm:p-5 sm:pb-6 z-20 hidden md:block select-none pointer-events-auto">
                        <h3 className="text-white text-xs sm:text-base font-semibold tracking-tight line-clamp-1 mb-1 opacity-90">{prop.title}</h3>
                        <p className="text-white text-base sm:text-2xl font-bold tracking-tight leading-none mb-2.5 sm:mb-4">
                          {formatPrice(prop.priceVal, prop.type as "buy" | "rent")}
                        </p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-2.5 sm:pt-4 gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[12px] font-semibold text-white/90">
                            {prop.beds > 0 ? (
                              <>
                                <span className="flex items-center gap-0.5 sm:gap-1"><BedIcon /><span className="text-white font-bold">{prop.beds}+</span></span>
                                <span className="text-white/25">|</span>
                                <span className="flex items-center gap-0.5 sm:gap-1"><BathIcon /><span className="text-white font-bold">{prop.baths}</span></span>
                                <span className="text-white/25">|</span>
                                <span className="flex items-center gap-0.5 sm:gap-1"><AreaIcon /><span className="text-white/80">{formatArea(prop.area)}</span></span>
                              </>
                            ) : (
                              <span className="flex items-center gap-0.5 sm:gap-1"><AreaIcon /><span className="text-white/80">{formatArea(prop.area)}</span></span>
                            )}
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedProperty(prop); setIsInquiryModalOpen(true); }}
                            className="w-8 h-8 sm:w-11 sm:h-11 bg-white/20 hover:bg-white text-white hover:text-black rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shrink-0 shadow-md">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Mobile Content Block */}
                      <div className="p-4 flex flex-col gap-3.5 md:hidden">
                        <div className="space-y-1.5 text-left">
                          <span className="text-xl font-black text-white">
                            {formatPrice(prop.priceVal, prop.type as "buy" | "rent")}
                          </span>
                          <h3 className="text-sm font-semibold tracking-tight line-clamp-1 transition-colors text-white/90 hover:text-[#EFBF04]">
                            {prop.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-x-2 gap-y-1 flex-wrap text-[11px] font-semibold pt-2.5 border-t border-white/10 text-white/85">
                          {prop.beds > 0 ? (
                            <>
                              <span className="flex items-center gap-1"><BedIcon className="text-white" /><span>{prop.beds} Bed</span></span>
                              <span className="opacity-30">|</span>
                              <span className="flex items-center gap-1"><BathIcon className="text-white" /><span>{prop.baths} Bath</span></span>
                              <span className="opacity-30">|</span>
                              <span className="flex items-center gap-1"><AreaIcon className="text-white" /><span>{formatArea(prop.area)}</span></span>
                            </>
                          ) : (
                            <span className="flex items-center gap-1"><AreaIcon className="text-white" /><span>{formatArea(prop.area)}</span></span>
                          )}
                          <span className="opacity-30">|</span>
                          <span className="flex items-center gap-1">
                            <PriceSqftIcon className="text-white" />
                            <span>
                              {currency === "AED"
                                ? `${Math.round(prop.priceVal / parseFloat(prop.area.replace(/,/g, "").replace(" sq ft", "").replace(" sqft", ""))).toLocaleString("en-US")} AED/sqft`
                                : formatPrice(Math.round(prop.priceVal / parseFloat(prop.area.replace(/,/g, "").replace(" sq ft", "").replace(" sqft", ""))))
                              }
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-left text-white/40">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{prop.location}</span>
                        </div>

                        {/* Call & WhatsApp Buttons following Theme Colors */}
                        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/5">
                          <a
                            href="tel:+97145558888"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProperty(prop);
                              setIsInquiryModalOpen(true);
                            }}
                            className="py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 font-bold text-xs shadow-sm border hover:bg-[#EFBF04]/10 bg-transparent !border-[#EFBF04]"
                            style={{ color: "#EFBF04", borderColor: "#EFBF04" }}
                          >
                            <PhoneIcon className="!text-[#EFBF04]" />
                            <span className="!text-[#EFBF04]">Call</span>
                          </a>

                          <a
                            href={`https://wa.me/97145558888?text=I%20am%20interested%20in%20${encodeURIComponent(prop.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 font-bold text-xs shadow-sm bg-[#EFBF04] hover:bg-[#EFBF04]/90 text-black border border-[#EFBF04]"
                          >
                            <WhatsAppIcon className="!text-black" />
                            <span className="!text-black">WhatsApp</span>
                          </a>
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
                      className={`relative rounded-[1.75rem] overflow-hidden shadow-lg group transition-all duration-500 flex flex-col md:flex-row property-card-list select-none min-h-[260px] cursor-pointer border animate-fade-in
                        ${theme === "light"
                          ? "bg-white border-neutral-200/80 hover:border-neutral-300"
                          : "bg-neutral-950 border-white/10 hover:border-white/25"
                        }`}
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
                      <div className={`flex-1 p-6 md:p-8 flex flex-col justify-between z-20 relative backdrop-blur-sm
                        ${theme === "light"
                          ? "bg-white"
                          : "bg-neutral-900/40"
                        }`}>
                        <div>
                          {/* Listed age & Developer/Tag row */}
                          <div className="flex items-center justify-between gap-4 mb-3.5 flex-wrap">
                            <span className={`text-[10px] uppercase tracking-wider font-semibold
                              ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>
                              Listed {((prop.id * 3) % 12) + 2} days ago
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              {prop.developer && (
                                <div className={`px-3 py-1.5 rounded-full border flex items-center shadow-xs select-none transition-all duration-300
                                  ${theme === "light"
                                    ? "bg-neutral-50 border-neutral-200/80"
                                    : "bg-white/5 border-white/10"
                                  }`}>
                                  <DeveloperLogo developer={prop.developer} theme={theme} />
                                </div>
                              )}
                              {prop.tag && (
                                <span className={`text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1.5 rounded-full border
                                  ${theme === "light"
                                    ? "bg-amber-50 border-amber-200 text-amber-700"
                                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                  }`}>
                                  {prop.tag}
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className={`text-xl md:text-2xl font-bold tracking-tight mb-1 opacity-95 transition-colors line-clamp-1
                            ${theme === "light"
                              ? "text-neutral-900 group-hover:text-[#EFBF04]"
                              : "text-white group-hover:text-[#EFBF04]"
                            }`}>
                            {prop.title}
                          </h3>

                          {/* Highlights subtitle */}
                          <p className={`text-xs md:text-[13px] font-medium tracking-wide mb-3 line-clamp-1
                            ${theme === "light" ? "text-neutral-500" : "text-white/60"}`}>
                            {getHighlights(prop.category, prop.beds)}
                          </p>

                          <div className={`flex items-center gap-1.5 text-[11px] mb-4
                            ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{prop.location}</span>
                          </div>
                        </div>

                        {/* Price & specifications */}
                        <div>
                          <div className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-5 leading-none
                            ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                            {formatPrice(prop.priceVal, prop.type as "buy" | "rent")}
                          </div>

                          {/* Specifications detail bar */}
                          <div className={`flex items-center justify-between border-t pt-5 gap-4
                            ${theme === "light" ? "border-neutral-200/60" : "border-white/10"}`}>
                            <div className={`flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px] font-semibold
                              ${theme === "light" ? "text-neutral-600" : "text-white/90"}`}>
                              {prop.beds > 0 ? (
                                <>
                                  <span className="flex items-center gap-1.5"><BedIcon /><span className={`font-bold ${theme === "light" ? "text-neutral-800" : "text-white"}`}>{prop.beds}</span></span>
                                  <span className={theme === "light" ? "text-neutral-200" : "text-white/20"}>|</span>
                                  <span className="flex items-center gap-1.5"><BathIcon /><span className={`font-bold ${theme === "light" ? "text-neutral-800" : "text-white"}`}>{prop.baths}</span></span>
                                  <span className={theme === "light" ? "text-neutral-200" : "text-white/20"}>|</span>
                                  <span className="flex items-center gap-1.5"><AreaIcon /><span className={theme === "light" ? "text-neutral-600" : "text-white/80"}>{prop.area}</span></span>
                                </>
                              ) : (
                                <span className="flex items-center gap-1.5"><AreaIcon /><span className={theme === "light" ? "text-neutral-600" : "text-white/80"}>{formatArea(prop.area)}</span></span>
                              )}
                              
                              <span className={theme === "light" ? "text-neutral-200" : "text-white/20"}>|</span>
                              <span className="flex items-center gap-1.5">
                                <PriceSqftIcon />
                                <span className={theme === "light" ? "text-neutral-600" : "text-white/80"}>
                                  {currency === "AED"
                                    ? `${Math.round(prop.priceVal / parseFloat(prop.area.replace(/,/g, "").replace(" sq ft", "").replace(" sqft", ""))).toLocaleString("en-US")} AED/sqft`
                                    : formatPrice(Math.round(prop.priceVal / parseFloat(prop.area.replace(/,/g, "").replace(" sq ft", "").replace(" sqft", ""))))
                                  }
                                </span>
                              </span>

                              <span className={theme === "light" ? "text-neutral-200" : "text-white/20"}>|</span>
                              <span className="flex items-center gap-1.5">
                                <CategoryIcon />
                                <span className={`uppercase tracking-wider text-[11px] font-extrabold ${theme === "light" ? "text-neutral-600" : "text-white/80"}`}>
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
                                className="px-6 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 font-bold text-xs tracking-normal shadow-sm bg-[#EFBF04] hover:bg-[#EFBF04]/90 text-black border border-[#EFBF04]"
                              >
                                <PhoneIcon className="!text-black" />
                                <span className="!text-black">Call</span>
                              </a>
                              
                              <a
                                href={`https://wa.me/97145558888?text=I%20am%20interested%20in%20${encodeURIComponent(prop.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="px-6 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 font-bold text-xs tracking-normal shadow-sm bg-[#EFBF04] hover:bg-[#EFBF04]/90 text-black border border-[#EFBF04]"
                              >
                                <WhatsAppIcon className="!text-black" />
                                <span className="!text-black">WhatsApp</span>
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
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-3
                ${theme === "light" ? "text-neutral-400" : "text-white/30"}`}>Buying in UAE</p>
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight leading-snug transition-colors
                ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                Things You<br />Should Know
              </h2>
              <p className={`text-sm font-light leading-relaxed mt-4 transition-colors
                ${theme === "light" ? "text-neutral-500" : "text-white/40"}`}>
                Answers to the most common questions from buyers and renters navigating the UAE property market.
              </p>
            </div>
            <div className={`flex-1 flex flex-col divide-y
              ${theme === "light" ? "divide-neutral-200/70" : "divide-white/8"}`}>
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className="py-5">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group">
                    <span className={`text-sm font-semibold transition-colors
                      ${theme === "light"
                        ? "text-neutral-800 group-hover:text-[#EFBF04]"
                        : "text-white/80 group-hover:text-white"
                      }`}>{faq.q}</span>
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border
                      ${openFaq === i
                        ? theme === "light"
                          ? "bg-[#EFBF04] border-[#EFBF04] text-[#1D1D1F] rotate-45"
                          : "bg-white border-white text-black rotate-45"
                        : theme === "light"
                          ? "border-neutral-250 text-neutral-500 hover:text-neutral-800 hover:border-neutral-350"
                          : "border-white/10 text-white/40 hover:text-white"
                      }`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className={`text-sm font-light leading-relaxed mt-3 overflow-hidden transition-colors
                          ${theme === "light" ? "text-neutral-500" : "text-white/45"}`}>
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
      <div className="properties-footer relative w-full bg-[#1A1A1A] px-6 sm:px-10 md:px-14 lg:px-16 py-24 md:py-32 overflow-hidden text-white font-sans border-t border-white/5">

        {/* Background Image Banner */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Footer Banner Image/AD8Qpts9AmNOiGQ1XK4D2QuFM.png"
            alt="Footer Banner Background"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/95 via-[#1A1A1A]/80 to-[#1A1A1A] z-10 pointer-events-none" />
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInquiryModalOpen(false)} className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className="inquiry-modal relative bg-[#1A1A1A] border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl p-8 z-10 font-sans">
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
                      <input type="text" required value={inquiryName} onChange={e => setInquiryName(e.target.value)} className="w-full mt-1 bg-[#0A0A0A]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Email</label>
                        <input type="email" required value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)} className="w-full mt-1 bg-[#0A0A0A]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30" /></div>
                      <div><label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Phone</label>
                        <input type="tel" required value={inquiryPhone} onChange={e => setInquiryPhone(e.target.value)} className="w-full mt-1 bg-[#0A0A0A]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30" /></div>
                    </div>
                    <div><label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Message</label>
                      <textarea rows={3} required value={inquiryMessage} onChange={e => setInquiryMessage(e.target.value)}
                        placeholder={selectedProperty ? `I am interested in ${selectedProperty.title}.` : "I would like to inquire about properties in the UAE."}
                        className="w-full mt-1 bg-[#0A0A0A]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white/30 resize-none" /></div>
                    <button type="submit" className="w-full py-3.5 bg-[#EFBF04] text-[#1D1D1F] text-[11px] tracking-[0.2em] uppercase font-bold rounded-xl hover:bg-[#EFBF04]/90 transition-colors shadow-lg active:scale-[0.98] cursor-pointer">
                      Request Details
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Full-Screen Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed inset-0 z-50 md:hidden flex flex-col w-full h-full overflow-hidden
              ${theme === "light" ? "bg-white text-neutral-850" : "bg-[#0A0A0A] text-white/90"}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b shrink-0
              ${theme === "light" ? "border-neutral-200 bg-neutral-50/50" : "border-white/10 bg-[#0e0a0d]"}`}
            >
              <h3 className={`text-base font-extrabold tracking-tight ${theme === "light" ? "text-neutral-900" : "text-white"}`}>Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 cursor-pointer
                  ${theme === "light"
                    ? "border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-100"
                    : "border-white/10 text-white/60 bg-white/5 hover:bg-white/10"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* 1. Offer Type */}
              <div className="space-y-3.5 text-left">
                <label className={`text-[10px] uppercase tracking-[0.15em] font-extrabold ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>Offer Type</label>
                <div className={`flex rounded-2xl border p-1 select-none overflow-hidden
                  ${theme === "light" ? "bg-neutral-50/80 border-neutral-200" : "bg-[#161214] border-white/5"}`}
                >
                  {(["all", "buy", "rent"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveType(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                        ${activeType === t
                          ? "bg-[#EFBF04] text-black shadow-sm"
                          : theme === "light" ? "text-neutral-500 hover:text-neutral-800" : "text-white/40 hover:text-white"
                        }`}
                    >
                      {t === "all" ? "Any" : t === "buy" ? "Buy" : "Rent"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Property Type (Category) */}
              <div className="space-y-3.5 text-left">
                <label className={`text-[10px] uppercase tracking-[0.15em] font-extrabold ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>Property Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", label: "Any" },
                    { id: "apartments", label: "Apartment" },
                    { id: "villas", label: "Villa" },
                    { id: "townhouses", label: "Townhouse" },
                    { id: "penthouses", label: "Penthouse" },
                    { id: "plots", label: "Land Plot" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`py-2 px-1 border rounded-xl text-xs font-bold transition-all cursor-pointer text-center select-none
                        ${activeCategory === cat.id
                          ? "bg-[#EFBF04] border-[#EFBF04] text-black shadow-sm"
                          : theme === "light"
                            ? "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-350"
                            : "bg-[#161214] border-white/5 text-white/60 hover:text-white"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Bedrooms */}
              <div className="space-y-3.5 text-left">
                <label className={`text-[10px] uppercase tracking-[0.15em] font-extrabold ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>Bedrooms</label>
                <div className={`flex rounded-2xl border p-1 select-none overflow-hidden
                  ${theme === "light" ? "bg-neutral-50/80 border-neutral-200" : "bg-[#161214] border-white/5"}`}
                >
                  {[
                    { id: "all", label: "Any" },
                    { id: "1", label: "1" },
                    { id: "2", label: "2" },
                    { id: "3", label: "3" },
                    { id: "4+", label: "4+" },
                  ].map((beds) => (
                    <button
                      key={beds.id}
                      onClick={() => setActiveBeds(beds.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                        ${activeBeds === beds.id
                          ? "bg-[#EFBF04] text-black shadow-sm"
                          : theme === "light" ? "text-neutral-500 hover:text-neutral-800" : "text-white/40 hover:text-white"
                        }`}
                    >
                      {beds.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Price Range */}
              <div className="space-y-3.5 text-left">
                <label className={`text-[10px] uppercase tracking-[0.15em] font-extrabold ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "Any Price" },
                    { id: "0-10m", label: "Under 10M AED" },
                    { id: "10m-30m", label: "10M - 30M AED" },
                    { id: "30m-50m", label: "30M - 50M AED" },
                    { id: "50m+", label: "Above 50M AED" },
                  ].map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setActivePriceRange(range.id)}
                      className={`py-2.5 px-3 border rounded-xl text-xs font-bold transition-all cursor-pointer text-center select-none
                        ${activePriceRange === range.id
                          ? "bg-[#EFBF04] border-[#EFBF04] text-black shadow-sm"
                          : theme === "light"
                            ? "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-350"
                            : "bg-[#161214] border-white/5 text-white/60 hover:text-white"
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Location */}
              <div className="space-y-3.5 text-left">
                <label className={`text-[10px] uppercase tracking-[0.15em] font-extrabold ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>Location</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "Any Location" },
                    { id: "Palm Jumeirah", label: "Palm Jumeirah" },
                    { id: "Downtown Dubai", label: "Downtown Dubai" },
                    { id: "Dubai Marina", label: "Dubai Marina" },
                    { id: "Business Bay", label: "Business Bay" },
                    { id: "Dubai Hills", label: "Dubai Hills" },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setActiveLocation(loc.id)}
                      className={`py-2.5 px-3 border rounded-xl text-xs font-bold transition-all cursor-pointer text-center select-none
                        ${activeLocation === loc.id
                          ? "bg-[#EFBF04] border-[#EFBF04] text-black shadow-sm"
                          : theme === "light"
                            ? "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-350"
                            : "bg-[#161214] border-white/5 text-white/60 hover:text-white"
                        }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Completion Status */}
              <div className="space-y-3.5 text-left">
                <label className={`text-[10px] uppercase tracking-[0.15em] font-extrabold ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>Completion Status</label>
                <div className={`flex rounded-2xl border p-1 select-none overflow-hidden
                  ${theme === "light" ? "bg-neutral-50/80 border-neutral-200" : "bg-[#161214] border-white/5"}`}
                >
                  {[
                    { id: "all", label: "Any" },
                    { id: "off-plan", label: "Off-plan" },
                    { id: "ready", label: "Ready" },
                  ].map((status) => (
                    <button
                      key={status.id}
                      onClick={() => setActiveStatus(status.id as "all" | "off-plan" | "ready")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                        ${activeStatus === status.id
                          ? "bg-[#EFBF04] text-black shadow-sm"
                          : theme === "light" ? "text-neutral-500 hover:text-neutral-800" : "text-white/40 hover:text-white"
                        }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Sort By */}
              <div className="space-y-3.5 text-left pb-6">
                <label className={`text-[10px] uppercase tracking-[0.15em] font-extrabold ${theme === "light" ? "text-neutral-450" : "text-white/40"}`}>Sort By</label>
                <div className={`flex rounded-2xl border p-1 select-none overflow-hidden
                  ${theme === "light" ? "bg-neutral-50/80 border-neutral-200" : "bg-[#161214] border-white/5"}`}
                >
                  {[
                    { id: "default", label: "Default" },
                    { id: "price-asc", label: "Low to High" },
                    { id: "price-desc", label: "High to Low" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                        ${sortBy === s.id
                          ? "bg-[#EFBF04] text-black shadow-sm"
                          : theme === "light" ? "text-neutral-500 hover:text-neutral-800" : "text-white/40 hover:text-white"
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className={`p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] border-t shrink-0 flex items-center justify-between gap-4
              ${theme === "light" ? "bg-white border-neutral-200" : "bg-[#0e0a0d] border-white/10"}`}
            >
              <button
                onClick={clearAllFilters}
                className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-all cursor-pointer select-none
                  ${theme === "light"
                    ? "text-neutral-600 hover:text-neutral-800 bg-neutral-100"
                    : "text-white/65 hover:text-white bg-white/5"
                  }`}
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3.5 rounded-xl bg-[#EFBF04] text-black font-extrabold text-xs tracking-wider uppercase text-center active:scale-95 transition-all shadow-lg cursor-pointer select-none"
              >
                Show {sorted.length.toLocaleString("en-US")} results
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile view bottom bar */}
      <div className="md:hidden">
        <InteractiveMenu />
      </div>
    </div>
  );
}
