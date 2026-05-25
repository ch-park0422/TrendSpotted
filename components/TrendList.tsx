"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TrendCard from "@/components/TrendCard";
import { CATEGORIES } from "@/lib/mockData";
import type { Category, TrendInsight } from "@/lib/types";
import { Flame, Lightbulb, Code2 } from "lucide-react";
import type { ReactNode } from "react";

const CATEGORY_META: Record<
  Category,
  { icon: ReactNode; emoji: string; description: string }
> = {
  재테크: {
    icon: <Flame className="h-4 w-4" />,
    emoji: "💰",
    description: "수익을 극대화하는 투자·절세 전략",
  },
  "창업/부업": {
    icon: <Lightbulb className="h-4 w-4" />,
    emoji: "🚀",
    description: "지금 당장 시작할 수 있는 창업·부업 기회",
  },
  "사이드 프로젝트": {
    icon: <Code2 className="h-4 w-4" />,
    emoji: "⚡",
    description: "개발자·기획자를 위한 프로젝트 아이디어",
  },
};

interface TrendListProps {
  /** 서버에서 미리 패치한 카테고리별 트렌드 데이터 */
  trendsByCategory: Record<Category, TrendInsight[]>;
}

export default function TrendList({ trendsByCategory }: TrendListProps) {
  return (
    <Tabs defaultValue="재테크" className="w-full">
      <TabsList className="w-full sm:w-auto">
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat} value={cat} className="gap-1.5 text-xs sm:text-sm">
            <span>{CATEGORY_META[cat].emoji}</span>
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>

      {CATEGORIES.map((cat) => {
        const trends = trendsByCategory[cat] ?? [];
        const meta = CATEGORY_META[cat];

        return (
          <TabsContent key={cat} value={cat}>
            {/* Category header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-lg">
                {meta.emoji}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{cat}</h2>
                <p className="text-xs text-white/40">{meta.description}</p>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-white/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {trends.length}개 트렌드
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 animate-fade-in">
              {trends.length > 0 ? (
                trends.map((trend, i) => (
                  <TrendCard key={trend.id} trend={trend} rank={i + 1} />
                ))
              ) : (
                <p className="text-center text-white/30 py-12 text-sm">
                  트렌드 데이터를 불러오는 중입니다...
                </p>
              )}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
