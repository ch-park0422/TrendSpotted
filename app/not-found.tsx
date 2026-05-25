import Link from "next/link";
import { TrendingUp, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-6">
        <TrendingUp className="h-8 w-8 text-violet-400" />
      </div>
      <h1 className="text-4xl font-black text-white mb-2">404</h1>
      <p className="text-white/50 mb-8">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
      >
        <Home className="h-4 w-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
