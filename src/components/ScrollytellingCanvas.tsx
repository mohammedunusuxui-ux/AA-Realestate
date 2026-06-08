"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent, AnimatePresence, useMotionValue, animate, useScroll, MotionValue } from "framer-motion";

interface ScrollSection {
  title: string;
  subtitle: string;
  start: number;
  end: number;
}

const SECTIONS: ScrollSection[] = [
  {
    title: "Discover Extraordinary Living Across UAE",
    subtitle: "AA TRADERS DEVELOPMENTS",
    start: 0.0,
    end: 0.05,
  },
  {
    title: "Luxury Villas Designed For Elevated Living",
    subtitle: "UNRIVALED SOPHISTICATION",
    start: 0.05,
    end: 0.20,
  },
  {
    title: "Premium Apartments In Prime Locations",
    subtitle: "CURATED URBAN LIVING",
    start: 0.20,
    end: 0.40,
  },
  {
    title: "Smart Property Discovery Experience",
    subtitle: "AI-POWERED SEARCH",
    start: 0.40,
    end: 0.60,
  },
  {
    title: "Where Investment Meets Lifestyle",
    subtitle: "GENERATE SECURE WEALTH",
    start: 0.60,
    end: 0.75,
  },
  {
    title: "Invest In UAE’s Future Landmarks",
    subtitle: "EXCLUSIVE CAPITAL APPRECIATION",
    start: 0.75,
    end: 0.87,
  },
];



export default function ScrollytellingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Inquiry Modal State
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", interest: "Villas" });

  // Section 4 Active Card State
  const [activeCard, setActiveCard] = useState<1 | 2 | 3>(1);

  // Authentication Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isAuthSubmitted, setIsAuthSubmitted] = useState(false);
  const [authState, setAuthState] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  // Manual scroll progress motion value driven by wheel/touch gestures
  const scrollYProgress = useMotionValue(0);
  const smoothProgress = useMotionValue(0);

  // Section 2 Data and Refs
  const section2Ref = useRef<HTMLDivElement>(null);
  const section2Y = useTransform(smoothProgress, [0.93, 1.0], ["100vh", "0vh"]);

  // Track ref for Section 3 pinning
  const section3TrackRef = useRef<HTMLDivElement>(null);

  // Scroll progress of the Section 3 sticky track relative to the container
  const { scrollYProgress: section3ScrollYProgress } = useScroll({
    container: section2Ref,
    target: section3TrackRef,
    offset: ["start start", "end end"]
  });

  // Reset Section 2 scroll position when it goes out of view
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 1.0 && section2Ref.current) {
      section2Ref.current.scrollTop = 0;
    }
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const drawFrameRef = useRef<(progress: number) => void>(() => {});

  // Preload all 75 frames of the scroll animation
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    const totalFrames = 75;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, "0");
      img.src = `/sequence/ezgif-frame-${numStr}.png`;
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  const drawFrame = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const totalFrames = 75;
    const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
    const img = imagesRef.current[frameIndex];

    if (img && img.complete && img.naturalWidth !== 0) {
      // Enable high-quality image smoothing explicitly on every frame draw
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        // Canvas is wider than image aspect ratio
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        // Canvas is taller than image aspect ratio
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } else if (img) {
      // If the image is not loaded yet, register an onload handler
      img.onload = () => {
        const currentProgress = smoothProgress.get();
        const currentFrameIndex = Math.min(totalFrames - 1, Math.floor(currentProgress * totalFrames));
        if (currentFrameIndex === frameIndex) {
          drawFrameRef.current(currentProgress);
        }
      };
    }
  };

  // Keep drawFrameRef updated
  useEffect(() => {
    drawFrameRef.current = drawFrame;
  });

  // Resize handler to match canvas coordinate space with screen dimensions
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      
      // Draw immediately on resize
      drawFrameRef.current(smoothProgress.get());
    };

    window.addEventListener("resize", handleResize);
    // Use requestAnimationFrame to defer initialization until DOM is stable
    const animId = requestAnimationFrame(handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [smoothProgress]);

  // Handle inquiry form submit
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Auto-close modal after 2.5 seconds and reset form state
    setTimeout(() => {
      setIsInquiryOpen(false);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: "", email: "", phone: "", interest: "Villas" });
      }, 500);
    }, 2500);
  };

  // Handle authentication form submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthSubmitted(true);
    // Auto-close modal after 2.5 seconds and reset form state
    setTimeout(() => {
      setIsAuthOpen(false);
      setTimeout(() => {
        setIsAuthSubmitted(false);
        setAuthState({ name: "", email: "", password: "", confirmPassword: "" });
      }, 500);
    }, 2500);
  };

  // Listen for custom navigation event from the header
  useEffect(() => {
    const handleScrollToSection = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      const sectionIndex = customEvent.detail;
      const sectionOffsets = [0.0, 0.10, 0.30, 0.50, 0.70, 0.80, 0.95];
      const targetProgress = sectionOffsets[sectionIndex];
      
      if (targetProgress !== undefined) {
        if (window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        animate(scrollYProgress, targetProgress, {
          duration: 0.8,
          ease: "easeInOut",
        });
      }
    };

    const handleOpenInquiryModal = () => {
      setIsInquiryOpen(true);
    };

    const handleOpenAuthModal = () => {
      setAuthMode("login");
      setIsAuthOpen(true);
    };

    window.addEventListener("scrollToSection", handleScrollToSection as EventListener);
    window.addEventListener("openInquiryModal", handleOpenInquiryModal);
    window.addEventListener("openAuthModal", handleOpenAuthModal);

    return () => {
      window.removeEventListener("scrollToSection", handleScrollToSection as EventListener);
      window.removeEventListener("openInquiryModal", handleOpenInquiryModal);
      window.removeEventListener("openAuthModal", handleOpenAuthModal);
    };
  }, [scrollYProgress]);

  // Track if user has scrolled to hide the starting helper indicator
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  // High-performance scroll jacking listeners (Mouse Wheel & Swipes)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const current = scrollYProgress.get();
      const section2 = section2Ref.current;
      const section2ScrollTop = section2 ? section2.scrollTop : 0;

      // Case 1: We are in the middle of the hero canvas timeline (progress < 1.0)
      if (current < 1.0) {
        e.preventDefault();
        const speed = 0.00025; 
        const change = e.deltaY * speed;
        let targetProgress = current + change;
        targetProgress = Math.max(0, Math.min(1, targetProgress));
        scrollYProgress.set(targetProgress);
      }
      // Case 2: Section 2 is fully visible (progress === 1.0)
      else if (current === 1.0) {
        // If they scroll up and Section 2 is at the top, slide Section 2 back down
        if (e.deltaY < 0 && section2ScrollTop <= 0) {
          e.preventDefault();
          const speed = 0.00025; 
          const change = e.deltaY * speed;
          let targetProgress = current + change;
          targetProgress = Math.max(0, Math.min(1, targetProgress));
          scrollYProgress.set(targetProgress);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scrollYProgress]);

  // Touch swipe support for mobile devices
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const current = scrollYProgress.get();
      const section2 = section2Ref.current;
      const section2ScrollTop = section2 ? section2.scrollTop : 0;

      // Case 1: Hero canvas timeline is active
      if (current < 1.0) {
        if (e.cancelable) e.preventDefault();
        const touchSpeed = 0.0008; 
        const change = deltaY * touchSpeed;
        let targetProgress = current + change;
        targetProgress = Math.max(0, Math.min(1, targetProgress));
        scrollYProgress.set(targetProgress);
        touchStartY = touchY;
      }
      // Case 2: Section 2 is fully visible
      else if (current === 1.0) {
        // If swipe down (scroll up) and Section 2 is at the top, slide Section 2 back down
        if (deltaY < 0 && section2ScrollTop <= 0) {
          if (e.cancelable) e.preventDefault();
          const touchSpeed = 0.0008; 
          const change = deltaY * touchSpeed;
          let targetProgress = current + change;
          targetProgress = Math.max(0, Math.min(1, targetProgress));
          scrollYProgress.set(targetProgress);
          touchStartY = touchY;
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollYProgress]);

  // High-performance custom momentum scroll lerp loop
  useEffect(() => {
    let animFrameId: number;
    let currentProgress = scrollYProgress.get();

    const lerp = (start: number, end: number, amt: number) => {
      return (1 - amt) * start + amt * end;
    };

    const renderLoop = () => {
      const targetProgress = scrollYProgress.get();
      
      // Interpolate with a very low factor (0.045) for ultra smooth floating inertia
      currentProgress = lerp(currentProgress, targetProgress, 0.045);
      
      // Snap to target if very close to save rendering cycles
      if (Math.abs(currentProgress - targetProgress) < 0.00001) {
        currentProgress = targetProgress;
      }
      
      // Update the smooth MotionValue so all useTransform text overlays and components react
      smoothProgress.set(currentProgress);

      // Render the current canvas frame
      drawFrameRef.current(currentProgress);

      // Update active section index for side dots (triggers lightweight re-renders of the dots only)
      let newIdx = 0;
      if (currentProgress >= 0.87) newIdx = 6;
      else if (currentProgress >= 0.75) newIdx = 5;
      else if (currentProgress >= 0.60) newIdx = 4;
      else if (currentProgress >= 0.40) newIdx = 3;
      else if (currentProgress >= 0.20) newIdx = 2;
      else if (currentProgress >= 0.05) newIdx = 1;
      else newIdx = 0;

      setActiveIdx((prevIdx) => {
        if (prevIdx !== newIdx) {
          return newIdx;
        }
        return prevIdx;
      });

      animFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [scrollYProgress, smoothProgress]);

  // Calculate final section opacity & transform
  const finalOpacity = useTransform(smoothProgress, [0.87, 0.9, 0.93], [0, 1, 0]);
  const finalY = useTransform(smoothProgress, [0.87, 0.9], [30, 0]);

  return (
    <>


      {/* Main Scrollytelling Hero Section Container */}
      <div 
        ref={containerRef} 
        className="relative h-screen w-full overflow-hidden bg-[#030102] flex items-center justify-center"
      >
        {/* Edge Vignette Overlays: Blends the canvas rendering edges seamlessly into the #030102 background */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(3,1,2,0)_30%,rgba(3,1,2,0.75)_75%,rgba(3,1,2,1)_95%)]" />

        {/* Quiet Background Image Canvas Scroll Animation for Hero Section */}
        <canvas
          ref={canvasRef}
          style={{ imageRendering: "auto" as any }}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none opacity-95"
        />

        {/* Scroll-Synced Text Overlays (Sections 1 to 6) */}
        {SECTIONS.map((section, idx) => (
          <TextOverlay
            key={idx}
            section={section}
            progress={smoothProgress}
          />
        ))}

        {/* Final Reassembled Section (Section 7 with CTAs) */}
        <motion.div
          style={{ opacity: finalOpacity, y: finalY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-30 pointer-events-none"
        >
          {/* Active Users Chip */}
          <div className="mb-6 flex items-center bg-white rounded-full px-3.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] select-none pointer-events-auto border border-white/10">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-2 mr-2.5">
              <img src="/avatar1.png" alt="User 1" className="w-6 h-6 rounded-full border border-white object-cover" />
              <img src="/avatar2.png" alt="User 2" className="w-6 h-6 rounded-full border border-white object-cover" />
              <img src="/avatar3.png" alt="User 3" className="w-6 h-6 rounded-full border border-white object-cover" />
            </div>
            {/* Badge text */}
            <span className="text-[10px] md:text-xs text-[#334155] font-semibold tracking-wide">
              3,500+ Pro Users
            </span>
          </div>

          <span 
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
            className="text-xs tracking-[0.4em] uppercase text-white/60 mb-4 font-semibold"
          >
            BEGIN YOUR JOURNEY WITH AA TRADERS
          </span>
          <h2 
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.5)" }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/95 max-w-4xl leading-[1.1] mb-10"
          >
            Luxury Real Estate<br />Across the UAE
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("scrollToSection", { detail: 1 }));
              }}
              className="px-8 py-3.5 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase rounded-full cursor-pointer btn-animate-primary"
            >
              Explore Properties
            </button>
            <button
              onClick={() => setIsInquiryOpen(true)}
              className="px-8 py-3.5 bg-transparent border border-white/20 text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-full cursor-pointer btn-animate-secondary"
            >
              Book A Consultation
            </button>
          </div>
        </motion.div>

          {/* Interactive Navigation Dot Indicators */}
          <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-40">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                onClick={() => {
                  const sectionOffsets = [0.0, 0.10, 0.30, 0.50, 0.70, 0.80, 0.95];
                  const targetProgress = sectionOffsets[i];
                  
                  if (window.scrollY > 0) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  
                  // Smoothly animate the value on dot click
                  animate(scrollYProgress, targetProgress, {
                    duration: 0.8,
                    ease: "easeInOut",
                  });
                }}
                className="group flex items-center justify-end gap-4 cursor-pointer outline-none border-none bg-transparent"
                aria-label={`Scroll to section ${i + 1}`}
              >
                <span className={`text-[9px] tracking-[0.25em] transition-all duration-300 uppercase font-light hidden sm:inline ${
                  activeIdx === i ? "text-white/80 translate-x-0 opacity-100" : "text-white/0 translate-x-2 opacity-0 group-hover:text-white/40 group-hover:translate-x-0 group-hover:opacity-100"
                }`}>
                  {i === 0 && "Discover"}
                  {i === 1 && "Villas"}
                  {i === 2 && "Apartments"}
                  {i === 3 && "Smart Discovery"}
                  {i === 4 && "Lifestyle"}
                  {i === 5 && "Landmarks"}
                  {i === 6 && "Begin Journey"}
                </span>
                <div 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    activeIdx === i ? "bg-white scale-125" : "bg-white/20 group-hover:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Section 2 + Section 3: Scrollable Slide-Up Panel */}
          <motion.div
            ref={section2Ref}
            style={{ y: section2Y }}
            className="absolute inset-0 z-35 bg-black overflow-y-auto overflow-x-hidden text-white pointer-events-auto font-sans"
          >
            {/* ── Section 2: Full-Screen Video ── */}
            <div className="relative h-screen w-full overflow-hidden flex-shrink-0">
              {/* Dusk Full-Screen Background Video */}
              <div className="absolute inset-0 z-0">
                <video
                  src="/Section 2 Video/Bg3JpCFVhXQn97VzoZ1IHBgQMBg.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay for cinematic contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 z-10 pointer-events-none" />
              </div>

              {/* Cinematic Text Content Overlay */}
              <div className="relative z-20 w-full h-full flex flex-col justify-end p-8 sm:p-12 md:p-20 lg:p-28">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-2xl text-left"
                >
                  <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase font-semibold block mb-4">
                    Why Us?
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                    Why AA Real Estate?
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed font-light">
                    Your life's changing. Don't just find a place — find what's next. We help you move forward with clarity, confidence, and the right agent by your side.
                  </p>
                </motion.div>
              </div>
            </div>


            {/* ── Section 3: Scroll-Driven Word Reveal (Pinned/Sticky) ── */}
            <div ref={section3TrackRef} className="relative w-full h-[200vh] bg-[#F7F7F7]">
              <div className="sticky top-0 h-screen w-full flex items-center justify-center px-8 sm:px-20 md:px-28 lg:px-36 overflow-hidden">

                {/* Soft ambient corner vignette blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-[#e3e3e3]/45 blur-[90px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[#dfdfdf]/40 blur-[100px] pointer-events-none" />
                <div className="absolute top-[30%] right-[-5%] w-[35%] h-[40%] rounded-full bg-[#e8e8e8]/30 blur-[80px] pointer-events-none" />

                {/* Golden background particles overlay */}
                <GoldenParticles />

                <div className="relative z-10 max-w-6xl w-full text-center flex flex-col items-center justify-center gap-8">
                  {/* Heading */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 15 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.8rem] font-bold tracking-tight text-[#171717] text-center leading-tight"
                  >
                    This isn’t just about real estate.
                  </motion.h2>

                  {/* Animating Body Text */}
                  <p className="text-[1.5rem] sm:text-[1.8rem] md:text-[2.2rem] lg:text-[2.6rem] leading-[1.3] tracking-[-0.015em] font-normal text-[#0a0a0a] text-center max-w-5xl">
                    {([
                      { text: "It’s", bold: false },
                      { text: "about", bold: false },
                      { text: "identity.", bold: true },
                      { text: "Progress.", bold: true },
                      { text: "Getting", bold: false },
                      { text: "unstuck", bold: true },
                      { text: "from", bold: false },
                      { text: "the", bold: false },
                      { text: "ordinary.", bold: false },
                      { text: "You", bold: false },
                      { text: "are", bold: false },
                      { text: "not", bold: false },
                      { text: "simply", bold: false },
                      { text: "searching", bold: false },
                      { text: "for", bold: false },
                      { text: "a", bold: false },
                      { text: "physical", bold: false },
                      { text: "structure", bold: false },
                      { text: "or", bold: false },
                      { text: "a", bold: false },
                      { text: "place", bold: false },
                      { text: "to", bold: false },
                      { text: "live.", bold: false },
                      { text: "You", bold: false },
                      { text: "are", bold: false },
                      { text: "looking", bold: false },
                      { text: "for", bold: false },
                      { text: "complete", bold: false },
                      { text: "alignment.", bold: true },
                      { text: "A", bold: false },
                      { text: "sanctuary", bold: true },
                      { text: "that", bold: false },
                      { text: "elevates", bold: true },
                      { text: "your", bold: false },
                      { text: "daily", bold: false },
                      { text: "life,", bold: false },
                      { text: "reflects", bold: false },
                      { text: "your", bold: false },
                      { text: "personal", bold: false },
                      { text: "ambition,", bold: true },
                      { text: "and", bold: false },
                      { text: "grounds", bold: false },
                      { text: "your", bold: false },
                      { text: "future.", bold: true },
                      { text: "That", bold: false },
                      { text: "is", bold: false },
                      { text: "exactly", bold: true },
                      { text: "what", bold: false },
                      { text: "we", bold: false },
                      { text: "help", bold: false },
                      { text: "you", bold: false },
                      { text: "find,", bold: true },
                      { text: "every", bold: false },
                      { text: "step", bold: false },
                      { text: "of", bold: false },
                      { text: "the", bold: false },
                      { text: "way.", bold: false },
                    ] as { text: string; bold: boolean }[]).map((w, i, arr) => (
                      <RevealWord
                        key={i}
                        word={w.text}
                        bold={w.bold}
                        index={i}
                        total={arr.length}
                        scrollProgress={section3ScrollYProgress}
                      />
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section 4: Our Services ── */}
            <div className="relative w-full min-h-screen bg-white flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 py-24 overflow-hidden text-[#171717] font-sans">
              
              {/* Golden background particles overlay */}
              <GoldenParticles />

              <div className="relative z-10 w-full max-w-none flex flex-col gap-12 md:gap-16">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                  <div className="flex flex-col gap-4 max-w-2xl">
                    {/* Badge */}
                    <div className="flex items-center gap-2 text-[#878787]">
                      <svg className="w-3.5 h-3.5 text-[#171717]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                      <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase">
                        Our Services
                      </span>
                    </div>
                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#171717] leading-none">
                      Real Estate, <br className="hidden sm:inline" />
                      Rewired.
                    </h2>
                  </div>
                  
                  {/* Right description text */}
                  <p className="text-sm sm:text-base text-[#878787] font-normal max-w-xs leading-relaxed md:pb-2">
                    Built to simplify your home search with clear insights, better options, and confident decisions.
                  </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                  
                  {/* Card 01 - Talk to a Real Human */}
                  <div 
                    onClick={() => setActiveCard(1)}
                    className={`relative aspect-[4/3] md:aspect-auto md:h-[500px] rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between group shadow-lg transition-all duration-500 cursor-pointer ${
                      activeCard === 1 ? "md:col-span-2 bg-neutral-950 hover:shadow-xl" : "md:col-span-1 bg-[#F4F4F4] hover:bg-[#eaeaea] hover:-translate-y-1 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Background Image */}
                    <img 
                      src="/villa_exterior.png" 
                      alt="Expert Match" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-0 ${
                        activeCard === 1 ? "opacity-80 scale-100" : "opacity-0 group-hover:opacity-80 group-hover:scale-105"
                      }`}
                    />
                    {/* Dark gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 z-10 pointer-events-none transition-opacity duration-500 ${
                      activeCard === 1 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`} />
                    
                    {/* Top Content Row */}
                    <div className="relative z-20 flex justify-between items-start w-full">
                      <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-500 ${
                        activeCard === 1 ? "text-white/80" : "text-[#878787] group-hover:text-white/80"
                      }`}>
                        Expert Match
                      </span>
                      <span className={`text-[3.5rem] sm:text-[4.5rem] font-bold leading-none tracking-tighter transition-colors duration-500 ${
                        activeCard === 1 ? "text-white/90" : "text-[#878787] group-hover:text-white/90"
                      }`}>
                        .01
                      </span>
                    </div>

                    {/* Bottom Title & Description */}
                    <div className="relative z-20">
                      {activeCard === 1 ? (
                        <>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                            Talk to a Real Human.
                          </h3>
                          <p className="text-xs sm:text-sm text-white/70 mt-2 font-light max-w-sm leading-relaxed">
                            We match you with an expert who actually listens.
                          </p>
                        </>
                      ) : (
                        <h3 className="text-lg sm:text-xl font-bold text-[#171717] group-hover:text-white leading-snug transition-colors duration-500">
                          Talk to a Real Human.
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Card 02 - Get Clarity */}
                  <div 
                    onClick={() => setActiveCard(2)}
                    className={`relative aspect-[4/3] md:aspect-auto md:h-[500px] rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between group transition-all duration-500 cursor-pointer ${
                      activeCard === 2 ? "md:col-span-2 bg-neutral-950 hover:shadow-xl shadow-lg" : "md:col-span-1 bg-[#F4F4F4] hover:bg-[#eaeaea] hover:-translate-y-1 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Hidden Image for hover or active background */}
                    <img 
                      src="/penthouse_interior.png" 
                      alt="Clarity" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-0 ${
                        activeCard === 2 ? "opacity-80 scale-100" : "opacity-0 group-hover:opacity-80 group-hover:scale-105"
                      }`}
                    />
                    {/* Dark gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 z-10 pointer-events-none transition-opacity duration-500 ${
                      activeCard === 2 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`} />

                    {/* Top Right Number */}
                    <div className="relative z-20 flex justify-between items-start w-full">
                      <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-500 ${
                        activeCard === 2 ? "text-white/80" : "text-[#878787] group-hover:text-white/80"
                      }`}>
                        Get Clarity
                      </span>
                      <span className={`text-[3.5rem] sm:text-[4.5rem] font-bold leading-none tracking-tighter transition-colors duration-500 ${
                        activeCard === 2 ? "text-white/90" : "text-[#878787] group-hover:text-white/90"
                      }`}>
                        .02
                      </span>
                    </div>

                    {/* Bottom Left Content */}
                    <div className="relative z-20">
                      {activeCard === 2 ? (
                        <>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                            Get Clarity.
                          </h3>
                          <p className="text-xs sm:text-sm text-white/70 mt-2 font-light max-w-sm leading-relaxed">
                            We define what you really need, not just what’s available.
                          </p>
                        </>
                      ) : (
                        <h3 className="text-lg sm:text-xl font-bold text-[#171717] group-hover:text-white leading-snug transition-colors duration-500">
                          We define what you really need, not just what’s available.
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Card 03 - Move Forward */}
                  <div 
                    onClick={() => setActiveCard(3)}
                    className={`relative aspect-[4/3] md:aspect-auto md:h-[500px] rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between group transition-all duration-500 cursor-pointer ${
                      activeCard === 3 ? "md:col-span-2 bg-neutral-950 hover:shadow-xl shadow-lg" : "md:col-span-1 bg-[#F4F4F4] hover:bg-[#eaeaea] hover:-translate-y-1 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Hidden Image for hover or active background */}
                    <img 
                      src="/smart_loft.png" 
                      alt="Progress" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-0 ${
                        activeCard === 3 ? "opacity-80 scale-100" : "opacity-0 group-hover:opacity-80 group-hover:scale-105"
                      }`}
                    />
                    {/* Dark gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 z-10 pointer-events-none transition-opacity duration-500 ${
                      activeCard === 3 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`} />

                    {/* Top Right Number */}
                    <div className="relative z-20 flex justify-between items-start w-full">
                      <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-500 ${
                        activeCard === 3 ? "text-white/80" : "text-[#878787] group-hover:text-white/80"
                      }`}>
                        Move Forward
                      </span>
                      <span className={`text-[3.5rem] sm:text-[4.5rem] font-bold leading-none tracking-tighter transition-colors duration-500 ${
                        activeCard === 3 ? "text-white/90" : "text-[#878787] group-hover:text-white/90"
                      }`}>
                        .03
                      </span>
                    </div>

                    {/* Bottom Left Content */}
                    <div className="relative z-20">
                      {activeCard === 3 ? (
                        <>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                            Move Forward.
                          </h3>
                          <p className="text-xs sm:text-sm text-white/70 mt-2 font-light max-w-sm leading-relaxed">
                            We find what fits — and make it happen.
                          </p>
                        </>
                      ) : (
                        <h3 className="text-lg sm:text-xl font-bold text-[#171717] group-hover:text-white leading-snug transition-colors duration-500">
                          We find what fits — and make it happen.
                        </h3>
                      )}
                    </div>
                  </div>

                </div>

                {/* CTA Button */}
                <div className="flex justify-center mt-8 md:mt-12 w-full">
                  <button 
                    onClick={() => setIsInquiryOpen(true)}
                    className="px-8 py-4 bg-[#171717] text-white text-[11px] tracking-[0.25em] uppercase rounded-full hover:bg-neutral-800 active:scale-95 transition-all duration-300 font-sans cursor-pointer flex items-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Start to Search
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

              </div>

            </div>

            {/* ── Section 5: Trust & Confidence ── */}
            <div className="relative w-full min-h-screen bg-white flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 py-24 overflow-hidden text-[#171717] font-sans">
              
              {/* Golden background particles overlay */}
              <GoldenParticles />

              <div className="relative z-10 w-full max-w-none flex flex-col gap-12 md:gap-16">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                  <div className="flex flex-col gap-4 max-w-2xl">
                    {/* Badge */}
                    <div className="flex items-center gap-2 text-[#878787]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#878787] inline-block" />
                      <span className="text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase">
                        Trust & Confidence
                      </span>
                    </div>
                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold tracking-tight text-[#171717] leading-none">
                      Confidence behind <br className="hidden sm:inline" />
                      every property decision
                    </h2>
                  </div>
                  
                  {/* Right description text */}
                  <p className="text-sm sm:text-base text-[#878787] font-normal max-w-xs leading-relaxed md:pb-2">
                    Built to make modern home discovery simple, transparent, and more confident for every user.
                  </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full items-stretch">
                  
                  {/* Column 1: Left Stats & Sub-card */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Stats Box */}
                    <div className="bg-[#F8F8F8] rounded-[2rem] p-6 flex flex-col gap-5 flex-grow justify-center">
                      <h3 className="text-lg font-bold text-[#171717] tracking-tight mb-1">
                        Real Results
                      </h3>
                      
                      {/* Stat 1 */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100/50">
                        <span className="text-[9px] uppercase tracking-[0.1em] font-semibold text-[#878787] block mb-1">
                          Total Value
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
                          $4.6M+
                        </span>
                      </div>

                      {/* Stat 2 */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100/50">
                        <span className="text-[9px] uppercase tracking-[0.1em] font-semibold text-[#878787] block mb-1">
                          Active Homes
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
                          320+
                        </span>
                      </div>

                      {/* Stat 3 */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100/50">
                        <span className="text-[9px] uppercase tracking-[0.1em] font-semibold text-[#878787] block mb-1">
                          Happy Clients
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
                          98%
                        </span>
                      </div>
                    </div>

                    {/* Bottom Card - Built for Better Living */}
                    <div className="relative rounded-[2rem] p-6 overflow-hidden min-h-[220px] flex flex-col justify-between group shadow-sm border border-neutral-100 bg-white">
                      {/* Background Image at Bottom */}
                      <img 
                        src="/villa_exterior.png" 
                        alt="Better Living" 
                        className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-700 ease-out z-0" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
                      
                      <div className="relative z-20">
                        <h4 className="text-base font-bold text-[#171717] mb-2 tracking-tight">
                          Built for Better Living
                        </h4>
                        <p className="text-[11px] text-[#878787] font-normal leading-relaxed">
                          We do more than list homes - we create a smoother way to discover spaces that feel right for your lifestyle.
                        </p>
                      </div>

                      {/* CTA button */}
                      <div className="relative z-20 mt-4">
                        <button 
                          onClick={() => setIsInquiryOpen(true)}
                          className="px-5 py-2.5 bg-[#171717] text-white text-[10px] tracking-[0.15em] uppercase rounded-full hover:bg-neutral-800 active:scale-95 transition-all duration-300 font-sans cursor-pointer flex items-center gap-3 font-semibold shadow-md"
                        >
                          Contact Us
                          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Center Main Banner Card */}
                  <div className="lg:col-span-2 relative min-h-[480px] lg:min-h-auto rounded-[2rem] p-8 md:p-10 overflow-hidden flex flex-col justify-end group shadow-lg bg-neutral-950">
                    {/* Background Portrait Image */}
                    <img 
                      src="/agent_portrait.png" 
                      alt="Expert Guidance" 
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-700 ease-out z-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/50 to-transparent z-10 pointer-events-none" />
                    
                    {/* Bottom Content Overlay */}
                    <div className="relative z-20 max-w-xl">
                      <h3 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold text-white leading-[1.2] tracking-tight">
                        Guidance you can trust <br />
                        in your home search
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 mt-4 font-light leading-relaxed max-w-md">
                        With the right expertise and a clear approach, explore homes with confidence and move closer to finding a space that truly fits your lifestyle.
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Right Side, Loved by people with auto-scroll marquee */}
                  <div className="lg:col-span-1 flex flex-col justify-between">
                    <h3 className="text-base font-bold text-[#171717] mb-4 tracking-tight leading-tight max-w-[200px]">
                      Loved by people who found their home
                    </h3>
                    
                    {/* Scrollable list container with fade masks */}
                    <div className="relative flex-grow h-[480px] overflow-hidden rounded-2xl">
                      {/* Top Fade Gradient Mask */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
                      {/* Bottom Fade Gradient Mask */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />

                      {/* Infinite scrolling track */}
                      <div className="flex flex-col animate-vertical-scroll hover:[animation-play-state:paused]">
                        
                        {/* List 1 */}
                        <div className="flex flex-col gap-4 pb-4">
                          {/* Thumb 1 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_happy_home.png" 
                              alt="Happy Couple" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>

                          {/* Thumb 2 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_meeting_agent.png" 
                              alt="Meeting Agent" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>

                          {/* Thumb 3 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_moving_in.png" 
                              alt="Moving In" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>

                          {/* Thumb 4 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_outside_villa.png" 
                              alt="Outside Villa" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>
                        </div>

                        {/* List 2 (Duplicate for Seamless Loop) */}
                        <div className="flex flex-col gap-4 pb-4">
                          {/* Thumb 1 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_happy_home.png" 
                              alt="Happy Couple" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>

                          {/* Thumb 2 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_meeting_agent.png" 
                              alt="Meeting Agent" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>

                          {/* Thumb 3 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_moving_in.png" 
                              alt="Moving In" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>

                          {/* Thumb 4 */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[1.5] shadow-sm group cursor-pointer border border-neutral-100">
                            <img 
                              src="/couple_outside_villa.png" 
                              alt="Outside Villa" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* ── Section 6: Testimonials ── */}
            <div className="relative w-full min-h-screen bg-white flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 py-24 overflow-hidden text-[#171717] font-sans border-t border-neutral-100/50">
              {/* Golden background particles overlay */}
              <GoldenParticles />
              
              <div className="relative z-10 w-full max-w-none flex flex-col gap-12 md:gap-16">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                  <div className="flex flex-col gap-4 max-w-2xl">
                    {/* Badge */}
                    <div className="flex items-center gap-2 text-[#878787]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#878787] inline-block" />
                      <span className="text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase">
                        Trusted by Leaders
                      </span>
                    </div>
                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold tracking-tight text-[#171717] leading-none">
                      Loved by founders <br className="hidden sm:inline" />
                      & partners
                    </h2>
                  </div>
                  
                  {/* Right description text */}
                  <p className="text-sm sm:text-base text-[#878787] font-normal max-w-xs leading-relaxed md:pb-2">
                    Read real experiences from business leaders and founders who found their home and investment portfolio with us.
                  </p>
                </div>

                {/* Horizontal Carousel Container with Left/Right Fades */}
                <div className="relative w-full overflow-hidden">
                  {/* Left Fade Overlay */}
                  <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-20" />
                  {/* Right Fade Overlay */}
                  <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-20" />

                  {/* Scroll Track with Auto-Scroll Marquee */}
                  <div className="flex flex-row animate-horizontal-scroll hover:[animation-play-state:paused] w-max py-4">
                    
                    {/* List 1 */}
                    <div className="flex flex-row gap-6 shrink-0 pr-6">
                      {/* Card 1: Benedict Kurz */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar1.png" alt="Benedict Kurz" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Benedict Kurz</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Co-Founder Knowunity</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “We were able to find our dream office space and two premium penthouses with Aura's elite team...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            What impressed us most was the unique combination of speed, discretion, and the team's deep access to off-market luxury listings in Dubai. Every property introduced was not only outstanding but also aligned with our corporate culture and long-term vision.
                          </p>
                        </div>
                        
                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="flex items-center gap-2 text-[#2C4A70] font-semibold text-xs tracking-wider">
                            <span className="w-5 h-5 rounded bg-[#2C4A70] text-white flex items-center justify-center font-bold text-[10px]">K</span>
                            <span>Knowunity</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Laurent Martinot */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar2.png" alt="Laurent Martinot" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Laurent Martinot</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder Sunrise</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “If luxury property hunting were an Olympic sport, Aura would already have several gold medals...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            Efficient, sharp, and always looking out for our interests — our advisor somehow managed to make viewings feel like coffee with a friend (but with results!). Sophie made the whole purchase quick, smooth, and surprisingly enjoyable.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="text-[#2C4A70] font-semibold text-xs tracking-wider flex items-center gap-1">
                            <span>sun</span>
                            <span className="text-amber-500 font-bold">*</span>
                            <span>rise</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Ali Mahlodji */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar3.png" alt="Ali Mahlodji" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Ali Mahlodji</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder futureOne</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “Our experience with this villa acquisition process was nothing short of extraordinary...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            The speed and efficiency with which our new waterfront villa was identified and closed was beyond our expectations. Aura's team was not just helpful, they anticipated every legal detail. We highly recommend them to anyone looking for a swift and discrete transaction.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="flex items-center gap-1.5 text-black font-bold text-xs tracking-wider">
                            <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                            <span>futureOne</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Sebastian Haupt */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar4.png" alt="Sebastian Haupt" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Sebastian Haupt</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder Sell&Stay</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “Outstanding real estate services. We've already purchased several key investment units...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            And the yields have been excellent every time. Most recently, we successfully acquired a full floor in a premium development through their support — a perfect addition to our portfolio. We couldn't be happier with the returns.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider">
                            <div className="flex gap-0.5 items-end h-3">
                              <span className="w-1 h-3 bg-blue-600 rounded-full rotate-12"></span>
                              <span className="w-1 h-3 bg-blue-500 rounded-full rotate-12"></span>
                              <span className="w-1 h-3 bg-blue-400 rounded-full rotate-12"></span>
                            </div>
                            <span>Sell&Stay</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 5: Vlado Stanic */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar5.png" alt="Vlado Stanic" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Vlado Stanic</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder OnZero</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “Aura delivered outstanding relocation support for our executive team...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            Achieving swift, diverse, and highly efficient housing placements, their consultations were instrumental in securing top-tier villas for our team. The ability to understand our unique needs and match them was impressive.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <span className="px-3.5 py-1 bg-black text-white rounded-full font-bold text-[9px] uppercase tracking-wider shadow">
                            OnZero
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* List 2 (Duplicate for Seamless Loop) */}
                    <div className="flex flex-row gap-6 shrink-0 pr-6">
                      {/* Card 1: Benedict Kurz */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar1.png" alt="Benedict Kurz" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Benedict Kurz</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Co-Founder Knowunity</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “We were able to find our dream office space and two premium penthouses with Aura's elite team...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            What impressed us most was the unique combination of speed, discretion, and the team's deep access to off-market luxury listings in Dubai. Every property introduced was not only outstanding but also aligned with our corporate culture and long-term vision.
                          </p>
                        </div>
                        
                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="flex items-center gap-2 text-[#2C4A70] font-semibold text-xs tracking-wider">
                            <span className="w-5 h-5 rounded bg-[#2C4A70] text-white flex items-center justify-center font-bold text-[10px]">K</span>
                            <span>Knowunity</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Laurent Martinot */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar2.png" alt="Laurent Martinot" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Laurent Martinot</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder Sunrise</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “If luxury property hunting were an Olympic sport, Aura would already have several gold medals...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            Efficient, sharp, and always looking out for our interests — our advisor somehow managed to make viewings feel like coffee with a friend (but with results!). Sophie made the whole purchase quick, smooth, and surprisingly enjoyable.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="text-[#2C4A70] font-semibold text-xs tracking-wider flex items-center gap-1">
                            <span>sun</span>
                            <span className="text-amber-500 font-bold">*</span>
                            <span>rise</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Ali Mahlodji */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar3.png" alt="Ali Mahlodji" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Ali Mahlodji</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder futureOne</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “Our experience with this villa acquisition process was nothing short of extraordinary...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            The speed and efficiency with which our new waterfront villa was identified and closed was beyond our expectations. Aura's team was not just helpful, they anticipated every legal detail. We highly recommend them to anyone looking for a swift and discrete transaction.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="flex items-center gap-1.5 text-black font-bold text-xs tracking-wider">
                            <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                            <span>futureOne</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Sebastian Haupt */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar4.png" alt="Sebastian Haupt" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Sebastian Haupt</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder Sell&Stay</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “Outstanding real estate services. We've already purchased several key investment units...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            And the yields have been excellent every time. Most recently, we successfully acquired a full floor in a premium development through their support — a perfect addition to our portfolio. We couldn't be happier with the returns.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider">
                            <div className="flex gap-0.5 items-end h-3">
                              <span className="w-1 h-3 bg-blue-600 rounded-full rotate-12"></span>
                              <span className="w-1 h-3 bg-blue-500 rounded-full rotate-12"></span>
                              <span className="w-1 h-3 bg-blue-400 rounded-full rotate-12"></span>
                            </div>
                            <span>Sell&Stay</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 5: Vlado Stanic */}
                      <div className="bg-[#F8F8F8] rounded-[2rem] p-8 w-[380px] sm:w-[420px] shrink-0 flex flex-col justify-between min-h-[460px] shadow-sm hover:shadow-md border border-neutral-100/30 transition-shadow">
                        <div>
                          {/* Header: Avatar, Name, Role */}
                          <div className="flex items-center gap-4 mb-8">
                            <img src="/avatar5.png" alt="Vlado Stanic" className="w-11 h-11 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#171717]">Vlado Stanic</span>
                              <span className="text-[10px] text-[#878787] font-medium uppercase tracking-wider">CEO & Founder OnZero</span>
                            </div>
                          </div>

                          {/* Quote */}
                          <h3 className="text-lg sm:text-xl font-medium text-[#2C4A70] leading-relaxed mb-4 tracking-tight">
                            “Aura delivered outstanding relocation support for our executive team...”
                          </h3>
                          {/* Body */}
                          <p className="text-[11.5px] text-[#878787] leading-relaxed font-normal">
                            Achieving swift, diverse, and highly efficient housing placements, their consultations were instrumental in securing top-tier villas for our team. The ability to understand our unique needs and match them was impressive.
                          </p>
                        </div>

                        {/* Brand Logo */}
                        <div className="mt-8 flex items-center justify-start border-t border-neutral-200/50 pt-6">
                          <span className="px-3.5 py-1 bg-black text-white rounded-full font-bold text-[9px] uppercase tracking-wider shadow">
                            OnZero
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 7: Footer Banner ── */}
            <div className="relative w-full bg-[#171717] px-6 sm:px-10 md:px-14 lg:px-16 py-24 md:py-32 overflow-hidden text-white font-sans border-t border-white/5">
              {/* Golden background particles overlay */}
              <GoldenParticles />

              {/* Subtle ambient lighting effect inside the dark banner */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-8 md:gap-10">
                {/* Accent line or badge */}
                <div className="flex items-center gap-2 text-white/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                  <span className="text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase">
                    Aura Developments
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
                    onClick={() => setIsInquiryOpen(true)}
                    className="px-8 py-4 bg-white text-black text-[11px] tracking-[0.25em] uppercase rounded-full hover:bg-neutral-200 active:scale-95 transition-all duration-300 font-semibold cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-white/10 hover:-translate-y-0.5"
                  >
                    Get In Touch
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                {/* Mini-Footer links/copyright for absolute completion */}
                <div className="w-full border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-[10px] tracking-widest uppercase font-light">
                  <p>&copy; 2026 Aura. All rights reserved.</p>
                  <div className="flex gap-6">
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryOpen(true); }} className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsInquiryOpen(true); }} className="hover:text-white transition-colors">Terms of Service</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>

      {/* Premium Glassmorphic Inquiry Form Modal */}
      <AnimatePresence>
        {isInquiryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="w-full max-w-lg bg-neutral-950/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-y-auto max-h-[90vh] backdrop-blur-xl font-sans"
            >
              {/* Subtle decorative background gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              
              {/* Close button */}
              <button
                onClick={() => setIsInquiryOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/10 active:scale-95"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-6 shadow-lg shadow-white/10">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light tracking-wide text-white mb-2">Request Received</h3>
                  <p className="text-xs tracking-wider text-white/50 max-w-sm uppercase leading-relaxed font-light">
                    An Aura consultant will reach out to you within the next 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div className="text-left mb-4">
                    <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase font-semibold">Inquire</span>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-wide text-white mt-1">Begin Your Aura Experience</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider placeholder-white/25 outline-none transition-all duration-300 font-light"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider placeholder-white/25 outline-none transition-all duration-300 font-light"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+971 50 123 4567"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider placeholder-white/25 outline-none transition-all duration-300 font-light"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Interest In</label>
                      <div className="relative">
                        <select
                          value={formState.interest}
                          onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider outline-none transition-all duration-300 font-light appearance-none cursor-pointer"
                        >
                          <option value="Villas" className="bg-neutral-900 text-white font-light">Luxury Villas</option>
                          <option value="Apartments" className="bg-neutral-900 text-white font-light">Premium Apartments</option>
                          <option value="Investments" className="bg-neutral-900 text-white font-light">Investment Portfolios</option>
                          <option value="Penthouses" className="bg-neutral-900 text-white font-light">Exclusive Penthouses</option>
                        </select>
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-white/40">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase rounded-xl cursor-pointer mt-4 font-semibold btn-animate-primary"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Glassmorphic Auth Modal (Login / Signup) */}
      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="w-full max-w-md bg-neutral-950/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-y-auto max-h-[90vh] backdrop-blur-xl font-sans"
            >
              {/* Subtle decorative background gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              
              {/* Close button */}
              <button
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/10 active:scale-95"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {isAuthSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-6 shadow-lg shadow-white/10">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light tracking-wide text-white mb-2">
                    {authMode === "login" ? "Welcome Back" : "Account Created"}
                  </h3>
                  <p className="text-xs tracking-wider text-white/50 max-w-sm uppercase leading-relaxed font-light">
                    {authMode === "login"
                      ? "Accessing your personal Aura collection..."
                      : "Your premium account is ready. Welcome to Aura."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Modal Header & Tabs */}
                  <div className="text-left mb-2">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-wide text-white">
                      {authMode === "login" ? "Sign In" : "Register"}
                    </h3>
                  </div>

                  {/* Glassmorphic Tabs Selector */}
                  <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/5 rounded-xl relative">
                    <button
                      onClick={() => setAuthMode("login")}
                      className={`py-2 text-xs tracking-wider uppercase font-semibold transition-all duration-300 rounded-lg relative z-10 cursor-pointer ${
                        authMode === "login" ? "text-black bg-white" : "text-white/40 hover:text-white"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setAuthMode("signup")}
                      className={`py-2 text-xs tracking-wider uppercase font-semibold transition-all duration-300 rounded-lg relative z-10 cursor-pointer ${
                        authMode === "signup" ? "text-black bg-white" : "text-white/40 hover:text-white"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={authState.name}
                          onChange={(e) => setAuthState({ ...authState, name: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider placeholder-white/25 outline-none transition-all duration-300 font-light"
                        />
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={authState.email}
                        onChange={(e) => setAuthState({ ...authState, email: e.target.value })}
                        className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider placeholder-white/25 outline-none transition-all duration-300 font-light"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authState.password}
                        onChange={(e) => setAuthState({ ...authState, password: e.target.value })}
                        className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider placeholder-white/25 outline-none transition-all duration-300 font-light"
                      />
                    </div>

                    {authMode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5 font-medium">Confirm Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={authState.confirmPassword}
                          onChange={(e) => setAuthState({ ...authState, confirmPassword: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/5 hover:border-white/10 focus:border-white/20 rounded-xl text-white text-xs tracking-wider placeholder-white/25 outline-none transition-all duration-300 font-light"
                        />
                      </motion.div>
                    )}

                    {authMode === "login" && (
                      <div className="flex justify-end">
                        <a href="#" className="text-[10px] tracking-wider text-white/40 hover:text-white uppercase transition-colors">
                          Forgot Password?
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 bg-white text-black text-xs font-semibold tracking-[0.2em] uppercase rounded-xl cursor-pointer mt-4 font-semibold btn-animate-primary"
                    >
                      {authMode === "login" ? "Login" : "Sign Up"}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Individual Text Overlay Component for Clean Animating Scope */
interface TextOverlayProps {
  section: ScrollSection;
  progress: any;
}

const TextOverlay: React.FC<TextOverlayProps> = ({ section, progress }) => {
  const { title, subtitle, start, end } = section;
  
  const range = end - start;
  const fadeInEnd = start + range * 0.25;
  const fadeOutStart = end - range * 0.25;
  const fadeInRange = fadeInEnd - start;
  const fadeOutRange = end - fadeOutStart;

  // Subtitle custom animations (slowly expanding tracking as scroll progress moves)
  let subOpacityInput;
  let subOpacityOutput;
  let subLetterSpacingInput;
  let subLetterSpacingOutput;

  if (start === 0.0) {
    subOpacityInput = [0.0, fadeOutStart, end];
    subOpacityOutput = [0.6, 0.6, 0];
    subLetterSpacingInput = [0.0, end];
    subLetterSpacingOutput = ["0.4em", "0.55em"];
  } else {
    subOpacityInput = [start, fadeInEnd, fadeOutStart, end];
    subOpacityOutput = [0, 0.6, 0.6, 0];
    subLetterSpacingInput = [start, end];
    subLetterSpacingOutput = ["0.25em", "0.55em"];
  }

  const subOpacity = useTransform(progress, subOpacityInput, subOpacityOutput);
  const subLetterSpacing = useTransform(progress, subLetterSpacingInput, subLetterSpacingOutput);
  const subY = useTransform(progress, subOpacityInput, start === 0.0 ? [0, 0, -15] : [15, 0, 0, -15]);
  const chipOpacity = useTransform(
    progress, 
    start === 0.0 ? [0.0, fadeOutStart, end] : [start, fadeInEnd, fadeOutStart, end],
    start === 0.0 ? [1.0, 1.0, 0] : [0, 1.0, 1.0, 0]
  );

  const words = title.split(" ");
  const N = words.length;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-30">
      <motion.div 
        style={{ opacity: chipOpacity, y: subY }}
        className="mb-6 flex items-center bg-white rounded-full px-3.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] select-none pointer-events-auto border border-white/10"
      >
        {/* Overlapping Avatars */}
        <div className="flex -space-x-2 mr-2.5">
          <img src="/avatar1.png" alt="User 1" className="w-6 h-6 rounded-full border border-white object-cover" />
          <img src="/avatar2.png" alt="User 2" className="w-6 h-6 rounded-full border border-white object-cover" />
          <img src="/avatar3.png" alt="User 3" className="w-6 h-6 rounded-full border border-white object-cover" />
        </div>
        {/* Badge text */}
        <span className="text-[10px] md:text-xs text-[#334155] font-semibold tracking-wide">
          3,500+ Pro Users
        </span>
      </motion.div>

      <motion.span 
        style={{ 
          opacity: subOpacity, 
          letterSpacing: subLetterSpacing, 
          y: subY,
          textShadow: "0 2px 8px rgba(0,0,0,0.9)" 
        }}
        className="text-xs uppercase text-white mb-6 font-semibold"
      >
        {subtitle}
      </motion.span>
      
      <h2 
        style={{ textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.5)" }}
        className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white/95 max-w-4xl leading-[1.3] flex flex-wrap justify-center pl-4 pr-4"
      >
        {words.map((word, idx) => (
          <WordOverlay
            key={idx}
            word={word}
            index={idx}
            totalWords={N}
            progress={progress}
            start={start}
            end={end}
            fadeInRange={fadeInRange}
            fadeOutRange={fadeOutRange}
            fadeOutStart={fadeOutStart}
          />
        ))}
      </h2>
    </div>
  );
};

/* Subcomponent to correctly isolate and declare React Hooks per Word */
interface WordOverlayProps {
  word: string;
  index: number;
  totalWords: number;
  progress: any;
  start: number;
  end: number;
  fadeInRange: number;
  fadeOutRange: number;
  fadeOutStart: number;
}

const WordOverlay: React.FC<WordOverlayProps> = ({
  word,
  index,
  totalWords,
  progress,
  start,
  end,
  fadeInRange,
  fadeOutRange,
  fadeOutStart,
}) => {
  let wordOpacity, wordY;

  if (start === 0.0) {
    const wordOutStart = fadeOutStart + (index / totalWords) * fadeOutRange * 0.4;
    const wordOutEnd = wordOutStart + fadeOutRange * 0.6;

    wordOpacity = useTransform(progress, [0.0, wordOutStart, wordOutEnd, end], [1, 1, 0, 0]);
    wordY = useTransform(progress, [0.0, wordOutStart, wordOutEnd, end], [0, 0, -25, -25]);
  } else {
    const wordInStart = start + (index / totalWords) * fadeInRange * 0.4;
    const wordInEnd = wordInStart + fadeInRange * 0.6;
    const wordOutStart = fadeOutStart + (index / totalWords) * fadeOutRange * 0.4;
    const wordOutEnd = wordOutStart + fadeOutRange * 0.6;

    wordOpacity = useTransform(progress, 
      [start, wordInStart, wordInEnd, wordOutStart, wordOutEnd, end], 
      [0, 0, 1, 1, 0, 0]
    );
    wordY = useTransform(progress, 
      [start, wordInStart, wordInEnd, wordOutStart, wordOutEnd, end], 
      [25, 25, 0, 0, -25, -25]
    );
  }

  return (
    <span className="inline-block overflow-hidden pb-1.5 mr-2 md:mr-3">
      <motion.span 
        style={{ opacity: wordOpacity, y: wordY }}
        className="inline-block"
      >
        {word}
      </motion.span>
    </span>
  );
};

/* ─────────────────────────────────────────────
   RevealWord — scroll-driven colour reveal
   Words start as light grey and progressively
   fill to near-black as the user scrolls
   through Section 3 inside the panel.
───────────────────────────────────────────── */
interface RevealWordProps {
  word: string;
  bold: boolean;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}

const RevealWord: React.FC<RevealWordProps> = ({ word, bold, index, total, scrollProgress }) => {
  // Section 3 occupies the second half of the panel scroll (0.42 → 0.96)
  // Each word gets a staggered reveal window — spread with slight overlap
  const sectionStart = 0.05;
  const sectionEnd   = 0.85;
  const spread   = (sectionEnd - sectionStart) / total;
  const wordStart = sectionStart + index * spread;
  const wordEnd   = Math.min(wordStart + spread * 1.6, sectionEnd);

  // Opacity: 0.15 → 1
  const opacity = useTransform(
    scrollProgress,
    [wordStart, wordEnd],
    [0.15, 1]
  );

  // Colour: grey → near-black
  const color = useTransform(
    scrollProgress,
    [wordStart, wordEnd],
    ["#878787", "#171717"]
  );

  return (
    <span style={{ marginRight: "0.35em" }} className={`inline-block ${bold ? "font-bold" : ""}`}>
      <motion.span style={{ opacity, color }} className="inline-block">
        {word}
      </motion.span>
    </span>
  );
};

/* ─────────────────────────────────────────────
   GoldenParticles — soft floating gold particles
   used as background decorations for light sections
   (Sections 3, 4, 5) to create a premium luxury mood.
───────────────────────────────────────────── */
const GoldenParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
    }> = [];

    const colors = [
      "rgba(212, 175, 55, 0.26)", // Warm Gold
      "rgba(197, 160, 89, 0.20)", // Muted Amber
      "rgba(244, 215, 94, 0.22)", // Bright Gold
      "rgba(218, 165, 32, 0.18)", // Darker Goldenrod tint
    ];

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particleCount = 85;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4.5 + 2.5, // 2.5px to 7.0px
        speedX: (Math.random() - 0.5) * 0.2, // slow drift
        speedY: -(Math.random() * 0.25 + 0.1), // drift upwards
        opacity: Math.random() * 0.45 + 0.15,
        fadeSpeed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around margins
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Recycle to bottom
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.opacity = 0.1;
        }

        // Twinkle effect (oscillating opacity)
        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.65 || p.opacity < 0.10) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Format color to use current opacity
        const baseColor = p.color.substring(0, p.color.lastIndexOf(",")) + ", " + Math.max(0, p.opacity).toFixed(3) + ")";
        ctx.fillStyle = baseColor;
        
        // Add subtle shadow glow to larger particles
        if (p.size > 5.0) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(212, 175, 55, 0.45)";
        } else if (p.size > 3.5) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(212, 175, 55, 0.35)";
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};


