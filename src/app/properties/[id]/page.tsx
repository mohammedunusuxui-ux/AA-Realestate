"use client";

import React, { use, useState, useEffect, useRef } from "react";
import { PROPERTIES_DATA, FAQ_DATA } from "@/data/properties";
import { useTheme } from "@/components/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

// ─── Component ──────────────────────────────────────────────────────────────
export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { theme, toggle: toggleTheme } = useTheme();
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const propertyId = parseInt(id, 10);
  const property = PROPERTIES_DATA.find((p) => p.id === propertyId);

  // States
  const [scrolled, setScrolled] = useState(false);
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);
  const [isRentDropdownOpen, setIsRentDropdownOpen] = useState(false);
  const [isNewProjectsDropdownOpen, setIsNewProjectsDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [chartTimeframe, setChartTimeframe] = useState<"1Y" | "2Y" | "5Y">("2Y");
  const [compareLocation, setCompareLocation] = useState("Dubai Marina");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showInlineMap, setShowInlineMap] = useState(false);
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

  // Inline Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{from:"user"|"agent"; text:string; time:string}[]>([
    { from: "agent", text: `Hi! I'm the agent for ${property?.title ?? "this property"}. How can I help you today?`, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    setChatMessages(prev => [...prev, { from: "user", text, time }]);
    setChatInput("");
    setTimeout(() => {
      const replies = [
        "Great question! I'd be happy to arrange a private viewing for you.",
        "This property is available immediately. Would you like to schedule a call?",
        "The price is negotiable for serious buyers. Can I get your contact details?",
        "We also have similar listings in the area if you'd like to compare.",
        "I'll check with the owner and get back to you right away!",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages(prev => [...prev, { from: "agent", text: reply, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }]);
    }, 900);
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages]);


  useEffect(() => {
    // Initial login check
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const container = pageContainerRef.current;
    const handleScroll = () => {
      if (container) {
        setScrolled(container.scrollTop > 50);
      }
    };
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#030102] flex items-center justify-center text-center p-6 text-white">
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

  return (
    <div
      ref={pageContainerRef}
      className={`relative h-screen overflow-y-auto scroll-smooth ${
        theme === "light" ? "bg-white text-neutral-900" : "bg-[#030102] text-white"
      } transition-colors duration-500`}
    >

      {/* ── Header ── */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex items-center justify-between ${
        scrolled 
          ? theme === "light"
            ? "bg-white/90 backdrop-blur-md border-b border-neutral-200/50 py-4 px-6 md:px-12"
            : "bg-[#030102]/65 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12"
          : "bg-transparent py-6 md:py-8 px-6 md:px-12"
      }`}>
        {/* Brand Logo */}
        <div className="font-sans">
          <Link href="/" className="block select-none hover:opacity-80 transition-all duration-300">
            <img
              src="/Logo/AA Real Estate.png"
              alt="AA Real Estate Logo"
              className="h-11 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Minimalist Desktop Navigation Links */}
        <nav className={`hidden md:flex items-center gap-14 bg-[#171717]/90 backdrop-blur-md px-12 py-4 rounded-full border shadow-sm font-sans
          ${theme === "light" ? "border-neutral-200 text-white" : "border-white/10 text-white"}`}>
          <Link href="/properties?type=buy" className="text-[12px] tracking-[0.25em] uppercase hover:text-white/80 transition-colors py-1 block font-bold">Buy</Link>
          <Link href="/properties?type=rent" className="text-[12px] tracking-[0.25em] uppercase hover:text-white/80 transition-colors py-1 block font-bold">Rent</Link>
          <Link href="/?section=4" className="text-[12px] tracking-[0.25em] uppercase hover:text-white/80 transition-colors py-1 block font-bold">New Projects</Link>
          <Link href="/?section=6" className="text-[12px] tracking-[0.25em] uppercase hover:text-white/80 transition-colors py-1 block font-bold">Find Agent</Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95
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
          <Link href="/?openAuth=true" className={`px-6 py-2 border text-[10px] tracking-[0.2em] uppercase rounded-full cursor-pointer transition-colors
            ${theme === "light"
              ? "border-neutral-200 text-neutral-900 bg-neutral-100/50 hover:bg-neutral-100"
              : "border-white/20 text-white bg-[#030102]/20 hover:bg-white/10"}`}>
            Login / Signup
          </Link>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="relative z-10 w-full pt-36 pb-0">
        <div className="w-full px-6 md:px-12 overflow-x-hidden">
        
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

        {/* Property Title Heading */}
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-3 font-sans leading-tight ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
          {property.title}
        </h1>

        {/* Subheading: Location */}
        <div className={`flex items-center gap-2 text-sm sm:text-base font-semibold mb-8 ${theme === "light" ? "text-neutral-600" : "text-neutral-450"}`}>
          <div className="text-amber-500">
            <PinIcon />
          </div>
          <span>{property.location}</span>
        </div>

        {/* ── Image Gallery Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
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
                className={`px-4 py-2 rounded-full text-[9px] tracking-widest font-extrabold uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer border shadow-md
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
                className={`px-4 py-2 rounded-full text-[9px] tracking-widest font-extrabold uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer border shadow-md
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
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
            <div className="flex-1 relative aspect-[16/10] sm:aspect-auto lg:h-[155px] rounded-[2rem] overflow-hidden border border-white/5 shadow-lg group">
              <img
                src={galleryImage1}
                alt="Interior perspective"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
            <div className="flex-1 relative aspect-[16/10] sm:aspect-auto lg:h-[155px] rounded-[2rem] overflow-hidden border border-white/5 shadow-lg group">
              <img
                src={galleryImage2}
                alt="Architectural landscape"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Main Details: Split layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-24">
          
          {/* Left Columns (Details Content) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Description</h2>
              <p className={`text-base leading-relaxed font-light ${theme === "light" ? "text-neutral-600" : "text-neutral-400"}`}>
                {property.title} is a beautifully designed modern estate located in the prestigious area of {property.location}.
                Offering breathtaking panoramic views and a serene surrounding landscape, this property integrates luxury, style, and everyday comfort.
                Constructed by premium developers {property.developer || "AA Traders Signature Homes"}, the property features expansive open-plan layout interiors with high-performance glass windows that bring in extensive natural light, boosting the overall luxury residence experience.
              </p>
            </div>

            {/* Specifications Card List */}
            <div className={`rounded-[2rem] border p-8 grid grid-cols-2 sm:grid-cols-3 gap-8 shadow-sm
              ${theme === "light" 
                ? "bg-neutral-50/50 border-neutral-200/70 text-neutral-800" 
                : "bg-[#111111]/45 border-white/8 text-white"}`}
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
                  <span className="text-sm font-bold truncate max-w-[120px]" title={property.developer || "Exclusive"}>
                    {property.developer || "Exclusive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities & Features */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight">Amenities & Features</h2>
              <div className="flex flex-wrap gap-2.5">
                {["Swimming Pool", "Gym", "Private Parking", "24/7 Security", "Central A/C", "Landscaped Garden"].map((item) => (
                  <span
                    key={item}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider border shadow-sm
                      ${theme === "light"
                        ? "bg-neutral-50 border-neutral-200/80 text-neutral-700"
                        : "bg-[#111111]/30 border-white/5 text-white/80"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Prices & Trends Section */}
            <div className={`rounded-[2rem] border p-8 space-y-6 shadow-sm relative transition-colors duration-500
              ${theme === "light" 
                ? "bg-neutral-50/50 border-neutral-200/70" 
                : "bg-[#111111]/45 border-white/8 text-white"}`}
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
                            : "bg-[#030102]/40 border-white/5 text-white/40 hover:text-white/70"}`}
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
                    <span className="w-3.5 h-0.75 border-t-2 border-dashed border-indigo-400 inline-block" />
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
                                  AED {primaryPrices[hoveredIndex].toLocaleString()}
                                </div>
                              </div>
                            </div>
                            {/* Compare location row */}
                            <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${theme === "light" ? "bg-indigo-50" : "bg-indigo-500/10"}`}>
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className={`text-[9px] font-bold uppercase tracking-wider truncate ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>
                                  {compareLocation}
                                </div>
                                <div className={`text-[13px] font-black tracking-tight mt-0.5 ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
                                  AED {secondaryPrices[hoveredIndex].toLocaleString()}
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
            <div className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight">Location</h2>
              <div className={`rounded-[2rem] border overflow-hidden p-6 md:p-8 shadow-sm relative transition-all duration-500
                ${theme === "light" 
                  ? "bg-white border-neutral-200/80 text-neutral-800" 
                  : "bg-[#111111]/30 border-white/5 text-white"}`}
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
                          ? "border-indigo-600/30 text-indigo-600 hover:bg-indigo-50/50"
                          : "border-amber-500/30 text-amber-500 hover:bg-amber-500/5"}`}
                    >
                      {showInlineMap ? "Hide Map" : "View on map"}
                    </button>
                  </div>

                  {/* Expandable Interactive Map Embed */}
                  <AnimatePresence>
                    {showInlineMap && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="w-full overflow-hidden rounded-2xl border border-neutral-200/50 dark:border-white/5 shadow-inner"
                      >
                        <iframe
                          title="Property Location Map"
                          width="100%"
                          height="350"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          className={`w-full block ${theme === "light" ? "grayscale-0" : "invert-[0.9] hue-rotate-[180deg] contrast-[0.9] opacity-80"}`}
                        />
                        <div className={`p-4 text-center border-t text-xs font-medium uppercase tracking-wider
                          ${theme === "light"
                            ? "bg-neutral-50 border-neutral-200 text-neutral-500"
                            : "bg-[#161616]/50 border-white/5 text-white/50"}`}
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
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Floor Plans */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold tracking-tight">Floor Plans</h2>
              <div className={`rounded-[2rem] border overflow-hidden p-6 md:p-8 flex flex-col items-center gap-8 shadow-md relative
                ${theme === "light" 
                  ? "bg-white border-neutral-200/80 text-neutral-800" 
                  : "bg-[#111111]/30 border-white/5 text-white"}`}
              >
                
                {/* Right floating view controls */}
                <div className="absolute right-6 top-[28%] -translate-y-1/2 z-20 flex flex-col gap-3">
                  {/* 2D View */}
                  <button
                    onClick={() => setFloorPlanView("2D")}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-xs cursor-pointer shadow-md transition-all duration-300 active:scale-95
                      ${floorPlanView === "2D"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25"
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
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25"
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
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25"
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
                              ? "bg-indigo-600 border-indigo-600 text-white" 
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
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-neutral-500 hover:text-neutral-800 dark:text-white/40 dark:hover:text-white"}`}
                      >
                        Feet
                      </button>
                      <button
                        onClick={() => setFloorPlanUnit("Meter")}
                        className={`px-4 py-1.5 rounded-full font-bold text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer
                          ${floorPlanUnit === "Meter"
                            ? "bg-indigo-600 text-white shadow-sm"
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
                        ${floorPlanFurnished ? "bg-indigo-600" : "bg-neutral-300 dark:bg-neutral-800"}`}
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
                      className="cursor-pointer text-neutral-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-colors p-1"
                      title="Previous Room"
                    >
                      ←
                    </button>
                    <span className="min-w-[130px] text-center">
                      {ROOMS[activeRoomIndex].fullLabel}
                    </span>
                    <button
                      onClick={handleNextRoom}
                      className="cursor-pointer text-neutral-400 hover:text-indigo-600 dark:hover:text-amber-500 transition-colors p-1"
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
                          className={`border rounded-xl p-3 w-[100px] flex flex-col items-center text-center gap-2 cursor-pointer transition-all duration-300 active:scale-97 shrink-0
                            ${isActive
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/25"
                              : theme === "light"
                                ? "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50/50"
                                : "bg-[#181818] border-white/5 text-white/80 hover:bg-[#202020]"}`}
                        >
                          <div className={isActive ? "text-white" : "text-indigo-600 dark:text-amber-500"}>
                            {renderRoomIcon(room.icon)}
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider truncate w-full">
                            {room.label}
                          </span>
                          <span className={`text-[9px] truncate w-full ${isActive ? "text-white/80" : "opacity-60"}`}>
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
          </div>

          {/* Right Column (Sidebar Box) */}
          <div className="lg:sticky lg:top-28 self-start space-y-6">
            
            {/* Dark themed Contact / Inquiry Sidebar Card */}
            <div className="bg-[#111111] border border-white/8 text-white rounded-[2.2rem] p-9 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col items-center text-center gap-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/3 rounded-full blur-2xl pointer-events-none" />
              
              {/* Home badge logo */}
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl font-bold tracking-tight">Like this property?</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light px-2">
                  We'd love to help you explore this home. Reach out to get more details or book a private viewing.
                </p>
              </div>

              {/* Bullet Features */}
              <div className="w-full flex flex-col gap-3 font-semibold text-xs tracking-wider uppercase text-white/80">
                {["Verified Property Listings", "Quality Living Spaces", "Smart Real Estate Choice"].map((feat) => (
                  <div key={feat} className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-left flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="w-full flex flex-col gap-3">
                <div className="flex gap-3 w-full">
                  <a
                    href="tel:+97145558888"
                    className="flex-1 py-3.5 bg-neutral-900 border border-white/10 hover:border-white/25 text-white hover:bg-neutral-800 text-[10px] tracking-widest font-extrabold uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneIcon />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => setIsChatOpen(prev => !prev)}
                    className={`flex-1 py-3.5 border text-white text-[10px] tracking-widest font-extrabold uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                      ${isChatOpen
                        ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/25"
                        : "bg-neutral-900 border-white/10 hover:border-white/25 hover:bg-neutral-800"}`}
                  >
                    <ChatBubbleIcon />
                    <span>Chat</span>
                  </button>
                </div>
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="w-full py-4 bg-white text-black hover:bg-neutral-200 text-[11px] tracking-widest font-extrabold uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
                >
                  <MailIcon />
                  <span>Email Inquiry</span>
                </button>
              </div>
            </div>
            {/* ── Inline Chat Panel ── */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="bg-[#111111] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)] flex flex-col"
                  style={{ height: "420px" }}
                >
                  {/* Chat Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#0e0e0e] shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                          AA
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0e0e0e]" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold tracking-wide">Property Agent</p>
                        <p className="text-emerald-400 text-[10px] font-semibold">● Online now</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {/* Messages */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex items-end gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.from === "agent" && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mb-1">
                            AA
                          </div>
                        )}
                        <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
                          msg.from === "user"
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-white/8 text-white/90 rounded-bl-sm"
                        }`}>
                          <p className="text-[12px] leading-relaxed">{msg.text}</p>
                          <p className={`text-[9px] mt-1 ${msg.from === "user" ? "text-indigo-200/60 text-right" : "text-white/30"}`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Input */}
                  <div className="px-4 py-3 border-t border-white/8 bg-[#0e0e0e] shrink-0">
                    <div className="flex items-center gap-2 bg-white/6 rounded-xl px-3 py-2 border border-white/8 focus-within:border-indigo-500/50 transition-colors">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendChatMessage()}
                        placeholder="Type a message…"
                        className="flex-1 bg-transparent text-white text-xs placeholder-white/25 focus:outline-none"
                      />
                      <button
                        onClick={sendChatMessage}
                        disabled={!chatInput.trim()}
                        className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

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
      <div className={`relative w-full px-6 sm:px-10 md:px-14 lg:px-16 py-24 md:py-32 overflow-hidden border-t font-sans
        ${theme === "light" 
          ? "bg-neutral-50 border-neutral-200 text-neutral-900" 
          : "bg-[#171717] border-white/5 text-white"}`}
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
              className="relative w-full max-w-lg bg-[#171717] border border-white/10 rounded-[2.2rem] p-8 md:p-10 shadow-2xl text-left text-white max-h-[90vh] overflow-y-auto z-10"
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
                  <button type="submit" className="w-full py-4 bg-white text-black text-[11px] tracking-[0.25em] uppercase font-bold rounded-xl hover:bg-neutral-200 cursor-pointer shadow-md active:scale-97 transition-colors flex items-center justify-center gap-2">
                    <span>Send Inquiry</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
