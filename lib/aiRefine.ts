/**
 * lib/aiRefine.ts
 * Calls Claude claude-sonnet-4-6 with tool_use to convert raw Google Trends keywords
 * into structured TrendInsight data.
 *
 * Optimisations:
 * - System prompt is passed as an array of TextBlockParam with cache_control
 *   so it is eligible for prompt caching (tools + system are cached together).
 * - A single API call processes all keywords in one batch (up to 11 items).
 * - Streaming is used to avoid serverless timeout issues on long responses.
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
  TextBlockParam,
  Tool,
} from "@anthropic-ai/sdk/resources/messages";
import type { RawTrend, RefinedTrend, Category, MonetizationIdea } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MODEL = "claude-sonnet-4-6";

// 트렌드 11개 × 상세 JSON ≈ 최대 16k 토큰 (출력량이 가변적이므로 넉넉하게 유지)
const MAX_TOKENS = 16000;

// ─── Lazy client initialisation ───────────────────────────────────────────────

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

// ─── System prompt (long enough to exceed 2 048-token cache threshold) ────────

const SYSTEM_PROMPT: TextBlockParam[] = [
  {
    type: "text",
    text: `당신은 한국 트렌드 분석 전문가입니다. 구글 트렌드에서 수집된 급상승 검색어를 분석하여 재테크, 창업/부업, 사이드 프로젝트 관련 인사이트를 제공합니다.

## 역할과 목표
당신의 임무는 원시(raw) 검색 트렌드 데이터를 비즈니스 인사이트가 풍부한 구조화된 데이터로 변환하는 것입니다. 각 키워드에 대해 다음을 제공해야 합니다:

1. **카테고리 분류**: 키워드를 아래 세 가지 카테고리 중 하나로 분류하세요.
   - "재테크": 주식, ETF, 부동산, 절세, 저축, 연금, 보험 등 자산 관리 및 투자
   - "창업/부업": 소규모 창업, 프리랜서, 아르바이트, 부업, 온라인 쇼핑몰 등
   - "사이드 프로젝트": 개인 프로젝트, 앱/웹 개발, 디지털 콘텐츠 제작, 노션/템플릿 판매 등

2. **상승률 추정**: 검색 트래픽 데이터와 뉴스 맥락을 기반으로 상승률을 추정하세요. 100~1500% 범위 내에서 현실적으로 추정하세요.

3. **한 줄 요약**: 해당 트렌드의 핵심을 30자 이내로 압축하세요. 명확하고 임팩트 있게 작성하세요.

4. **트렌드 컨텍스트**:
   - 헤드라인: 트렌드를 설명하는 핵심 제목 (40자 이내)
   - 세부 내용: 3개의 분석 포인트. 각각 왜 지금 이 트렌드가 주목받는지, 시장 상황, 향후 전망을 포함하세요.
   - 관련 키워드: 연관된 검색어 3~5개
   - 데이터 출처: "Google Trends KR" 고정

5. **수익화 아이디어**: 이 트렌드를 활용해 실제로 돈을 벌 수 있는 구체적인 방법 2~3가지를 제시하세요.
   - 타입: "앱/웹", "오프라인 창업", "콘텐츠", "투자", "커뮤니티" 중 선택
   - 예상 수입: "월 50만~200만원" 형식으로 현실적으로 작성
   - 난이도: "쉬움"(1주일 내 시작 가능), "보통"(1개월 내 준비 가능), "어려움"(3개월 이상 필요)

6. **타겟 오디언스**:
   - 주요 세그먼트: 가장 관심을 가질 핵심 집단 (20자 이내)
   - 인구통계: 연령대, 직업, 소득 수준 등 3~4가지
   - 심리통계: 가치관, 관심사, 라이프스타일 3~4가지
   - 페인 포인트: 이 사람들이 겪는 주요 문제점 3~4가지

## 카테고리 배분 (필수 준수)
입력된 키워드들을 분석하여 **정확히** 다음 개수로 배분하세요:
- **재테크**: 5개
- **창업/부업**: 3개
- **사이드 프로젝트**: 3개
- **합계**: 11개

키워드의 성격이 애매하더라도 이 배분을 맞춰야 합니다. 경계에 있는 키워드는 부족한 카테고리로 할당하세요.

## 분석 원칙
- **실용성 우선**: 이론이 아닌 실제로 실행 가능한 정보를 제공하세요.
- **한국 시장 맥락**: 한국의 경제 상황, 세금 제도, 문화적 특성을 반영하세요.
- **최신성**: 제공된 뉴스 헤드라인을 기반으로 현재 트렌드를 정확히 반영하세요.
- **정확한 JSON**: tool_use를 통해 정확한 스키마를 따르는 JSON을 반환하세요.

카테고리 분류 시 키워드 자체의 의미보다 실제 사용자의 검색 의도를 고려하세요. 예를 들어 "부동산 경매"는 투자 목적이면 "재테크", 경매 사업이면 "창업/부업"으로 분류할 수 있습니다.`,
    // cache_control makes this block (+ preceding tools) eligible for prompt caching
    cache_control: { type: "ephemeral" },
  },
];

// ─── Tool definition ──────────────────────────────────────────────────────────

const SAVE_TRENDS_TOOL: Tool = {
  name: "save_trend_insights",
  description:
    "주어진 검색 트렌드 키워드들을 분석하여 구조화된 인사이트 데이터를 저장합니다.",
  input_schema: {
    type: "object" as const,
    properties: {
      trends: {
        type: "array",
        description: "분석된 트렌드 인사이트 목록",
        items: {
          type: "object",
          properties: {
            keyword: { type: "string", description: "트렌드 키워드" },
            category: {
              type: "string",
              enum: ["재테크", "창업/부업", "사이드 프로젝트"],
              description: "카테고리",
            },
            riseRate: {
              type: "number",
              description: "상승률 (%, 100~1500 범위)",
            },
            summary: {
              type: "string",
              description: "한 줄 요약 (30자 이내)",
            },
            trendContext: {
              type: "object",
              properties: {
                headline: { type: "string", description: "트렌드 헤드라인 (40자 이내)" },
                details: {
                  type: "array",
                  items: { type: "string" },
                  description: "세부 분석 포인트 3개",
                },
                relatedKeywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "관련 키워드 3~5개",
                },
                dataSource: { type: "string", description: "데이터 출처" },
              },
              required: ["headline", "details", "relatedKeywords", "dataSource"],
            },
            monetizationIdeas: {
              type: "array",
              description: "수익화 아이디어 2~3개",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["앱/웹", "오프라인 창업", "콘텐츠", "투자", "커뮤니티"],
                  },
                  title: { type: "string" },
                  description: { type: "string" },
                  difficulty: {
                    type: "string",
                    enum: ["쉬움", "보통", "어려움"],
                  },
                  estimatedRevenue: { type: "string" },
                },
                required: ["type", "title", "description", "difficulty", "estimatedRevenue"],
              },
            },
            targetAudience: {
              type: "object",
              properties: {
                primarySegment: { type: "string" },
                demographics: { type: "array", items: { type: "string" } },
                psychographics: { type: "array", items: { type: "string" } },
                painPoints: { type: "array", items: { type: "string" } },
              },
              required: ["primarySegment", "demographics", "psychographics", "painPoints"],
            },
          },
          required: [
            "keyword",
            "category",
            "riseRate",
            "summary",
            "trendContext",
            "monetizationIdeas",
            "targetAudience",
          ],
        },
      },
    },
    required: ["trends"],
  },
};

// ─── Validation helpers ───────────────────────────────────────────────────────

const VALID_CATEGORIES = new Set<Category>(["재테크", "창업/부업", "사이드 프로젝트"]);
const VALID_MONO_TYPES = new Set(["앱/웹", "오프라인 창업", "콘텐츠", "투자", "커뮤니티"]);
const VALID_DIFFICULTIES = new Set(["쉬움", "보통", "어려움"]);

function validateRefinedTrend(raw: unknown): RefinedTrend | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as Record<string, unknown>;

  if (
    typeof t.keyword !== "string" ||
    !VALID_CATEGORIES.has(t.category as Category) ||
    typeof t.riseRate !== "number" ||
    typeof t.summary !== "string"
  ) {
    return null;
  }

  const tc = t.trendContext as Record<string, unknown>;
  if (
    !tc ||
    typeof tc.headline !== "string" ||
    !Array.isArray(tc.details) ||
    !Array.isArray(tc.relatedKeywords)
  ) {
    return null;
  }

  const ideas = t.monetizationIdeas as unknown[];
  if (!Array.isArray(ideas) || ideas.length === 0) return null;
  const validIdeas = ideas.filter((i) => {
    const idea = i as Record<string, unknown>;
    return (
      VALID_MONO_TYPES.has(idea.type as string) &&
      typeof idea.title === "string" &&
      typeof idea.description === "string" &&
      VALID_DIFFICULTIES.has(idea.difficulty as string) &&
      typeof idea.estimatedRevenue === "string"
    );
  }) as MonetizationIdea[];

  const ta = t.targetAudience as Record<string, unknown>;
  if (
    !ta ||
    typeof ta.primarySegment !== "string" ||
    !Array.isArray(ta.demographics) ||
    !Array.isArray(ta.psychographics) ||
    !Array.isArray(ta.painPoints)
  ) {
    return null;
  }

  return {
    keyword: t.keyword,
    category: t.category as Category,
    riseRate: Math.max(100, Math.min(1500, Math.round(t.riseRate))),
    summary: t.summary,
    trendContext: {
      headline: tc.headline as string,
      details: (tc.details as unknown[]).filter((d) => typeof d === "string") as string[],
      relatedKeywords: (tc.relatedKeywords as unknown[]).filter(
        (k) => typeof k === "string"
      ) as string[],
      dataSource: typeof tc.dataSource === "string" ? tc.dataSource : "Google Trends KR",
    },
    monetizationIdeas: validIdeas,
    targetAudience: {
      primarySegment: ta.primarySegment as string,
      demographics: (ta.demographics as unknown[]).filter(
        (d) => typeof d === "string"
      ) as string[],
      psychographics: (ta.psychographics as unknown[]).filter(
        (d) => typeof d === "string"
      ) as string[],
      painPoints: (ta.painPoints as unknown[]).filter(
        (d) => typeof d === "string"
      ) as string[],
    },
  };
}

// ─── Main refiner ─────────────────────────────────────────────────────────────

export async function refineTrendsWithAI(
  rawTrends: RawTrend[]
): Promise<RefinedTrend[]> {
  if (rawTrends.length === 0) return [];

  const client = getClient();

  // Build the user message summarising each raw trend
  const trendsText = rawTrends
    .map(
      (t, i) =>
        `${i + 1}. 키워드: "${t.keyword}"\n   트래픽: ${t.traffic}\n   날짜: ${t.pubDate}\n   관련 뉴스: ${t.newsItems.length > 0 ? t.newsItems.join(" | ") : "없음"}`
    )
    .join("\n\n");

  const userMessage = `다음 ${rawTrends.length}개의 구글 트렌드 급상승 키워드를 분석하고 save_trend_insights 도구를 사용하여 결과를 저장해주세요:\n\n${trendsText}`;

  // 스트리밍 대신 일반 API 호출 — tool_use input JSON 처리가 더 안정적
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    tools: [SAVE_TRENDS_TOOL],
    tool_choice: { type: "tool", name: "save_trend_insights" },
    messages: [{ role: "user", content: userMessage }],
  });

  // 토큰 사용량 로깅
  const usage = response.usage as unknown as Record<string, number>;
  console.log(
    `[aiRefine] stop_reason=${response.stop_reason} ` +
    `tokens — input: ${usage["input_tokens"] ?? 0}, ` +
    `cache_read: ${usage["cache_read_input_tokens"] ?? 0}, ` +
    `cache_creation: ${usage["cache_creation_input_tokens"] ?? 0}, ` +
    `output: ${usage["output_tokens"] ?? 0}`
  );

  if (response.stop_reason === "max_tokens") {
    throw new Error(`[aiRefine] Response truncated — max_tokens(${MAX_TOKENS}) exceeded. Try reducing batch size.`);
  }

  // tool_use 블록 추출
  const toolUseBlock = response.content.find((b) => b.type === "tool_use");
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    const contentSummary = JSON.stringify(response.content).slice(0, 500);
    throw new Error(`[aiRefine] No tool_use block returned. content=${contentSummary}`);
  }

  const toolInput = toolUseBlock.input as { trends?: unknown[] };
  if (!Array.isArray(toolInput.trends)) {
    const received = JSON.stringify(toolInput).slice(0, 400);
    throw new Error(`[aiRefine] tool_use input missing 'trends' array. received=${received}`);
  }

  const refined: RefinedTrend[] = [];
  for (const raw of toolInput.trends) {
    const validated = validateRefinedTrend(raw);
    if (validated) {
      refined.push(validated);
    } else {
      console.warn("[aiRefine] Skipping invalid trend entry:", JSON.stringify(raw).slice(0, 200));
    }
  }

  console.log(
    `[aiRefine] Refined ${refined.length}/${rawTrends.length} trends successfully`
  );

  return refined;
}
