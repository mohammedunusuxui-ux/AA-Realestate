"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PROPERTIES_DATA, AGENTS_LIST, TOP_CATEGORIES } from "@/data/properties";
import { useTheme } from "@/components/ThemeContext";

// ─── Icon Components ───────────────────────────────────────────────────────────

const Icon = ({ d, className = "w-5 h-5" }: { d: string; className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  dashboard:    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  properties:   "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  agents:       "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  clients:      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  inquiries:    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  transactions: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  analytics:    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  settings:     "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  bell:         "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  search:       "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  menu:         "M4 6h16M4 12h16M4 18h16",
  close:        "M6 18L18 6M6 6l12 12",
  trending_up:  "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  trending_down:"M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
  building:     "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5",
  star:         "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  plus:         "M12 4v16m8-8H4",
  calendar:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  export:       "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  eye:          "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  check:        "M5 13l4 4L19 7",
  clock:        "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  location:     "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
};

// ─── Type Definitions ───────────────────────────────────────────────────────────

type NavSection = "dashboard" | "properties" | "agents" | "clients" | "inquiries" | "transactions" | "analytics" | "settings";

// ─── Simulated Data ─────────────────────────────────────────────────────────────

const RECENT_INQUIRIES = [
  { id: 1, client: "Arjun Mehta",      property: "Royal Atlantis Signature Penthouse", type: "Viewing Request",  time: "5 min ago",   status: "New",      avatar: "AM" },
  { id: 2, client: "Sophie Laurent",   property: "One Canal Ultra-Luxury Villa",       type: "Price Inquiry",   time: "22 min ago",  status: "Replied",  avatar: "SL" },
  { id: 3, client: "Wang Fang",        property: "DIFC Executive Penthouse",           type: "Viewing Request",  time: "1 hr ago",    status: "Pending",  avatar: "WF" },
  { id: 4, client: "David Okonkwo",    property: "Bulgari Resort Loft Residence",      type: "Documentation",   time: "3 hr ago",    status: "Replied",  avatar: "DO" },
  { id: 5, client: "Priya Krishnan",   property: "Emaar Beachfront Sky Villa",         type: "Price Inquiry",   time: "5 hr ago",    status: "Closed",   avatar: "PK" },
  { id: 6, client: "Mohammed Al Ali",  property: "Palm Jumeirah Waterfront Mansion",   type: "Viewing Request",  time: "Yesterday",   status: "New",      avatar: "MA" },
];

const MONTHLY_SALES = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 18 },
  { month: "Mar", value: 15 },
  { month: "Apr", value: 22 },
  { month: "May", value: 28 },
  { month: "Jun", value: 35 },
  { month: "Jul", value: 30 },
  { month: "Aug", value: 42 },
  { month: "Sep", value: 38 },
  { month: "Oct", value: 45 },
  { month: "Nov", value: 52 },
  { month: "Dec", value: 48 },
];

const NAV_ITEMS: { key: NavSection; label: string; iconKey: keyof typeof ICONS; badge?: number }[] = [
  { key: "dashboard",    label: "Dashboard",    iconKey: "dashboard"    },
  { key: "properties",  label: "Properties",   iconKey: "properties", badge: 58 },
  { key: "agents",      label: "Agents",       iconKey: "agents",     badge: 10 },
  { key: "clients",     label: "Clients",      iconKey: "clients"      },
  { key: "inquiries",   label: "Inquiries",    iconKey: "inquiries",  badge: 6  },
  { key: "transactions",label: "Transactions", iconKey: "transactions" },
  { key: "analytics",   label: "Analytics",    iconKey: "analytics"    },
  { key: "settings",    label: "Settings",     iconKey: "settings"     },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, trend, trendDir,
}: {
  label: string; value: string; sub: string; trend: string; trendDir: "up" | "down" | "neutral";
}) {
  const trendColor =
    trendDir === "up" ? "text-emerald-400" : trendDir === "down" ? "text-red-400" : "text-white/40";
  const TrendIcon = trendDir === "up" ? ICONS.trending_up : ICONS.trending_down;

  return (
    <div className="relative bg-[#111111] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3 overflow-hidden group hover:border-[#C8994A]/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8994A]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <p className="text-[13px] font-semibold text-white/40 tracking-normal capitalize">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
      <div className="flex items-center justify-between mt-auto">
        <p className="text-[12px] text-white/35 font-medium">{sub}</p>
        <span className={`flex items-center gap-1 text-[12px] font-semibold ${trendColor}`}>
          {trendDir !== "neutral" && (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={TrendIcon} />
            </svg>
          )}
          {trend}
        </span>
      </div>
      {/* Gold bottom bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#C8994A] to-[#e8bf7a] group-hover:w-full transition-all duration-500 rounded-b-2xl" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "New":     "bg-[#C8994A]/15 text-[#C8994A] border border-[#C8994A]/30",
    "Replied": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    "Pending": "bg-amber-500/10  text-amber-400  border border-amber-500/20",
    "Closed":  "bg-white/5       text-white/35   border border-white/10",
    "For Sale":"bg-[#C8994A]/15 text-[#C8994A] border border-[#C8994A]/30",
    "For Rent":"bg-sky-500/10    text-sky-400   border border-sky-500/20",
    "Sold":    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    "Off-Plan":"bg-purple-500/10 text-purple-400 border border-purple-500/20",
  };
  const cls = styles[status] ?? "bg-white/5 text-white/35 border border-white/10";
  return (
    <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${cls}`}>
      {status}
    </span>
  );
}

// SVG Bar Chart
function BarChart() {
  const max = Math.max(...MONTHLY_SALES.map((d) => d.value));
  return (
    <div className="flex items-end gap-1.5 h-32 w-full">
      {MONTHLY_SALES.map((d, i) => {
        const pct = (d.value / max) * 100;
        const isLast3 = i >= 9;
        return (
          <div key={d.month} className="flex flex-col items-center gap-1 flex-1 group/bar">
            <div className="relative w-full flex flex-col justify-end" style={{ height: "100px" }}>
              <div
                className={`w-full rounded-t-md transition-all duration-700 ${
                  isLast3
                    ? "bg-gradient-to-t from-[#C8994A] to-[#e8bf7a]"
                    : "bg-white/10 group-hover/bar:bg-white/20"
                }`}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-white/35 font-semibold">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// SVG Donut Chart
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="12" />
          {segments.map((seg, i) => {
            const dashLength = (seg.value / total) * circumference;
            const dashOffset = circumference - cumulative * (circumference / total);
            cumulative += seg.value;
            return (
              <circle
                key={i}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={-((cumulative - seg.value) / total) * circumference}
                strokeLinecap="butt"
                style={{ transition: "stroke-dasharray 0.8s ease" }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{total}</span>
          <span className="text-[9px] text-white/40 font-medium">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[11px] text-white/60 font-medium">{seg.label}</span>
            <span className="text-[11px] text-white/90 font-bold ml-auto pl-2">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [activeNav, setActiveNav] = useState<NavSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [listingsPage, setListingsPage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    // Set initial responsive state
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const recentListings = useMemo(
    () => PROPERTIES_DATA.slice(0, 8),
    []
  );

  const topAgents = useMemo(() => AGENTS_LIST.slice(0, 4), []);

  const categoryData = useMemo(
    () =>
      TOP_CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
        label: c.label,
        count: parseInt(c.count.replace(/,/g, ""), 10),
      })),
    []
  );

  const maxCategoryCount = Math.max(...categoryData.map((c) => c.count));

  const donutSegments = [
    { label: "For Sale",  value: 34, color: "#C8994A" },
    { label: "For Rent",  value: 16, color: "#38bdf8" },
    { label: "Sold",      value:  5, color: "#34d399" },
    { label: "Off-Plan",  value:  3, color: "#a78bfa" },
  ];

  const LISTINGS_PER_PAGE = 5;
  const paginatedListings = recentListings.slice(
    listingsPage * LISTINGS_PER_PAGE,
    listingsPage * LISTINGS_PER_PAGE + LISTINGS_PER_PAGE
  );

  return (
    <div className="admin-dashboard fixed inset-0 flex h-screen overflow-hidden bg-[#030102]" style={{ fontFamily: "var(--font-roboto), ui-sans-serif, system-ui, sans-serif" }}>

      {/* Backdrop for mobile sidebar drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:relative z-30 flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] transition-all duration-300 shrink-0 h-full lg:h-auto ${
          sidebarOpen ? "w-60 translate-x-0" : "w-0 lg:w-[60px] -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar glow */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#C8994A]/5 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.05] relative z-10 ${sidebarOpen ? "justify-start" : "justify-center"}`}>
          <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden">
            <Image
              src="/Logo/AA Real Estate.png"
              alt="AA Traders"
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-[13px] font-bold text-white tracking-tight leading-none">AA TRADERS</p>
              <p className="text-[10px] text-[#C8994A] tracking-[0.2em] uppercase font-bold mt-0.5">Admin Portal</p>
            </div>
          )}
        </div>

        {/* Nav label */}
        {sidebarOpen && (
          <p className="px-4 pt-5 pb-2 text-[9.5px] tracking-wider uppercase text-white/25 font-bold">Navigation</p>
        )}

        {/* Nav Items */}
        <nav className="flex flex-col gap-0.5 px-2 flex-1 relative z-10 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                id={`nav-${item.key}`}
                onClick={() => setActiveNav(item.key)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 w-full transition-all duration-200 cursor-pointer relative group ${
                  isActive
                    ? "bg-[#C8994A]/15 text-[#C8994A]"
                    : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                } ${!sidebarOpen ? "justify-center" : ""}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C8994A] rounded-r-full" />
                )}
                <Icon d={ICONS[item.iconKey]} className="w-4.5 h-4.5 shrink-0 w-[18px] h-[18px]" />
                {sidebarOpen && (
                  <>
                    <span className="text-[13px] font-semibold flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-[#C8994A]/20 text-[#C8994A]" : "bg-white/8 text-white/40"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {/* Tooltip on collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded-lg text-[11px] text-white/80 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile at bottom */}
        <div className={`relative z-10 border-t border-white/[0.05] p-3 ${!sidebarOpen ? "flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8994A] to-[#a0723a] flex items-center justify-center text-[11px] font-bold text-black shrink-0">
              AD
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white/90 truncate">Admin</p>
                <p className="text-[10px] text-white/35 truncate">admin@aatrade.ae</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top Bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-[#080808] border-b border-white/[0.06] shrink-0">
          {/* Sidebar toggle */}
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen((s) => !s)}
            className="text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <Icon d={ICONS.menu} className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-white/30 font-medium">Dashboard</span>
            <span className="text-white/15">›</span>
            <span className="text-white/80 font-semibold capitalize">{activeNav}</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-[160px] sm:max-w-sm ml-2 sm:ml-4 relative">
            <Icon d={ICONS.search} className="w-4 h-4 text-white/25 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="admin-search"
              type="text"
              placeholder="Search properties, agents…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2 text-[12px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#C8994A]/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Date */}
            <span className="text-[11px] text-white/30 font-medium hidden md:block">
              {new Date().toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>

            {/* Theme Toggle */}
            <button
              id="admin-theme-toggle"
              onClick={toggleTheme}
              className="text-white/40 hover:text-white/80 transition-colors p-2 rounded-xl hover:bg-white/5 cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* Bell */}
            <button id="admin-notifications" className="relative text-white/40 hover:text-white/80 transition-colors p-2 rounded-xl hover:bg-white/5 cursor-pointer">
              <Icon d={ICONS.bell} className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C8994A] rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8994A] to-[#a0723a] flex items-center justify-center text-[11px] font-bold text-black cursor-pointer">
              AD
            </div>
          </div>
        </header>

        {/* ── Dashboard Content ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none"
          style={{ scrollbarWidth: "none" }}>

          {/* Welcome Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, Admin</h1>
              <p className="text-[13.5px] text-white/40 mt-1">Here's what's happening with your portfolio today.</p>
            </div>
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button id="btn-add-property" className="flex items-center gap-2 bg-[#C8994A] hover:bg-[#b8893a] text-black text-[12px] font-bold tracking-[0.1em] uppercase px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-[0_0_20px_rgba(200,153,74,0.3)]">
                <Icon d={ICONS.plus} className="w-3.5 h-3.5" />
                Add Property
              </button>
              <button id="btn-add-agent" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 text-[12px] font-bold tracking-[0.1em] uppercase px-4 py-2 rounded-xl border border-white/10 transition-all duration-200 cursor-pointer">
                <Icon d={ICONS.plus} className="w-3.5 h-3.5" />
                Add Agent
              </button>
              <button id="btn-export" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 text-[12px] font-bold tracking-[0.1em] uppercase px-4 py-2 rounded-xl border border-white/10 transition-all duration-200 cursor-pointer">
                <Icon d={ICONS.export} className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Listings"
              value="58"
              sub="Active on platform"
              trend="+12.4% vs last month"
              trendDir="up"
            />
            <KpiCard
              label="Active Agents"
              value="10"
              sub="Certified advisors"
              trend="2 new this month"
              trendDir="up"
            />
            <KpiCard
              label="This Month Inquiries"
              value="142"
              sub="Across all properties"
              trend="+8.1% vs last month"
              trendDir="up"
            />
            <KpiCard
              label="Portfolio Value"
              value="AED 4.2B"
              sub="Combined listing value"
              trend="+3.2% vs Q3"
              trendDir="up"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Monthly Deals Chart */}
            <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14.5px] font-bold text-white/90">Monthly Deals Closed</h3>
                  <p className="text-[12px] text-white/35 mt-0.5">12-month performance overview</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#C8994A] to-[#e8bf7a]" />
                  <span className="text-[11.5px] text-white/40 font-medium">Deals</span>
                </div>
              </div>
              <BarChart />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
                <div>
                  <p className="text-[12px] text-white/35">Total deals YTD</p>
                  <p className="text-2xl font-bold text-white">385</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-[12.5px] font-semibold">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.trending_up} />
                  </svg>
                  <span>+24.6% YoY</span>
                </div>
              </div>
            </div>

            {/* Property Status Donut */}
            <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
              <div className="mb-5">
                <h3 className="text-[14.5px] font-bold text-white/90">Property Status</h3>
                <p className="text-[12px] text-white/35 mt-0.5">Current portfolio breakdown</p>
              </div>
              <DonutChart segments={donutSegments} />
              <div className="mt-5 pt-4 border-t border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-white/35">Avg. listing price</span>
                  <span className="text-[14.5px] font-bold text-[#C8994A]">AED 21.4M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Properties by Category */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[14.5px] font-bold text-white/90">Properties by Category</h3>
                <p className="text-[12px] text-white/35 mt-0.5">Total inventory across all types</p>
              </div>
              <Link href="/properties" className="text-[11.5px] text-[#C8994A] font-semibold hover:text-[#e8bf7a] transition-colors">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {categoryData.map((cat) => {
                const pct = Math.round((cat.count / maxCategoryCount) * 100);
                return (
                  <div key={cat.label} className="flex items-center gap-4">
                    <span className="text-[13px] text-white/60 font-semibold w-28 shrink-0">{cat.label}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C8994A] to-[#e8bf7a] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-white/45 font-semibold w-20 text-right shrink-0">
                      {cat.count.toLocaleString("en-US")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Listings Table + Inquiries */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

            {/* Table */}
            <div className="xl:col-span-3 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-[14.5px] font-bold text-white/90">Recent Listings</h3>
                  <p className="text-[12px] text-white/35 mt-0.5">Latest properties added</p>
                </div>
                <Link href="/properties" className="text-[12px] text-[#C8994A] font-semibold hover:text-[#e8bf7a] transition-colors">
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.04]">
                {["Property", "Price", "Type", "Status"].map((h) => (
                  <span key={h} className="text-[12.5px] font-semibold text-white/30">{h}</span>
                ))}
              </div>

              {/* Table rows */}
              {paginatedListings.map((prop) => (
                <div
                  key={prop.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center group"
                >
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-white/85 truncate group-hover:text-white transition-colors">
                      {prop.title}
                    </p>
                    <p className="text-[11.5px] text-white/35 mt-0.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.location} />
                      </svg>
                      {prop.location}
                    </p>
                  </div>
                  <span className="text-[12.5px] font-bold text-[#C8994A] whitespace-nowrap">{prop.price}</span>
                  <StatusBadge status={prop.type === "buy" ? "For Sale" : "For Rent"} />
                  <StatusBadge status={prop.tag} />
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-3">
                <p className="text-[12px] text-white/35">
                  Showing {listingsPage * LISTINGS_PER_PAGE + 1}–{Math.min((listingsPage + 1) * LISTINGS_PER_PAGE, recentListings.length)} of {recentListings.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    id="listings-prev"
                    disabled={listingsPage === 0}
                    onClick={() => setListingsPage((p) => p - 1)}
                    className="text-[12px] text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                  >
                    ← Prev
                  </button>
                  <button
                    id="listings-next"
                    disabled={(listingsPage + 1) * LISTINGS_PER_PAGE >= recentListings.length}
                    onClick={() => setListingsPage((p) => p + 1)}
                    className="text-[12px] text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="xl:col-span-2 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-[14.5px] font-bold text-white/90">Recent Inquiries</h3>
                  <p className="text-[12px] text-white/35 mt-0.5">Latest client activity</p>
                </div>
                <span className="flex items-center gap-1.5 bg-[#C8994A]/15 text-[#C8994A] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#C8994A]/20">
                  <span className="w-1.5 h-1.5 bg-[#C8994A] rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              <div className="overflow-y-auto max-h-[340px] scrollbar-none divide-y divide-white/[0.03]">
                {RECENT_INQUIRIES.map((inq) => (
                  <div key={inq.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8994A]/30 to-[#a0723a]/20 border border-[#C8994A]/20 flex items-center justify-center text-[11.5px] font-bold text-[#C8994A] shrink-0 mt-0.5">
                      {inq.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13.5px] font-semibold text-white/85 truncate">{inq.client}</p>
                        <StatusBadge status={inq.status} />
                      </div>
                      <p className="text-[11.5px] text-white/35 mt-0.5 truncate">{inq.type} · {inq.property}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.clock} />
                        </svg>
                        <span className="text-[10.5px] text-white/30 font-medium">{inq.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-white/[0.04]">
                <button id="view-all-inquiries" className="text-[12px] text-[#C8994A] font-semibold hover:text-[#e8bf7a] transition-colors w-full text-center cursor-pointer">
                  View All Inquiries →
                </button>
              </div>
            </div>
          </div>

          {/* Top Agents */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[14.5px] font-bold text-white/90">Top Performing Agents</h3>
                <p className="text-[12px] text-white/35 mt-0.5">Based on deals closed this quarter</p>
              </div>
              <button id="manage-agents" className="text-[12px] text-[#C8994A] font-semibold hover:text-[#e8bf7a] transition-colors cursor-pointer">
                Manage Agents →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {topAgents.map((agent, idx) => (
                <div
                  key={agent.name}
                  className="relative bg-[#111111] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 hover:border-[#C8994A]/25 transition-all duration-300 group overflow-hidden"
                >
                  {idx === 0 && (
                    <div className="absolute top-3 right-3 bg-[#C8994A]/15 text-[#C8994A] text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-[#C8994A]/20">
                      #1
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C8994A]/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8994A]/20 to-[#a0723a]/10 border border-[#C8994A]/15 flex items-center justify-center text-[13.5px] font-bold text-[#C8994A] shrink-0">
                      {agent.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold text-white/90 truncate">{agent.name}</p>
                      <p className="text-[11px] text-white/35 font-medium truncate">{agent.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 relative z-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(agent.rating) ? "text-[#C8994A]" : "text-white/15"}`}
                        fill={s <= Math.round(agent.rating) ? "currentColor" : "none"}
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.star} />
                      </svg>
                    ))}
                    <span className="text-[12px] font-bold text-white/80 ml-1">{agent.rating}</span>
                    <span className="text-[11px] text-white/30 ml-1">({agent.reviews})</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 relative z-10">
                    <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                      <p className="text-[10.5px] text-white/30 uppercase tracking-wider font-semibold">Deals</p>
                      <p className="text-[15px] font-bold text-white/90">{agent.deals}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                      <p className="text-[10.5px] text-white/30 uppercase tracking-wider font-semibold">Response</p>
                      <p className="text-[13px] font-bold text-white/90">{agent.responseTime}</p>
                    </div>
                  </div>

                  <p className="text-[12px] text-white/35 font-medium relative z-10 truncate">
                    📍 {agent.specialty}
                  </p>

                  <div className="flex gap-1 flex-wrap relative z-10">
                    {agent.languages.slice(0, 2).map((lang) => (
                      <span key={lang} className="text-[10.5px] font-semibold bg-white/5 text-white/40 px-2 py-0.5 rounded-full border border-white/[0.06]">
                        {lang}
                      </span>
                    ))}
                    {agent.languages.length > 2 && (
                      <span className="text-[10.5px] font-semibold bg-white/5 text-white/40 px-2 py-0.5 rounded-full border border-white/[0.06]">
                        +{agent.languages.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions + Activity Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Quick Actions */}
            <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-[14.5px] font-bold text-white/90 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "qa-add-property",  icon: ICONS.properties, label: "Add New Property", sub: "List a new listing" },
                  { id: "qa-add-agent",     icon: ICONS.agents,     label: "Add Agent",        sub: "Onboard a new agent" },
                  { id: "qa-schedule",      icon: ICONS.calendar,   label: "Schedule Viewing", sub: "Book a property tour" },
                  { id: "qa-export",        icon: ICONS.export,     label: "Export Report",    sub: "Download analytics" },
                ].map((action) => (
                  <button
                    key={action.id}
                    id={action.id}
                    className="flex flex-col items-start gap-2.5 bg-[#111111] border border-white/[0.06] rounded-xl p-4 hover:border-[#C8994A]/30 hover:bg-[#C8994A]/5 transition-all duration-200 group text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#C8994A]/10 group-hover:bg-[#C8994A]/20 flex items-center justify-center transition-colors">
                      <Icon d={action.icon} className="w-4 h-4 text-[#C8994A]" />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-white/85">{action.label}</p>
                      <p className="text-[11.5px] text-white/30 mt-0.5">{action.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Summary */}
            <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-[14.5px] font-bold text-white/90 mb-4">Platform Summary</h3>
              <div className="space-y-4">
                {[
                  { label: "Website Page Views (Today)",  value: "12,480",  trend: "+8.2%", up: true  },
                  { label: "Avg. Time on Site",           value: "4m 32s",  trend: "+12s",  up: true  },
                  { label: "Inquiry Conversion Rate",     value: "6.8%",    trend: "+0.4%", up: true  },
                  { label: "Properties Saved by Users",   value: "1,204",   trend: "+3.1%", up: true  },
                  { label: "Active User Sessions",        value: "87",      trend: "Live",  up: true  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-[13px] text-white/50 font-medium">{row.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-bold text-white/90">{row.value}</span>
                      <span className={`text-[11px] font-bold ${row.up ? "text-emerald-400" : "text-red-400"}`}>
                        {row.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between py-4 border-t border-white/[0.04] mt-2">
            <p className="text-[12.5px] text-white/20">© 2026 AA Traders Developments. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["Support", "Privacy", "Terms"].map((link) => (
                <a key={link} href="#" className="text-[12.5px] text-white/25 hover:text-white/50 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
