# Notion 견적서 웹 뷰어

노션으로 관리하는 견적서를 클라이언트가 전문적인 웹 페이지에서 확인하고 PDF로 다운로드할 수 있게 하는 서비스입니다.

---

## 프로젝트 개요

**목적**: 노션 견적서 데이터를 기반으로 클라이언트에게 공유 가능한 전문적인 견적서 웹 페이지 제공

**범위**: MVP — 견적서 조회, 웹 열람, PDF 다운로드, 관리자 대시보드

**사용자**:
- 관리자(발행자): 대시보드에서 견적서 목록 확인 및 공유 링크 생성
- 클라이언트(수신자): 공유 링크를 통해 견적서 열람 및 PDF 다운로드

---

## 주요 페이지

1. `/dashboard?token={ADMIN_TOKEN}` - 관리자 대시보드 (견적서 목록 조회, 공유 링크 생성)
2. `/quotes/[id]` - 견적서 열람 페이지 (공개, 인증 불필요, PDF 다운로드 포함)

---

## 핵심 기능

- **F001**: 노션 견적서 동기화 (Notion 공식 API SDK)
- **F002**: 견적서 목록 조회 (관리자 대시보드)
- **F003**: 견적서 웹 열람 (클라이언트 공개 페이지)
- **F004**: 공유 링크 생성 및 클립보드 복사
- **F005**: PDF 다운로드 (@react-pdf/renderer)
- **F010**: 대시보드 접근 제어 (URL 토큰 검증)

---

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| 프레임워크 | Next.js 16.1.6 (App Router) + React 19 + TypeScript 5 |
| 스타일링 | Tailwind CSS v4 + shadcn/ui (new-york 스타일) |
| Notion 연동 | @notionhq/client |
| PDF 생성 | @react-pdf/renderer |
| 유틸리티 | lucide-react, Radix UI |
| 배포 | Vercel |

---

## 시작하기

### 요구사항

- Node.js 18.17 이상
- Notion Integration 설정 완료
- npm

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd <project-directory>

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 값 입력

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 `/dashboard`로 자동 이동합니다.

> 대시보드 접근 시 `?token=your-admin-token` 쿼리 파라미터가 필요합니다.
> 예: `http://localhost:3000/dashboard?token=your-secret-token`

### 환경변수 설정

`.env.local` 파일에 다음 값을 입력합니다:

```env
ADMIN_TOKEN=your-secret-admin-token

NOTION_API_KEY=secret_xxxxxxxxxxxx
NOTION_ESTIMATES_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ITEMS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

ISSUER_COMPANY_NAME=회사명
ISSUER_REPRESENTATIVE=대표자명
ISSUER_BUSINESS_NUMBER=000-00-00000
ISSUER_ADDRESS=서울시 강남구 테헤란로 123
ISSUER_CONTACT=02-0000-0000
```

### Notion 설정

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 Integration 생성
2. 견적서 데이터베이스와 견적 항목 데이터베이스에 Integration 연결
3. 각 데이터베이스 ID를 환경변수에 입력

---

## 프로젝트 구조

```
.
├── app/
│   ├── dashboard/page.tsx              # 관리자 대시보드 (토큰 보호)
│   ├── quotes/[id]/page.tsx            # 견적서 열람 페이지 (공개)
│   ├── layout.tsx                      # 루트 레이아웃
│   └── page.tsx                        # / → /dashboard 리다이렉트
│
├── components/
│   ├── layout/                         # Layer 1: AppShell, Header, ContentArea, PageHeader
│   ├── ui/                             # Layer 2: shadcn/ui 원자 컴포넌트
│   └── composite/                      # Layer 3: MetricCard, EmptyState, LoadingOverlay
│
├── hooks/
│   ├── useTheme.ts                     # 다크/라이트 테마 상태
│   └── useMediaQuery.ts                # 반응형 브레이크포인트 감지
│
├── lib/
│   ├── types.ts                        # 공통 타입 (Quote, QuoteItem, IssuerInfo 등)
│   ├── constants.ts                    # 상태 레이블, API 경로 상수
│   └── utils.ts                        # cn() 등 유틸리티
│
├── middleware.ts                        # /dashboard 경로 토큰 검증
├── .env.example                        # 환경변수 템플릿
└── docs/
    └── PRD.md                          # 상세 요구사항 문서
```

---

## 개발 상태

| 항목 | 상태 |
|------|------|
| 기본 프로젝트 구조 설정 | 완료 |
| 환경변수 템플릿 | 완료 |
| 미들웨어 (대시보드 접근 제어) | 완료 |
| 타입 및 상수 정의 | 완료 |
| F001: Notion API 연동 | 개발 예정 |
| F002: 견적서 목록 조회 | 개발 예정 |
| F003: 견적서 웹 열람 | 개발 예정 |
| F004: 공유 링크 생성 | 개발 예정 |
| F005: PDF 다운로드 | 개발 예정 |

---

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./CLAUDE.md) - 개발 지침 및 아키텍처

---

## 라이선스

MIT
