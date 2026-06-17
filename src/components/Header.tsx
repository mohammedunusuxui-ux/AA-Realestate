"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeContext";
import { usePreferences, LanguageCode, CurrencyCode } from "@/components/PreferencesContext";
import { PROPERTIES_DATA } from "@/data/properties";

const POPULAR_LANGUAGES = [
  { name: "English",          code: "en", region: "US", flagIso: "us" },
  { name: "Ð ÑƒÑÑÐºÐ¸Ð¹",           code: "ru", region: "RU", flagIso: "ru" },
  { name: "Tiáº¿ng Viá»‡t",       code: "vi", region: "VN", flagIso: "vn" },
  { name: "TÃ¼rkÃ§e",            code: "tr", region: "TR", flagIso: "tr" },
  { name: "EspaÃ±ol",           code: "es", region: "ES", flagIso: "es" },
];

const ALL_LANGUAGES = [
  { name: "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©",            code: "ar", region: "AR", flagIso: "sa" },
  { name: "Ð±ÑŠÐ»Ð³Ð°Ñ€ÑÐºÐ¸",          code: "bg", region: "BG", flagIso: "bg" },
  { name: "ÄŒeÅ¡tina",            code: "cz", region: "CZ", flagIso: "cz" },
  { name: "Dansk",              code: "dk", region: "DK", flagIso: "dk" },
  { name: "Deutsch",            code: "de", region: "DE", flagIso: "de" },
  { name: "ÎµÎ»Î»Î·Î½Î¹ÎºÎ¬",           code: "el", region: "EL", flagIso: "gr" },
  { name: "English",            code: "en", region: "US", flagIso: "us" },
  { name: "EspaÃ±ol",            code: "es", region: "ES", flagIso: "es" },
  { name: "Suomeksi",           code: "fi", region: "FI", flagIso: "fi" },
  { name: "FranÃ§ais",           code: "fr", region: "FR", flagIso: "fr" },
  { name: "à¤¹à¤¿à¤¨à¥à¤¦à¥€",              code: "hi", region: "IN", flagIso: "in" },
  { name: "Magyar",             code: "hu", region: "HU", flagIso: "hu" },
  { name: "Bahasa Indonesia",   code: "id", region: "ID", flagIso: "id" },
  { name: "Italiano",           code: "it", region: "IT", flagIso: "it" },
  { name: "æ—¥æœ¬èªž",              code: "ja", region: "JA", flagIso: "jp" },
  { name: "í•œêµ­ì–´",              code: "ko", region: "KR", flagIso: "kr" },
  { name: "Nederlands",         code: "nl", region: "NL", flagIso: "nl" },
  { name: "Norsk",              code: "no", region: "NO", flagIso: "no" },
  { name: "JÄ™zyk polski",       code: "pl", region: "PL", flagIso: "pl" },
  { name: "PortuguÃªs Brasil",   code: "pt", region: "BR", flagIso: "br" },
];

const POPULAR_CURRENCIES = [
  { code: "AED", symbol: "AED", name: "United Arab Emirates Dirham", flagIso: "ae" },
  { code: "USD", symbol: "$", name: "United States Dollar", flagIso: "us" },
  { code: "EUR", symbol: "â‚¬", name: "Euro", flagIso: "eu" },
  { code: "GBP", symbol: "Â£", name: "Great British Pound", flagIso: "gb" },
];

const ALL_CURRENCIES = [
  { code: "AED", symbol: "AED", name: "United Arab Emirates Dirham", flagIso: "ae" },
  { code: "USD", symbol: "$", name: "United States Dollar", flagIso: "us" },
  { code: "EUR", symbol: "â‚¬", name: "Euro", flagIso: "eu" },
  { code: "GBP", symbol: "Â£", name: "Great British Pound", flagIso: "gb" },
  { code: "INR", symbol: "â‚¹", name: "Indian Rupee", flagIso: "in" },
  { code: "RUB", symbol: "â‚½", name: "Russian Ruble", flagIso: "ru" },
  { code: "CNY", symbol: "Â¥", name: "Chinese Yuan", flagIso: "cn" },
];

interface HeaderProps {
  onSelectFilter?: (type: "buy" | "rent", category: string) => void;
  activeType?: "all" | "buy" | "rent";
}

export default function Header({ onSelectFilter, activeType }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle: toggleTheme } = useTheme();
  const { language, setLanguage, currency, setCurrency, t } = usePreferences();

  const [scrolled, setScrolled] = useState(false);
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);
  const [isRentDropdownOpen, setIsRentDropdownOpen] = useState(false);
  const [isNewProjectsDropdownOpen, setIsNewProjectsDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<string | null>(null);
  const toggleMobileAccordion = (key: string) => setMobileAccordionOpen(prev => prev === key ? null : key);

  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [prefActiveTab, setPrefActiveTab] = useState<"language" | "currency">("language");
  const [prefSearchQuery, setPrefSearchQuery] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const isHomePage = pathname === "/";
  const isPropertiesPage = pathname === "/properties";
  const isPropertyDetailPage = pathname.startsWith("/properties/") && pathname !== "/properties";

  const [isSaved, setIsSaved] = useState(false);
  const propertyId = isPropertyDetailPage
    ? parseInt(pathname.split("/").pop() || "0", 10)
    : 0;

  useEffect(() => {
    if (typeof window !== "undefined" && isPropertyDetailPage && propertyId > 0) {
      const savedList = JSON.parse(localStorage.getItem("savedProperties") || "[]");
      setIsSaved(savedList.includes(propertyId));
    }
  }, [isPropertyDetailPage, propertyId]);

  useEffect(() => {
    const handleSavedChange = (e: Event) => {
      const customEvent = e as CustomEvent<number[]>;
      if (isPropertyDetailPage && propertyId > 0) {
        setIsSaved(customEvent.detail.includes(propertyId));
      }
    };
    window.addEventListener("savedPropertiesChange", handleSavedChange);
    return () => {
      window.removeEventListener("savedPropertiesChange", handleSavedChange);
    };
  }, [isPropertyDetailPage, propertyId]);

  const handleSaveToggle = () => {
    if (typeof window !== "undefined" && isPropertyDetailPage && propertyId > 0) {
      const savedList: number[] = JSON.parse(localStorage.getItem("savedProperties") || "[]");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      let newList: number[];
      let message = "";
      if (savedList.includes(propertyId)) {
        newList = savedList.filter(id => id !== propertyId);
        setIsSaved(false);
        message = "Property removed from saved listings";
      } else {
        newList = [...savedList, propertyId];
        setIsSaved(true);
        message = loggedIn 
          ? "Property saved to your account" 
          : "Property saved locally! Log in to sync.";
      }
      localStorage.setItem("savedProperties", JSON.stringify(newList));
      
      // Notify other components of saved list change
      window.dispatchEvent(new CustomEvent("savedPropertiesChange", { detail: newList }));
      window.dispatchEvent(new CustomEvent("propertyDetailToast", { detail: message }));
    }
  };

  const handleShareClick = async () => {
    if (typeof window !== "undefined" && isPropertyDetailPage && propertyId > 0) {
      const property = PROPERTIES_DATA.find((p) => p.id === propertyId);
      const shareUrl = window.location.href;
      const shareTitle = property ? property.title : "AA Real Estate Property";
      const shareText = property
        ? `Check out this amazing property: ${property.title} in ${property.location}`
        : "Check out this amazing property";

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          });
        } catch (error) {
          console.log("Error sharing:", error);
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareUrl);
          window.dispatchEvent(new CustomEvent("propertyDetailToast", { detail: "Link copied to clipboard!" }));
        } catch (err) {
          console.error("Failed to copy link:", err);
        }
      }
    }
  };

  useEffect(() => {
    // Check initial login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setUserEmail(localStorage.getItem("userEmail") || "");

    const handleScroll = (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        setScrolled(target.scrollTop > 50);
      } else {
        setScrolled(window.scrollY > 50);
      }
    };

    const handleCustomScroll = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setScrolled(customEvent.detail);
    };

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isLoggedIn: boolean }>;
      setIsLoggedIn(customEvent.detail.isLoggedIn);
      setUserEmail(localStorage.getItem("userEmail") || "");
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("headerScrollChange", handleCustomScroll);
    window.addEventListener("authStateChange", handleAuthChange);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("headerScrollChange", handleCustomScroll);
      window.removeEventListener("authStateChange", handleAuthChange);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, sectionIndex: number, fallbackHref: string) => {
    if (isHomePage) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("scrollToSection", { detail: sectionIndex }));
    } else {
      // Navigate to home page with section parameter
      router.push(fallbackHref);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onSelectFilter && href.includes("/properties")) {
      e.preventDefault();
      const url = new URL(href, window.location.origin);
      const typeParam = url.searchParams.get("type") as "buy" | "rent" | null;
      const categoryParam = url.searchParams.get("category") || "all";
      onSelectFilter(typeParam || "buy", categoryParam);
      setIsBuyDropdownOpen(false);
      setIsRentDropdownOpen(false);
    }
  };

  const handleAuthButtonClick = () => {
    if (isHomePage) {
      window.dispatchEvent(new CustomEvent("openAuthModal"));
    } else {
      router.push("/?openAuth=true");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center justify-between pointer-events-none ${
          scrolled
            ? theme === "light" && !isHomePage
              ? "bg-white/90 backdrop-blur-md border-b border-neutral-200/50 py-2 md:py-4 px-6 md:px-12"
              : "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 py-2 md:py-4 px-6 md:px-12"
            : "bg-transparent py-3 md:py-8 px-6 md:px-12"
        }`}
      >
        {/* Brand Logo / Back Button */}
        <div className="pointer-events-auto font-sans flex items-center">
          {isPropertyDetailPage ? (
            <>
              {/* Back Button for Mobile Detail Page */}
              <button
                onClick={() => router.back()}
                className={`md:hidden flex items-center justify-center w-10 h-10 -ml-2 rounded-full transition-colors active:scale-95 cursor-pointer
                  ${theme === "light"
                    ? "text-neutral-800 hover:bg-neutral-100"
                    : "text-white hover:bg-white/10"
                  }`}
                aria-label="Go Back"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Desktop-only Logo on detail page */}
              <div className="hidden md:block">
                <Link
                  href="/"
                  className="block select-none hover:opacity-80 transition-all duration-300"
                >
                  <img
                    src="/Logo/AA Real Estate.png"
                    alt="AA Traders Logo"
                    className="h-12 w-auto object-contain"
                  />
                </Link>
              </div>
            </>
          ) : (
            /* Regular logo for other pages */
            <Link
              href="/"
              className="block select-none hover:opacity-80 transition-all duration-300"
            >
              <img
                src="/Logo/AA Real Estate.png"
                alt="AA Traders Logo"
                className="h-9 md:h-12 w-auto object-contain"
              />
            </Link>
          )}
        </div>

        {/* Minimalist Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-14 pointer-events-auto bg-[#1A1A1A]/90 backdrop-blur-md px-12 py-4 rounded-full border border-white/10 shadow-sm font-sans">
          {/* Buy Link & Dropdown */}
          <div
            className="flex items-center"
            onMouseEnter={() => setIsBuyDropdownOpen(true)}
            onMouseLeave={() => setIsBuyDropdownOpen(false)}
          >
            <a
              href="/properties?type=buy"
              onClick={(e) => {
                if (isPropertiesPage && onSelectFilter) {
                  e.preventDefault();
                  onSelectFilter("buy", "all");
                } else {
                  handleNavClick(e, 1, "/properties?type=buy");
                }
              }}
              className={`text-[15px] tracking-[-0.005em] transition-colors py-1 block font-medium cursor-pointer ${
                isBuyDropdownOpen || activeType === "buy" ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {t("buy")}
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
                  <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
                    <div className="grid grid-cols-4 gap-10">
                      {/* Column 1: Residential Properties for Sale */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Residential Properties
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/properties?type=buy&category=apartments" onClick={(e) => handleLinkClick(e, "/properties?type=buy&category=apartments")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Apartments for Sale</Link>
                          <Link href="/properties?type=buy&category=villas" onClick={(e) => handleLinkClick(e, "/properties?type=buy&category=villas")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Villas for Sale</Link>
                          <Link href="/properties?type=buy&category=townhouses" onClick={(e) => handleLinkClick(e, "/properties?type=buy&category=townhouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Townhouses for Sale</Link>
                          <Link href="/properties?type=buy&category=penthouses" onClick={(e) => handleLinkClick(e, "/properties?type=buy&category=penthouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Penthouses for Sale</Link>
                          <Link href="/properties?type=buy&category=plots" onClick={(e) => handleLinkClick(e, "/properties?type=buy&category=plots")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Land / Plots for Sale</Link>
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
                        <Link href="/?section=6" className="mt-6 w-full py-3 bg-white text-black text-[11px] tracking-[0.15em] uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors text-center cursor-pointer shadow-md active:scale-95">
                          Calculate Mortgage
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Horizontal Quick Links */}
                    <div className="border-t border-white/10 pt-8 grid grid-cols-4 gap-6">
                      <Link href="/properties?type=buy" onClick={(e) => handleLinkClick(e, "/properties?type=buy")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Buy Residential
                      </Link>
                      <Link href="/properties?type=buy" onClick={(e) => handleLinkClick(e, "/properties?type=buy")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
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

          {/* Rent Link & Dropdown */}
          <div
            className="flex items-center"
            onMouseEnter={() => setIsRentDropdownOpen(true)}
            onMouseLeave={() => setIsRentDropdownOpen(false)}
          >
            <a
              href="/properties?type=rent"
              onClick={(e) => {
                if (isPropertiesPage && onSelectFilter) {
                  e.preventDefault();
                  onSelectFilter("rent", "all");
                } else {
                  handleNavClick(e, 2, "/properties?type=rent");
                }
              }}
              className={`text-[15px] tracking-[-0.005em] transition-colors py-1 block font-medium cursor-pointer ${
                isRentDropdownOpen || activeType === "rent" ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {t("rent")}
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
                  <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
                    <div className="grid grid-cols-4 gap-10">
                      {/* Column 1: Residential Properties for Rent */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Residential Properties
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/properties?type=rent&category=apartments" onClick={(e) => handleLinkClick(e, "/properties?type=rent&category=apartments")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Apartments for Rent</Link>
                          <Link href="/properties?type=rent&category=studios" onClick={(e) => handleLinkClick(e, "/properties?type=rent&category=studios")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Studios for Rent</Link>
                          <Link href="/properties?type=rent&category=villas" onClick={(e) => handleLinkClick(e, "/properties?type=rent&category=villas")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Villas for Rent</Link>
                          <Link href="/properties?type=rent&category=townhouses" onClick={(e) => handleLinkClick(e, "/properties?type=rent&category=townhouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Townhouses for Rent</Link>
                          <Link href="/properties?type=rent&category=penthouses" onClick={(e) => handleLinkClick(e, "/properties?type=rent&category=penthouses")} className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium text-left">Penthouses for Rent</Link>
                        </div>
                      </div>

                      {/* Column 2: Renter Tools */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Renter Tools
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Rent vs Buy Calculator</Link>
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
                          <Link href="/?section=2" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Renter's Guide</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Area Insights</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Community Guides</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Tower & Compound Guides</Link>
                          <Link href="/?section=4" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Schools & University Guides</Link>
                        </div>
                      </div>

                      {/* Column 4: Premium Renting Guide Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#101b2b] to-[#02050a] border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
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
                      <Link href="/properties?type=rent" onClick={(e) => handleLinkClick(e, "/properties?type=rent")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
                        <span className="w-6.5 h-6.5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </span>
                        Rent Residential
                      </Link>
                      <Link href="/properties?type=rent" onClick={(e) => handleLinkClick(e, "/properties?type=rent")} className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors group font-semibold">
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

          {/* New Projects Link & Dropdown */}
          <div
            className="flex items-center"
            onMouseEnter={() => setIsNewProjectsDropdownOpen(true)}
            onMouseLeave={() => setIsNewProjectsDropdownOpen(false)}
          >
            <a
              href="/?section=4"
              onClick={(e) => handleNavClick(e, 4, "/?section=4")}
              className={`text-[15px] tracking-[-0.005em] transition-colors py-1 block font-medium cursor-pointer ${
                isNewProjectsDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {t("newProjects")}
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
                  <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
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

                      {/* Column 2: Find Developers */}
                      <div className="space-y-5">
                        <h4 className="text-[12px] md:text-[13px] font-bold tracking-[0.18em] uppercase text-white/90">
                          Find Developers
                        </h4>
                        <div className="flex flex-col gap-3.5">
                           <Link href="/developers/emaar" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Emaar Properties</Link>
                           <Link href="/developers/azizi-developments" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Azizi Developments</Link>
                           <Link href="/developers/aldar-properties" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Aldar Properties</Link>
                           <Link href="/developers/damac" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Damac Properties</Link>
                           <Link href="/developers/sobha-realty" className="text-[13px] md:text-[14px] text-white/60 hover:text-white transition-colors font-medium">Sobha Realty</Link>
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

          {/* Tools & Insights Link & Dropdown */}
          <div
            className="flex items-center"
            onMouseEnter={() => setIsToolsDropdownOpen(true)}
            onMouseLeave={() => setIsToolsDropdownOpen(false)}
          >
            <a
              href="/?section=6"
              onClick={(e) => handleNavClick(e, 6, "/?section=6")}
              className={`text-[15px] tracking-[-0.005em] transition-colors py-1 block font-medium cursor-pointer ${
                isToolsDropdownOpen ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {t("toolsInsights")}
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
                  <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-[2.2rem] p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col gap-10 text-left font-sans">
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

          {/* Find Agents Link */}
          <div className="flex items-center">
            <a
              href="/?section=6"
              onClick={(e) => handleNavClick(e, 6, "/?section=6")}
              className="text-[15px] tracking-[-0.005em] transition-colors py-1 block font-medium cursor-pointer text-white/60 hover:text-white"
            >
              {t("findAgents")}
            </a>
          </div>
        </nav>

        {/* Action Button, Theme Toggle & Mobile Menu Trigger */}
        <div className="pointer-events-auto font-sans flex items-center gap-4 relative">
          {/* Theme Toggle (hidden on home page, and hidden on mobile for detail page) */}
          {!isHomePage && (
            <button
              onClick={toggleTheme}
              className={`${isPropertyDetailPage ? "hidden md:flex" : "flex"} w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95
                ${theme === "dark"
                  ? "bg-black border-white/10 text-white/60 hover:text-white hover:bg-neutral-900"
                  : "bg-white border-black/10 text-black/60 hover:text-black hover:bg-neutral-100"}`}
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          )}

          {/* Mobile-only Property Detail Page Header Actions */}
          {isPropertyDetailPage && (
            <>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`md:hidden flex w-9 h-9 items-center justify-center rounded-full transition-all duration-300 cursor-pointer active:scale-95
                  ${theme === "light"
                    ? "text-neutral-800 hover:bg-neutral-100"
                    : "text-white hover:bg-white/10"
                  }`}
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>

              {/* Save (Heart) Button */}
              <button
                onClick={handleSaveToggle}
                className={`md:hidden flex w-9 h-9 items-center justify-center rounded-full transition-all duration-300 cursor-pointer active:scale-95
                  ${theme === "light"
                    ? "text-neutral-800 hover:bg-neutral-100"
                    : "text-white hover:bg-white/10"
                  }`}
                title="Save Property"
              >
                {isSaved ? (
                  <svg className="w-5.5 h-5.5 text-red-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>

              {/* Curved Share Arrow Button */}
              <button
                onClick={handleShareClick}
                className={`md:hidden flex w-9 h-9 items-center justify-center rounded-full transition-all duration-300 cursor-pointer active:scale-95
                  ${theme === "light"
                    ? "text-neutral-800 hover:bg-neutral-100"
                    : "text-white hover:bg-white/10"
                  }`}
                title="Share Property"
              >
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 8l6 6-6 6M21 14H10a8 8 0 00-8 8" />
                </svg>
              </button>
            </>
          )}

          {/* Like Icon — hidden on mobile (available in bottom menu bar) */}
          <button
            onClick={() => {
              if (isLoggedIn) {
                router.push("/profile?tab=saved");
              } else {
                handleAuthButtonClick();
              }
            }}
            className={`hidden md:flex w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95
              ${theme === "dark" || isHomePage
                ? "bg-black border-white/10 text-white/60 hover:text-white hover:bg-neutral-900"
                : "bg-white border-black/10 text-black/60 hover:text-black hover:bg-neutral-100"}`}
            title="Saved Properties"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Preferences Hamburger Button */}
          <button
            onClick={() => setIsPrefModalOpen(true)}
            className={`hidden md:flex w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95
              ${theme === "dark" || isHomePage
                ? "bg-black border-white/10 text-white/60 hover:text-white hover:bg-neutral-900"
                : "bg-white border-black/10 text-black/60 hover:text-black hover:bg-neutral-100"}`}
            title="Language & Currency"
          >
            <svg className="w-4.5 h-4.5 text-current hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Profile / Login — hidden on mobile (available in bottom menu bar) */}
          {isLoggedIn ? (
            <Link href="/profile" className="hidden md:block relative">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 shadow-lg hover:border-white/40 hover:scale-105 cursor-pointer transition-all duration-300 relative select-none">
                <img
                  src="/avatar1.png"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full" />
              </div>
            </Link>
          ) : (
            <button
              onClick={handleAuthButtonClick}
              className={`hidden md:flex px-6 py-2 border text-[10px] tracking-[0.2em] uppercase rounded-full cursor-pointer transition-colors
                ${theme === "light" && !isHomePage
                  ? "border-neutral-200 text-neutral-900 bg-neutral-100/50 hover:bg-neutral-100"
                  : "border-white/20 text-white bg-[#0A0A0A]/20 hover:bg-white/10"}`}
            >
              {t("loginSignup")}
            </button>
          )}

          {/* Mobile Detail Page Contact Actions removed from top header */}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`${isPropertyDetailPage ? "hidden" : "md:hidden"} w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer hover:bg-white/10 active:scale-95 transition-all
              ${theme === "light" && !isHomePage
                ? "bg-neutral-100 border-neutral-200 text-neutral-800"
                : "bg-white/5 border-white/10 text-white"}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-45 bg-[#0A0A0A]/98 backdrop-blur-3xl md:hidden pointer-events-auto flex flex-col"
          >
            {/* Ambient glows */}
            <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

            {/* Scrollable Nav List */}
            <div className="flex-1 overflow-y-auto pt-[72px] pb-28 relative z-10 font-sans">

              {/* â”€â”€â”€ BUY â”€â”€â”€ */}
              <div className="border-b border-white/8">
                <button
                  onClick={() => toggleMobileAccordion("buy")}
                  className="w-full flex items-center justify-between px-6 py-5 text-[17px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer bg-transparent"
                >
                  <span>{t("buy")}</span>
                  <svg className={`w-5 h-5 text-white/40 transition-transform duration-200 ${mobileAccordionOpen === "buy" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {mobileAccordionOpen === "buy" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden bg-white/[0.02]"
                    >
                      <div className="px-6 pt-2 pb-4 flex flex-col">
                        {/* Residential */}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-3 pb-2">Residential for Sale</p>
                        {[["Apartments","apartments"],["Villas","villas"],["Townhouses","townhouses"],["Penthouses","penthouses"],["Land / Plots","plots"]].map(([label, cat]) => (
                          <button key={cat} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); if (isPropertiesPage && onSelectFilter) onSelectFilter("buy", cat); else router.push(`/properties?type=buy&category=${cat}`); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{label} for Sale</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        {/* Buyer Tools */}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Buyer Tools</p>
                        {["Mortgage Calculator","Property Valuation","Investment ROI Calculator","Sale Price Map"].map(item => (
                          <button key={item} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=6"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{item}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        {/* Buying Insights */}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Buying Insights</p>
                        {["Buyer's Guide","Area Insights","Community Guides","Off-Plan Projects"].map(item => (
                          <button key={item} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=4"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{item}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* â”€â”€â”€ RENT â”€â”€â”€ */}
              <div className="border-b border-white/8">
                <button
                  onClick={() => toggleMobileAccordion("rent")}
                  className="w-full flex items-center justify-between px-6 py-5 text-[17px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer bg-transparent"
                >
                  <span>{t("rent")}</span>
                  <svg className={`w-5 h-5 text-white/40 transition-transform duration-200 ${mobileAccordionOpen === "rent" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {mobileAccordionOpen === "rent" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden bg-white/[0.02]"
                    >
                      <div className="px-6 pt-2 pb-4 flex flex-col">
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-3 pb-2">Residential for Rent</p>
                        {[["Apartments","apartments"],["Studios","studios"],["Villas","villas"],["Townhouses","townhouses"],["Penthouses","penthouses"]].map(([label, cat]) => (
                          <button key={cat} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); if (isPropertiesPage && onSelectFilter) onSelectFilter("rent", cat); else router.push(`/properties?type=rent&category=${cat}`); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{label} for Rent</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Renter Tools</p>
                        {["Rent vs Buy Calculator","Rental Price Map","Budget Calculator","Tenant Rights Guide"].map(item => (
                          <button key={item} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=6"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{item}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Renting Insights</p>
                        {["Renter's Guide","Area Insights","Community Guides","Short-Term Rentals"].map(item => (
                          <button key={item} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=2"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{item}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* â”€â”€â”€ NEW PROJECTS â”€â”€â”€ */}
              <div className="border-b border-white/8">
                <button
                  onClick={() => toggleMobileAccordion("projects")}
                  className="w-full flex items-center justify-between px-6 py-5 text-[17px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer bg-transparent"
                >
                  <span>{t("newProjects")}</span>
                  <svg className={`w-5 h-5 text-white/40 transition-transform duration-200 ${mobileAccordionOpen === "projects" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {mobileAccordionOpen === "projects" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden bg-white/[0.02]"
                    >
                      <div className="px-6 pt-2 pb-4 flex flex-col">
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-3 pb-2">By Emirate</p>
                        {["Dubai","Abu Dhabi","Sharjah","Ras Al Khaimah"].map(city => (
                          <button key={city} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=4"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>New Projects in {city}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Top Developers</p>
                        {[["Emaar Properties","/developers/emaar"],["Azizi Developments","/developers/azizi-developments"],["Aldar Properties","/developers/aldar-properties"],["Damac Properties","/developers/damac"],["Sobha Realty","/developers/sobha-realty"]].map(([label, href]) => (
                          <button key={label} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push(href); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{label}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Investing Insights</p>
                        {["Investor's Guide","Areas to Invest","Off-Plan Market Reports","Golden Visa Guidelines"].map(item => (
                          <button key={item} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=4"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{item}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* â”€â”€â”€ TOOLS & INSIGHTS â”€â”€â”€ */}
              <div className="border-b border-white/8">
                <button
                  onClick={() => toggleMobileAccordion("tools")}
                  className="w-full flex items-center justify-between px-6 py-5 text-[17px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer bg-transparent"
                >
                  <span>{t("toolsInsights")}</span>
                  <svg className={`w-5 h-5 text-white/40 transition-transform duration-200 ${mobileAccordionOpen === "tools" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {mobileAccordionOpen === "tools" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden bg-white/[0.02]"
                    >
                      <div className="px-6 pt-2 pb-4 flex flex-col">
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-3 pb-2">Tools</p>
                        {["Mortgage Calculator","Rent vs Buy Calculator","Property Valuation","Investment ROI Calculator"].map(item => (
                          <button key={item} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=6"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{item}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Market Insights</p>
                        {["Dubai Market Trends","Property Price Index","Transaction Reports","Area Price Maps"].map(item => (
                          <button key={item} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=4"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{item}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                        <p className="text-[11px] tracking-[0.14em] uppercase text-white/30 font-bold pt-4 pb-2">Popular Communities</p>
                        {["Dubai Marina","Palm Jumeirah","Downtown Dubai","Arabian Ranches","JVC","Business Bay"].map(area => (
                          <button key={area} onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/properties"); }}
                            className="flex items-center justify-between w-full text-left text-[15px] text-white/70 hover:text-white py-3 border-b border-white/5 transition-colors last:border-0">
                            <span>{area}</span>
                            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* â”€â”€â”€ FIND AGENTS â”€â”€â”€ */}
              <div className="border-b border-white/8">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); router.push("/?section=6"); }}
                  className="w-full flex items-center justify-between px-6 py-5 text-[17px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer bg-transparent"
                >
                  <span>{t("findAgents")}</span>
                  <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* â”€â”€â”€ Language & Currency â”€â”€â”€ */}
              <div className="mx-6 mt-2">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); setPrefActiveTab("language"); setIsPrefModalOpen(true); }}
                  className="flex items-center justify-between w-full py-4 border-b border-white/5 text-[15px] font-medium text-white/50 hover:text-white/80 transition-colors cursor-pointer bg-transparent"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    {language === "ar" ? "Ø§Ù„Ù„ØºØ©" : language === "ru" ? "Ð¯Ð·Ñ‹Ðº" : "Language"}
                  </span>
                  <span className="text-[13px] font-bold text-[#EFBF04] flex items-center gap-1.5">
                    {language === "en" ? "English" : language === "ru" ? "Ð ÑƒÑÑÐºÐ¸Ð¹" : language === "ar" ? "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" : language.toUpperCase()}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </button>
                <button
                  onClick={() => { toggleTheme(); }}
                  className="flex items-center justify-between w-full py-4 border-b border-white/5 text-[15px] font-medium text-white/50 hover:text-white/80 transition-colors cursor-pointer bg-transparent"
                >
                  <span className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                      </svg>
                    )}
                    Theme Mode
                  </span>
                  <span className="text-[13px] font-bold text-[#EFBF04] flex items-center gap-1.5">
                    {theme === "dark" ? "Dark" : "Light"}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setMobileAccordionOpen(null); setPrefActiveTab("currency"); setIsPrefModalOpen(true); }}
                  className="flex items-center justify-between w-full py-4 border-b border-white/5 text-[15px] font-medium text-white/50 hover:text-white/80 transition-colors cursor-pointer bg-transparent"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><rect x="2" y="6" width="20" height="13" rx="2"/><circle cx="12" cy="12.5" r="2.5"/><path strokeLinecap="round" d="M6 10h.01M18 15h.01"/></svg>
                    {language === "ar" ? "Ø§Ù„Ø¹Ù…Ù„Ø©" : language === "ru" ? "Ð’Ð°Ð»ÑŽÑ‚Ð°" : "Currency"}
                  </span>
                  <span className="text-[13px] font-bold text-[#EFBF04] flex items-center gap-1.5">
                    {currency}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </button>
              </div>

              {/* Footer */}
              <p className="mt-8 text-[9px] tracking-[0.25em] uppercase text-white/15 font-light text-center">
                AA TRADERS DEVELOPMENTS &copy; 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal (Language / Currency) */}
      <AnimatePresence>
        {isPrefModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full max-w-4xl max-h-[85vh] rounded-[2rem] overflow-hidden border shadow-2xl flex flex-col font-sans relative select-none
                ${theme === 'light' && !isHomePage
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-[#0E0E10] border-white/10 text-white'}`}
            >
              {/* Top tabs */}
              <div className={`flex items-center justify-between px-8 pt-8 pb-4 border-b ${theme === 'light' && !isHomePage ? 'border-neutral-100' : 'border-white/5'}`}>
                <div className="flex gap-8 text-lg font-bold">
                  <button
                    onClick={() => {
                      setPrefActiveTab("language");
                      setPrefSearchQuery("");
                    }}
                    className={`pb-2 transition-all relative font-medium cursor-pointer flex items-center gap-2 ${
                      prefActiveTab === "language"
                        ? theme === 'light' && !isHomePage ? 'text-black font-semibold' : 'text-white font-semibold'
                        : 'text-neutral-400 hover:text-neutral-300'
                    }`}
                  >
                    {/* Globe / Language icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Language
                    {prefActiveTab === "language" && (
                      <motion.span
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPrefActiveTab("currency");
                      setPrefSearchQuery("");
                    }}
                    className={`pb-2 transition-all relative font-medium cursor-pointer flex items-center gap-2 ${
                      prefActiveTab === "currency"
                        ? theme === 'light' && !isHomePage ? 'text-black font-semibold' : 'text-white font-semibold'
                        : 'text-neutral-400 hover:text-neutral-300'
                    }`}
                  >
                    {/* Banknotes / Currency icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <rect x="2" y="6" width="20" height="13" rx="2" />
                      <circle cx="12" cy="12.5" r="2.5" />
                      <path strokeLinecap="round" d="M6 10h.01M18 15h.01" />
                    </svg>
                    Currency
                    {prefActiveTab === "currency" && (
                      <motion.span
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </button>
                </div>
                
                {/* Close X button */}
                <button
                  onClick={() => setIsPrefModalOpen(false)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    theme === 'light' && !isHomePage
                      ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search input */}
              <div className="p-8 pb-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={prefSearchQuery}
                    onChange={(e) => setPrefSearchQuery(e.target.value)}
                    className={`w-full py-3.5 pl-12 pr-6 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${theme === 'light' && !isHomePage
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                        : 'bg-[#18181B] border-white/5 text-white placeholder-neutral-500'}`}
                  />
                </div>
              </div>

              {/* Scrollable list contents */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8 min-h-[350px]">
                {prefActiveTab === "language" ? (
                  <>
                    {/* Popular languages section */}
                    {prefSearchQuery === "" && (
                      <div className="space-y-4">
                        <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-neutral-400">
                          Popular languages
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {POPULAR_LANGUAGES.map((langItem) => {
                            const isSelected = language === langItem.code;
                            return (
                              <button
                                key={`pop-${langItem.code}-${langItem.region}`}
                                onClick={() => {
                                  setLanguage(langItem.code as LanguageCode);
                                  setIsPrefModalOpen(false);
                                }}
                                className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]
                                  ${isSelected
                                    ? theme === 'light' && !isHomePage
                                      ? 'bg-neutral-100 border-neutral-300 shadow-sm'
                                      : 'bg-white/5 border-white/20 shadow-sm'
                                    : theme === 'light' && !isHomePage
                                      ? 'bg-neutral-50/50 border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200'
                                      : 'bg-[#18181B]/40 border-transparent hover:bg-[#18181B] hover:border-white/5'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={`https://flagcdn.com/w40/${langItem.flagIso}.png`}
                                    srcSet={`https://flagcdn.com/w80/${langItem.flagIso}.png 2x`}
                                    alt={langItem.name}
                                    width={28}
                                    height={21}
                                    className="rounded-sm object-cover shrink-0 shadow-sm"
                                    style={{ aspectRatio: '4/3' }}
                                  />
                                  <div>
                                    <div className="font-semibold text-[15px]">{langItem.name}</div>
                                    <div className="text-xs text-neutral-400">{langItem.region}</div>
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* All languages section */}
                    <div className="space-y-4">
                      <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-neutral-400">
                        {prefSearchQuery === "" ? "All languages" : "Search results"}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ALL_LANGUAGES.filter((langItem) =>
                          langItem.name.toLowerCase().includes(prefSearchQuery.toLowerCase()) ||
                          langItem.code.toLowerCase().includes(prefSearchQuery.toLowerCase()) ||
                          langItem.region.toLowerCase().includes(prefSearchQuery.toLowerCase())
                        ).map((langItem) => {
                            const isSelected = language === langItem.code;
                          return (
                            <button
                              key={`all-${langItem.code}-${langItem.region}`}
                              onClick={() => {
                                setLanguage(langItem.code as LanguageCode);
                                setIsPrefModalOpen(false);
                              }}
                              className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]
                                ${isSelected
                                  ? theme === 'light' && !isHomePage
                                    ? 'bg-neutral-100 border-neutral-300 shadow-sm'
                                    : 'bg-white/5 border-white/20 shadow-sm'
                                  : theme === 'light' && !isHomePage
                                    ? 'bg-neutral-50/50 border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200'
                                    : 'bg-[#18181B]/40 border-transparent hover:bg-[#18181B] hover:border-white/5'}`}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://flagcdn.com/w40/${langItem.flagIso}.png`}
                                  srcSet={`https://flagcdn.com/w80/${langItem.flagIso}.png 2x`}
                                  alt={langItem.name}
                                  width={28}
                                  height={21}
                                  className="rounded-sm object-cover shrink-0 shadow-sm"
                                  style={{ aspectRatio: '4/3' }}
                                />
                                <div>
                                  <div className="font-semibold text-[15px]">{langItem.name}</div>
                                  <div className="text-xs text-neutral-400">{langItem.region}</div>
                                </div>
                              </div>
                              {isSelected && (
                                <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Popular currencies section */}
                    {prefSearchQuery === "" && (
                      <div className="space-y-4">
                        <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-neutral-400">
                          Popular currencies
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {POPULAR_CURRENRENCIES_ITEMS().map((currItem) => {
                            const isSelected = currency === currItem.code;
                            return (
                              <button
                                key={`pop-${currItem.code}`}
                                onClick={() => {
                                  setCurrency(currItem.code as CurrencyCode);
                                  setIsPrefModalOpen(false);
                                }}
                                className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]
                                  ${isSelected
                                    ? theme === 'light' && !isHomePage
                                      ? 'bg-neutral-100 border-neutral-300 shadow-sm'
                                      : 'bg-white/5 border-white/20 shadow-sm'
                                    : theme === 'light' && !isHomePage
                                      ? 'bg-neutral-50/50 border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200'
                                      : 'bg-[#18181B]/40 border-transparent hover:bg-[#18181B] hover:border-white/5'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={`https://flagcdn.com/w40/${currItem.flagIso}.png`}
                                    srcSet={`https://flagcdn.com/w80/${currItem.flagIso}.png 2x`}
                                    alt={currItem.name}
                                    width={28}
                                    height={21}
                                    className="rounded-sm object-cover shrink-0 shadow-sm"
                                    style={{ aspectRatio: '4/3' }}
                                  />
                                  <div>
                                    <div className="font-semibold text-[15px]">{currItem.code} ({currItem.symbol})</div>
                                    <div className="text-xs text-neutral-400">{currItem.name}</div>
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* All currencies section */}
                    <div className="space-y-4">
                      <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-neutral-400">
                        {prefSearchQuery === "" ? "All currencies" : "Search results"}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ALL_CURRENCIES.filter((currItem) =>
                          currItem.code.toLowerCase().includes(prefSearchQuery.toLowerCase()) ||
                          currItem.name.toLowerCase().includes(prefSearchQuery.toLowerCase())
                        ).map((currItem) => {
                          const isSelected = currency === currItem.code;
                          return (
                            <button
                              key={`all-${currItem.code}`}
                              onClick={() => {
                                setCurrency(currItem.code as CurrencyCode);
                                setIsPrefModalOpen(false);
                              }}
                              className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]
                                ${isSelected
                                  ? theme === 'light' && !isHomePage
                                    ? 'bg-neutral-100 border-neutral-300 shadow-sm'
                                    : 'bg-white/5 border-white/20 shadow-sm'
                                  : theme === 'light' && !isHomePage
                                    ? 'bg-neutral-50/50 border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200'
                                    : 'bg-[#18181B]/40 border-transparent hover:bg-[#18181B] hover:border-white/5'}`}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://flagcdn.com/w40/${currItem.flagIso}.png`}
                                  srcSet={`https://flagcdn.com/w80/${currItem.flagIso}.png 2x`}
                                  alt={currItem.name}
                                  width={28}
                                  height={21}
                                  className="rounded-sm object-cover shrink-0 shadow-sm"
                                  style={{ aspectRatio: '4/3' }}
                                />
                                <div>
                                  <div className="font-semibold text-[15px]">{currItem.code} ({currItem.symbol})</div>
                                  <div className="text-xs text-neutral-400">{currItem.name}</div>
                                </div>
                              </div>
                              {isSelected && (
                                <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation / Property Detail Contact Bar (Conditional) */}
      {isPropertyDetailPage ? (
        <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-center gap-6 px-6 border-t transition-all duration-500 h-[76px] pb-safe pointer-events-auto
          ${theme === "light"
            ? "bg-white/95 backdrop-blur-md border-neutral-200/60 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
            : "bg-[#0A0A0A]/95 backdrop-blur-md border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
          }`}
        >
          {/* Call Button */}
          <a
            href="tel:+97145558888"
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 shadow-md cursor-pointer
              ${theme === "light"
                ? "bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200"
                : "bg-neutral-900 border-white/10 text-white hover:bg-neutral-800"}`}
            title="Call Us"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305 1.305a12.083 12.083 0 005.723 5.723l1.305-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>

          {/* Chat Button */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("toggleChat"));
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 shadow-md cursor-pointer
              ${theme === "light"
                ? "bg-[#10b981]/10 border-[#10b981]/25 text-[#10b981] hover:bg-[#10b981]/20"
                : "bg-[#10b981]/10 border-[#10b981]/25 text-[#34d399] hover:bg-[#10b981]/20"}`}
            title="Chat"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* Email Inquiry Button */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("openInquiryModal"));
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 shadow-md cursor-pointer
              ${theme === "light"
                ? "bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200"
                : "bg-neutral-900 border-white/10 text-white hover:bg-neutral-800"}`}
            title="Send Inquiry"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      ) : (
        <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around px-2 border-t transition-all duration-500 h-[68px] pb-safe pointer-events-auto
          ${theme === "light" && !isHomePage
            ? "bg-white/95 backdrop-blur-md border-neutral-200/60 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] text-neutral-600"
            : "bg-[#0A0A0A]/95 backdrop-blur-md border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] text-white/60"
          }`}
        >
          {/* Home Tab */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === "/" ? "text-[#EFBF04] font-bold" : "opacity-75 hover:opacity-100"
            }`}
          >
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] tracking-wide mt-1">
              {language === "ar" ? "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" : language === "ru" ? "Ð“Ð»Ð°Ð²Ð½Ð°Ñ" : "Home"}
            </span>
          </Link>

          {/* Search Tab */}
          <Link
            href="/properties"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === "/properties" ? "text-[#EFBF04] font-bold" : "opacity-75 hover:opacity-100"
            }`}
          >
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] tracking-wide mt-1">
              {language === "ar" ? "Ø§Ù„Ø¨Ø­Ø«" : language === "ru" ? "ÐŸÐ¾Ð¸ÑÐº" : "Search"}
            </span>
          </Link>

          {/* Projects Tab */}
          <Link
            href="/?section=4"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("scrollToSection", { detail: 4 }));
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/developers") ? "text-[#EFBF04] font-bold" : "opacity-75 hover:opacity-100"
            }`}
          >
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-[10px] tracking-wide mt-1">
              {language === "ar" ? "Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹" : language === "ru" ? "ÐŸÑ€Ð¾ÐµÐºÑ‚Ñ‹" : "Projects"}
            </span>
          </Link>

          {/* Shortlist Tab */}
          <button
            onClick={() => {
              if (isLoggedIn) {
                router.push("/profile?tab=saved");
              } else {
                handleAuthButtonClick();
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              pathname === "/profile" && typeof window !== "undefined" && window.location.search.includes("tab=saved")
                ? "text-[#EFBF04] font-bold"
                : "opacity-75 hover:opacity-100"
            }`}
          >
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[10px] tracking-wide mt-1">
              {language === "ar" ? "Ø§Ù„Ù…ÙØ¶Ù„Ø©" : language === "ru" ? "Ð˜Ð·Ð±Ñ€Ð°Ð½Ð½Ð¾Ðµ" : "Saved"}
            </span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => {
              if (isLoggedIn) {
                router.push("/profile");
              } else {
                handleAuthButtonClick();
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
              pathname === "/profile" && !(typeof window !== "undefined" && window.location.search.includes("tab=saved"))
                ? "text-[#EFBF04] font-bold"
                : "opacity-75 hover:opacity-100"
            }`}
          >
            {isLoggedIn ? (
               <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 relative">
                 <img src="/avatar1.png" alt="User Avatar" className="w-full h-full object-cover" />
               </div>
            ) : (
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            <span className="text-[10px] tracking-wide mt-1">
              {language === "ar" ? "Ø­Ø³Ø§Ø¨ÙŠ" : language === "ru" ? "ÐšÐ°Ð±Ð¸Ð½ÐµÑ‚" : "Profile"}
            </span>
          </button>
        </div>
      )}

      {/* Global CSS Inject to add padding offset at the bottom on mobile viewports */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .properties-page,
          .profile-page,
          main,
          div[class*="pb-24"] {
            padding-bottom: 84px !important;
          }
        }
      `}} />
    </>
  );
}

// Helper to keep mapping references clear outside component scope
function POPULAR_CURRENRENCIES_ITEMS() {
  return POPULAR_CURRENCIES;
}
