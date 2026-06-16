"use client";

import React, { use, useState, useMemo } from "react";
import { PROPERTIES_DATA } from "@/data/properties";
import { useTheme } from "@/components/ThemeContext";
import Header from "@/components/Header";
import DeveloperLogo from "@/components/DeveloperLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Icons ──────────────────────────────────────────────────────────────────
const HouseIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-3 h-3 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const BedIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const BathIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const AreaIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.161.001 6.136 1.233 8.375 3.474 2.241 2.241 3.471 5.217 3.47 8.378-.004 6.535-5.33 11.859-11.861 11.859-2.002-.001-3.968-.507-5.714-1.467L0 24zm6.529-3.722c1.642.975 3.25 1.488 4.79 1.49 5.375 0 9.75-4.373 9.753-9.75.002-2.599-1.01-5.044-2.852-6.887s-4.29-2.853-6.896-2.855c-5.376 0-9.753 4.374-9.756 9.752-.001 1.705.474 3.328 1.484 4.856l-1.054 3.849 3.964-1.042zm12.355-6.721c-.328-.164-1.939-.956-2.239-1.065-.3-.11-.519-.165-.738.164-.219.329-.848 1.065-1.039 1.284-.191.219-.383.246-.71.082-.328-.164-1.383-.51-2.637-1.627-.976-.87-1.633-1.947-1.825-2.274-.192-.329-.02-.507.144-.67.147-.146.328-.383.493-.574.164-.192.219-.328.328-.547.11-.219.055-.411-.027-.574-.082-.164-.738-1.777-1.012-2.433-.267-.64-.543-.55-.738-.56-.192-.01-.41-.01-.629-.01s-.574.082-.875.411c-.3.328-1.148 1.12-1.148 2.733 0 1.612 1.176 3.169 1.34 3.387.164.219 2.313 3.532 5.6 4.952.781.338 1.39.54 1.867.691.785.249 1.498.214 2.062.13.629-.094 1.939-.793 2.212-1.559.273-.766.273-1.422.191-1.558-.082-.136-.3-.219-.628-.383z" />
  </svg>
);

const CompareIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current text-amber-500" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


export default function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: rawName } = use(params);
  const router = useRouter();
  const { theme } = useTheme();
  
  // Format developer name from route parameter
  const formattedName = useMemo(() => {
    const decoded = decodeURIComponent(rawName);
    // Standard matches
    if (decoded.toLowerCase() === "emaar") return "Emaar";
    if (decoded.toLowerCase() === "nakheel") return "Nakheel";
    if (decoded.toLowerCase() === "damac") return "Damac";
    if (decoded.toLowerCase() === "sobha-realty" || decoded.toLowerCase() === "sobha") return "Sobha Realty";
    if (decoded.toLowerCase() === "omniyat") return "Omniyat";
    if (decoded.toLowerCase() === "meraas") return "Meraas";
    if (decoded.toLowerCase() === "select-group") return "Select Group";
    if (decoded.toLowerCase() === "al-barari" || decoded.toLowerCase() === "al barari") return "Al Barari";
    if (decoded.toLowerCase() === "maf" || decoded.toLowerCase() === "majid-al-futtaim") return "Majid Al Futtaim";
    if (decoded.toLowerCase() === "dubai-properties") return "Dubai Properties";
    if (decoded.toLowerCase() === "ahs-properties") return "AHS Properties";
    if (decoded.toLowerCase() === "kerzner") return "Kerzner";
    if (decoded.toLowerCase() === "meydan-sobha") return "Meydan Sobha";
    
    // Fallback capitalizing words
    return decoded
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [rawName]);

  // Filter properties matching this developer
  const developerProperties = useMemo(() => {
    return PROPERTIES_DATA.filter((p) => {
      if (!p.developer) return false;
      const devLower = p.developer.toLowerCase();
      const paramLower = rawName.toLowerCase();
      
      // Match Emaar
      if (paramLower === "emaar" && devLower === "emaar") return true;
      // Match Sobha
      if ((paramLower === "sobha" || paramLower === "sobha-realty") && devLower === "sobha realty") return true;
      // Match Nakheel
      if (paramLower === "nakheel" && devLower === "nakheel") return true;
      // Match general slugs (e.g. ahs-properties -> ahs properties)
      return (
        devLower === paramLower ||
        devLower.replace(/\s+/g, "-") === paramLower ||
        paramLower.replace(/-/g, " ") === devLower
      );
    });
  }, [rawName]);

  // Derived locations for filter chips
  const locations = useMemo(() => {
    const list = new Set<string>();
    developerProperties.forEach((p) => {
      // e.g. "Palm Jumeirah, Dubai" -> "Palm Jumeirah"
      const area = p.location.split(",")[0].trim();
      list.add(area);
    });
    return Array.from(list);
  }, [developerProperties]);

  // States
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [propType, setPropType] = useState<string>("all");
  const [bedsFilter, setBedsFilter] = useState<string>("any");
  const [priceFilter, setPriceFilter] = useState<string>("any");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showPropType, setShowPropType] = useState(false);
  const [showBeds, setShowBeds] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    let result = [...developerProperties];
    if (selectedLocation !== "all") {
      result = result.filter((p) => p.location.startsWith(selectedLocation));
    }
    
    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const aVal = a.priceVal || 0;
        const bVal = b.priceVal || 0;
        return aVal - bVal;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const aVal = a.priceVal || 0;
        const bVal = b.priceVal || 0;
        return bVal - aVal;
      });
    }
    
    return result;
  }, [developerProperties, selectedLocation, sortBy]);

  // Count helper
  const totalCount = developerProperties.length;

  // Render Page
  return (
    <div className={`min-h-screen overflow-y-auto pb-24 transition-colors duration-500 font-sans selection:bg-white/20 selection:text-white
      ${theme === "light" ? "bg-white text-neutral-900" : "bg-[#0A0A0A] text-white/90"}`}
    >
      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none z-0" />
      <Header />

      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-16 pt-32">
        {/* Breadcrumbs */}
        <div className={`flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase mb-6
          ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>
          <Link href="/" className={`flex items-center gap-1 transition-colors
            ${theme === "light" ? "hover:text-neutral-800" : "hover:text-white"}`}>
            <HouseIcon />
            <span>Home</span>
          </Link>
          <ChevronRightIcon />
          <Link href="/properties" className={`transition-colors
            ${theme === "light" ? "hover:text-neutral-800" : "hover:text-white"}`}>
            <span>New Off-Plan Projects in UAE</span>
          </Link>
          <ChevronRightIcon />
          <span className="text-[#EFBF04]">
            New Projects by {formattedName}
          </span>
        </div>

        {/* Title & Count */}
        <div className="mb-8 text-left">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase mb-2 leading-tight
            ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
            {totalCount * 12 + 7} New & Off-Plan Projects by {formattedName} Properties
          </h1>
          <p className={`text-sm font-semibold tracking-wide uppercase
            ${theme === "light" ? "text-neutral-500" : "text-white/40"}`}>
            {developerProperties.length} projects with developer stock in our database
          </p>
        </div>

        {/* ── Search / Filter Bar ── */}
        <div className={`mb-6 rounded-2xl border shadow-md overflow-visible p-1.5
          ${theme === "light"
            ? "bg-white border-neutral-200/80 shadow-neutral-100/50"
            : "bg-[#0e0a0d] border-white/10 shadow-black/40"}`}
        >
          <div className="flex items-center flex-wrap gap-0 divide-x divide-neutral-200/40 dark:divide-white/6">

            {/* Search Input with developer chip */}
            <div className="flex items-center gap-2.5 px-4 py-3.5 flex-1 min-w-[220px]">
              {/* Search icon */}
              <svg className="w-4 h-4 shrink-0 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Developer chip */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wide shrink-0 bg-[#EFBF04]/10 border-[#EFBF04]/30 text-[#EFBF04]"
              >
                <span>{formattedName} Properties</span>
                <button className="hover:opacity-60 transition-opacity cursor-pointer" onClick={() => router.push("/properties")}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Location, project or developer"
                className={`flex-1 text-[13px] font-medium bg-transparent outline-none placeholder:opacity-35
                  ${theme === "light" ? "text-neutral-800 placeholder:text-neutral-500" : "text-white placeholder:text-white"}`}
              />
            </div>

            {/* Property Type */}
            <div className="relative">
              <button
                onClick={() => { setShowPropType(!showPropType); setShowBeds(false); setShowPrice(false); }}
                className={`flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap
                  ${propType !== "all" ? "text-[#EFBF04]" : ""}`}
              >
                <span>{propType === "all" ? "Property type" : propType}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${showPropType ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPropType && (
                <div className={`absolute top-full left-0 mt-1 w-44 rounded-xl border shadow-xl z-50 overflow-hidden
                  ${theme === "light" ? "bg-white border-neutral-200" : "bg-neutral-900 border-white/10"}`}
                >
                  {["all", "Apartment", "Villa", "Townhouse", "Penthouse", "Plot"].map((t) => (
                    <button key={t} onClick={() => { setPropType(t); setShowPropType(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer
                        ${propType === t
                          ? "bg-[#EFBF04]/10 text-[#EFBF04]"
                          : theme === "light" ? "hover:bg-neutral-50 text-neutral-700" : "hover:bg-white/5 text-white/80"}`}
                    >
                      {t === "all" ? "Any type" : t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Beds */}
            <div className="relative">
              <button
                onClick={() => { setShowBeds(!showBeds); setShowPropType(false); setShowPrice(false); }}
                className={`flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap
                  ${bedsFilter !== "any" ? "text-[#EFBF04]" : ""}`}
              >
                <span>{bedsFilter === "any" ? "Beds" : bedsFilter + " Beds"}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${showBeds ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showBeds && (
                <div className={`absolute top-full left-0 mt-1 w-36 rounded-xl border shadow-xl z-50 overflow-hidden
                  ${theme === "light" ? "bg-white border-neutral-200" : "bg-neutral-900 border-white/10"}`}
                >
                  {["any", "Studio", "1", "2", "3", "4", "5+"].map((b) => (
                    <button key={b} onClick={() => { setBedsFilter(b); setShowBeds(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer
                        ${bedsFilter === b
                          ? "bg-[#EFBF04]/10 text-[#EFBF04]"
                          : theme === "light" ? "hover:bg-neutral-50 text-neutral-700" : "hover:bg-white/5 text-white/80"}`}
                    >
                      {b === "any" ? "Any" : b === "Studio" ? "Studio" : b + " Bed" + (b === "1" ? "" : "s")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="relative">
              <button
                onClick={() => { setShowPrice(!showPrice); setShowPropType(false); setShowBeds(false); }}
                className={`flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap
                  ${priceFilter !== "any" ? "text-[#EFBF04]" : ""}`}
              >
                <span>{priceFilter === "any" ? "Price" : priceFilter}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${showPrice ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPrice && (
                <div className={`absolute top-full left-0 mt-1 w-52 rounded-xl border shadow-xl z-50 overflow-hidden
                  ${theme === "light" ? "bg-white border-neutral-200" : "bg-neutral-900 border-white/10"}`}
                >
                  {["any", "Under 5M AED", "5M – 15M AED", "15M – 30M AED", "30M – 60M AED", "60M+ AED"].map((p) => (
                    <button key={p} onClick={() => { setPriceFilter(p); setShowPrice(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer
                        ${priceFilter === p
                          ? "bg-[#EFBF04]/10 text-[#EFBF04]"
                          : theme === "light" ? "hover:bg-neutral-50 text-neutral-700" : "hover:bg-white/5 text-white/80"}`}
                    >
                      {p === "any" ? "Any price" : p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Filters */}
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap`}
            >
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              <span>More Filters</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${showMoreFilters ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Find CTA */}
            <div className="px-3 py-2">
              <button className="bg-[#EFBF04] hover:bg-[#EFBF04]/90 text-black active:scale-95 font-bold text-xs tracking-normal px-7 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find
              </button>
            </div>
          </div>

          {/* More Filters expanded panel */}
          {showMoreFilters && (
            <div className={`px-6 py-4 border-t
              ${theme === "light" ? "border-neutral-100 bg-neutral-50" : "border-white/5 bg-white/3"}`}
            >
              <div className="flex flex-wrap gap-6 items-center">
                <div>
                  <p className="text-[11px] font-semibold tracking-normal opacity-55 mb-1.5">Furnishing</p>
                  <div className="flex gap-2">
                    {["Any", "Furnished", "Unfurnished"].map((f) => (
                      <button key={f} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all
                        ${theme === "light" ? "bg-white border-neutral-200 hover:border-indigo-400 text-neutral-700" : "bg-white/5 border-white/10 hover:border-[#EFBF04]/40 text-white/70"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-normal opacity-55 mb-1.5">Completion</p>
                  <div className="flex gap-2">
                    {["Any", "Ready", "Off-Plan"].map((c) => (
                      <button key={c} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all
                        ${theme === "light" ? "bg-white border-neutral-200 hover:border-indigo-400 text-neutral-700" : "bg-white/5 border-white/10 hover:border-[#EFBF04]/40 text-white/70"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-normal opacity-55 mb-1.5">Area (sq ft)</p>
                  <div className="flex gap-2">
                    {["Any", "< 1,000", "1,000–3,000", "3,000+"].map((a) => (
                      <button key={a} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all
                        ${theme === "light" ? "bg-white border-neutral-200 hover:border-indigo-400 text-neutral-700" : "bg-white/5 border-white/10 hover:border-[#EFBF04]/40 text-white/70"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setPropType("all"); setBedsFilter("any"); setPriceFilter("any"); setShowMoreFilters(false); }}
                  className={`ml-auto text-xs font-semibold tracking-normal cursor-pointer underline underline-offset-2 opacity-50 hover:opacity-100 transition-opacity`}>
                  Reset all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Location Chips + Sort Bar ── */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b
          ${theme === "light" ? "border-neutral-200" : "border-white/5"}`}>
          {/* Location Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setSelectedLocation("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-normal border transition-all duration-200 active:scale-95 cursor-pointer
                ${selectedLocation === "all"
                  ? "bg-[#EFBF04] border-[#EFBF04] text-black shadow-md shadow-[#EFBF04]/10 font-bold"
                  : theme === "light"
                    ? "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-350"
                    : "bg-[#0A0A0A]/40 border-white/5 text-white/40 hover:text-white/70 hover:border-white/10"}`}
            >
              All ({(developerProperties.length * 12 + 7)})
            </button>
            {locations.map((loc) => {
              const count = developerProperties.filter((p) => p.location.startsWith(loc)).length;
              return (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-normal border transition-all duration-200 active:scale-95 cursor-pointer
                    ${selectedLocation === loc
                      ? "bg-[#EFBF04] border-[#EFBF04] text-black shadow-md shadow-[#EFBF04]/10 font-bold"
                      : theme === "light"
                        ? "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-350"
                        : "bg-[#0A0A0A]/40 border-white/5 text-white/40 hover:text-white/70 hover:border-white/10"}`}
                >
                  {loc} ({count * 12 + 1})
                </button>
              );
            })}
          </div>

          {/* Sort dropdown & Compare action */}
          <div className="flex items-center gap-3 shrink-0">
            <button className={`px-4 py-2 rounded-xl border text-xs font-semibold tracking-normal flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95
              ${theme === "light"
                ? "bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-350"
                : "bg-white/3 border-white/5 text-white/60 hover:bg-white/8 hover:text-white"}`}
            >
              <CompareIcon />
              <span>Compare</span>
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none pl-4 pr-8 py-2 rounded-xl border text-xs font-semibold tracking-normal focus:outline-none cursor-pointer transition-all duration-200
                  ${theme === "light"
                    ? "bg-white border-neutral-200 text-neutral-700 focus:border-[#EFBF04]"
                    : "bg-white/3 border-white/5 text-white/70 focus:border-[#EFBF04]"}`}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                <svg className="w-3 h-3 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid — 6 per row */}
        {filteredProperties.length === 0 ? (
          <div className={`text-center py-20 border rounded-2xl
            ${theme === "light" ? "bg-neutral-50 border-neutral-200" : "bg-white/3 border-white/5"}`}
          >
            <h3 className={`text-lg font-bold ${theme === "light" ? "text-neutral-500" : "text-white/50"}`}>No listings found</h3>
            <p className={`text-xs mt-1 ${theme === "light" ? "text-neutral-400" : "text-white/30"}`}>
              Please select another location or clear filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 relative z-10">
            {filteredProperties.map((prop, index) => {
              // Agent Expert Card at slot 3 (index 2)
              if (index === 2) {
                const agent = prop.agent || {
                  name: "Sara Al Mansoori",
                  title: "Senior Property Advisor",
                  initials: "SM",
                  rating: 4.9,
                  reviews: 218,
                  responseTime: "< 3 min",
                  languages: ["English", "Arabic"],
                  phone: "+971 50 678 9012"
                };

                return (
                  <div
                    key="expert-agent-card"
                    className={`rounded-2xl p-5 border flex flex-col justify-between text-center shadow-md hover:shadow-xl transition-all duration-500 hover:scale-[1.01]
                      ${theme === "light"
                        ? "bg-white border-neutral-200 text-neutral-800"
                        : "bg-[#1A1A1A] border-white/5 text-white"}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase px-3 py-1 rounded-full mb-3.5 border bg-[#EFBF04]/10 border-[#EFBF04]/20 text-[#EFBF04]">
                        New Projects Expert
                      </span>

                      {/* circular Avatar initials profile */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base mb-3 border relative
                        ${theme === "light"
                          ? "bg-[#EFBF04]/10 border-[#EFBF04]/20 text-[#EFBF04]"
                          : "bg-white/5 border-white/10 text-white"}`}
                      >
                        {agent.initials}
                        <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-[#25D366] border border-white rounded-full" />
                      </div>
                      <h3 className={`text-xs sm:text-sm font-bold tracking-tight uppercase leading-none
                        ${theme === "light" ? "text-neutral-900" : "text-white"}`}>{agent.name}</h3>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider mt-1
                        ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>{agent.title}</p>
                      
                      <div className="flex items-center gap-1 mt-3 select-none justify-center">
                        <StarIcon />
                        <span className={`text-xs font-bold ${theme === "light" ? "text-neutral-700" : "text-white"}`}>{agent.rating}</span>
                        <span className={`text-[10px] font-semibold ${theme === "light" ? "text-neutral-400" : "text-white/30"}`}>({agent.reviews})</span>
                      </div>
                      <p className={`text-xs leading-normal mt-2.5 max-w-[180px] ${theme === "light" ? "text-neutral-500" : "text-white/50"}`}>
                        Investment strategist with years in capital allocation and luxury master community advisory.
                      </p>
                    </div>

                    <div className={`mt-4 pt-4 border-t flex flex-col gap-1.5
                      ${theme === "light" ? "border-neutral-100" : "border-white/5"}`}>
                      <div className={`flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest px-0.5
                        ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>
                        <span>Languages</span>
                        <span>{agent.languages.join(", ")}</span>
                      </div>
                      <div className={`flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest px-0.5
                        ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>
                        <span>Response</span>
                        <span className="text-[#25D366] font-bold">{agent.responseTime}</span>
                      </div>
                      
                      <a
                        href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(agent.name)},%20I%20would%20like%20to%20consult%20on%20upcoming%20projects%20from%20${encodeURIComponent(formattedName)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 mt-2 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95 bg-[#EFBF04] hover:bg-[#EFBF04]/90 text-black border border-[#EFBF04] shadow-md shadow-amber-500/10"
                      >
                        <WhatsAppIcon />
                        <span>WhatsApp Expert</span>
                      </a>
                    </div>
                  </div>
                );
              }

              const price = prop.price;
              const offPlanDelivery = prop.tag === "Off-Plan" ? "Delivery Date: Q1 2030" : null;
              const paymentPlan = prop.tag === "Off-Plan" ? "2 Plans" : "Flexible";

              return (
                <div
                  key={prop.id}
                  onClick={() => router.push(`/properties/${prop.id}`)}
                  className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col cursor-pointer group
                    ${theme === "light"
                      ? "bg-white border-neutral-200 text-neutral-800"
                      : "bg-[#1A1A1A] border-white/5 text-white"}`}
                >
                  {/* Top: Image section */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent z-10" />

                    {/* Developer Logo capsule overlay */}
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full flex items-center shadow-md z-20">
                      <DeveloperLogo developer={prop.developer} theme="dark" />
                    </div>

                    {/* Tag badge + delivery date (only Off-Plan) */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-20">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full
                        ${prop.tag === "Off-Plan"
                          ? "bg-[#EFBF04] text-black font-bold border-none"
                          : "bg-neutral-900/80 text-white border border-white/10"}`}
                      >
                        {prop.tag || "Luxury"}
                      </span>
                      {offPlanDelivery && (
                        <span className="text-[10px] font-bold tracking-normal uppercase bg-black/55 backdrop-blur-sm text-white/90 px-1.5 py-0.5 rounded">
                          {offPlanDelivery}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Info section */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Title & Location */}
                      <h3 className="text-sm sm:text-base font-semibold tracking-tight leading-snug line-clamp-1 mb-1 group-hover:underline">
                        {prop.title}
                      </h3>
                      <p className="text-[10px] font-semibold opacity-50 uppercase tracking-widest line-clamp-1 mb-2">
                        {prop.location}
                      </p>

                      {/* Specs row */}
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold opacity-60 mb-3 flex-wrap">
                        {prop.beds > 0 ? (
                          <>
                            <span className="flex items-center gap-0.5"><BedIcon /> <span>{prop.beds} Beds</span></span>
                            <span className="opacity-30">|</span>
                            <span className="flex items-center gap-0.5"><BathIcon /> <span>{prop.baths}</span></span>
                            <span className="opacity-30">|</span>
                            <span className="flex items-center gap-0.5"><AreaIcon /> <span>{prop.area}</span></span>
                          </>
                        ) : (
                          <span className="flex items-center gap-0.5"><AreaIcon /> <span>{prop.area}</span></span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-neutral-200/10 dark:border-white/5">
                      <span className="block text-[10px] font-bold tracking-widest uppercase opacity-45 leading-none mb-1">
                        Launch Price
                      </span>
                      <div className="flex items-baseline justify-between mb-2.5">
                        <p className="text-sm sm:text-base font-bold tracking-tight leading-none text-[#EFBF04]">
                          {price.startsWith("AED") ? price.substring(4) : price} <span className="text-[10px] font-bold tracking-widest">AED</span>
                        </p>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-[#EFBF04]/10 border-[#EFBF04]/20 text-[#EFBF04]">
                          {paymentPlan}
                        </span>
                      </div>

                      {/* WhatsApp CTA */}
                      <a
                        href={`https://wa.me/${prop.agent.phone.replace(/[^0-9]/g, "")}?text=Hi,%20I%20am%20interested%20in%20learning%20more%20about%20${encodeURIComponent(prop.title)}%20by%20${encodeURIComponent(formattedName)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer active:scale-95 bg-[#EFBF04] hover:bg-[#EFBF04]/90 text-black border border-[#EFBF04] shadow-sm"
                      >
                        <WhatsAppIcon />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
