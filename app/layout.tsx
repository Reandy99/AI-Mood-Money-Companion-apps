import type { Metadata } from "next";
import { JetBrains_Mono, Nunito, Quicksand } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const nunito = Nunito({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const quicksand = Quicksand({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "RasaKas - AI Mood & Money Companion",
  description: "AI yang tahu kamu belanja karena lapar — atau karena luka.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${nunito.variable} ${quicksand.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen font-[var(--font-inter)] antialiased">
        <Sidebar />
        <div className="md:ml-72">
          {children}
        </div>
      </body>
    </html>
  );
}
