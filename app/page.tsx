import { TrendingUp, BarChart3, Sparkles } from "lucide-react";
import TrendList from "@/components/TrendList";
import { getAllTrendsByCategory, getAllTrends } from "@/lib/getTrends";

// 크론이 6시간마다 실행되므로 캐시도 6시간으로 설정
export const revalidate = 21600;

export default async function HomePage() {
  // 서버에서 Supabase(또는 mockData)에서 데이터 패치
  const [trendsByCategory, allTrends] = await Promise.all([
    getAllTrendsByCategory(),
    getAllTrends(),
  ]);

  // 통계 계산
  const totalCount = allTrends.length;
  const avgRiseRate = totalCount > 0
    ? Math.round(allTrends.reduce((sum, t) => sum + t.riseRate, 0) / totalCount)
    : 0;
  const lastUpdated = allTrends[0]?.updatedAt
    ? new Date(allTrends[0].updatedAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="pt-4 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
            <Sparkles className="h-3 w-3" />
            AI 기반 트렌드 분석
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          지금 뜨는 트렌드,
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            비즈니스 인사이트
          </span>
          로 전환하세요
        </h1>

        <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
          재테크·창업·사이드 프로젝트 분야의 급상승 키워드를 실시간으로 추적하고,
          AI가 분석한 수익화 전략을 즉시 확인하세요.
        </p>

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap gap-6">
          {[
            { icon: TrendingUp, label: "실시간 트렌드", value: `${totalCount}개` },
            { icon: BarChart3, label: "평균 상승률", value: `+${avgRiseRate}%` },
            { icon: Sparkles, label: "AI 인사이트", value: "24/7" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <Icon className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{value}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Trend Tabs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">급상승 트렌드</h2>
            <p className="text-sm text-white/40 mt-0.5">카테고리별 실시간 인기 키워드</p>
          </div>
          <div className="text-xs text-white/30">
            {lastUpdated} 기준
          </div>
        </div>
        <TrendList trendsByCategory={trendsByCategory} />
      </section>
    </div>
  );
}
