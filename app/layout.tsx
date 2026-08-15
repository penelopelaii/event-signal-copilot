import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import ArtBackground from "@/components/ArtBackground";
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
  title: "Event Signal Copilot",
  description:
    "A research prototype for evaluating when event-driven market signals are decision-useful. A probability is not automatically a reliable signal. Not financial advice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-bg font-sans text-ink">
        <ArtBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
