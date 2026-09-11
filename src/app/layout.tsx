import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TWS Quant Terminal | Auction Market Theory & Performance Dashboard",
  description: "Dashboard pemantauan trading kuantitatif, kurva R-Multiple, dan jurnal lelang TWS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${geistMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
