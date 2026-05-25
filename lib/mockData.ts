// Import from shared types and re-export for backward compatibility
import type { Category, MonetizationIdea, TrendInsight } from "./types";
export type { Category, MonetizationIdea, TrendInsight };

export const mockTrends: TrendInsight[] = [
  // ── 재테크 ─────────────────────────────────────────────────────────────
  {
    id: "trend-001",
    keyword: "개인 연금 ETF 자동투자",
    category: "재테크",
    riseRate: 312,
    summary: "IRP·연금저축 계좌에서 ETF를 자동 분산투자하는 관심이 폭발적으로 상승 중",
    trendContext: {
      headline: "2030세대의 노후 불안이 '자동화된 연금 ETF' 검색을 끌어올리고 있습니다",
      details: [
        "금리 인하 전망과 함께 주식형 ETF로의 자금 이동이 가속화되고 있습니다.",
        "연금저축펀드 내 ETF 비중이 2024년 대비 47% 증가하며 사상 최고치를 기록했습니다.",
        "매달 일정 금액을 자동 매수하는 '적립식 ETF 전략'이 유튜브·블로그에서 바이럴되고 있습니다.",
        "미국 S&P500 추종 ETF와 국내 배당 ETF 조합 전략이 특히 인기를 끌고 있습니다.",
      ],
      relatedKeywords: ["IRP ETF", "연금저축 TDF", "S&P500 적립", "배당 ETF 포트폴리오"],
      dataSource: "네이버 트렌드, 금융투자협회 2025 Q2",
    },
    monetizationIdeas: [
      {
        type: "앱/웹",
        title: "연금 ETF 포트폴리오 시뮬레이터",
        description:
          "사용자가 월 투자금액과 기간을 입력하면 다양한 ETF 조합의 예상 수익률을 시뮬레이션하고, 최적 포트폴리오를 추천해주는 웹 서비스",
        difficulty: "보통",
        estimatedRevenue: "월 200~500만 원 (구독 모델 + 제휴 증권사 수수료)",
      },
      {
        type: "콘텐츠",
        title: "연금 ETF 뉴스레터",
        description:
          "매주 ETF 시장 동향과 포트폴리오 리밸런싱 전략을 큐레이션하는 유료 뉴스레터. 스티비·서브스택 활용",
        difficulty: "쉬움",
        estimatedRevenue: "월 50~150만 원 (구독자 200~500명 기준)",
      },
      {
        type: "콘텐츠",
        title: "ETF 자동투자 강의 패키지",
        description:
          "클래스101 또는 인프런에서 IRP/연금저축 ETF 자동투자 세팅 A-Z 강의 출시",
        difficulty: "쉬움",
        estimatedRevenue: "월 100~300만 원 (강의 판매 + 업데이트 구독)",
      },
    ],
    targetAudience: {
      primarySegment: "노후 준비를 시작하고 싶은 2030 직장인",
      demographics: ["25~38세", "직장인/프리랜서", "월소득 250만~500만 원"],
      psychographics: [
        "장기 투자에 관심 있으나 시간 부족",
        "자동화·시스템에 의존하는 성향",
        "노후 불안을 느끼지만 복잡한 공부는 싫음",
      ],
      painPoints: [
        "어떤 ETF를 골라야 할지 모르겠다",
        "매월 리밸런싱을 직접 하기 번거롭다",
        "세제 혜택을 최대한 활용하는 방법을 모른다",
      ],
    },
    updatedAt: "2025-05-25T09:00:00Z",
    viewCount: 14823,
    bookmarkCount: 1204,
  },
  {
    id: "trend-002",
    keyword: "달러 분산투자 전략",
    category: "재테크",
    riseRate: 228,
    summary: "원·달러 환율 변동성 확대로 달러 자산 분산 보유 전략에 대한 관심 급증",
    trendContext: {
      headline: "환율 1,450원 돌파 이후 달러 자산으로의 헷지 수요가 급격히 늘었습니다",
      details: [
        "원화 약세 장기화 전망에 달러 예금, 달러 MMF, 달러 ETF 가입이 동시에 증가했습니다.",
        "토스·카카오페이 등 핀테크 앱의 달러 소수점 매수 기능이 진입 장벽을 낮췄습니다.",
        "미국 국채 ETF(TLT, SHY)와 달러 인덱스 상품 조합이 커뮤니티에서 활발히 공유되고 있습니다.",
      ],
      relatedKeywords: ["달러 MMF", "달러 예금 금리", "미국 국채 ETF", "환헷지"],
      dataSource: "한국은행 외환시장 데이터, 네이버 금융 트렌드 2025",
    },
    monetizationIdeas: [
      {
        type: "앱/웹",
        title: "달러 환율 알림 & 자동 매수 봇",
        description:
          "사용자가 설정한 환율 목표에 도달하면 알림을 보내고, 연동된 증권사에서 자동으로 달러 ETF를 매수하는 서비스",
        difficulty: "어려움",
        estimatedRevenue: "월 500~1,500만 원 (프리미엄 구독 + 증권사 제휴)",
      },
      {
        type: "콘텐츠",
        title: "달러 자산 비중 계산기 무료 툴",
        description:
          "자산 포트폴리오를 입력하면 달러 비중 추천과 리스크 분석을 제공하는 무료 웹툴. 광고·제휴로 수익화",
        difficulty: "보통",
        estimatedRevenue: "월 30~100만 원 (광고 수익 + 리드 제너레이션)",
      },
    ],
    targetAudience: {
      primarySegment: "환율 변동 리스크를 헷지하고 싶은 투자 경험자",
      demographics: ["30~45세", "자산 5천만~3억 원 보유", "주식 투자 2년 이상"],
      psychographics: [
        "국내 자산만 보유하는 것에 불안감",
        "글로벌 경제 흐름에 관심",
        "안전 자산 선호",
      ],
      painPoints: [
        "적절한 달러 비중을 모르겠다",
        "환전 타이밍 잡기가 어렵다",
        "달러 관련 상품이 너무 다양해 혼란스럽다",
      ],
    },
    updatedAt: "2025-05-25T08:30:00Z",
    viewCount: 9341,
    bookmarkCount: 782,
  },

  // ── 창업/부업 ──────────────────────────────────────────────────────────
  {
    id: "trend-003",
    keyword: "AI 자동화 스마트스토어",
    category: "창업/부업",
    riseRate: 445,
    summary: "AI로 상품 소싱·상세페이지 제작·CS까지 자동화한 1인 스마트스토어 운영 사례 급부상",
    trendContext: {
      headline: "GPT-4o와 자동화 툴로 '혼자서 월 1,000만 원' 스마트스토어 성공 사례가 바이럴되고 있습니다",
      details: [
        "ChatGPT로 상품 상세페이지 초안 작성 → 미리캔버스로 이미지 제작 → 네이버 쇼핑 자동 등록까지 반자동화된 플로우가 확산 중입니다.",
        "알리익스프레스·TEMU 소싱 + AI 번역·수정으로 상품 등록 시간이 기존 대비 80% 단축되고 있습니다.",
        "AI 기반 가격 추적 툴과 재고 관리 자동화 SaaS가 속속 등장하고 있습니다.",
        "인플루언서 협업 없이 SEO 최적화된 AI 작성 글만으로 월 매출 500만 원 돌파 사례가 커뮤니티에 공유됐습니다.",
      ],
      relatedKeywords: ["스마트스토어 자동화", "AI 상세페이지", "드롭쉬핑 AI", "쇼핑몰 GPT"],
      dataSource: "네이버 쇼핑 파트너 데이터, 판다랭크 트렌드 2025",
    },
    monetizationIdeas: [
      {
        type: "앱/웹",
        title: "AI 스마트스토어 상세페이지 생성기",
        description:
          "상품 URL 또는 키워드 입력 시 네이버 SEO 최적화된 상세페이지 HTML·이미지를 자동 생성하는 SaaS",
        difficulty: "보통",
        estimatedRevenue: "월 300~800만 원 (건당 과금 + 월정액)",
      },
      {
        type: "오프라인 창업",
        title: "AI 스마트스토어 컨설팅 서비스",
        description:
          "오프라인 소상공인을 대상으로 AI 자동화 스마트스토어 셋업 대행 및 교육. 1인 컨설팅으로 시작",
        difficulty: "쉬움",
        estimatedRevenue: "월 200~600만 원 (셋업비 + 월 유지관리비)",
      },
      {
        type: "콘텐츠",
        title: "AI 스마트스토어 자동화 VOD 강의",
        description:
          "크몽·클래스101에서 AI 툴 활용 스마트스토어 창업 A-Z 강의. 템플릿·프롬프트 세트 번들 판매",
        difficulty: "쉬움",
        estimatedRevenue: "월 150~400만 원",
      },
    ],
    targetAudience: {
      primarySegment: "부업으로 온라인 쇼핑몰을 시작하고 싶은 직장인",
      demographics: ["22~40세", "직장인/주부", "IT 기기 친숙"],
      psychographics: [
        "시간 대비 높은 수익 원함",
        "실패 리스크를 최소화하고 싶음",
        "자동화에 높은 관심",
      ],
      painPoints: [
        "상세페이지 제작 능력이 없다",
        "어떤 상품을 팔아야 할지 모르겠다",
        "CS 응대 시간이 부담된다",
      ],
    },
    updatedAt: "2025-05-25T10:15:00Z",
    viewCount: 23104,
    bookmarkCount: 3456,
  },
  {
    id: "trend-004",
    keyword: "시니어 디지털 교육 창업",
    category: "창업/부업",
    riseRate: 189,
    summary: "60+세대의 키오스크·스마트폰 교육 수요가 사업화 기회로 주목받고 있음",
    trendContext: {
      headline: "고령화 사회 가속화와 함께 시니어 디지털 리터러시 교육 시장이 빠르게 성장하고 있습니다",
      details: [
        "정부의 '디지털 배움터' 예산이 전년 대비 35% 증가해 민간 강사·기관에 기회가 열렸습니다.",
        "키오스크·모바일 뱅킹·OTT 사용법 수요가 60~75세 인구에서 폭발적으로 늘고 있습니다.",
        "1:1 방문 교습 모델로 시작한 1인 창업자가 월 수익 300만 원 초과 사례가 블로그에 다수 공유됐습니다.",
        "복지관·노인정 출강 형태로 B2B 계약을 체결하면 안정적 수입원 확보가 가능합니다.",
      ],
      relatedKeywords: ["시니어 IT 교육", "키오스크 교육", "디지털 배움터 강사", "노인 스마트폰 강좌"],
      dataSource: "과학기술정보통신부 디지털배움터 통계 2025",
    },
    monetizationIdeas: [
      {
        type: "오프라인 창업",
        title: "시니어 1:1 방문 디지털 교습",
        description:
          "60+세대 가정을 방문해 스마트폰, 키오스크, 모바일 뱅킹 등을 1:1로 가르치는 서비스. 시간당 2~4만 원",
        difficulty: "쉬움",
        estimatedRevenue: "월 150~350만 원 (주 5일, 일 4시간 기준)",
      },
      {
        type: "앱/웹",
        title: "시니어 디지털 교육 매칭 플랫폼",
        description:
          "시니어 학습자와 디지털 교사를 연결하는 플랫폼. 튜터 수수료 모델로 수익화",
        difficulty: "어려움",
        estimatedRevenue: "월 500~2,000만 원 (플랫폼 성숙 후)",
      },
    ],
    targetAudience: {
      primarySegment: "사회에 기여하면서 수익도 원하는 2040 세대",
      demographics: ["25~45세", "교육·IT 경험 보유", "서울/수도권 거주"],
      psychographics: [
        "의미 있는 일을 하고 싶은 성향",
        "안정적 부업 수입 희망",
        "부모님 세대에 공감대 보유",
      ],
      painPoints: [
        "어디서 학생을 구해야 할지 모르겠다",
        "교육 커리큘럼을 어떻게 만들지 모른다",
        "수강료 결정 기준이 없다",
      ],
    },
    updatedAt: "2025-05-25T07:45:00Z",
    viewCount: 7823,
    bookmarkCount: 645,
  },

  // ── 사이드 프로젝트 ────────────────────────────────────────────────────
  {
    id: "trend-005",
    keyword: "Vibe Coding 도구",
    category: "사이드 프로젝트",
    riseRate: 567,
    summary: "자연어로 코드를 생성·수정하는 'Vibe Coding' 방식과 전용 에디터 도구들이 폭발적 관심 획득",
    trendContext: {
      headline: "비개발자도 앱을 만드는 시대 — Cursor, Bolt, v0가 사이드 프로젝트 생태계를 뒤흔들고 있습니다",
      details: [
        "Cursor AI, Bolt.new, GitHub Copilot Workspace 등 Vibe Coding 툴 사용자가 6개월 만에 3배 이상 증가했습니다.",
        "비전공자 창업자들이 Vibe Coding으로 MVP를 2주 만에 출시하는 사례가 Product Hunt에 줄을 잇고 있습니다.",
        "Next.js + Supabase + Vercel 스택이 'Vibe Coding 황금 삼각형'으로 불리며 표준화되고 있습니다.",
        "1인 SaaS의 평균 개발 기간이 3개월 → 2주로 단축되면서 마이크로 SaaS 붐이 재점화됐습니다.",
      ],
      relatedKeywords: ["Cursor AI", "Bolt.new", "v0 by Vercel", "마이크로 SaaS", "노코드 빌더"],
      dataSource: "GitHub Trending, Product Hunt Stats, Stack Overflow Developer Survey 2025",
    },
    monetizationIdeas: [
      {
        type: "앱/웹",
        title: "Vibe Coding 프롬프트 라이브러리",
        description:
          "특정 기능(인증, 결제, 대시보드 등)을 바로 구현하는 검증된 프롬프트 템플릿 마켓플레이스",
        difficulty: "쉬움",
        estimatedRevenue: "월 100~400만 원 (개별 판매 + 구독)",
      },
      {
        type: "콘텐츠",
        title: "Vibe Coding으로 SaaS 만들기 유튜브",
        description:
          "실시간으로 SaaS 제품을 Vibe Coding으로 만드는 과정을 영상화. 빌드 인 퍼블릭 전략으로 팬덤 형성",
        difficulty: "쉬움",
        estimatedRevenue: "월 50~500만 원 (광고 + 스폰서십 + 강의 연계)",
      },
      {
        type: "앱/웹",
        title: "Vibe Coding 코드 퀄리티 리뷰봇",
        description:
          "AI가 생성한 코드의 보안 취약점, 성능 이슈, 베스트 프랙티스 위반을 자동으로 검토해주는 CI 도구",
        difficulty: "어려움",
        estimatedRevenue: "월 200~1,000만 원 (팀 플랜 구독)",
      },
    ],
    targetAudience: {
      primarySegment: "빠르게 아이디어를 제품화하고 싶은 개발자·기획자",
      demographics: ["22~35세", "개발자/디자이너/기획자", "사이드 프로젝트 경험 1회 이상"],
      psychographics: [
        "빠른 실행 선호",
        "완벽주의보다 출시 우선",
        "새로운 기술 얼리어답터",
      ],
      painPoints: [
        "아이디어는 있는데 개발 속도가 느리다",
        "AI가 생성한 코드를 믿을 수 있는지 모르겠다",
        "어떤 툴 조합이 최선인지 모르겠다",
      ],
    },
    updatedAt: "2025-05-25T11:00:00Z",
    viewCount: 31245,
    bookmarkCount: 5820,
  },
  {
    id: "trend-006",
    keyword: "로컬 LLM 개인 서버",
    category: "사이드 프로젝트",
    riseRate: 298,
    summary: "Llama 3, Mistral 등 오픈소스 LLM을 집 서버나 로컬 PC에서 돌리는 프로젝트가 급증",
    trendContext: {
      headline: "개인정보 보호와 비용 절감을 위해 '나만의 로컬 AI 서버' 구축 열풍이 불고 있습니다",
      details: [
        "Meta의 Llama 3.1 70B 모델이 RTX 4090 한 장으로 실행 가능해지면서 홈 서버 구축 관심이 급증했습니다.",
        "Ollama, LM Studio 등 로컬 LLM 실행 도구의 GitHub 스타가 6개월 만에 각각 5배 이상 증가했습니다.",
        "기업 데이터를 외부 API에 보내지 않아도 되는 로컬 RAG 시스템 구축이 스타트업·중소기업에서 주목받고 있습니다.",
        "중고 서버 구매 + 로컬 LLM 설치로 월 AI API 비용 200만 원을 0원으로 줄인 사례가 공유됐습니다.",
      ],
      relatedKeywords: ["Ollama", "Llama 3", "로컬 RAG", "홈 서버 AI", "LM Studio"],
      dataSource: "GitHub Trending, Hugging Face Downloads, Reddit r/LocalLLaMA 2025",
    },
    monetizationIdeas: [
      {
        type: "콘텐츠",
        title: "로컬 LLM 셋업 가이드 블로그/유튜브",
        description:
          "하드웨어 선택부터 Ollama 설치, 파인튜닝까지 다루는 기술 블로그. SEO + 유튜브 광고로 수익화",
        difficulty: "쉬움",
        estimatedRevenue: "월 50~200만 원 (광고 + 제휴 링크)",
      },
      {
        type: "앱/웹",
        title: "기업용 로컬 LLM 구축 대행 서비스",
        description:
          "보안이 중요한 중소기업에 로컬 LLM 인프라를 셋업해주는 B2B 컨설팅·구축 서비스",
        difficulty: "어려움",
        estimatedRevenue: "건당 500~2,000만 원 + 월 유지관리비",
      },
      {
        type: "앱/웹",
        title: "로컬 LLM 성능 벤치마크 비교 사이트",
        description:
          "다양한 오픈소스 LLM 모델의 속도·품질·메모리 사용량을 표준화된 방식으로 비교하는 커뮤니티 사이트",
        difficulty: "보통",
        estimatedRevenue: "월 30~150만 원 (광고 + 후원)",
      },
    ],
    targetAudience: {
      primarySegment: "AI를 직접 제어하고 싶은 개발자·테크 애호가",
      demographics: ["25~40세", "개발자/엔지니어", "하드웨어 DIY 경험"],
      psychographics: [
        "데이터 프라이버시 중시",
        "DIY·자작 문화 선호",
        "비용 최적화에 관심",
      ],
      painPoints: [
        "클라우드 AI API 비용이 너무 비싸다",
        "민감한 데이터를 외부에 보내기 꺼림칙하다",
        "어떤 GPU/CPU가 필요한지 모르겠다",
      ],
    },
    updatedAt: "2025-05-25T09:45:00Z",
    viewCount: 18562,
    bookmarkCount: 2341,
  },
  {
    id: "trend-007",
    keyword: "1인 SaaS 마이크로 구독",
    category: "사이드 프로젝트",
    riseRate: 201,
    summary: "월 5달러 이하 초소액 구독 모델로 특정 니치를 공략하는 1인 SaaS 성공 공식이 확산",
    trendContext: {
      headline: "Indie Hacker 커뮤니티를 중심으로 '작지만 수익성 높은' 마이크로 SaaS 열풍이 다시 불고 있습니다",
      details: [
        "MRR(월 반복 수익) $500 이하지만 운영 비용이 $10 미만인 마이크로 SaaS가 Indie Hackers에서 주목받고 있습니다.",
        "Stripe + Supabase + Vercel 조합으로 창업 비용이 사실상 $0에 수렴하면서 진입 장벽이 사라졌습니다.",
        "아주 좁은 문제(특정 슬랙 봇, 특정 CSV 변환기 등)를 해결하는 제품이 마케팅 없이도 SEO로 꾸준히 성장하고 있습니다.",
        "Product Hunt의 '오늘의 제품' 상위권 절반 이상이 1인 개발 SaaS로 채워지고 있습니다.",
      ],
      relatedKeywords: ["Indie Hacker", "마이크로 SaaS", "MRR", "Stripe 구독", "1인 창업"],
      dataSource: "Indie Hackers Monthly Report, Product Hunt Analytics 2025",
    },
    monetizationIdeas: [
      {
        type: "앱/웹",
        title: "니치 자동화 SaaS 런치패드",
        description:
          "특정 반복 작업(영수증 OCR, 메일 자동 분류, 회의록 요약 등) 하나만 해결하는 초집중 SaaS 개발 후 Product Hunt 런칭",
        difficulty: "보통",
        estimatedRevenue: "월 50~500만 원 (니치에 따라 상이)",
      },
      {
        type: "커뮤니티",
        title: "국내 마이크로 SaaS 빌더 커뮤니티",
        description:
          "국내 1인 SaaS 창업자들이 MRR, 고객 확보 전략, 기술 스택을 공유하는 유료 슬랙/디스코드 커뮤니티",
        difficulty: "쉬움",
        estimatedRevenue: "월 50~200만 원 (회원비 + 스폰서십)",
      },
    ],
    targetAudience: {
      primarySegment: "개발 실력을 수입으로 연결하고 싶은 개발자",
      demographics: ["24~38세", "프론트/백엔드 개발자", "사이드 프로젝트 1~2회 경험"],
      psychographics: [
        "독립·자유 추구",
        "빠른 피드백 루프 선호",
        "완벽보다 출시 중시",
      ],
      painPoints: [
        "무엇을 만들어야 할지 아이디어가 없다",
        "마케팅을 전혀 모른다",
        "고객 한 명을 만나는 것 자체가 두렵다",
      ],
    },
    updatedAt: "2025-05-25T08:00:00Z",
    viewCount: 12087,
    bookmarkCount: 1890,
  },
];

export function getTrendsByCategory(category: Category): TrendInsight[] {
  return mockTrends.filter((t) => t.category === category);
}

export function getTrendById(id: string): TrendInsight | undefined {
  return mockTrends.find((t) => t.id === id);
}

export const CATEGORIES: Category[] = ["재테크", "창업/부업", "사이드 프로젝트"];
