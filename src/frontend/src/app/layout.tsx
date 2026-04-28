import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prism Money",
  description:
    "Personal finance tracking, budgets, investments, and habit intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} overscroll-y-none`}>
      <body className="antialiased">
        <div className="relative min-h-screen overflow-clip bg-background">
          {/* Noise overlay */}
          <div className="bg-noise pointer-events-none fixed inset-0 z-[1] bg-[length:256px] opacity-[0.035]" />
          {children}
        </div>
      </body>
    </html>
  );
}
