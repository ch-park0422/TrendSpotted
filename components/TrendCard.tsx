import Link from "next/link";
import { TrendingUp, Eye, Bookmark, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrendInsight } from "@/lib/mockData";

interface TrendCardProps {
  trend: TrendInsight;
  rank: number;
}

function getRiseRateBadgeVariant(rate: number): "success" | "warning" | "info" {
  if (rate >= 300) return "success";
  if (rate >= 150) return "warning";
  return "info";
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function TrendCard({ trend, rank }: TrendCardProps) {
  const variant = getRiseRateBadgeVariant(trend.riseRate);

  return (
    <Link href={`/insight/${trend.id}`} className="block group">
      <Card className="relative overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.03] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer">
        {/* Rank gradient accent */}
        <div
          className={`absolute left-0 top-0 h-full w-0.5 ${
            rank === 1
              ? "bg-gradient-to-b from-yellow-400 via-amber-400 to-transparent"
              : rank === 2
              ? "bg-gradient-to-b from-slate-300 via-slate-400 to-transparent"
              : rank === 3
              ? "bg-gradient-to-b from-orange-400 via-orange-500 to-transparent"
              : "bg-gradient-to-b from-violet-500/50 to-transparent"
          }`}
        />

        <CardContent className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            {/* Left: rank + content */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Rank number */}
              <span
                className={`flex-shrink-0 mt-0.5 text-2xl font-black leading-none ${
                  rank <= 3 ? "text-white/80" : "text-white/30"
                }`}
              >
                {String(rank).padStart(2, "0")}
              </span>

              {/* Keyword + summary */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                    {trend.keyword}
                  </h3>
                  <Badge variant={variant} className="flex-shrink-0">
                    <TrendingUp className="mr-1 h-2.5 w-2.5" />
                    +{trend.riseRate}%
                  </Badge>
                </div>
                <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
                  {trend.summary}
                </p>

                {/* Footer stats */}
                <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatNumber(trend.viewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    {formatNumber(trend.bookmarkCount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: arrow */}
            <ArrowUpRight className="flex-shrink-0 h-5 w-5 text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
