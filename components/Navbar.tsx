import Link from "next/link";
import { TrendingUp, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/50 transition-shadow">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Trend<span className="text-violet-400">Spotted</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
            <Zap className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">실시간 업데이트</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-white/20 flex items-center justify-center text-xs font-bold text-violet-300">
            TS
          </div>
        </div>
      </div>
    </nav>
  );
}
