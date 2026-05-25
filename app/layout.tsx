import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrendSpotted — 실시간 트렌드 인사이트",
  description:
    "재테크·창업·사이드 프로젝트 급상승 트렌드와 AI 비즈니스 인사이트를 한눈에 확인하세요.",
  keywords: ["트렌드", "재테크", "창업", "사이드 프로젝트", "인사이트"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} min-h-screen antialiased`}>
        {/* Background grid */}
        <div
          className="fixed inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,87,255,0.15),transparent)]" />

        <Navbar />
        <main className="container mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
