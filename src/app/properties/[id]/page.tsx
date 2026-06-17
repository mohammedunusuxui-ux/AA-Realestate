"use client";

import React, { use, useState, useEffect, useRef } from "react";
import { PROPERTIES_DATA, FAQ_DATA, AGENTS_LIST } from "@/data/properties";
import { useTheme } from "@/components/ThemeContext";
import { usePreferences } from "@/components/PreferencesContext";
import Header from "@/components/Header";
import DeveloperLogo from "@/components/DeveloperLogo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InteractiveMenu } from "@/components/ui/modern-mobile-menu";

// ─── Icons ──────────────────────────────────────────────────────────────────
const PinIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BedIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const BathIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const AreaIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
  </svg>
);

const DeveloperIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const YearIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-4 h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52C8.36 2.65 7.64 2 6.77 2H4.14C3.26 2 2.5 2.77 2.5 3.65c0 10.15 8.24 18.39 18.39 18.39.88 0 1.65-.76 1.65-1.64v-2.63c0-.87-.65-1.59-1.51-1.71z" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-4.5 h-4.5 transition-colors duration-300" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l-2.622 1.31M8.684 10.742a3.978 3.978 0 115.632-3.722m-5.632 3.722a3.978 3.978 0 005.632 3.722m-5.632-3.722L14.71 13.06m-5.632-2.318L6.062 9.43m8.648 3.63a3.978 3.978 0 11-5.632 3.722" />
  </svg>
);

const FlagIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);



const ROOMS = [
  { 
    id: "combbath", 
    label: "CombBath", 
    fullLabel: "Combined bathroom", 
    icon: "bath", 
    mDim: "2.4m x 1.8m", 
    fDim: "7.9ft x 5.9ft",
    x3d: 66.5, y3d: 45.0, w3d: 14.0, h3d: 12.0,
    x2d: 75.5, y2d: 59.0, w2d: 19.0, h2d: 26.0
  },
  { 
    id: "living", 
    label: "Living", 
    fullLabel: "Living Room", 
    icon: "sofa", 
    mDim: "7.4m x 6.2m", 
    fDim: "24.3ft x 20.3ft", 
    x3d: 18.0, y3d: 47.0, w3d: 25.0, h3d: 18.0,
    x2d: 55.0, y2d: 56.0, w2d: 15.0, h2d: 30.5
  },
  { 
    id: "bedroom1", 
    label: "Bedroom", 
    fullLabel: "Master Bedroom", 
    icon: "bed", 
    mDim: "3.4m x 3.7m", 
    fDim: "11.2ft x 12.1ft", 
    x3d: 54.0, y3d: 44.0, w3d: 12.5, h3d: 16.0,
    x2d: 10.0, y2d: 70.0, w2d: 15.0, h2d: 26.0
  },
  { 
    id: "bedroom2", 
    label: "Bedroom", 
    fullLabel: "Guest Bedroom", 
    icon: "bed", 
    mDim: "3.0m x 3.7m", 
    fDim: "9.8ft x 12.1ft", 
    x3d: 40.0, y3d: 20.0, w3d: 14.5, h3d: 17.0,
    x2d: 12.8, y2d: 8.5, w2d: 12.5, h2d: 36.5
  },
  { 
    id: "balcony1", 
    label: "Balcony", 
    fullLabel: "Main Balcony", 
    icon: "balcony", 
    mDim: "1.8m x 1.7m", 
    fDim: "5.9ft x 5.6ft", 
    x3d: 34.0, y3d: 65.0, w3d: 20.0, h3d: 18.0,
    x2d: 44.5, y2d: 3.5, w2d: 23.5, h2d: 23.0
  },
  { 
    id: "balcony2", 
    label: "Balcony", 
    fullLabel: "Side Balcony", 
    icon: "balcony", 
    mDim: "6.1m x 2.2m", 
    fDim: "20.0ft x 7.2ft", 
    x3d: 8.0, y3d: 55.0, w3d: 26.5, h3d: 25.0,
    x2d: 75.5, y2d: 9.0, w2d: 17.5, h2d: 37.0
  },
  { 
    id: "kitchen", 
    label: "Kitchen", 
    fullLabel: "Gourmet Kitchen", 
    icon: "kitchen", 
    mDim: "2.4m x 3.0m", 
    fDim: "7.9ft x 9.8ft", 
    x3d: 35.0, y3d: 27.0, w3d: 14.0, h3d: 18.0,
    x2d: 55.0, y2d: 86.5, w2d: 15.0, h2d: 10.0
  },
  { 
    id: "hall", 
    label: "Hall", 
    fullLabel: "Entrance Hall", 
    icon: "hall", 
    mDim: "0.9m x 2.0m", 
    fDim: "3.0ft x 6.6ft", 
    x3d: 50.0, y3d: 20.0, w3d: 10.0, h3d: 10.0,
    x2d: 30.5, y2d: 70.0, w2d: 15.0, h2d: 26.0
  },
];


const renderRoomIcon = (iconName: string) => {
  switch (iconName) {
    case "bath":
      return (
        <svg className="w-5 h-5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      );
    case "sofa":
      return (
        <svg className="w-5 h-5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12h-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v3H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2z" />
        </svg>
      );
    case "bed":
      return (
        <svg className="w-5 h-5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V6a2 2 0 012-2h14a2 2 0 012 2v4M3 10v6a2 2 0 002 2h14a2 2 0 002-2v-6M3 10h18M7 10V6M17 10V6" />
        </svg>
      );
    case "balcony":
      return (
        <svg className="w-5 h-5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      );
    case "kitchen":
      return (
        <svg className="w-5 h-5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "hall":
      return (
        <svg className="w-5 h-5 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8v16H8V4zm2 8h2v2h-2v-2z" />
        </svg>
      );
    default:
      return null;
  }
};

const plotDocuments = [
  { name: "Title Deed / Mulkiya", size: "1.8 MB", file: "title_deed_mulkiya.pdf" },
  { name: "Oqood Registration", size: "1.2 MB", file: "oqood_registration.pdf" },
  { name: "Affection Plan", size: "2.4 MB", file: "affection_plan.pdf" },
  { name: "Site Plan / Blueprint", size: "3.8 MB", file: "site_plan.pdf" },
  { name: "RERA Certificate", size: "3.2 MB", file: "rera_certificate.pdf" }
];

// ─── Helper: Developer Official Legal Name ──────────────────────────────────
const getDeveloperOfficialName = (dev: string) => {
  switch (dev.toLowerCase()) {
    case "emaar":
      return "EMAAR PROPERTIES PJSC";
    case "nakheel":
      return "NAKHEEL REAL ESTATE - SOLE PROPRIETORSHIP L.L.C.";
    case "damac":
      return "DAMAC PROPERTIES CO. PJSC";
    case "sobha realty":
    case "meydan sobha":
      return "SOBHA REALTY L.L.C.";
    case "meraas":
      return "MERAAS DEVELOPMENT L.L.C.";
    case "omniyat":
      return "OMNIYAT PROPERTIES L.L.C.";
    case "select group":
      return "SELECT GROUP REAL ESTATE L.L.C.";
    default:
      return `${dev.toUpperCase()} DEVELOPMENTS L.L.C.`;
  }
};

// ─── Helper: Developer Friendly Name ────────────────────────────────────────
const getDeveloperFriendlyName = (dev: string) => {
  const lower = dev.toLowerCase();
  switch (lower) {
    case "emaar":
      return "Emaar Properties";
    case "nakheel":
      return "Nakheel Properties";
    case "damac":
      return "Damac Properties";
    case "sobha realty":
    case "meydan sobha":
      return "Sobha Realty";
    case "meraas":
      return "Meraas Developments";
    case "omniyat":
      return "Omniyat Properties";
    case "select group":
      return "Select Group";
    default:
      if (lower.endsWith("properties") || lower.endsWith("realty") || lower.endsWith("developments") || lower.endsWith("group") || lower.endsWith("holdings")) {
        return dev;
      }
      return `${dev} Properties`;
  }
};

// ─── Helper: Developer Brief Info ───────────────────────────────────────────
const getDeveloperBrief = (dev: string) => {
  const data: Record<string, { desc: string; founded: string; projects: string[] }> = {
    emaar: {
      desc: "Emaar Properties is one of the world's most valuable and admired real estate development companies. With proven competencies in properties, shopping malls & retail and hospitality & leisure, Emaar shapes new lifestyles with a focus on design excellence, build quality and timely delivery. Famous for building the Burj Khalifa, Downtown Dubai, and Dubai Mall.",
      founded: "1997",
      projects: ["Burj Khalifa", "Downtown Dubai", "Dubai Marina", "Emaar Beachfront", "Dubai Hills Estate"]
    },
    nakheel: {
      desc: "Nakheel is a world-leading master developer whose innovative, landmark projects form an iconic portfolio of master communities and residential, retail, hospitality and leisure developments that are pivotal to realizing Dubai's vision. Famous for the Palm Jumeirah and the World Islands, reclaiming coastline and redefining waterfront living.",
      founded: "2000",
      projects: ["Palm Jumeirah", "The World Islands", "Deira Islands", "Jumeirah Islands", "Dragon Mart"]
    },
    damac: {
      desc: "DAMAC Properties has been at the forefront of the Middle East's luxury real estate market since 2002, delivering luxury residential, commercial and leisure properties across the region, including the UAE, Saudi Arabia, Qatar, Jordan, Lebanon, Iraq, the Maldives, Canada, and the United Kingdom.",
      founded: "2002",
      projects: ["DAMAC Hills", "DAMAC Lagoons", "DAMAC Tower Nine Elms", "Cavalli Tower"]
    },
    "sobha realty": {
      desc: "Sobha Realty is an international luxury developer committed to redefining the art of living with sustainable communities. Established in 1976 as an interior decoration firm in Oman by PNC Menon, it has grown into a leading premium developer with high-end master developments in Dubai Hills and Sobha Hartland.",
      founded: "1976",
      projects: ["Sobha Hartland", "Sobha Hartland II", "Sobha Reserve", "The S Tower"]
    },
    meraas: {
      desc: "Meraas is a Dubai-based conglomerate that aims to enhance Dubai's global active economy and active living index through a diverse portfolio of developments. They specialize in contemporary waterfront and urban lifestyle destinations, incorporating creative concepts that attract locals and tourists alike.",
      founded: "2007",
      projects: ["Jumeirah Bay Island", "Bluewaters Island", "City Walk", "La Mer", "Port de La Mer"]
    },
    omniyat: {
      desc: "Omniyat is a privately-held real estate development and service group that creates premium unique artistic residences and spaces. Known for working with world-renowned architects like Zaha Hadid, Omniyat treats each project as a unique work of art, delivering iconic landmarks to the Dubai skyline.",
      founded: "2005",
      projects: ["The Opus by Zaha Hadid", "One at Palm Jumeirah", "The Lana (Dorchester Collection)", "ORLA"]
    }
  };

  const key = dev.toLowerCase();
  if (data[key]) return data[key];
  if (key === "meydan sobha") return data["sobha realty"];
  
  return {
    desc: `${dev} is a prominent luxury real estate developer operating in the UAE, dedicated to delivering premium residential and commercial spaces that meet international standards of design, quality, and craftsmanship.`,
    founded: "N/A",
    projects: ["Premium Residential Suites", "Signature Waterfront Estates"]
  };
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { theme, toggle: toggleTheme } = useTheme();
  const { formatPrice, formatArea, currency } = usePreferences();
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const subNavContainerRef = useRef<HTMLDivElement>(null);

  const propertyId = parseInt(id, 10);
  const property = PROPERTIES_DATA.find((p) => p.id === propertyId);

  // Find similar properties using scoring logic (max score is 7)
  const similarProperties = PROPERTIES_DATA
    .filter((p) => p && property && p.id !== property.id)
    .map((p) => {
      let score = 0;
      if (property && p.category === property.category) score += 3;
      if (property && p.developer === property.developer) score += 2;
      const baseLoc = property ? property.location.split(",")[0].trim().toLowerCase() : "";
      const pLoc = p.location.split(",")[0].trim().toLowerCase();
      if (baseLoc && (baseLoc.includes(pLoc) || pLoc.includes(baseLoc))) score += 1.5;
      if (property && p.type === property.type) score += 0.5;
      return { prop: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // States
  const [isSaved, setIsSaved] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportOtherText, setReportOtherText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Load initial saved status from localStorage and listen to external changes (e.g. from header)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedList = JSON.parse(localStorage.getItem("savedProperties") || "[]");
      setIsSaved(savedList.includes(propertyId));
    }

    const handleSavedChange = (e: Event) => {
      const customEvent = e as CustomEvent<number[]>;
      setIsSaved(customEvent.detail.includes(propertyId));
    };

    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setToastMessage(customEvent.detail);
      setTimeout(() => setToastMessage(null), 3000);
    };

    window.addEventListener("savedPropertiesChange", handleSavedChange);
    window.addEventListener("propertyDetailToast", handleToastEvent);

    return () => {
      window.removeEventListener("savedPropertiesChange", handleSavedChange);
      window.removeEventListener("propertyDetailToast", handleToastEvent);
    };
  }, [propertyId]);

  const handleSaveToggle = () => {
    if (typeof window !== "undefined") {
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
      
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage("Link copied to clipboard!");
      setIsShareDropdownOpen(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined" && property) {
      const text = `Check out this amazing property: ${property.title} in ${property.location} - ${window.location.href}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      setIsShareDropdownOpen(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this amazing property: ${property.title} in ${property.location}`,
          url: window.location.href,
        });
        setIsShareDropdownOpen(false);
      } catch (err) {
        console.error("Native share failed:", err);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSubmitted(false);
      setReportReason("");
      setReportOtherText("");
      setToastMessage("Report submitted successfully.");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1800);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [chartTimeframe, setChartTimeframe] = useState<"1Y" | "2Y" | "5Y">("2Y");
  const [compareLocation, setCompareLocation] = useState("Dubai Marina");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showInlineMap, setShowInlineMap] = useState(false);
  const [isPlotDocsOpen, setIsPlotDocsOpen] = useState(true);
  const [floorPlanUnit, setFloorPlanUnit] = useState<"Feet" | "Meter">("Meter");
  const [floorPlanFurnished, setFloorPlanFurnished] = useState(true);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [floorPlanView, setFloorPlanView] = useState<"2D" | "3D" | "360">("3D");
  const roomListRef = useRef<HTMLDivElement>(null);

  const [panX, setPanX] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const startPanX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (floorPlanView !== "360") return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    startPanX.current = panX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    const percentageChange = (deltaX / 600) * 100;
    setPanX((startPanX.current - percentageChange + 100) % 100);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (floorPlanView !== "360") return;
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    startPanX.current = panX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const percentageChange = (deltaX / 600) * 100;
    setPanX((startPanX.current - percentageChange + 100) % 100);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (floorPlanView !== "360" || !isAutoRotating || isDragging) return;

    let animationFrameId: number;
    const animate = () => {
      setPanX((prev) => (prev + 0.05 * rotationSpeed) % 100);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [floorPlanView, isAutoRotating, rotationSpeed, isDragging]);

  // Active section tracking for sticky sub-nav
  useEffect(() => {
    const container = pageContainerRef.current;
    if (!container) return;

    const sections = [
      "gallery",
      "description",
      "amenities",
      "prices-trends",
      "location",
      "floor-plans",
      "plot-documents"
    ];

    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const scrollPos = container.scrollTop + (isMobile ? 130 : 180); // adjusted for header offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const containerRect = container.getBoundingClientRect();
          const rect = el.getBoundingClientRect();
          const top = rect.top - containerRect.top + container.scrollTop;
          const height = rect.height;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial section
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrevRoom = () => {
    setActiveRoomIndex((prev) => (prev === 0 ? ROOMS.length - 1 : prev - 1));
  };
  const handleNextRoom = () => {
    setActiveRoomIndex((prev) => (prev === ROOMS.length - 1 ? 0 : prev + 1));
  };
  const scrollRoomChips = (direction: "left" | "right") => {
    if (roomListRef.current) {
      const scrollAmount = 200;
      roomListRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Inquiry Modal
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Acquisition Cost States (Collapsible Dropdown inline)
  const [isAcquisitionDropdownOpen, setIsAcquisitionDropdownOpen] = useState(false);
  const [acquisitionPaymentType, setAcquisitionPaymentType] = useState<"cash" | "mortgage">("cash");

  // Active Navigation Section state
  const [activeSection, setActiveSection] = useState("gallery");

  // Mobile Active Image Index state for horizontal slider
  const [mobileActiveImageIndex, setMobileActiveImageIndex] = useState(0);

  // Auto-scroll sub-nav horizontally to center active section on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && activeSection && subNavContainerRef.current) {
      const activeBtn = document.getElementById(`sub-nav-btn-${activeSection}`);
      const container = subNavContainerRef.current;
      if (activeBtn && container) {
        const containerRect = container.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        const scrollLeftTarget = container.scrollLeft + (btnRect.left - containerRect.left) - (containerRect.width / 2) + (btnRect.width / 2);
        container.scrollTo({
          left: scrollLeftTarget,
          behavior: "smooth"
        });
      }
    }
  }, [activeSection]);

  // Mortgage Calculator States
  const [mortgageDownPaymentPercent, setMortgageDownPaymentPercent] = useState(20);
  const [mortgageInterestRate, setMortgageInterestRate] = useState(4.5);
  const [mortgageTermYears, setMortgageTermYears] = useState(25);

  // Inline Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  // Facebook Messenger states
  const [chatState, setChatState] = useState<"list" | "chat">("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  
  type Agent = typeof AGENTS_LIST[number];
  
  // Dedicated property agent
  const propertyAgent = AGENTS_LIST.find(a => a.name === property?.agent?.name) ?? AGENTS_LIST[0];
  const [chatAgent, setChatAgent] = useState<Agent>(propertyAgent);
  
  // Track active chat heads. Initially populated with the dedicated agent.
  const [chatHeads, setChatHeads] = useState<Agent[]>([propertyAgent]);
  
  // Track conversations history dynamically for each agent
  const [conversations, setConversations] = useState<Record<string, {from:"user"|"agent"; text:string; time:string}[]>>({
    [propertyAgent.name]: [
      { from: "agent", text: `Hi! I'm ${propertyAgent.name}, ${propertyAgent.title} at AA Traders. I'm the dedicated agent for ${property?.title ?? "this property"}. How can I help you today?`, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }
    ]
  });

  // Track unread status for conversations
  const [unreadAgents, setUnreadAgents] = useState<string[]>(["Layla Hassan", "Priya Sharma", "Fatima Al Zaabi"]);

  // Pre-configured last messages for the Messenger list view simulation
  const [mockLastMessages, setMockLastMessages] = useState<Record<string, { text: string; time: string }>>({
    "Omar Al Rashid": { text: "Messages and calls are secure...", time: "44w" },
    "Layla Hassan": { text: "Layla sent an attachment.", time: "9w" },
    "Priya Sharma": { text: "Happy Birthday! 🎂", time: "10w" },
    "James Whitfield": { text: "Are you interested in a viewing?", time: "2d" },
    "Sara Al Mansoori": { text: "Let's connect soon.", time: "1w" },
    "Michael Chen": { text: "Price list has been updated.", time: "3d" },
    "Ravi Nair": { text: "Sent a PDF proposal.", time: "5w" },
    "Fatima Al Zaabi": { text: "Fatima sent an attachment.", time: "9w" },
    "Aisha Malik": { text: "Sure, let me check that.", time: "1h" },
    "Khalid Meraas": { text: "Call me when you are free.", time: "5d" }
  });

  const chatMessages = conversations[chatAgent.name] || [
    { from: "agent", text: `Hi! I'm ${chatAgent.name}, ${chatAgent.title} at AA Traders. How can I help you today?`, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }
  ];

  const chatScrollRef = useRef<HTMLDivElement>(null);

  const switchAgent = (agent: Agent) => {
    setChatAgent(agent);
    setChatState("chat");
    setIsChatOpen(true);
    setIsChatMinimized(false);
    
    // Add to chat heads list if not already present
    if (!chatHeads.some(h => h.name === agent.name)) {
      setSavedHeads(agent);
    }
    
    // Mark as read
    setUnreadAgents(prev => prev.filter(name => name !== agent.name));
  };

  const setSavedHeads = (agent: Agent) => {
    setChatHeads(prev => {
      if (prev.some(h => h.name === agent.name)) return prev;
      return [agent, ...prev.slice(0, 3)]; // max 4 chat heads
    });
  };

  const scrollChatToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    
    const userMsg = { from: "user" as const, text, time };
    
    // Update conversation history
    setConversations(prev => ({
      ...prev,
      [chatAgent.name]: [...(prev[chatAgent.name] || []), userMsg]
    }));
    
    // Update last message preview
    setMockLastMessages(prev => ({
      ...prev,
      [chatAgent.name]: { text, time: "Just now" }
    }));
    
    setChatInput("");
    
    // Simulate agent typing response
    setTimeout(() => {
      const replies = [
        "Great question! I'd be happy to arrange a private viewing for you.",
        "This property is available immediately. Would you like to schedule a call?",
        "The price is negotiable for serious buyers. Can I get your contact details?",
        "We also have similar listings in the area if you'd like to compare.",
        "I'll check with the owner and get back to you right away!",
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      const agentMsg = { from: "agent" as const, text: replyText, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) };
      
      setConversations(prev => ({
        ...prev,
        [chatAgent.name]: [...(prev[chatAgent.name] || []), agentMsg]
      }));
      
      setMockLastMessages(prev => ({
        ...prev,
        [chatAgent.name]: { text: replyText, time: "Just now" }
      }));
    }, 900);
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [conversations, chatAgent.name]);


  useEffect(() => {
    // Initial login check
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const handleOpenInquiry = () => {
      setIsInquiryModalOpen(true);
    };
    const handleToggleChat = () => {
      setIsChatOpen((prev) => !prev);
    };

    window.addEventListener("openInquiryModal", handleOpenInquiry);
    window.addEventListener("toggleChat", handleToggleChat);

    return () => {
      window.removeEventListener("openInquiryModal", handleOpenInquiry);
      window.removeEventListener("toggleChat", handleToggleChat);
    };
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-center p-6 text-white">
        <div>
          <h1 className="text-3xl font-black mb-4">Property Not Found</h1>
          <p className="text-white/50 text-sm mb-6">The property details you are looking for do not exist or have been removed.</p>
          <Link href="/properties" className="px-6 py-3 bg-white text-black text-xs font-bold tracking-wider uppercase rounded-full hover:bg-neutral-200">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setIsInquiryModalOpen(false);
      setInquirySubmitted(false);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
      setInquiryMessage("");
    }, 2500);
  };

  // Curated stacked images for details page gallery
  const galleryImage1 = property.id % 2 === 0 ? "/smart_loft.png" : "/couple_outside_villa.png";
  const galleryImage2 = property.id % 3 === 0 ? "/couple_happy_home.png" : "/villa_exterior.png";
  const bottomLargeImage = property.id % 2 === 0 ? "/villa_exterior.png" : "/penthouse_interior.png";

  const formattedCategory = property.category
    .replace("apartments", "Apartment")
    .replace("villas", "Villa")
    .replace("townhouses", "Townhouse")
    .replace("penthouses", "Penthouse")
    .replace("plots", "Land Plot")
    .replace("buildings", "Building")
    .replace("duplexes", "Duplex");

  // Chart configuration & calculation logic
  const rawArea = parseInt(property.area.replace(/[^0-9]/g, ""), 10) || 5000;
  const rawPrice = property.priceVal || 20000000;
  const baseRate = Math.round(rawPrice / rawArea);

  const activeLocName = property.title
    .replace("The ", "")
    .replace("One ", "")
    .replace(" Signature Penthouse", "")
    .replace(" Ultra-Luxury Villa", "")
    .replace(" Loft Residence", "")
    .replace(" Sky Residences", "")
    .replace(" Crystal Mansion", "")
    .replace(" Sky Villa", "")
    .replace(" Executive Penthouse", "")
    .replace(" Forest Villas", "")
    .replace(" Waterfront Plot", "")
    .replace(" Grand Townhouse", "")
    .replace(" Waterfront Mansion", "")
    .replace(" Luxury Apartment", "")
    .replace(" Penthouse Duplex", "")
    .replace(" Family Townhouse", "")
    .replace(" Modern Studio Apartment", "")
    .replace(" Golf Villa", "")
    .replace(" Seaview Apartment", "")
    .replace(" Premium Villa", "")
    .replace(" Sanctuary Estate", "")
    .replace(" Community Townhouse", "")
    .replace(" Golf Estate", "")
    .replace(" Horizon Apartment", "");

  const getTooltipDate = (tf: "1Y" | "2Y" | "5Y", index: number) => {
    const dates = {
      "1Y": ["Jun 2025", "Sep 2025", "Dec 2025", "Mar 2026", "Jun 2026"],
      "2Y": ["Jun 2024", "Oct 2024", "Feb 2025", "Jun 2025", "Oct 2025", "Feb 2026", "Jun 2026"],
      "5Y": ["2022", "2023", "2024", "2025", "2026"]
    };
    return dates[tf][index] || "";
  };

  const getChartConfig = (tf: "1Y" | "2Y" | "5Y", baseVal: number, compLoc: string) => {
    const labelsMap = {
      "1Y": ["Jun 25", "Sep 25", "Dec 25", "Mar 26", "Jun 26"],
      "2Y": ["Jun 24", "Oct 24", "Feb 25", "Jun 25", "Oct 25", "Feb 26", "Jun 26"],
      "5Y": ["2022", "2023", "2024", "2025", "2026"]
    };

    const primaryMultipliers = {
      "1Y": [0.93, 0.95, 0.98, 0.99, 1.0],
      "2Y": [0.82, 0.85, 0.89, 0.92, 0.95, 0.98, 1.0],
      "5Y": [0.65, 0.72, 0.84, 0.92, 1.0]
    };

    const compModifiers: Record<string, number> = {
      "Dubai Marina": 1.05,
      "Downtown Dubai": 1.15,
      "Palm Jumeirah": 1.25,
      "Business Bay": 0.85,
      "Al Reem Island": 0.95
    };
    const modifier = compModifiers[compLoc] || 1.0;

    const secondaryMultipliers = {
      "1Y": [0.95 * modifier, 0.98 * modifier, 1.01 * modifier, 1.04 * modifier, 1.08 * modifier],
      "2Y": [0.85 * modifier, 0.88 * modifier, 0.93 * modifier, 0.98 * modifier, 1.02 * modifier, 1.07 * modifier, 1.12 * modifier],
      "5Y": [0.7 * modifier, 0.8 * modifier, 0.95 * modifier, 1.06 * modifier, 1.18 * modifier]
    };

    return {
      labels: labelsMap[tf],
      primaryPrices: primaryMultipliers[tf].map(m => Math.round(baseVal * m)),
      secondaryPrices: secondaryMultipliers[tf].map(m => Math.round(baseVal * m))
    };
  };

  const { labels, primaryPrices, secondaryPrices } = getChartConfig(chartTimeframe, baseRate, compareLocation);
  const N = labels.length;
  const svgWidth = 700;
  const svgHeight = 240;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const allPrices = [...primaryPrices, ...secondaryPrices];
  const maxPrice = Math.max(...allPrices) * 1.05;
  const minPrice = Math.max(0, Math.min(...allPrices) * 0.9);

  const getCoordinates = (prices: number[]) => {
    return prices.map((price, i) => {
      const x = paddingLeft + (i * chartWidth) / (N - 1);
      const y = paddingTop + chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
      return { x, y, price };
    });
  };

  const primaryCoords = getCoordinates(primaryPrices);
  const secondaryCoords = getCoordinates(secondaryPrices);

  const getBezierPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return "";
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) * 0.35;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) * 0.65;
      const cpY2 = next.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const primaryPath = getBezierPath(primaryCoords);
  const primaryAreaPath = primaryCoords.length > 0 
    ? `${primaryPath} L ${primaryCoords[primaryCoords.length - 1].x} ${paddingTop + chartHeight} L ${primaryCoords[0].x} ${paddingTop + chartHeight} Z`
    : "";

  const secondaryPath = getBezierPath(secondaryCoords);

  const filteredAgents = AGENTS_LIST.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (agent.specialty && agent.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === "unread") {
      return matchesSearch && unreadAgents.includes(agent.name);
    }
    return matchesSearch;
  });

  return (
    <div
      ref={pageContainerRef}
      className={`properties-page relative h-screen overflow-y-auto scroll-smooth ${
        theme === "light" ? "bg-white text-neutral-900" : "bg-[#0A0A0A] text-white"
      } transition-colors duration-500`}
    >

      {/* ── Header ── */}
      <Header />

      {/* ── Main Layout ── */}
      <main className="relative z-10 w-full pt-20 md:pt-36 pb-0">
        <div className="w-full px-6 md:px-12">
        
        {/* Navigation Breadcrumbs / Back Row */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-neutral-400 select-none">
            <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <span className="opacity-50">›</span>
            <Link href="/properties" className="hover:text-amber-500 transition-colors">Properties</Link>
            <span className="opacity-50">›</span>
            <span className={theme === "light" ? "text-neutral-900" : "text-white"}>{property.title}</span>
          </div>
        </div>

        {/* Title and actions row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            {/* Property Title Heading */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-3 font-sans leading-tight ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
              {property.title}
            </h1>

            {/* Subheading: Location */}
            <div className={`flex items-center gap-2 text-sm sm:text-base font-semibold ${theme === "light" ? "text-neutral-600" : "text-neutral-450"}`}>
              <div className="text-amber-500">
                <PinIcon />
              </div>
              <span>{property.location}</span>
            </div>
          </div>

          {/* Desktop Save, Share, Report Action Group */}
          <div className="hidden md:flex items-center gap-4 select-none relative">
            {/* Save Button */}
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all duration-300 active:scale-95 cursor-pointer select-none
                ${theme === "light"
                  ? isSaved
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-600 hover:bg-rose-500/20"
                    : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 shadow-sm"
                  : isSaved
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-455 hover:bg-rose-500/30"
                    : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white"
                }`}
            >
              <HeartIcon filled={isSaved} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all duration-300 active:scale-95 cursor-pointer select-none
                  ${theme === "light"
                    ? "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 shadow-sm"
                    : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
              >
                <ShareIcon />
                <span>Share</span>
              </button>

              <AnimatePresence>
                {isShareDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsShareDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-3 right-0 z-50 w-48 rounded-2xl border p-2.5 shadow-2xl backdrop-blur-md font-sans text-left
                        ${theme === "light"
                          ? "bg-white border-neutral-200/80 text-neutral-800"
                          : "bg-[#0b0709]/95 border-white/10 text-white"
                        }`}
                    >
                      <button
                        onClick={handleNativeShare}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer
                          ${theme === "light" ? "hover:bg-neutral-100 text-neutral-800" : "hover:bg-white/5 text-white"}`}
                      >
                        <ShareIcon />
                        System Share
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer
                          ${theme === "light" ? "hover:bg-neutral-100 text-neutral-800" : "hover:bg-white/5 text-white"}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Link
                      </button>
                      <button
                        onClick={handleShareWhatsApp}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer
                          ${theme === "light" ? "hover:bg-neutral-100 text-[#128C7E]" : "hover:bg-white/5 text-[#25D366]"}`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.799-4.382 9.802-9.77.001-2.61-1.01-5.063-2.846-6.898C16.398 2.1 13.953.948 11.998.948 6.596.948 2.2 5.332 2.197 10.72c-.001 1.517.411 3.01 1.192 4.304l-.99 3.616 3.708-.973c1.238.675 2.593 1.033 3.94 1.037z"/>
                        </svg>
                        WhatsApp
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Report Button */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs tracking-normal font-semibold transition-all duration-300 active:scale-95 cursor-pointer select-none
                ${theme === "light"
                  ? "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 shadow-sm"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white"
                }`}
            >
              <FlagIcon />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Mobile Save, Share, Report Action Group */}
        <div className="hidden items-center gap-3 mb-8 select-none">
          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs tracking-normal font-semibold transition-all duration-300 active:scale-95 cursor-pointer
              ${theme === "light"
                ? isSaved
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-600"
                  : "bg-white border-neutral-200 text-neutral-800 shadow-sm"
                : isSaved
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-455"
                  : "bg-white/5 border-white/10 text-white/80"
              }`}
          >
            <HeartIcon filled={isSaved} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          {/* Share Button */}
          <div className="flex-1 relative">
            <button
              onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs tracking-normal font-semibold transition-all duration-300 active:scale-95 cursor-pointer
                ${theme === "light"
                  ? "bg-white border-neutral-200 text-neutral-800 shadow-sm"
                  : "bg-white/5 border-white/10 text-white/80"
                }`}
            >
              <ShareIcon />
              <span>Share</span>
            </button>

            <AnimatePresence>
              {isShareDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsShareDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute bottom-full mb-3 right-0 z-50 w-48 rounded-2xl border p-2.5 shadow-2xl backdrop-blur-md font-sans text-left
                      ${theme === "light"
                        ? "bg-white border-neutral-200/80 text-neutral-800"
                        : "bg-[#0b0709]/95 border-white/10 text-white"
                      }`}
                  >
                    <button
                      onClick={handleNativeShare}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer
                        ${theme === "light" ? "hover:bg-neutral-100 text-neutral-800" : "hover:bg-white/5 text-white"}`}
                    >
                      <ShareIcon />
                      System Share
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer
                        ${theme === "light" ? "hover:bg-neutral-100 text-neutral-800" : "hover:bg-white/5 text-white"}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Link
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer
                        ${theme === "light" ? "hover:bg-neutral-100 text-[#128C7E]" : "hover:bg-white/5 text-[#25D366]"}`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.799-4.382 9.802-9.77.001-2.61-1.01-5.063-2.846-6.898C16.398 2.1 13.953.948 11.998.948 6.596.948 2.2 5.332 2.197 10.72c-.001 1.517.411 3.01 1.192 4.304l-.99 3.616 3.708-.973c1.238.675 2.593 1.033 3.94 1.037z"/>
                      </svg>
                      WhatsApp
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Report Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs tracking-wider uppercase font-bold transition-all duration-300 active:scale-95 cursor-pointer
              ${theme === "light"
                ? "bg-white border-neutral-200 text-neutral-800 shadow-sm"
                : "bg-white/5 border-white/10 text-white/80"
              }`}
          >
            <FlagIcon />
            <span>Report</span>
          </button>
        </div>

        {/* ── Sub-Navigation Bar ── */}
        <div className={`sticky top-[53px] md:top-[81px] z-30 border-b backdrop-blur-md transition-all duration-300 -mx-6 md:-mx-12 px-6 md:px-12 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] mb-8
          ${theme === "light"
            ? "bg-white/75 border-neutral-200/50 text-neutral-800"
            : "bg-[#0A0A0A]/70 border-white/5 text-white/90"}`}
        >
          <div className="w-full">
            <div ref={subNavContainerRef} className="flex items-center justify-start md:justify-between overflow-x-auto md:overflow-visible scrollbar-none gap-6 md:gap-0 h-14 md:h-16 text-xs font-semibold select-none whitespace-nowrap w-full">
              {[
                { id: "gallery", label: "Gallery" },
                { id: "description", label: "Description" },
                { id: "amenities", label: "Amenities & Features" },
                { id: "prices-trends", label: "Prices & Trends" },
                { id: "location", label: "Location" },
                { id: "floor-plans", label: "Floor Plans" },
                { id: "plot-documents", label: "Plot Documents" },
              ].map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sub-nav-btn-${tab.id}`}
                    onClick={() => {
                      const el = document.getElementById(tab.id);
                      const container = pageContainerRef.current;
                      if (el && container) {
                        const isMobile = window.innerWidth < 768;
                        const headerOffset = isMobile ? 110 : 145; // main header + sub-nav
                        const containerRect = container.getBoundingClientRect();
                        const elementPosition = el.getBoundingClientRect().top;
                        const offsetPosition = elementPosition - containerRect.top + container.scrollTop - headerOffset;
                        container.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth"
                        });
                        setActiveSection(tab.id);
                      }
                    }}
                    className={`relative h-full flex items-center justify-center cursor-pointer transition-colors duration-300 pb-[2px] px-2 md:px-0
                      ${isActive
                        ? "text-[#EFBF04] font-extrabold"
                        : "text-neutral-400 hover:text-neutral-500 dark:hover:text-white/80"}`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeSubTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#EFBF04]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Image Gallery Grid/Carousel ── */}
        <div id="gallery" className="mb-8 w-full">
          {/* Mobile Swipeable Gallery (visible only on mobile/tablet) */}
          <div className="block lg:hidden relative w-full">
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 w-full rounded-[2rem]"
              onScroll={(e) => {
                const target = e.currentTarget;
                const index = Math.round(target.scrollLeft / target.clientWidth);
                setMobileActiveImageIndex(index);
              }}
            >
              {/* Slide 1: Main Photo or Video */}
              <div className="w-full shrink-0 snap-center relative aspect-[4/3] sm:aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/5 shadow-xl bg-neutral-950">
                <AnimatePresence mode="wait">
                  {mediaType === "photo" ? (
                    <motion.div
                      key="photo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={property.image}
                        alt={property.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      
                      {/* Play button */}
                      <button
                        onClick={() => setMediaType("video")}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all duration-300 shadow-2xl cursor-pointer"
                      >
                        <svg className="w-5 h-5 text-white fill-white translate-x-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full bg-black"
                    >
                      <video
                        src="/Section 2 Video/Bg3JpCFVhXQn97VzoZ1IHBgQMBg.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Switcher overlay */}
                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                  <button
                    onClick={() => setMediaType("photo")}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-normal transition-all duration-300 flex items-center gap-1 cursor-pointer border shadow-md
                      ${mediaType === "photo"
                        ? "bg-white border-white text-black"
                        : "bg-black/60 backdrop-blur-md border-white/10 text-white hover:bg-black/80"}`}
                  >
                    Photos
                  </button>
                  <button
                    onClick={() => setMediaType("video")}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-normal transition-all duration-300 flex items-center gap-1 cursor-pointer border shadow-md
                      ${mediaType === "video"
                        ? "bg-white border-white text-black"
                        : "bg-black/60 backdrop-blur-md border-white/10 text-white hover:bg-black/80"}`}
                  >
                    Video
                  </button>
                </div>
              </div>

              {/* Slide 2: Gallery Image 1 */}
              <div className="w-full shrink-0 snap-center relative aspect-[4/3] sm:aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/5 shadow-xl bg-neutral-950">
                <img
                  src={galleryImage1}
                  alt="Interior perspective"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Slide 3: Gallery Image 2 */}
              <div className="w-full shrink-0 snap-center relative aspect-[4/3] sm:aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/5 shadow-xl bg-neutral-950">
                <img
                  src={galleryImage2}
                  alt="Architectural landscape"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 right-4 flex gap-1.5 z-25 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 select-none">
              {[0, 1, 2].map((idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    mobileActiveImageIndex === idx ? "bg-[#EFBF04] scale-125" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Gallery Grid (visible only on desktop) */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-3">
            {/* Left Side: Large primary landscape image or Video player */}
            <div className="lg:col-span-2 relative aspect-[21/9] sm:aspect-[21/9] rounded-[2rem] overflow-hidden border border-white/5 shadow-xl group bg-neutral-950">
              <AnimatePresence mode="wait">
                {mediaType === "photo" ? (
                  <motion.div
                    key="photo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    
                    {/* Subtle glassmorphic play button in center */}
                    <button
                      onClick={() => setMediaType("video")}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all duration-300 shadow-2xl cursor-pointer group-hover:scale-105"
                    >
                      <svg className="w-6 h-6 text-white fill-white translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full bg-black"
                  >
                    <video
                      src="/Section 2 Video/Bg3JpCFVhXQn97VzoZ1IHBgQMBg.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Premium Media Switcher Overlay */}
              <div className="absolute bottom-6 left-6 z-20 flex gap-2">
                <button
                  onClick={() => setMediaType("photo")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 cursor-pointer border shadow-md
                    ${mediaType === "photo"
                      ? "bg-white border-white text-black"
                      : "bg-black/60 backdrop-blur-md border-white/10 text-white hover:bg-black/80"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Photos
                </button>
                <button
                  onClick={() => setMediaType("video")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 cursor-pointer border shadow-md
                    ${mediaType === "video"
                      ? "bg-white border-white text-black"
                      : "bg-black/60 backdrop-blur-md border-white/10 text-white hover:bg-black/80"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  3D Video / Tour
                </button>
              </div>
            </div>

            {/* Right Side: Two stacked smaller images */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative h-[155px] rounded-[2rem] overflow-hidden border border-white/5 shadow-lg group">
                <img
                  src={galleryImage1}
                  alt="Interior perspective"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>
              <div className="flex-1 relative h-[155px] rounded-[2rem] overflow-hidden border border-white/5 shadow-lg group">
                <img
                  src={galleryImage2}
                  alt="Architectural landscape"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Details: Split layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-24">
          
          {/* Left Columns (Details Content) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <div id="description" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Description</h2>
              <p className={`text-base leading-relaxed font-light ${theme === "light" ? "text-neutral-600" : "text-neutral-400"}`}>
                {(() => {
                  const fullDesc = `${property.title} is a beautifully designed modern estate located in the prestigious area of ${property.location}. Offering breathtaking panoramic views and a serene surrounding landscape, this property integrates luxury, style, and everyday comfort. Constructed by premium developers ${property.developer || "AA Traders Signature Homes"}, the property features expansive open-plan layout interiors with high-performance glass windows that bring in extensive natural light, boosting the overall luxury residence experience.`;
                  
                  if (fullDesc.length <= 250) return fullDesc;
                  
                  return (
                    <>
                      <span>{isDescExpanded ? fullDesc : `${fullDesc.slice(0, 250)}...`}</span>
                      <button
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="font-semibold inline-flex items-center ml-2 transition-all duration-300 hover:underline cursor-pointer active:scale-95 focus:outline-none text-[#EFBF04] hover:text-amber-400"
                      >
                        {isDescExpanded ? "See Less" : "See More"}
                      </button>
                    </>
                  );
                })()}
              </p>
            </div>

            {/* Specifications Card List */}
            <div className={`rounded-[2rem] border p-8 grid grid-cols-2 sm:grid-cols-3 gap-8 shadow-sm
              ${theme === "light" 
                ? "bg-neutral-50/50 border-neutral-200/70 text-neutral-800" 
                : "bg-[#1A1A1A]/45 border-white/8 text-white"}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-600" : "bg-white/5 border-white/10 text-white"}`}>
                  <BedIcon />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-50 font-bold">Bedrooms</span>
                  <span className="text-sm font-bold">{property.beds > 0 ? `${property.beds}+` : "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-600" : "bg-white/5 border-white/10 text-white"}`}>
                  <BathIcon />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-50 font-bold">Bathrooms</span>
                  <span className="text-sm font-bold">{property.baths > 0 ? property.baths : "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-600" : "bg-white/5 border-white/10 text-white"}`}>
                  <AreaIcon />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-50 font-bold">Square Area</span>
                  <span className="text-sm font-bold">{property.area}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-600" : "bg-white/5 border-white/10 text-white"}`}>
                  <YearIcon />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-50 font-bold">Year Built</span>
                  <span className="text-sm font-bold">2024</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-600" : "bg-white/5 border-white/10 text-white"}`}>
                  <CategoryIcon />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-50 font-bold">Property Type</span>
                  <span className="text-sm font-bold">{formattedCategory}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${theme === "light" ? "bg-white border-neutral-200 text-neutral-600" : "bg-white/5 border-white/10 text-white"}`}>
                  <DeveloperIcon />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-50 font-bold">Developer</span>
                  <div className="mt-0.5">
                    <DeveloperLogo developer={property.developer || "Exclusive"} theme={theme} />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities & Features */}
            <div id="amenities" className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight">Amenities & Features</h2>
              <div className="flex flex-wrap gap-2.5">
                {["Swimming Pool", "Gym", "Private Parking", "24/7 Security", "Central A/C", "Landscaped Garden"].map((item) => (
                  <span
                    key={item}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider border shadow-sm
                      ${theme === "light"
                        ? "bg-neutral-50 border-neutral-200/80 text-neutral-700"
                        : "bg-[#1A1A1A]/30 border-white/5 text-white/80"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Prices & Trends Section */}
            <div id="prices-trends" className={`rounded-[2rem] border p-8 space-y-6 shadow-sm relative transition-colors duration-500
              ${theme === "light" 
                ? "bg-neutral-50/50 border-neutral-200/70" 
                : "bg-[#1A1A1A]/45 border-white/8 text-white"}`}
            >
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight">Prices & trends</h2>
                  <p className={`text-xs font-light transition-colors ${theme === "light" ? "text-neutral-500" : "text-white/50"}`}>
                    {property.beds > 0 ? `${property.beds} bedrooms` : "Premium"} {formattedCategory.toLowerCase()} sold in {property.title.replace("The ", "").replace("One ", "")} and {compareLocation}
                  </p>
                </div>

                {/* Switcher Pill */}
                <div className="flex gap-1.5 self-start">
                  {(["1Y", "2Y", "5Y"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setChartTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] tracking-widest font-extrabold uppercase transition-all cursor-pointer border
                        ${chartTimeframe === tf
                          ? "bg-white border-white text-black"
                          : theme === "light"
                            ? "bg-neutral-100 border-neutral-200 text-neutral-500 hover:text-neutral-900"
                            : "bg-[#0A0A0A]/40 border-white/5 text-white/40 hover:text-white/70"}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector / Compare Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200/10 dark:border-white/5">
                {/* Custom Presets Dropdown */}
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] uppercase tracking-wider font-extrabold transition-colors ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>
                    Compare Area:
                  </span>
                  <div className="relative">
                    <select
                      value={compareLocation}
                      onChange={(e) => setCompareLocation(e.target.value)}
                      className={`px-4 py-2.5 pr-9 text-[11px] rounded-xl border focus:outline-none appearance-none cursor-pointer font-semibold transition-all duration-300
                        ${theme === "light"
                          ? "bg-white border-neutral-200 text-neutral-800 focus:border-neutral-450 hover:bg-neutral-50"
                          : "bg-black/60 border-white/10 text-white focus:border-white/30 hover:bg-black/85"}`}
                    >
                      <option value="Dubai Marina">Dubai Marina</option>
                      <option value="Downtown Dubai">Downtown Dubai</option>
                      <option value="Palm Jumeirah">Palm Jumeirah</option>
                      <option value="Business Bay">Business Bay</option>
                      <option value="Al Reem Island">Al Reem Island</option>
                    </select>
                    <div className={`absolute inset-y-0 right-3 flex items-center pointer-events-none transition-colors ${theme === "light" ? "text-neutral-500" : "text-white/60"}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex items-center gap-6 text-[9px] font-extrabold tracking-wider uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-0.75 bg-amber-500 rounded-full inline-block" />
                    <span className={theme === "light" ? "text-neutral-700" : "text-white/70"}>
                      {property.title.split(" ").slice(0,2).join(" ")} (Active)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-0.75 border-t-2 border-dashed border-[#EFBF04] inline-block" />
                    <span className={theme === "light" ? "text-neutral-700" : "text-white/70"}>
                      {compareLocation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart area: outer relative wrapper so tooltip can escape the scroll div */}
              <div className="w-full relative select-none pt-4">

                {/* Scrollable SVG area — tooltip is NOT inside this div */}
                <div className="w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[600px] overflow-visible">
                    <defs>
                      <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines */}
                    {[0, 0.5, 1].map((ratio) => {
                      const y = paddingTop + ratio * chartHeight;
                      const gridVal = maxPrice - ratio * (maxPrice - minPrice);
                      return (
                        <g key={ratio}>
                          <line
                            x1={paddingLeft}
                            y1={y}
                            x2={svgWidth - paddingRight}
                            y2={y}
                            stroke={theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}
                            strokeWidth="1"
                          />
                          {/* Y-Axis Label */}
                          <text
                            x={paddingLeft - 10}
                            y={y + 4}
                            textAnchor="end"
                            className="text-[9px] font-bold"
                            fill={theme === "light" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.4)"}
                          >
                            {gridVal >= 1000 ? `${(gridVal / 1000).toFixed(1)}K` : Math.round(gridVal)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Vertical Divider Lines aligned with labels */}
                    {primaryCoords.map((coord, i) => (
                      <line
                        key={i}
                        x1={coord.x}
                        y1={paddingTop}
                        x2={coord.x}
                        y2={paddingTop + chartHeight}
                        stroke={theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}
                        strokeWidth="1"
                      />
                    ))}

                    {/* X-axis labels */}
                    {labels.map((lbl, i) => {
                      const x = paddingLeft + (i * chartWidth) / (N - 1);
                      return (
                        <text
                          key={i}
                          x={x}
                          y={svgHeight - 10}
                          textAnchor="middle"
                          className="text-[9px] font-bold"
                          fill={theme === "light" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.4)"}
                        >
                          {lbl}
                        </text>
                      );
                    })}

                    {/* Secondary Line Path (Compare Location) */}
                    <path
                      d={secondaryPath}
                      fill="none"
                      stroke="rgb(99, 102, 241)"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                    />

                    {/* Primary Area Path (Gradient Area) */}
                    <path
                      d={primaryAreaPath}
                      fill="url(#primaryGrad)"
                    />

                    {/* Primary Line Path */}
                    <path
                      d={primaryPath}
                      fill="none"
                      stroke="rgb(245, 158, 11)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive Dot Triggers */}
                    {primaryCoords.map((coord, i) => {
                      const compCoord = secondaryCoords[i];
                      return (
                        <g
                          key={i}
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="cursor-pointer"
                        >
                          {/* Invisible wide hit area for easier hovering */}
                          <rect
                            x={coord.x - 18}
                            y={paddingTop}
                            width={36}
                            height={chartHeight}
                            fill="transparent"
                          />

                          {/* Secondary (Compare) dots */}
                          <circle
                            cx={compCoord.x}
                            cy={compCoord.y}
                            r={hoveredIndex === i ? "5.5" : "4"}
                            fill="white"
                            stroke="rgb(99, 102, 241)"
                            strokeWidth="2"
                            className="transition-all duration-200"
                          />

                          {/* Primary dots */}
                          <circle
                            cx={coord.x}
                            cy={coord.y}
                            r={hoveredIndex === i ? "6.5" : "5"}
                            fill="white"
                            stroke="rgb(245, 158, 11)"
                            strokeWidth="2.5"
                            className="transition-all duration-200"
                          />
                        </g>
                      );
                    })}

                    {/* Vertical Hover Pointer Line */}
                    {hoveredIndex !== null && (
                      <line
                        x1={primaryCoords[hoveredIndex].x}
                        y1={paddingTop}
                        x2={primaryCoords[hoveredIndex].x}
                        y2={paddingTop + chartHeight}
                        stroke={theme === "light" ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.2)"}
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                        className="pointer-events-none"
                      />
                    )}
                  </svg>
                </div>

                {/* Y-Axis title */}
                <span className="absolute top-2 left-0 text-[8px] uppercase tracking-widest font-extrabold rotate-270 origin-left translate-y-20 -translate-x-1.5 opacity-30">
                  AED / SQ FT
                </span>

                {/* Floating Tooltip — rendered OUTSIDE overflow-x-auto so it is never clipped */}
                <AnimatePresence>
                  {hoveredIndex !== null && (() => {
                    const xPct = (primaryCoords[hoveredIndex].x / svgWidth) * 100;
                    const yPct = (primaryCoords[hoveredIndex].y / svgHeight) * 100;
                    // Flip horizontally for last point so tooltip doesn't overflow right edge
                    const isRightEdge = hoveredIndex >= N - 1;
                    // Always show tooltip ABOVE the dot (chart points are never too high since chart has paddingTop)
                    return (
                      <motion.div
                        key={hoveredIndex}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute pointer-events-none z-50 min-w-[190px] rounded-[1.25rem] border shadow-2xl backdrop-blur-xl
                          ${theme === "light"
                            ? "bg-white border-neutral-200 text-neutral-800"
                            : "bg-[#1a1a1a] border-white/15 text-white"}`}
                        style={{
                          left: isRightEdge ? "auto" : `${xPct}%`,
                          right: isRightEdge ? "0%" : "auto",
                          bottom: `${100 - yPct}%`,
                          marginBottom: "18px",
                          transform: isRightEdge ? "none" : "translateX(-50%)",
                        }}
                      >
                        {/* Tooltip inner */}
                        <div className="p-4">
                          <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>
                            {getTooltipDate(chartTimeframe, hoveredIndex)}
                          </div>
                          <div className="space-y-3">
                            {/* Primary property row */}
                            <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${theme === "light" ? "bg-amber-50" : "bg-amber-500/10"}`}>
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className={`text-[9px] font-bold uppercase tracking-wider truncate ${theme === "light" ? "text-amber-700" : "text-amber-400"}`}>
                                  {activeLocName}
                                </div>
                                <div className={`text-[13px] font-black tracking-tight mt-0.5 ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                                  {formatPrice(primaryPrices[hoveredIndex])}
                                </div>
                              </div>
                            </div>
                            {/* Compare location row */}
                            <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${theme === "light" ? "bg-amber-50" : "bg-amber-500/10"}`}>
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className={`text-[9px] font-bold uppercase tracking-wider truncate ${theme === "light" ? "text-amber-700" : "text-amber-400"}`}>
                                  {compareLocation}
                                </div>
                                <div className={`text-[13px] font-black tracking-tight mt-0.5 ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                                  {formatPrice(secondaryPrices[hoveredIndex])}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Caret pointer arrow pointing downward */}
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 bottom-[-7px] w-3 h-3 rotate-45 border-r border-b
                            ${isRightEdge ? "left-auto right-6 translate-x-0" : ""}
                            ${theme === "light" ? "bg-white border-neutral-200" : "bg-[#1a1a1a] border-white/15"}`}
                        />
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

              </div>

              {/* Bottom Reset Row */}
              <div className="flex justify-end pt-2 border-t border-neutral-200/10 dark:border-white/5">
                <button
                  onClick={() => {
                    setChartTimeframe("2Y");
                    setCompareLocation("Dubai Marina");
                  }}
                  className={`px-6 py-2.5 rounded-xl text-[10px] tracking-wider uppercase font-bold border transition-colors cursor-pointer active:scale-97
                    ${theme === "light"
                      ? "bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200"
                      : "bg-[#1b1b1b] border-white/5 text-white/60 hover:text-white hover:bg-neutral-900"}`}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Location Section */}
            <div id="location" className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight">Location</h2>
              <div className={`rounded-[2rem] border overflow-hidden p-6 md:p-8 shadow-sm relative transition-all duration-500
                ${theme === "light" 
                  ? "bg-white border-neutral-200/80 text-neutral-800" 
                  : "bg-[#1A1A1A]/30 border-white/5 text-white"}`}
              >
                {/* Stylized vector map background roads */}
                <svg className={`absolute inset-0 w-full h-full pointer-events-none opacity-[0.08] dark:opacity-[0.03]
                  ${theme === "light" ? "text-neutral-900" : "text-white"}`}
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" preserveAspectRatio="none"
                >
                  <line x1="-100" y1="50" x2="900" y2="150" stroke="currentColor" strokeWidth="2" />
                  <line x1="100" y1="-50" x2="300" y2="250" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="400" y1="-50" x2="600" y2="250" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="700" y1="-50" x2="500" y2="250" stroke="currentColor" strokeWidth="2" />
                  <line x1="0" y1="80" x2="800" y2="80" stroke="currentColor" strokeWidth="1" />
                  <line x1="0" y1="140" x2="800" y2="140" stroke="currentColor" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="currentColor" strokeWidth="1" />
                  <line x1="600" y1="0" x2="600" y2="200" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="450" cy="115" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="450" cy="115" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Location Pin & Text */}
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
                        <div className="absolute bottom-1 w-6 h-2 bg-black/10 rounded-full blur-[1px]" />
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 via-red-500 to-red-600 flex items-center justify-center text-white shadow-md transform -translate-y-1 animate-bounce duration-1000">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-base font-semibold tracking-tight leading-relaxed">
                        {property.location}
                      </span>
                    </div>

                    {/* View on Map Toggle Button */}
                    <button
                      onClick={() => setShowInlineMap(!showInlineMap)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide border cursor-pointer transition-all duration-300 active:scale-97 shrink-0
                        ${theme === "light"
                          ? "border-[#EFBF04]/50 text-[#1D1D1F] hover:bg-[#EFBF04]/8"
                          : "border-[#EFBF04]/30 text-[#EFBF04] hover:bg-[#EFBF04]/5"}`}
                    >
                      {showInlineMap ? "Minimize Map" : "Expand Map"}
                    </button>
                  </div>

                  {/* Always Visible, Animatable Interactive Map Embed */}
                  <motion.div
                    animate={{ 
                      height: showInlineMap ? 450 : 200 
                    }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full overflow-hidden rounded-2xl border border-neutral-200/50 dark:border-white/5 shadow-inner mt-4"
                  >
                    <iframe
                      title="Property Location Map"
                      width="100%"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      className={`w-full block h-[calc(100%-55px)] ${theme === "light" ? "grayscale-0" : "invert-[0.9] hue-rotate-[180deg] contrast-[0.9] opacity-80"}`}
                    />
                    <div className={`p-4 text-center border-t text-xs font-medium uppercase tracking-wider h-[55px] flex items-center justify-center
                      ${theme === "light"
                        ? "bg-neutral-50 border-neutral-200 text-neutral-500"
                        : "bg-[#1A1A1A]/50 border-white/5 text-white/50"}`}
                    >
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-amber-500 transition-colors"
                      >
                        Open in Google Maps ↗
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Floor Plans */}
            <div id="floor-plans" className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight">Floor Plans</h2>
              <div className={`rounded-[2rem] border overflow-hidden p-6 md:p-8 flex flex-col items-center gap-8 shadow-md relative
                ${theme === "light" 
                  ? "bg-white border-neutral-200/80 text-neutral-800" 
                  : "bg-[#1A1A1A]/30 border-white/5 text-white"}`}
              >
                
                {/* Right floating view controls */}
                <div className="absolute right-6 top-[28%] -translate-y-1/2 z-20 flex flex-col gap-3">
                  {/* 2D View */}
                  <button
                    onClick={() => setFloorPlanView("2D")}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-xs cursor-pointer shadow-md transition-all duration-300 active:scale-95
                      ${floorPlanView === "2D"
                        ? "bg-[#EFBF04] border-[#EFBF04] text-[#1D1D1F] shadow-lg shadow-amber-500/20"
                        : theme === "light"
                          ? "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                          : "bg-[#1c1c1c] border-white/10 text-white/70 hover:text-white hover:bg-neutral-900"}`}
                    title="2D View"
                  >
                    2D
                  </button>

                  {/* 3D View */}
                  <button
                    onClick={() => setFloorPlanView("3D")}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-xs cursor-pointer shadow-md transition-all duration-300 active:scale-95
                      ${floorPlanView === "3D"
                        ? "bg-[#EFBF04] border-[#EFBF04] text-[#1D1D1F] shadow-lg shadow-amber-500/20"
                        : theme === "light"
                          ? "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                          : "bg-[#1c1c1c] border-white/10 text-white/70 hover:text-white hover:bg-neutral-900"}`}
                    title="3D Perspective"
                  >
                    3D
                  </button>

                  {/* 360 View */}
                  <button
                    onClick={() => setFloorPlanView("360")}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 active:scale-95
                      ${floorPlanView === "360"
                        ? "bg-[#EFBF04] border-[#EFBF04] text-[#1D1D1F] shadow-lg shadow-amber-500/20"
                        : theme === "light"
                          ? "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                          : "bg-[#1c1c1c] border-white/10 text-white/70 hover:text-white hover:bg-neutral-900"}`}
                    title="360 Panorama"
                  >
                    <svg className="w-6 h-6 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <circle cx="12" cy="12" r="3" strokeWidth={2.2} />
                      <path d="M12 9V5m0 0l-2.5 2.5M12 5l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} />
                      <path d="M7 8.5C5.1 9.9 4 12.1 4 14.5c0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5c0-2.4-1.1-4.6-2.9-6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16.5 5.5l1.5 3h-3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <div className={`relative w-full max-w-4xl aspect-[16/9] flex justify-center items-center rounded-2xl overflow-hidden border transition-colors duration-500 bg-white
                  ${theme === "light" ? "border-neutral-100" : "border-white/5"}`}
                >
                  {floorPlanView === "360" ? (
                    /* 360 Panorama View */
                    <div
                      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Image background panning */}
                      <div
                        className={`absolute inset-0 w-full h-full transition-all duration-300
                          ${!floorPlanFurnished ? "grayscale opacity-40 blur-[0.5px]" : ""}`}
                        style={{
                          backgroundImage: "url('/panorama_360.png')",
                          backgroundPosition: `${panX}% 50%`,
                          backgroundSize: "180% auto",
                          backgroundRepeat: "repeat-x",
                        }}
                      />

                      {/* Mini Floor Plan Map bottom-left */}
                      <div className={`absolute bottom-4 left-4 w-28 h-24 rounded-xl border p-2 shadow-md z-20 flex flex-col items-center justify-center relative bg-white/95 text-neutral-800 border-neutral-200/80`}>
                        <div className="w-full h-full relative">
                          <svg className="w-full h-full opacity-40 text-neutral-500" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M 15 15 L 85 15 L 85 65 L 65 65 L 65 55 L 35 55 L 35 65 L 15 65 Z" />
                            <line x1="35" y1="15" x2="35" y2="55" />
                            <line x1="55" y1="15" x2="55" y2="35" />
                            <line x1="65" y1="15" x2="65" y2="35" />
                            <line x1="65" y1="35" x2="85" y2="35" />
                            <line x1="55" y1="35" x2="65" y2="35" />
                          </svg>

                          {/* Minimap active direction pointer cone */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 80">
                            <g transform={`translate(${[75, 48, 52, 62, 50, 68, 25, 25][activeRoomIndex]}, ${[50, 35, 25, 25, 18, 18, 25, 50][activeRoomIndex]})`}>
                              <g transform={`rotate(${panX * 3.6})`}>
                                <path d="M 0 0 L -12 -22 A 12 12 0 0 1 12 -22 Z" fill="rgba(79, 70, 229, 0.35)" stroke="rgba(79, 70, 229, 0.6)" strokeWidth="0.5" />
                              </g>
                              <circle cx="0" cy="0" r="2" fill="rgb(79, 70, 229)" />
                              <circle cx="0" cy="0" r="4" fill="none" stroke="rgb(79, 70, 229)" strokeWidth="0.5" className="animate-ping" />
                            </g>
                          </svg>
                        </div>
                      </div>

                      {/* 360 Bottom floating toolbar overlays */}
                      <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-3 text-white text-xs font-semibold select-none">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRotationSpeed((s) => (s === 1 ? 2 : 1));
                          }}
                          className="w-8 h-8 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center text-[10px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all duration-300"
                        >
                          {rotationSpeed}x
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAutoRotating(!isAutoRotating);
                          }}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300
                            ${isAutoRotating 
                              ? "bg-[#EFBF04] border-[#EFBF04] text-[#1D1D1F]" 
                              : "border-white/20 hover:bg-white/10 text-white"}`}
                          title="Auto Rotate"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Default floor plan mock layouts */
                    <div className={`relative h-full w-auto transition-all duration-500 rounded-lg select-none flex items-center justify-center
                      ${floorPlanView === "2D" ? "aspect-[1024/584]" : "aspect-[446/414]"}
                      ${floorPlanView === "3D" ? "scale-[1.38]" : "scale-100"}`}
                    >
                      <img
                        src={floorPlanView === "2D" ? "/floor_plan_2d.png" : "/floor_plan_3d.png"}
                        alt={`${ROOMS[activeRoomIndex].fullLabel} floor layout`}
                        className={`w-full h-full object-contain transition-all duration-500 rounded-lg select-none
                          ${theme === "light" ? "opacity-95" : "opacity-90"}
                          ${!floorPlanFurnished ? "grayscale opacity-40 blur-[0.5px]" : ""}`}
                      />

                      {/* Highlight SVG layer on top of image */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {/* Glowing active room overlay */}
                        <motion.rect
                          key={activeRoomIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.55 }}
                          transition={{ duration: 0.3 }}
                          x={floorPlanView === "2D" ? ROOMS[activeRoomIndex].x2d : ROOMS[activeRoomIndex].x3d}
                          y={floorPlanView === "2D" ? ROOMS[activeRoomIndex].y2d : ROOMS[activeRoomIndex].y3d}
                          width={floorPlanView === "2D" ? ROOMS[activeRoomIndex].w2d : ROOMS[activeRoomIndex].w3d}
                          height={floorPlanView === "2D" ? ROOMS[activeRoomIndex].h2d : ROOMS[activeRoomIndex].h3d}
                          fill="rgba(91, 62, 179, 0.45)"
                          stroke="rgb(91, 62, 179)"
                          strokeWidth="0.8"
                          className="drop-shadow-[0_0_8px_rgba(91,62,179,0.5)]"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Middle tools panel */}
                <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-neutral-200/10 dark:border-white/5 relative z-10">
                  
                  {/* Left Controls: Unit and Furnished switches */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Unit Switcher */}
                    <div className={`rounded-full p-1 border flex gap-1 items-center
                      ${theme === "light" ? "bg-neutral-100 border-neutral-200/70" : "bg-black/40 border-white/5"}`}
                    >
                      <button
                        onClick={() => setFloorPlanUnit("Feet")}
                        className={`px-4 py-1.5 rounded-full font-bold text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer
                          ${floorPlanUnit === "Feet"
                            ? "bg-[#EFBF04] text-[#1D1D1F] shadow-sm"
                            : "text-neutral-500 hover:text-neutral-800 dark:text-white/40 dark:hover:text-white"}`}
                      >
                        Feet
                      </button>
                      <button
                        onClick={() => setFloorPlanUnit("Meter")}
                        className={`px-4 py-1.5 rounded-full font-bold text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer
                          ${floorPlanUnit === "Meter"
                            ? "bg-[#EFBF04] text-[#1D1D1F] shadow-sm"
                            : "text-neutral-500 hover:text-neutral-800 dark:text-white/40 dark:hover:text-white"}`}
                      >
                        Meter
                      </button>
                    </div>

                    {/* Furnished Toggle Switch */}
                    <div
                      onClick={() => setFloorPlanFurnished(!floorPlanFurnished)}
                      className="flex items-center gap-2.5 cursor-pointer select-none"
                    >
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${theme === "light" ? "text-neutral-500" : "text-white/40"}`}>
                        Furnished
                      </span>
                      <div className={`w-9 h-5 rounded-full p-0.5 relative transition-all duration-300 flex items-center
                        ${floorPlanFurnished ? "bg-[#EFBF04]" : "bg-neutral-300 dark:bg-neutral-800"}`}
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 rounded-full bg-white shadow-sm absolute"
                          animate={{ left: floorPlanFurnished ? "18px" : "2px" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Room Title Pill */}
                  <div className={`rounded-full px-5 py-2 flex items-center gap-4 text-xs font-bold tracking-wider uppercase border shadow-sm
                    ${theme === "light"
                      ? "bg-neutral-50 border-neutral-200 text-neutral-800"
                      : "bg-[#181818]/60 border-white/5 text-white/90"}`}
                  >
                    <button
                      onClick={handlePrevRoom}
                      className="cursor-pointer text-neutral-400 hover:text-[#EFBF04] transition-colors p-1"
                      title="Previous Room"
                    >
                      ←
                    </button>
                    <span className="min-w-[130px] text-center">
                      {ROOMS[activeRoomIndex].fullLabel}
                    </span>
                    <button
                      onClick={handleNextRoom}
                      className="cursor-pointer text-neutral-400 hover:text-[#EFBF04] transition-colors p-1"
                      title="Next Room"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Bottom Row Room Chips Carousel */}
                <div className="w-full flex items-center gap-2 relative z-10">
                  {/* Left scroll button */}
                  <button
                    onClick={() => scrollRoomChips("left")}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors
                      ${theme === "light"
                        ? "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50"
                        : "bg-[#181818] border-white/8 text-white/40 hover:text-white hover:bg-neutral-900"}`}
                    title="Scroll Left"
                  >
                    ←
                  </button>

                  {/* Chips Scrollable Content */}
                  <div
                    ref={roomListRef}
                    className="flex-1 flex gap-2.5 overflow-x-auto scrollbar-none py-2 px-0.5 scroll-smooth"
                  >
                    {ROOMS.map((room, idx) => {
                      const isActive = idx === activeRoomIndex;
                      return (
                        <div
                          key={room.id}
                          onClick={() => setActiveRoomIndex(idx)}
                          className={`border rounded-xl p-3 w-[100px] flex flex-col items-center text-center gap-2 cursor-pointer transition-all duration-300 active:scale-97 shrink-0 active-room-chip
                            ${isActive
                              ? "bg-[#EFBF04] border-[#EFBF04] text-black shadow-md shadow-amber-500/20 font-bold"
                              : theme === "light"
                                ? "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50/50"
                                : "bg-[#181818] border-white/5 text-white/80 hover:bg-[#202020]"}`}
                        >
                          <div className={isActive ? "text-black" : theme === "light" ? "text-[#EFBF04]" : "text-amber-500"}>
                            {renderRoomIcon(room.icon)}
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider truncate w-full">
                            {room.label}
                          </span>
                          <span className={`text-[9px] truncate w-full ${isActive ? "text-black/60 font-bold" : "opacity-60"}`}>
                            {floorPlanUnit === "Meter" ? room.mDim : room.fDim}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right scroll button */}
                  <button
                    onClick={() => scrollRoomChips("right")}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer transition-colors
                      ${theme === "light"
                        ? "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50"
                        : "bg-[#181818] border-white/8 text-white/40 hover:text-white hover:bg-neutral-900"}`}
                    title="Scroll Right"
                  >
                    →
                  </button>
                </div>

              </div>
            </div>

            {/* Plot Documents */}
            <div id="plot-documents" className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight">Plot Documents</h2>
              <div className={`rounded-[2rem] border overflow-hidden p-6 md:p-8 flex flex-col gap-0 shadow-md relative transition-all duration-500
                ${theme === "light" 
                  ? "bg-white border-neutral-200/80 text-neutral-800" 
                  : "bg-[#1A1A1A]/30 border-white/5 text-white"}`}
              >
              {/* Header */}
              <button
                onClick={() => setIsPlotDocsOpen(!isPlotDocsOpen)}
                className="w-full flex items-center justify-between cursor-pointer focus:outline-none select-none text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300
                    ${theme === "light" 
                      ? "bg-[#EFBF04]/10 border-[#EFBF04]/25 text-[#EFBF04]" 
                      : "bg-[#EFBF04]/10 border-[#EFBF04]/20 text-[#EFBF04] shadow-[0_0_15px_rgba(239,191,4,0.1)]"}`}
                  >
                    <svg className="w-5 h-5 text-[#EFBF04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold tracking-tight">Approvals & Certificates</span>
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${theme === "light" ? "hover:bg-neutral-100 text-neutral-500" : "hover:bg-white/5 text-white/50"}`}
                >
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isPlotDocsOpen ? "rotate-180" : ""} ${theme === "light" ? "text-neutral-500" : "text-white/50"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Collapsible content */}
              <AnimatePresence initial={false}>
                {isPlotDocsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-neutral-200/10 dark:border-white/5 mt-6 w-full">
                      {plotDocuments.map((doc, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 group
                            ${theme === "light"
                              ? "bg-neutral-50/50 border-neutral-200/60 hover:bg-neutral-50 hover:border-[#EFBF04]/30"
                              : "bg-[#161616]/30 border-white/5 hover:bg-[#1c1c1c]/45 hover:border-[#EFBF04]/20"}`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* File Icon Container */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300
                              ${theme === "light"
                                ? "bg-[#EFBF04]/8 border-[#EFBF04]/20 text-[#EFBF04]"
                                : "bg-[#EFBF04]/8 border-[#EFBF04]/15 text-white"}`}
                            >
                              <svg className={`w-5 h-5 ${theme === "light" ? "text-[#EFBF04]" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            
                            {/* Details */}
                            <div className="min-w-0">
                              <span className="block text-xs font-bold truncate leading-tight">
                                {doc.name}
                              </span>
                              <span className={`block text-[10px] tracking-wide mt-1 transition-colors
                                ${theme === "light" ? "text-neutral-400 font-semibold" : "text-white/30 font-medium"}`}
                              >
                                {doc.size}
                              </span>
                            </div>
                          </div>

                          {/* Download button */}
                          <a
                            href={`#download-${doc.file}`}
                            onClick={(e) => {
                              e.preventDefault();
                              // download simulation
                              alert(`Downloading ${doc.name}...`);
                            }}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer active:scale-95
                              ${theme === "light"
                                ? "bg-white border-neutral-200 text-neutral-500 hover:text-[#EFBF04] hover:border-[#EFBF04]/30"
                                : "bg-[#202020]/40 border-white/5 text-white/50 hover:text-[#EFBF04] hover:border-[#EFBF04]/20 hover:bg-[#EFBF04]/5"}`}
                            title={`Download ${doc.name}`}
                          >
                            <svg className={`w-4.5 h-4.5 fill-none ${theme === "light" ? "text-neutral-500" : "text-white/50"} group-hover:text-[#EFBF04] transition-colors duration-300`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            </div>

            {/* ── Mortgage Calculator Section ── */}
            <div id="mortgage-calculator" className="space-y-5 pt-4">
              <h2 className="text-xl font-bold tracking-tight">Mortgage Calculator</h2>
              <div className={`rounded-[2rem] border p-8 space-y-8 shadow-sm relative transition-all duration-500
                ${theme === "light" 
                  ? "bg-neutral-50/50 border-neutral-200/70 text-neutral-800 shadow-neutral-100" 
                  : "bg-[#1A1A1A]/45 border-white/8 text-white"}`}
              >
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Down Payment slider */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Down Payment</span>
                      <span className="font-bold">{mortgageDownPaymentPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={mortgageDownPaymentPercent}
                      onChange={(e) => setMortgageDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#EFBF04] h-1.5 bg-neutral-200 dark:bg-white/10 rounded-lg cursor-pointer appearance-none"
                    />
                    <div className="flex justify-between text-[9px] opacity-40 font-semibold">
                      <span>Min 20%</span>
                      <span>Max 80%</span>
                    </div>
                  </div>

                  {/* Interest Rate slider */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Interest Rate</span>
                      <span className="font-bold">{mortgageInterestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={8}
                      step={0.1}
                      value={mortgageInterestRate}
                      onChange={(e) => setMortgageInterestRate(Number(e.target.value))}
                      className="w-full accent-[#EFBF04] h-1.5 bg-neutral-200 dark:bg-white/10 rounded-lg cursor-pointer appearance-none"
                    />
                    <div className="flex justify-between text-[9px] opacity-40 font-semibold">
                      <span>2%</span>
                      <span>8%</span>
                    </div>
                  </div>

                  {/* Loan Term slider */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Loan Term</span>
                      <span className="font-bold">{mortgageTermYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={5}
                      value={mortgageTermYears}
                      onChange={(e) => setMortgageTermYears(Number(e.target.value))}
                      className="w-full accent-[#EFBF04] h-1.5 bg-neutral-200 dark:bg-white/10 rounded-lg cursor-pointer appearance-none"
                    />
                    <div className="flex justify-between text-[9px] opacity-40 font-semibold">
                      <span>5 Yrs</span>
                      <span>25 Yrs</span>
                    </div>
                  </div>
                </div>

                {/* Output calculations and summaries */}
                {(() => {
                  const P = property.priceVal || 0;
                  const downPaymentAmount = P * (mortgageDownPaymentPercent / 100);
                  const loanAmount = P - downPaymentAmount;
                  const monthlyInterest = (mortgageInterestRate / 12) / 100;
                  const totalPayments = mortgageTermYears * 12;
                  
                  let monthlyPayment = 0;
                  if (monthlyInterest > 0) {
                    monthlyPayment = loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) / (Math.pow(1 + monthlyInterest, totalPayments) - 1);
                  } else {
                    monthlyPayment = loanAmount / totalPayments;
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-6 border-t border-neutral-200/10 dark:border-white/5">
                      {/* Breakdown numbers */}
                      <div className="space-y-3.5 flex flex-col justify-center">
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-70">Property Price</span>
                          <span className="font-bold">{formatPrice(P)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-70">Down Payment Amount</span>
                          <span className="font-bold">{formatPrice(downPaymentAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-70">Total Loan Amount</span>
                          <span className="font-bold">{formatPrice(loanAmount)}</span>
                        </div>
                      </div>

                      {/* Highlighted Monthly Payment Card */}
                      <div className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-1 shadow-sm border
                        ${theme === "light"
                          ? "bg-amber-50/40 border-amber-100 text-amber-900"
                          : "bg-white/5 border-white/5 text-white"}`}
                      >
                        <span className="text-[10px] uppercase tracking-widest opacity-60 font-extrabold">Estimated Payment</span>
                        <span className="text-2xl font-black text-[#EFBF04] mt-1">
                          {formatPrice(Math.round(monthlyPayment))}
                        </span>
                        <span className="text-[9px] opacity-45 font-semibold">per month</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar Box) */}
          <div id="provided-by" className="lg:sticky lg:top-28 self-start space-y-4">
            
            {/* Property Agent Sidebar Card (No Avatar) - Now Developer Branding Header */}
            <div className={`relative rounded-[2.2rem] border p-8 md:p-9 flex flex-col items-center text-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500
              ${theme === "light"
                ? "bg-white border-neutral-200 text-neutral-800"
                : "bg-[#1A1A1A]/30 border-white/5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"}`}
            >
              {/* Developer Branding - Horizontal Layout (Image 1 style) */}
              <div className={`w-full border rounded-[1.5rem] p-4 flex items-center justify-between gap-4 transition-all duration-500
                ${theme === "light"
                  ? "bg-neutral-50/50 border-neutral-200/80 shadow-sm"
                  : "bg-black/20 border-white/5 shadow-inner"}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Left: Square logo container */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-500 shadow-xs
                    ${theme === "light" 
                      ? "bg-white border-neutral-200" 
                      : "bg-[#161616] border-white/10"}`}
                  >
                    <div className="scale-85 origin-center">
                      <DeveloperLogo developer={property.developer || "Exclusive"} theme={theme} />
                    </div>
                  </div>
                  
                  {/* Middle: Details */}
                  <div className="text-left min-w-0">
                    <span className={`block text-[9px] uppercase tracking-wider font-extrabold opacity-45`}>
                      Developer
                    </span>
                    <button
                      onClick={() => setIsDevModalOpen(true)}
                      className={`block text-[13px] font-black tracking-tight hover:underline text-left truncate cursor-pointer transition-all active:scale-97
                        ${theme === "light" ? "text-[#1D1D1F] hover:text-[#EFBF04]" : "text-white hover:text-[#EFBF04]"}`}
                    >
                      {getDeveloperFriendlyName(property.developer || "Exclusive")}
                    </button>
                  </div>
                </div>

                {/* Right: View details button */}
                <button
                  onClick={() => {
                    const devSlug = (property.developer || "Exclusive").toLowerCase().replace(/\s+/g, "-");
                    router.push(`/developers/${devSlug}`);
                  }}
                  className="px-4 py-2 bg-[#EFBF04] hover:bg-[#EFBF04]/90 text-black rounded-full font-bold text-[10px] active:scale-95 transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
                >
                  View Details
                </button>
              </div>

              {/* Call & Chat Buttons */}
              <div className="flex gap-3 w-full">
                {/* Call Button */}
                <a
                  href={`tel:${propertyAgent.phone}`}
                  className={`flex-1 py-3 border rounded-xl font-semibold text-xs tracking-normal transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95
                    ${theme === "light"
                      ? "bg-[#F5F5F7] border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#EFBF04]/8 hover:border-[#EFBF04]/40 hover:text-[#1D1D1F]"
                      : "bg-[#1C1C1E] border-[#38383A] text-[#F5F5F7] hover:bg-[#161617] hover:border-[#EFBF04]/30"}`}
                >
                  <PhoneIcon />
                  <span>Call</span>
                </a>
                
                {/* Chat Button */}
                <button
                  onClick={() => setIsChatOpen(prev => !prev)}
                  className={`flex-1 py-3 border text-xs tracking-normal font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95
                    ${isChatOpen
                      ? "bg-[#EFBF04] border-[#EFBF04] text-[#1D1D1F] shadow-lg shadow-[#EFBF04]/25"
                      : theme === "light"
                        ? "bg-[#F5F5F7] border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#EFBF04]/8 hover:border-[#EFBF04]/40"
                        : "bg-[#1C1C1E] border-[#38383A] text-[#F5F5F7] hover:bg-[#161617] hover:border-[#EFBF04]/30"}`}
                >
                  <ChatBubbleIcon />
                  <span>Chat</span>
                </button>
              </div>

              {/* Email Inquiry Button */}
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="w-full py-3.5 text-xs tracking-normal font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md shadow-amber-500/15 active:scale-95 bg-[#EFBF04] text-[#1D1D1F] hover:bg-[#EFBF04]/90"
              >
                <MailIcon />
                <span>Email Inquiry</span>
              </button>

              {/* Acquisition Cost Button - BELOW and OUTSIDE the developer box */}
              <button
                onClick={() => setIsAcquisitionDropdownOpen(prev => !prev)}
                className={`w-full py-3.5 text-xs tracking-normal font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95
                  ${isAcquisitionDropdownOpen
                    ? "bg-[#EFBF04]/10 border border-[#EFBF04] text-[#EFBF04] shadow-lg shadow-[#EFBF04]/5"
                    : theme === "light"
                      ? "bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#EFBF04]/8 hover:border-[#EFBF04]/40 shadow-sm"
                      : "bg-[#1C1C1E] border border-[#38383A] text-[#F5F5F7] hover:bg-[#161617] hover:border-[#EFBF04]/30 shadow-md"}`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="5" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10.5" r="2.5" />
                  <path d="M6 8v-1h1M17 7h1v1M6 13v1h1M17 14h1v-1" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="4.5" y1="19" x2="19.5" y2="19" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="4.5" y1="22" x2="19.5" y2="22" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Acquisition Cost</span>
              </button>

              {/* Dropdown Content */}
              <AnimatePresence>
                {isAcquisitionDropdownOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden w-full text-left"
                  >
                    <div className={`border rounded-2xl p-4.5 flex flex-col gap-4 transition-all duration-500
                      ${theme === "light"
                        ? "bg-neutral-50 border-neutral-200 text-neutral-900 shadow-sm"
                        : "bg-black/25 border-white/5 text-white"}`}
                    >
                      <div className="flex items-center justify-between border-b border-neutral-200/10 dark:border-white/5 pb-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] opacity-55 font-black">Cost Breakdown</span>
                        <button
                          onClick={() => setIsAcquisitionDropdownOpen(false)}
                          className="text-neutral-400 hover:text-neutral-200 text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                        >
                          Close
                        </button>
                      </div>

                      {/* Cash vs Mortgage Toggle */}
                      <div className={`flex rounded-xl p-1 border transition-all duration-300
                        ${theme === "light" ? "bg-neutral-100 border-neutral-200" : "bg-black/40 border-white/5"}`}
                      >
                        <button
                          type="button"
                          onClick={() => setAcquisitionPaymentType("cash")}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-300 cursor-pointer
                            ${acquisitionPaymentType === "cash"
                              ? "bg-[#EFBF04] text-[#1D1D1F] shadow-md shadow-[#EFBF04]/10"
                              : theme === "light" ? "text-neutral-500 hover:text-neutral-900" : "text-neutral-400 hover:text-neutral-300"}`}
                        >
                          Cash
                        </button>
                        <button
                          type="button"
                          onClick={() => setAcquisitionPaymentType("mortgage")}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-300 cursor-pointer
                            ${acquisitionPaymentType === "mortgage"
                              ? "bg-[#EFBF04] text-[#1D1D1F] shadow-md shadow-[#EFBF04]/10"
                              : theme === "light" ? "text-neutral-500 hover:text-neutral-900" : "text-neutral-400 hover:text-neutral-300"}`}
                        >
                          Mortgage
                        </button>
                      </div>

                      {/* Cost Calculations */}
                      {(() => {
                        const P = property.priceVal || 0;
                        const dldFee = P * 0.04;
                        const agencyFee = P * 0.021; // 2% + 5% VAT = 2.1%
                        const trusteeFee = P >= 500000 ? 4200 : 2100;
                        const titleDeedFee = 250;
                        
                        // Mortgage items
                        const loanVal = P * 0.80;
                        const mortgageRegFee = loanVal * 0.0025;
                        const mortgageAdminFee = 290;
                        const bankValuationFee = 3150;
                        
                        const purchasePriceDisplay = acquisitionPaymentType === "cash" ? P : P * 0.20; // Down payment if mortgage
                        
                        const secondaryCosts = dldFee + agencyFee + trusteeFee + titleDeedFee + 
                          (acquisitionPaymentType === "mortgage" ? (mortgageRegFee + mortgageAdminFee + bankValuationFee) : 0);
                        
                        const totalRequired = purchasePriceDisplay + secondaryCosts;

                        return (
                          <div className="space-y-4">
                            {/* Price Section */}
                            <div className={`p-4 rounded-2xl border transition-all duration-300
                              ${theme === "light" ? "bg-neutral-100/50 border-neutral-200" : "bg-black/30 border-white/5"}`}
                            >
                              <div className="flex justify-between items-center mb-1 text-xs">
                                <span className="opacity-65">Property Price</span>
                                <span className="font-bold">{formatPrice(P)}</span>
                              </div>
                              {acquisitionPaymentType === "mortgage" && (
                                <div className="flex justify-between items-center text-[10px] text-neutral-400">
                                  <span>Down Payment (20%)</span>
                                  <span>{formatPrice(purchasePriceDisplay)}</span>
                                </div>
                              )}
                            </div>

                            {/* Breakdown List */}
                            <div className="space-y-2.5 px-0.5">
                              <h4 className="text-[9px] uppercase tracking-wider opacity-40 font-black">Government & Agency</h4>
                              
                              <div className="flex justify-between text-[11px]">
                                <span className="opacity-75">DLD Transfer Fee (4%)</span>
                                <span className="font-semibold">{formatPrice(dldFee)}</span>
                              </div>

                              <div className="flex justify-between text-[11px]">
                                <span className="opacity-75">Agency Comm. (2.1%)</span>
                                <span className="font-semibold">{formatPrice(agencyFee)}</span>
                              </div>

                              <div className="flex justify-between text-[11px]">
                                <span className="opacity-75">Trustee Registration</span>
                                <span className="font-semibold">{formatPrice(trusteeFee)}</span>
                              </div>

                              <div className="flex justify-between text-[11px]">
                                <span className="opacity-75">Title Deed Fee</span>
                                <span className="font-semibold">{formatPrice(titleDeedFee)}</span>
                              </div>

                              {acquisitionPaymentType === "mortgage" && (
                                <>
                                  <div className="border-t border-neutral-200/10 dark:border-white/5 my-1.5" />
                                  <h4 className="text-[9px] uppercase tracking-wider opacity-40 font-black">Mortgage Costs</h4>
                                  
                                  <div className="flex justify-between text-[11px]">
                                    <span className="opacity-75">Mortgage Registration</span>
                                    <span className="font-semibold">{formatPrice(mortgageRegFee)}</span>
                                  </div>

                                  <div className="flex justify-between text-[11px]">
                                    <span className="opacity-75">Bank Valuation Fee</span>
                                    <span className="font-semibold">{formatPrice(bankValuationFee)}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-neutral-200/10 dark:border-white/5 pt-3" />

                            {/* Total Upfront Cash Required */}
                            <div className="flex justify-between items-center px-0.5">
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-wider">Total Cash Req.</span>
                                <span className="text-[8px] opacity-50 mt-0.5">
                                  {acquisitionPaymentType === "cash" 
                                    ? "Price + secondary fees" 
                                    : "Downpayment + fees"}
                                </span>
                              </div>
                              <span className="text-sm font-black text-[#EFBF04]">
                                {formatPrice(totalRequired)}
                              </span>
                            </div>

                            {acquisitionPaymentType === "mortgage" && (
                              <div className={`p-2.5 rounded-lg text-[9px] leading-relaxed transition-all duration-300
                                ${theme === "light" 
                                  ? "bg-neutral-100 text-neutral-500 border border-neutral-200" 
                                  : "bg-black/20 text-neutral-400 border border-white/5"}`}
                              >
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Note: </span>
                                Remaining {formatPrice(loanVal)} (80%) financed via mortgage.
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* ── More Like This Section (Google Chrome visual search style) ── */}
        <section className="w-full border-t border-neutral-200/30 dark:border-white/5 pt-20 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1 text-left">
              <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${theme === "light" ? "text-neutral-400" : "text-white/40"}`}>
                Visual Matches
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none">
                More like this
              </h2>
            </div>
            
            <Link 
              href="/properties" 
              className={`px-5 py-2.5 rounded-full border text-xs tracking-wider uppercase font-bold transition-all duration-300 active:scale-95 flex items-center gap-2
                ${theme === "light"
                  ? "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 shadow-sm"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white"
                }`}
            >
              <span>View All</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProperties.map(({ prop: p, score }, i) => {
              const matchPercentage = Math.round(85 + (score / 7) * 14);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    // Navigate to the property detail page and scroll back to top
                    router.push(`/properties/${p.id}`);
                    const container = pageContainerRef.current;
                    if (container) {
                      container.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`group relative rounded-[2rem] overflow-hidden border transition-all duration-500 cursor-pointer shadow-md text-left flex flex-col justify-between aspect-[3/4] bg-neutral-950
                    ${theme === "light"
                      ? "border-neutral-200/80 hover:border-neutral-350 hover:shadow-xl"
                      : "border-white/10 hover:border-white/25 hover:shadow-2xl hover:shadow-amber-500/5"
                    }`}
                >
                  {/* Property Image */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                  />
                  {/* Cinematic dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

                  {/* Top Badges Row */}
                  <div className="relative z-20 p-5 flex justify-between items-start pointer-events-none">
                    {/* Developer Logo Capsule */}
                    {p.developer && (
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center shadow-md">
                        <DeveloperLogo developer={p.developer} theme="dark" />
                      </div>
                    )}

                    {/* Google Chrome/Lens visual search style match score */}
                    <div className="bg-[#EFBF04] text-[#1D1D1F] text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                      <span>{matchPercentage}% Match</span>
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="relative z-20 p-5 pb-6">
                    {/* Location Tag */}
                    <div className="text-[10px] font-bold text-white/50 tracking-wider uppercase mb-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[#EFBF04] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span className="truncate max-w-[150px]">{p.location.split(",")[0]}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-base font-bold tracking-tight line-clamp-1 mb-1 transition-colors group-hover:text-[#EFBF04]">
                      {p.title}
                    </h3>

                    {/* Price */}
                    <p className="text-white text-xl font-black tracking-tight leading-none mb-3.5">
                      {formatPrice(p.priceVal, p.type as "buy" | "rent")}
                    </p>

                    {/* Specs Row */}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 border-t border-white/10 pt-3">
                      {p.beds > 0 ? (
                        <>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            <span>{p.beds} Beds</span>
                          </span>
                          <span className="text-white/20">|</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            <span>{p.baths} Baths</span>
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18M3 9h18" />
                          </svg>
                          <span>{p.area}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="w-full border-t border-neutral-200/30 dark:border-white/5 pt-24 pb-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <div className="lg:w-[320px] shrink-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-3">Buying in UAE</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Things You<br />Should Know
              </h2>
              <p className={`text-sm font-light leading-relaxed mt-4 ${theme === "light" ? "text-neutral-600" : "text-neutral-400"}`}>
                Answers to the most common questions from buyers and renters navigating the UAE property market.
              </p>
            </div>
            
            <div className="flex-1 flex flex-col divide-y divide-neutral-200/50 dark:divide-white/8 w-full">
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className="py-5">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group">
                    <span className={`text-sm font-semibold transition-colors
                      ${openFaq === i 
                        ? "text-amber-500" 
                        : theme === "light" ? "text-neutral-800 hover:text-neutral-600" : "text-white/80 hover:text-white"}`}>
                      {faq.q}
                    </span>
                    <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
                      ${openFaq === i ? "bg-amber-500 border-amber-500 text-white rotate-45" : "border-neutral-200 dark:border-white/10 text-neutral-400"}`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className={`text-sm font-light leading-relaxed mt-3 overflow-hidden ${theme === "light" ? "text-neutral-600" : "text-white/45"}`}>
                        {faq.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        </div>{/* end inner px wrapper */}
      </main>

      {/* ── Footer Banner + Detailed Links ── */}
      <div className={`properties-footer relative w-full px-6 sm:px-10 md:px-14 lg:px-16 py-24 md:py-32 overflow-hidden border-t font-sans
        ${theme === "light" 
          ? "bg-neutral-50 border-neutral-200 text-neutral-900" 
          : "bg-[#1A1A1A] border-white/5 text-white"}`}
      >
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-5" />

        <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-8 md:gap-10">
          <div className="flex items-center gap-2 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase">
              AA Real Estate Developments
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight leading-[1.1] max-w-4xl">
            See Tomorrow <br className="sm:hidden" />
            Before Invest
          </h2>

          <p className="text-xs sm:text-sm opacity-40 max-w-md leading-relaxed font-light uppercase tracking-wider">
            Discover off-market opportunities and secure premium real estate portfolios in the UAE.
          </p>

          <div className="mt-4">
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className={`px-8 py-4 text-[11px] tracking-[0.25em] uppercase rounded-full active:scale-95 transition-all duration-300 font-semibold cursor-pointer flex items-center gap-3 shadow-lg hover:-translate-y-0.5
                ${theme === "light" 
                  ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                  : "bg-white text-black hover:bg-neutral-200"}`}
            >
              Get In Touch
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Detailed Premium Footer links */}
        <div className="relative z-10 w-full border-t border-neutral-300/30 dark:border-white/10 mt-20 pt-16 flex flex-col gap-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">
            
            <div className="flex flex-col gap-4 md:col-span-1">
              <img
                src="/Logo/AA Real Estate.png"
                alt="AA Traders Logo"
                className="h-11 md:h-12 w-auto object-contain"
              />
              <p className="text-xs md:text-sm opacity-40 leading-relaxed font-light uppercase tracking-wider max-w-[280px]">
                Luxury Real Estate & Extraordinary Living Across UAE.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em]">AA Real Estate</h4>
              <div className="flex flex-col gap-3 opacity-60">
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">About us</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Careers</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Press Office</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Contact Us</a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em]">Professionals</h4>
              <div className="flex flex-col gap-3 opacity-60">
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Partner Hub</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Agent Portal</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Developer Services</a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em]">Discoveries</h4>
              <div className="flex flex-col gap-3 opacity-60">
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Villas Collection</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Penthouses</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity">Off-Plan Projects</a>
              </div>
            </div>

          </div>

          <div className="border-t border-neutral-300/30 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[10px] uppercase tracking-[0.25em] opacity-30">© 2026 AA Real Estate. All rights reserved.</span>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.25em] opacity-40">
              <a href="#" className="hover:opacity-100">Privacy Policy</a>
              <a href="#" className="hover:opacity-100">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Inquiry Modal ── */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInquiryModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="inquiry-modal relative w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-[2.2rem] p-8 md:p-10 shadow-2xl text-left text-white max-h-[90vh] overflow-y-auto z-10"
            >
              <button onClick={() => setIsInquiryModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="mb-8">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/50 block mb-2 font-bold">Property Inquiry</span>
                <h3 className="text-xl font-bold tracking-tight">{property.title}</h3>
                <p className="text-xs text-white/40 font-light mt-1.5">{property.location}</p>
              </div>

              {inquirySubmitted ? (
                <div className="py-12 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-lg font-bold">Inquiry Sent Successfully</h4>
                  <p className="text-xs text-white/50 font-light max-w-xs leading-relaxed">Our luxury property advisor will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-bold block">Your Name</label>
                    <input type="text" required value={inquiryName} onChange={e => setInquiryName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/30" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-bold block">Email Address</label>
                    <input type="email" required value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/30" placeholder="e.g. john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-bold block">Phone Number</label>
                    <input type="tel" required value={inquiryPhone} onChange={e => setInquiryPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/30" placeholder="e.g. +971 50 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-bold block">Your Message</label>
                    <textarea rows={3} value={inquiryMessage} onChange={e => setInquiryMessage(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/30 resize-none" placeholder="Let us know what details you need..." />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#EFBF04] text-[#1D1D1F] text-[11px] tracking-[0.25em] uppercase font-bold rounded-xl hover:bg-[#EFBF04]/90 cursor-pointer shadow-md active:scale-97 transition-colors flex items-center justify-center gap-2">
                    <span>Send Inquiry</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Developer Details Modal ── */}
      <AnimatePresence>
        {isDevModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDevModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`dev-modal relative z-10 w-full max-w-lg overflow-hidden rounded-[2.2rem] border p-8 md:p-10 shadow-2xl font-sans text-left
                ${theme === "light" 
                  ? "bg-white border-neutral-200 text-neutral-900" 
                  : "bg-[#1A1A1A] border-white/10 text-white"
                }`}
            >
              <button 
                onClick={() => setIsDevModalOpen(false)} 
                className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer
                  ${theme === "light" ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-800" : "bg-white/5 hover:bg-white/10 text-white"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col gap-6">
                {/* Brand Header */}
                <div className="flex items-center gap-4 border-b border-neutral-200/10 dark:border-white/5 pb-5 mt-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm shrink-0
                    ${theme === "light" ? "bg-neutral-50 border-neutral-200" : "bg-black/30 border-white/10"}`}
                  >
                    <div className="scale-110">
                      <DeveloperLogo developer={property.developer || "Exclusive"} theme={theme} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight leading-tight">
                      {getDeveloperFriendlyName(property.developer || "Exclusive")}
                    </h3>
                    <p className={`text-[10px] font-bold tracking-wider uppercase opacity-55 mt-1 ${theme === "light" ? "text-neutral-500" : "text-white/60"}`}>
                      {getDeveloperOfficialName(property.developer || "Exclusive")}
                    </p>
                  </div>
                </div>

                {/* Brief description */}
                <div className="space-y-4">
                  <p className={`text-xs sm:text-sm font-light leading-relaxed ${theme === "light" ? "text-neutral-600" : "text-white/60"}`}>
                    {getDeveloperBrief(property.developer || "Exclusive").desc}
                  </p>

                  {/* Founded and major projects */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className={`p-4 rounded-2xl border
                      ${theme === "light" ? "bg-neutral-50 border-neutral-200/50" : "bg-black/20 border-white/5"}`}
                    >
                      <span className="block text-[8px] uppercase tracking-widest font-extrabold opacity-40">Founded</span>
                      <span className="block text-sm font-extrabold mt-1 text-[#EFBF04] dark:text-[#EFBF04]">
                        {getDeveloperBrief(property.developer || "Exclusive").founded}
                      </span>
                    </div>

                    <div className={`p-4 rounded-2xl border
                      ${theme === "light" ? "bg-neutral-50 border-neutral-200/50" : "bg-black/20 border-white/5"}`}
                    >
                      <span className="block text-[8px] uppercase tracking-widest font-extrabold opacity-40">Status</span>
                      <span className="block text-sm font-extrabold mt-1 text-emerald-500">
                        Verified Partner
                      </span>
                    </div>
                  </div>

                  {/* Notable Projects */}
                  <div className="space-y-3 pt-3">
                    <h4 className="text-[10px] font-black tracking-widest uppercase opacity-45">Notable Landmarks & Communities</h4>
                    <div className="flex flex-wrap gap-2">
                      {getDeveloperBrief(property.developer || "Exclusive").projects.map((proj) => (
                        <span
                          key={proj}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-normal border
                            ${theme === "light" 
                              ? "bg-white border-neutral-200 text-neutral-700" 
                              : "bg-white/5 border-white/5 text-white/80"}`}
                        >
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200/10 dark:border-white/5 mt-2">
                  <button
                    onClick={() => {
                      setIsDevModalOpen(false);
                      const devSlug = (property.developer || "Exclusive").toLowerCase().replace(/\s+/g, "-");
                      router.push(`/developers/${devSlug}`);
                    }}
                    className={`flex-1 py-3 text-[10px] tracking-widest font-bold uppercase rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95
                      ${theme === "light"
                        ? "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                        : "bg-[#1A1A1A]/40 border-white/10 text-white hover:bg-white/5"}`}
                  >
                    View All Listings
                  </button>

                  <button
                    onClick={() => {
                      setIsDevModalOpen(false);
                      setIsInquiryModalOpen(true);
                    }}
                    className="flex-1 py-3 text-[10px] tracking-widest font-bold uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 bg-[#EFBF04] text-[#1D1D1F] hover:bg-[#EFBF04]/90 shadow-md shadow-amber-500/10"
                  >
                    Inquire Builder
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Report Listing Modal ── */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`report-modal relative z-10 w-full max-w-md overflow-hidden rounded-[2.2rem] border p-8 shadow-2xl font-sans text-left
                ${theme === "light" 
                  ? "bg-white border-neutral-200 text-neutral-900" 
                  : "bg-[#1A1A1A] border-white/10 text-white"
                }`}
            >
              <button 
                onClick={() => setIsReportModalOpen(false)} 
                className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer
                  ${theme === "light" ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-800" : "bg-white/5 hover:bg-white/10 text-white"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <span className={`text-[9px] uppercase tracking-[0.25em] block mb-1 font-bold ${theme === "light" ? "text-neutral-500" : "text-white/50"}`}>
                  AA Traders Security
                </span>
                <h3 className="text-xl font-bold tracking-tight">Report Listing</h3>
                <p className={`text-xs mt-1.5 leading-relaxed font-light ${theme === "light" ? "text-neutral-500" : "text-white/40"}`}>
                  Help us keep AA Traders accurate. Please select the reason for reporting this property.
                </p>
              </div>
              
              {reportSubmitted ? (
                <div className="py-12 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold">Report Received</h4>
                  <p className={`text-xs font-light max-w-xs leading-relaxed ${theme === "light" ? "text-neutral-500" : "text-white/50"}`}>
                    Our compliance team will investigate this listing immediately.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                    {[
                      "Inaccurate price / details",
                      "Fake property / listing is not real",
                      "Duplicate listing",
                      "Offensive/inappropriate media",
                      "Other"
                    ].map((reason) => (
                      <label 
                        key={reason}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                          ${reportReason === reason 
                            ? theme === "light" 
                              ? "bg-neutral-50 border-neutral-400 font-semibold text-neutral-900"
                              : "bg-white/5 border-white/30 font-semibold text-white"
                            : theme === "light"
                              ? "border-neutral-100 hover:bg-neutral-50 text-neutral-600"
                              : "border-white/5 hover:bg-white/5 text-white/60"
                          }`}
                      >
                        <input
                          type="radio"
                          name="reportReason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="accent-white cursor-pointer"
                        />
                        <span className="text-xs">{reason}</span>
                      </label>
                    ))}
                  </div>

                  {reportReason === "Other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={reportOtherText}
                        onChange={(e) => setReportOtherText(e.target.value)}
                        placeholder="Please tell us more..."
                        className={`w-full mt-2 p-3.5 text-xs rounded-xl border focus:outline-none transition-all resize-none
                          ${theme === "light"
                            ? "bg-neutral-50 border-neutral-200 focus:border-neutral-450 text-neutral-900 focus:bg-white"
                            : "bg-black/40 border-white/10 focus:border-white/30 text-white focus:bg-black/60"
                          }`}
                        rows={3}
                        required
                      />
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={!reportReason}
                    className={`w-full py-4 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all text-center
                      ${!reportReason 
                        ? theme === "light"
                          ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                          : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
                        : "bg-[#EFBF04] text-[#1D1D1F] hover:bg-[#EFBF04]/90 shadow-md"
                      }`}
                  >
                    Submit Report
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast Notifications ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
            className={`fixed bottom-24 left-1/2 z-50 px-6 py-4 text-[10px] sm:text-xs tracking-wider uppercase font-bold rounded-full border shadow-2xl backdrop-blur-md flex items-center gap-3 select-none
              ${theme === "light"
                ? "bg-white/95 border-neutral-200 text-neutral-800 shadow-neutral-200/50"
                : "bg-[#1A1A1A]/95 border-white/10 text-white"
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EFBF04] animate-ping" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Facebook Messenger-style Chat Widget ── */}
      {/* Chat Heads Column (Desktop only) */}
      <div className="hidden md:flex fixed bottom-24 right-6 flex-col gap-3.5 z-40 select-none">
        {chatHeads.map((agent) => (
          <div key={agent.name} className="relative group">
            <button
              onClick={() => switchAgent(agent)}
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#EFBF04] to-[#B38F03] flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 hover:scale-105 transition-all
                ${chatAgent.name === agent.name && isChatOpen && !isChatMinimized
                  ? "border-[#EFBF04] scale-105 shadow-[#EFBF04]/30"
                  : theme === "light" ? "border-neutral-200" : "border-white/10"
                }`}
            >
              {agent.initials}
            </button>
            
            {/* Online indicator */}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-900" />
            
            {/* Unread indicator dot */}
            {unreadAgents.includes(agent.name) && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#EFBF04] rounded-full border-2 border-neutral-900 animate-pulse" />
            )}

            {/* Hover Tooltip tooltip */}
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-neutral-900/95 border border-white/10 text-white text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-xl">
              {agent.name}
            </div>

            {/* Remove / Close chat head button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setChatHeads(prev => prev.filter(h => h.name !== agent.name));
              }}
              className="absolute -top-1 -left-1 w-5 h-5 bg-neutral-800 text-white hover:bg-neutral-700 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md border border-white/10"
              title="Close Conversation"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Floating Compose / Bubble Toggle Button */}
      <button
        onClick={() => {
          setIsChatOpen(prev => !prev);
          setIsChatMinimized(false);
          // Default to chat state if we click to open
          if (!isChatOpen) {
            setChatState("chat");
          }
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer hover:scale-105
          ${isChatOpen && !isChatMinimized
            ? "bg-neutral-800 border border-white/10 hover:bg-neutral-750 text-white"
            : "bg-[#EFBF04] hover:bg-[#F3C924] text-[#1D1D1F]"
          }`}
        title="Toggle Chat"
      >
        {isChatOpen && !isChatMinimized ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        
        {/* Unread badge count indicator */}
        {unreadAgents.length > 0 && !(isChatOpen && !isChatMinimized) && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-neutral-900 animate-bounce">
            {unreadAgents.length}
          </span>
        )}
      </button>

      {/* Floating Messenger popup window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed z-40 shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 font-sans
              ${isChatMinimized
                ? "bottom-6 right-24 w-[280px] h-[54px] rounded-t-2xl"
                : "bottom-24 right-6 w-[360px] h-[520px] rounded-[2.2rem]"
              }
              ${theme === "light"
                ? "bg-white border-neutral-200 text-neutral-900"
                : "bg-[#0b0709]/95 border-white/10 text-white backdrop-blur-md"
              }
              max-md:bottom-0 max-md:right-0 max-md:w-full max-md:h-full max-md:rounded-none max-md:inset-0
            `}
          >
            {/* ── Active Conversation Screen ── */}
            {chatState === "chat" && (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className={`flex items-center justify-between px-5 py-3 shrink-0 border-b select-none
                  ${theme === "light" ? "bg-neutral-50 border-neutral-150" : "bg-neutral-900/60 border-white/5"}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => setChatState("list")}
                      className={`p-1.5 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors text-neutral-400 hover:text-inherit`}
                      title="All Chats"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EFBF04] to-[#B38F03] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {chatAgent.initials}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-neutral-900" />
                    </div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs truncate max-w-[120px]">{chatAgent.name}</span>
                        {chatAgent.verified && (
                          <svg className="w-3.5 h-3.5 text-[#EFBF04] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 00.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[9px] opacity-50 truncate">{chatAgent.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsChatMinimized(prev => !prev)}
                      className="p-1.5 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors text-neutral-400 hover:text-inherit"
                      title={isChatMinimized ? "Restore" : "Minimize"}
                    >
                      {isChatMinimized ? (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => { setIsChatOpen(false); setIsChatMinimized(false); }}
                      className="p-1.5 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors text-neutral-400 hover:text-inherit"
                      title="Close"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {!isChatMinimized && (
                  <>
                    {/* Agent Status Strip */}
                    <div className={`flex items-center justify-between px-5 py-2 border-b shrink-0 select-none
                      ${theme === "light" ? "bg-neutral-50/50 border-neutral-100" : "bg-white/3 border-white/5"}`}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-[10px] font-semibold">Online</span>
                        <span className="text-white/20 text-[10px]">·</span>
                        <span className="opacity-50 text-[10px]">Responds {chatAgent.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-1 select-none">
                        {chatAgent.languages.map((lang: string) => (
                          <span key={lang} className={`text-[9px] rounded-full px-2 py-0.5 font-bold ${theme === "light" ? "bg-neutral-100 text-neutral-600" : "bg-white/5 text-white/50"}`}>{lang}</span>
                        ))}
                      </div>
                    </div>

                    {/* Messages Window */}
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 scrollbar-none">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex items-end gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                          {msg.from === "agent" && (
                            <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-[#EFBF04] to-[#B38F03] flex items-center justify-center text-white text-[9px] font-bold shrink-0 mb-0.5">
                              {chatAgent.initials}
                            </div>
                          )}
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                            msg.from === "user"
                              ? "bg-[#EFBF04] text-[#1D1D1F] font-medium rounded-br-sm"
                              : theme === "light"
                                ? "bg-neutral-100 text-neutral-800 rounded-bl-sm border border-neutral-200/50"
                                : "bg-white/8 text-white/95 rounded-bl-sm border border-white/5"
                          }`}>
                            <p className="text-[12px] leading-relaxed break-words">{msg.text}</p>
                            <p className={`text-[8.5px] mt-1 ${msg.from === "user" ? "text-[#1D1D1F]/60 text-right" : "opacity-45"}`}>{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input Field */}
                    <div className={`px-4 py-3 border-t shrink-0 ${theme === "light" ? "bg-neutral-50/50 border-neutral-150" : "bg-neutral-900/60 border-white/8"}`}>
                      <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 border transition-all duration-300
                        ${theme === "light"
                          ? "bg-white border-neutral-250 focus-within:border-[#EFBF04] text-neutral-800"
                          : "bg-white/5 border-white/8 focus-within:border-[#EFBF04]/50 text-white"
                        }`}>
                        <input
                          type="text"
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendChatMessage()}
                          placeholder={`Message ${chatAgent.name.split(" ")[0]}…`}
                          className="flex-1 bg-transparent text-xs placeholder-neutral-450 focus:outline-none"
                        />
                        <button
                          onClick={sendChatMessage}
                          disabled={!chatInput.trim()}
                          className="w-7 h-7 rounded-xl bg-[#EFBF04] hover:bg-[#F3C924] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#1D1D1F] transition-all cursor-pointer shrink-0 shadow-md"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Chats List Screen ── */}
            {chatState === "list" && (
              <div className="flex flex-col h-full overflow-hidden select-none">
                {/* Header */}
                <div className={`flex items-center justify-between px-5 py-4 shrink-0 border-b
                  ${theme === "light" ? "bg-neutral-50 border-neutral-150" : "bg-neutral-900/60 border-white/5"}`}>
                  <h3 className="text-lg font-black uppercase tracking-wider">Chats</h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsChatMinimized(prev => !prev)}
                      className="p-1.5 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors text-neutral-400 hover:text-inherit"
                      title={isChatMinimized ? "Restore" : "Minimize"}
                    >
                      {isChatMinimized ? (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => { setIsChatOpen(false); setIsChatMinimized(false); }}
                      className="p-1.5 rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors text-neutral-400 hover:text-inherit"
                      title="Close"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {!isChatMinimized && (
                  <>
                    {/* Search Bar */}
                    <div className="px-4 pt-3 pb-2">
                      <div className={`flex items-center gap-2 rounded-full px-3.5 py-2.5 border transition-all duration-300
                        ${theme === "light"
                          ? "bg-neutral-50 border-neutral-200 focus-within:border-[#EFBF04] focus-within:bg-white text-neutral-800"
                          : "bg-white/5 border-white/5 focus-within:border-[#EFBF04]/50 focus-within:bg-white/10 text-white"
                        }`}>
                        <svg className="w-4 h-4 text-neutral-450 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search Messenger…"
                          className="flex-1 bg-transparent text-xs placeholder-neutral-450 focus:outline-none"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")} className="text-neutral-450 hover:text-inherit text-xs font-bold">×</button>
                        )}
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1.5 px-4 pb-2 border-b border-neutral-200/40 dark:border-white/5">
                      <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors
                          ${activeFilter === "all"
                            ? "bg-[#EFBF04] text-[#1D1D1F] font-bold"
                            : theme === "light"
                              ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setActiveFilter("unread")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5
                          ${activeFilter === "unread"
                            ? "bg-[#EFBF04] text-[#1D1D1F] font-bold"
                            : theme === "light"
                              ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                      >
                        Unread
                        {unreadAgents.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                        )}
                      </button>
                    </div>

                    {/* Backup Callout Banner */}
                    <div className={`mx-4 my-2.5 p-3 rounded-2xl border flex items-start gap-2.5
                      ${theme === "light"
                        ? "bg-[#EFBF04]/10 border-[#EFBF04]/30 text-[#604C02]"
                        : "bg-amber-950/20 border-[#EFBF04]/20 text-[#FEE587]"
                      }`}>
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-[#EFBF04] shrink-0 mt-0.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-[10.5px] leading-relaxed">
                        <p className="font-bold">Priority Advisor Access</p>
                        <p className="opacity-80">Connect directly with verified brokers for instant premium viewings.</p>
                      </div>
                    </div>

                    {/* Scrollable Agent List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-200/20 dark:divide-white/5 scrollbar-none pb-4">
                      {filteredAgents.length === 0 ? (
                        <div className="text-center py-10 opacity-55 text-xs font-medium">No active agents match your search.</div>
                      ) : (
                        filteredAgents.map((agent) => {
                          const isUnread = unreadAgents.includes(agent.name);
                          const lastMsg = mockLastMessages[agent.name] || { text: "No recent messages", time: "" };
                          return (
                            <div
                              key={agent.name}
                              onClick={() => switchAgent(agent)}
                              className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer
                                ${theme === "light" ? "hover:bg-neutral-50" : "hover:bg-white/4"}
                                ${chatAgent.name === agent.name ? theme === "light" ? "bg-[#EFBF04]/10" : "bg-[#EFBF04]/10" : ""}
                              `}
                            >
                              {/* Avatar wrapper */}
                              <div className="relative shrink-0">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#EFBF04] to-[#B38F03] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                  {agent.initials}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-900" />
                              </div>

                              {/* Message previews */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className={`text-[12.5px] truncate max-w-[150px] ${isUnread ? "font-black" : "font-bold"}`}>{agent.name}</span>
                                  {agent.verified && (
                                    <svg className="w-3.5 h-3.5 text-[#EFBF04] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 00.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                  )}
                                  {lastMsg.time && (
                                    <span className="text-[9px] opacity-40 ml-auto shrink-0 select-none">{lastMsg.time}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 justify-between">
                                  <p className={`text-[11.5px] truncate max-w-[180px]
                                    ${isUnread 
                                      ? theme === "light" ? "text-neutral-900 font-extrabold" : "text-white font-extrabold"
                                      : "opacity-45"
                                    }`}>
                                    {lastMsg.text}
                                  </p>
                                  {isUnread && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#EFBF04] shrink-0 ml-1.5" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
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
