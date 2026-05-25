import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Lightbulb,
  Users,
  Target,
  ExternalLink,
  CheckCircle2,
  Zap,
  BookOpen,
} from "lucide-react";
import ViewCounter from "@/components/ViewCounter";
import { getTrendById } from "@/lib/getTrends";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonetizationIdea } from "@/lib/types";

const DIFFICULTY_COLOR: Record<
  MonetizationIdea["difficulty"],
  "success" | "warning" | "info"
> = {
  쉬움: "success",
  보통: "warning",
  어려움: "info",
};

const TYPE_EMOJI: Record<MonetizationIdea["type"], string> = {
  "앱/웹": "💻",
  "오프라인 창업": "🏪",
  콘텐츠: "📱",
  투자: "📈",
  커뮤니티: "👥",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InsightPage({ params }: PageProps) {
  const { id } = await params;
  const trend = await getTrendById(id);

  if (!trend) {
    notFound();
  }

  const formattedDate = new Date(trend.updatedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">

      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        트렌드 목록으로
      </Link>

      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/50 via-indigo-950/30 to-transparent p-8">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15),transparent_60%)] pointer-events-none" />

        <div className="relative">
          {/* Category + badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-violet-400 border-violet-500/30 bg-violet-500/10">
              {trend.category}
            </Badge>
            <Badge variant="success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{trend.riseRate}% 급상승
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            {trend.keyword}
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-2xl">
            {trend.summary}
          </p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-white/30">
            <ViewCounter trendId={id} initialCount={trend.viewCount} />
            <span>업데이트: {formattedDate}</span>
          </div>
        </div>
      </header>

      {/* ── SECTION 1: Trend Context ───────────────────────────────────── */}
      <section>
        <SectionHeading icon={<BookOpen className="h-5 w-5" />} label="Trend Context" sublabel="왜 지금 뜨고 있는가?" />

        <Card className="mt-4">
          <CardHeader className="pb-3">
            <p className="text-base font-semibold text-white leading-snug">
              {trend.trendContext.headline}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Details */}
            <ul className="space-y-3">
              {trend.trendContext.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60 leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" />
                  {d}
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* Related keywords */}
            <div>
              <p className="text-xs font-medium text-white/40 mb-2">관련 키워드</p>
              <div className="flex flex-wrap gap-2">
                {trend.trendContext.relatedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-white/60"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Source */}
            <div className="flex items-center gap-1.5 text-xs text-white/25">
              <ExternalLink className="h-3 w-3" />
              출처: {trend.trendContext.dataSource}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── SECTION 2: Monetization Ideas ─────────────────────────────── */}
      <section>
        <SectionHeading
          icon={<Lightbulb className="h-5 w-5" />}
          label="Monetization Ideas"
          sublabel="어떻게 수익화할 것인가?"
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {trend.monetizationIdeas.map((idea, i) => (
            <Card
              key={i}
              className="hover:border-violet-500/30 transition-colors"
            >
              <CardContent className="p-5 space-y-3">
                {/* Type + Difficulty */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{TYPE_EMOJI[idea.type]}</span>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                    {idea.type}
                  </Badge>
                  <Badge variant={DIFFICULTY_COLOR[idea.difficulty]} className="text-xs ml-auto">
                    {idea.difficulty}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-bold text-white text-sm leading-snug">
                  {idea.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-white/50 leading-relaxed">
                  {idea.description}
                </p>

                {/* Revenue estimate */}
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2">
                  <Zap className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-emerald-400 font-medium">
                    예상 수익: {idea.estimatedRevenue}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: Target Audience ─────────────────────────────────── */}
      <section>
        <SectionHeading
          icon={<Users className="h-5 w-5" />}
          label="Target Audience"
          sublabel="누구에게 팔 것인가?"
        />

        <Card className="mt-4">
          <CardContent className="p-6">
            {/* Primary segment */}
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
              <Target className="h-5 w-5 text-violet-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-violet-400 font-medium mb-0.5">핵심 고객군</p>
                <p className="text-sm font-bold text-white">
                  {trend.targetAudience.primarySegment}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Demographics */}
              <AudienceBlock
                title="인구통계학적 특성"
                emoji="📊"
                items={trend.targetAudience.demographics}
              />
              {/* Psychographics */}
              <AudienceBlock
                title="심리·행동 특성"
                emoji="🧠"
                items={trend.targetAudience.psychographics}
              />
              {/* Pain points */}
              <AudienceBlock
                title="페인 포인트"
                emoji="😩"
                items={trend.targetAudience.painPoints}
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

/* ── Helper Components ──────────────────────────────────────────────────── */

function SectionHeading({
  icon,
  label,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{label}</h2>
        <p className="text-xs text-white/40">{sublabel}</p>
      </div>
    </div>
  );
}

function AudienceBlock({
  title,
  emoji,
  items,
}: {
  title: string;
  emoji: string;
  items: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-white/50 mb-3 flex items-center gap-1.5">
        <span>{emoji}</span>
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-white/60 leading-relaxed"
          >
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-violet-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
