import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | AA Traders Real Estate",
  description: "AA Traders internal admin dashboard — manage properties, agents, inquiries and analytics.",
};

// Admin route inherits the root layout (html/body/font already set there).
// We only override the scroll behaviour via a wrapper div inside the page.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
