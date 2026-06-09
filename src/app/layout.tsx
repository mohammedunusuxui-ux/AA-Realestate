import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

const interTight = localFont({
  src: [
    {
      path: "./fonts/InterTight-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./fonts/InterTight-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/InterTight-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "AA Traders | Luxury Real Estate & Extraordinary Living Across UAE",
  description: "Experience smart property discovery and luxury living in Dubai & UAE. Previews of premium apartments and villas disassembling in a high-end scrollytelling journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased dark overflow-hidden`}>
      <body className="h-full bg-[#030102] text-white/90 font-sans selection:bg-white/20 selection:text-white overflow-hidden">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
