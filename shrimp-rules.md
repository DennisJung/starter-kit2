# Development Guidelines

## 프로젝트 개요

- **서비스**: Notion 견적서 웹 뷰어 — 노션 DB 견적서를 웹에서 열람하고 PDF 다운로드
- **사용자**: 관리자(프리랜서/소규모 사업자), 열람자(클라이언트)
- **기술 스택**: Next.js 16 (App Router), React 19, TypeScript 5, TailwindCSS v4, shadcn/ui (new-york), @notionhq/client, @react-pdf/renderer
- **패키지 관리자**: npm (yarn, pnpm, bun 사용 금지)
- **참조 문서**: `docs/PRD.md` (요구사항), `docs/ROADMAP.md` (개발 로드맵), `CLAUDE.md` (프로젝트 설정)

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
app/                        # Next.js App Router 페이지
  layout.tsx                # 루트 레이아웃 (Geist 폰트, TooltipProvider)
  page.tsx                  # / → /dashboard 리다이렉트
  globals.css               # TailwindCSS v4 글로벌 스타일
  dashboard/page.tsx        # 관리자 대시보드 (토큰 보호)
  quotes/[id]/page.tsx      # 견적서 열람 (공개)
  api/quotes/               # API 라우트 (미구현)
components/
  layout/                   # Layer 1: 레이아웃 (AppShell, Header, ContentArea, PageHeader)
  ui/                       # Layer 2: shadcn/ui 원자 컴포넌트 (수동 수정 금지)
  composite/                # Layer 3: 조합 컴포넌트 (MetricCard, EmptyState, LoadingOverlay)
  features/                 # Layer 4: 도메인 컴포넌트 (미구현, quote/ 하위에 생성)
lib/
  types.ts                  # 도메인 타입 정의
  constants.ts              # 상수 (상태 레이블, API 경로, 페이지네이션)
  utils.ts                  # cn() 유틸리티
  formatters.ts             # 포맷팅 유틸리티 (미구현)
  notion.ts                 # Notion API 클라이언트 (미구현)
  notion-mapper.ts          # Notion 응답 → 도메인 타입 변환 (미구현)
hooks/                      # 커스텀 훅
middleware.ts               # /dashboard 경로 토큰 검증
docs/                       # PRD, ROADMAP 문서
```

### 5계층 컴포넌트 규칙

| 계층 | 경로 | 역할 | 의존 가능 대상 |
|------|------|------|---------------|
| Layer 1 | `components/layout/` | 페이지 레이아웃 셸 | Layer 2 |
| Layer 2 | `components/ui/` | shadcn/ui 원자 컴포넌트 | 없음 (독립) |
| Layer 3 | `components/composite/` | UI 조합 컴포넌트 | Layer 1, 2 |
| Layer 4 | `components/features/` | 도메인별 기능 컴포넌트 | Layer 1, 2, 3 |
| Layer 5 | `app/*/page.tsx` | Next.js 페이지 | Layer 1, 2, 3, 4 |

- **상위 계층은 하위 계층에만 의존** — Layer 4는 Layer 1~3만 import 가능
- **역방향 의존 금지** — Layer 2가 Layer 3을 import하면 안 됨
- Feature 컴포넌트는 `components/features/quote/` 하위에 생성

---

## 코드 규칙

### 포맷팅

- 들여쓰기: **스페이스 2칸** (탭 금지)
- 세미콜론: **사용하지 않음**
- 따옴표: **작은따옴표(`'`)** 사용 (JSX 속성 포함)
- 주석: **한국어**로 작성

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase.tsx | `QuoteListTable.tsx` |
| 유틸리티/훅 파일 | camelCase.ts | `formatters.ts`, `useQuotes.ts` |
| 컴포넌트 함수 | PascalCase | `export function QuoteListTable()` |
| 일반 함수/변수 | camelCase | `formatCurrency()`, `totalAmount` |
| 상수 | UPPER_SNAKE_CASE | `PAGE_SIZE`, `API_ROUTES` |
| 타입/인터페이스 | PascalCase | `QuoteItem`, `IssuerInfo` |
| CSS 클래스 | TailwindCSS 유틸리티 | `className="flex items-center gap-2"` |

### 임포트 순서

1. React/Next.js 내장 모듈
2. 외부 라이브러리 (`lucide-react`, `@notionhq/client` 등)
3. `@/components/ui/*` (shadcn/ui)
4. `@/components/layout/*`, `@/components/composite/*`, `@/components/features/*`
5. `@/lib/*`, `@/hooks/*`

- 경로 별칭 `@/*` 사용 필수 — 상대 경로(`../`) 사용 금지 (같은 디렉토리 내 `./` 제외)

---

## 컴포넌트 구현 규칙

### 새 컴포넌트 생성 시

- 해당 계층 디렉토리에 생성 (Feature 컴포넌트 → `components/features/quote/`)
- `interface {ComponentName}Props` 정의 후 export
- `cn()` 유틸리티로 className 조합 (`import { cn } from '@/lib/utils'`)
- 기본적으로 Server Component로 작성, 클라이언트 상호작용 필요 시에만 `'use client'` 추가

### shadcn/ui 사용 규칙

- **`components/ui/` 파일 직접 수정 금지** — shadcn CLI로 관리
- 새 UI 컴포넌트 필요 시: `npx shadcn@latest add {component-name}`
- 설치된 컴포넌트: button, card, badge, separator, skeleton, tooltip, sheet, scroll-area, select, input, label, popover, calendar, table, tabs, dialog
- shadcn/ui 설정: `components.json` (style: new-york, baseColor: neutral, cssVariables: true)
- 아이콘: `lucide-react` 사용

### 기존 Composite 컴포넌트 활용

| 컴포넌트 | 용도 | 위치 |
|----------|------|------|
| `MetricCard` | 통계 카드 (값, 트렌드) | `components/composite/MetricCard.tsx` |
| `EmptyState` | 빈 상태 표시 (아이콘, 제목, 설명) | `components/composite/EmptyState.tsx` |
| `LoadingOverlay` | 목록 스켈레톤 로딩 | `components/composite/LoadingOverlay.tsx` |
| `AppShell` | 헤더 + 메인 레이아웃 | `components/layout/AppShell.tsx` |
| `ContentArea` | 컨테이너 (max-w-7xl, p-6) | `components/layout/ContentArea.tsx` |
| `PageHeader` | 페이지 제목 + 설명 + 액션 슬롯 | `components/layout/PageHeader.tsx` |

---

## 라우트 및 API 규칙

### 페이지 라우트

| 경로 | 용도 | 접근 제어 | 레이아웃 |
|------|------|----------|---------|
| `/` | `/dashboard`로 리다이렉트 | 없음 | 없음 |
| `/dashboard` | 관리자 대시보드 | `middleware.ts`에서 `?token=` 검증 | AppShell |
| `/quotes/[id]` | 견적서 열람 | 공개 | 자체 레이아웃 (AppShell 미사용) |

### API 라우트 (구현 예정)

- `app/api/quotes/route.ts` — GET: 견적서 목록 조회
- `app/api/quotes/[id]/route.ts` — GET: 견적서 상세 조회 (항목 포함)
- 응답 형식: `{ data: T }` 또는 `{ error: string }`
- 에러 시 적절한 HTTP 상태 코드 반환 (400, 404, 500)
- Notion API 호출은 `lib/notion.ts`에 캡슐화

### 미들웨어 규칙

- `middleware.ts`는 `/dashboard/:path*` 경로만 처리
- 토큰 검증 로직 변경 시 `middleware.ts`만 수정
- 새 보호 경로 추가 시 `config.matcher` 배열에 추가

---

## 타입 시스템 규칙

### 도메인 타입 위치

- 모든 도메인 타입은 `lib/types.ts`에 정의
- Notion API 관련 타입은 `@notionhq/client`에서 import

### 핵심 타입 참조

| 타입 | 용도 |
|------|------|
| `Quote` | 견적서 전체 데이터 (항목 포함) |
| `QuoteItem` | 견적 항목 (항목명, 수량, 단가) |
| `QuoteSummary` | 목록용 요약 (totalAmount 포함) |
| `QuoteStatus` | `'draft' \| 'sent' \| 'accepted' \| 'rejected' \| 'expired'` |
| `IssuerInfo` | 발행자 회사 정보 (환경변수에서 로드) |
| `ShareLink` | 공유 링크 (quoteId, url) |
| `NavItem` | 네비게이션 메뉴 항목 |

### 새 타입 추가 시

- 도메인 관련 → `lib/types.ts`에 추가
- 컴포넌트 Props → 해당 컴포넌트 파일 내에 `interface`로 정의
- API 응답 → `lib/types.ts`에 추가
- Notion 매퍼 관련 → `lib/notion-mapper.ts`에 정의 (필요 시)

---

## 환경변수 규칙

### 현재 환경변수 목록

| 변수 | 용도 | 접근 위치 |
|------|------|----------|
| `ADMIN_TOKEN` | 대시보드 접근 토큰 | `middleware.ts` (서버) |
| `NOTION_API_KEY` | Notion API 시크릿 | `lib/notion.ts` (서버) |
| `NOTION_ESTIMATES_DB_ID` | 견적서 DB ID | `lib/notion.ts` (서버) |
| `NOTION_ITEMS_DB_ID` | 견적 항목 DB ID | `lib/notion.ts` (서버) |
| `ISSUER_COMPANY_NAME` | 발행자 회사명 | 서버 컴포넌트/API |
| `ISSUER_REPRESENTATIVE` | 대표자명 | 서버 컴포넌트/API |
| `ISSUER_BUSINESS_NUMBER` | 사업자등록번호 | 서버 컴포넌트/API |
| `ISSUER_ADDRESS` | 주소 | 서버 컴포넌트/API |
| `ISSUER_CONTACT` | 연락처 | 서버 컴포넌트/API |

### 환경변수 추가 시

1. `.env.example`에 템플릿 값 추가
2. `.env.local`에 실제 값 추가
3. `CLAUDE.md`의 환경변수 섹션 업데이트
4. **`NEXT_PUBLIC_` 접두사 사용 금지** — 모든 환경변수는 서버 전용

---

## 상수 관리 규칙

### 상수 위치

- 모든 상수는 `lib/constants.ts`에 정의
- 상태 레이블: `QUOTE_STATUS_LABELS` (한국어 매핑)
- 상태 배지: `QUOTE_STATUS_VARIANTS` (shadcn Badge variant 매핑)
- API 경로: `API_ROUTES` (엔드포인트 문자열 중앙 관리)
- 페이지네이션: `PAGE_SIZE`

### 새 상수 추가 시

- 도메인 상수 → `lib/constants.ts`에 추가
- 컴포넌트 전용 상수 → 해당 컴포넌트 파일 내 정의
- 매직 넘버/문자열 금지 — 반드시 상수로 추출

---

## 핵심 파일 연동 규칙

### 동시 수정이 필요한 파일 그룹

| 변경 사항 | 반드시 함께 수정할 파일 |
|----------|----------------------|
| 도메인 타입 변경 | `lib/types.ts` + `lib/constants.ts` + 해당 타입 사용 컴포넌트 |
| 새 QuoteStatus 추가 | `lib/types.ts` (타입) + `lib/constants.ts` (LABELS, VARIANTS) |
| API 라우트 추가 | `app/api/` 라우트 파일 + `lib/constants.ts` (API_ROUTES) |
| 환경변수 추가 | `.env.example` + `.env.local` + `CLAUDE.md` |
| shadcn/ui 컴포넌트 추가 | `npx shadcn@latest add` 실행 (수동 생성 금지) |
| 새 Feature 컴포넌트 | `components/features/quote/` 하위 + 사용하는 페이지 |
| ROADMAP 진행 상황 | `docs/ROADMAP.md` 진행률 테이블 + 해당 Task 체크박스 |

### 데이터 흐름 의존성

```
Notion DB → lib/notion.ts (API 호출) → lib/notion-mapper.ts (타입 변환)
  → app/api/quotes/ (API 라우트) → 페이지/컴포넌트 (렌더링)
```

- Notion 프로퍼티 이름 변경 시 → `lib/notion-mapper.ts`만 수정 (다른 파일 영향 없게 격리)
- 도메인 타입 변경 시 → 매퍼 함수와 컴포넌트 모두 확인

---

## AI 의사결정 규칙

### 구현 우선순위 판단

1. `docs/ROADMAP.md`의 "우선순위" 표시 Task를 먼저 구현
2. 기술 의존성 그래프 순서를 따름 (Task 002 → 003 → 004 ...)
3. 기존 TODO 주석 해결보다 ROADMAP Task 우선

### 모호한 요청 처리

| 상황 | 결정 |
|------|------|
| Server vs Client Component | 기본 Server Component, 이벤트 핸들러/useState 필요 시만 Client |
| 새 파일 vs 기존 파일 수정 | 기존 파일 수정 우선, 300줄 초과 시 분리 고려 |
| 직접 Notion 호출 vs API 라우트 | Server Component에서는 직접 호출 가능, Client에서는 API 라우트 사용 |
| 에러 처리 수준 | API 경계에서만 try-catch, 내부 함수는 에러 전파 |
| 스타일링 방식 | TailwindCSS 유틸리티 클래스만 사용, CSS 파일 추가 금지 |
| 상태 관리 | React 내장 (useState, useReducer) 우선, 전역 상태 라이브러리 추가 금지 |

### 작업 완료 기준

- 코드가 `npm run build` 에러 없이 빌드됨
- `npm run lint` 경고/에러 없음
- ROADMAP.md 해당 Task 체크박스 업데이트
- 변경 사항을 한글로 간단히 설명

---

## 금지 사항

- **`components/ui/` 파일 직접 수정 금지** — shadcn CLI로만 관리
- **`NEXT_PUBLIC_` 환경변수 사용 금지** — 모든 시크릿은 서버 전용
- **상대 경로 import 금지** — `@/*` 경로 별칭만 사용 (같은 디렉토리 `./` 제외)
- **CSS 모듈/Styled Components 금지** — TailwindCSS만 사용
- **`any` 타입 사용 금지** — 타입을 명시하거나 `unknown` 사용
- **`console.log` 프로덕션 코드에 남기기 금지** — 디버깅 후 반드시 제거
- **`.env.local` 파일을 git에 커밋 금지**
- **역방향 컴포넌트 의존 금지** — Layer 2가 Layer 3+ import 불가
- **패키지 관리자 변경 금지** — npm만 사용 (yarn, pnpm, bun 금지)
- **영어 주석/커밋 메시지 금지** — 모든 주석과 커밋은 한국어
- **세미콜론 사용 금지** — 코드 전체에서 세미콜론 미사용
- **큰따옴표(`"`) 사용 금지** — 작은따옴표(`'`) 사용 (JSX 속성 포함)
- **매직 넘버/문자열 금지** — 반드시 상수로 추출
- **새 전역 상태 라이브러리 설치 금지** — React 내장 상태 관리만 사용
