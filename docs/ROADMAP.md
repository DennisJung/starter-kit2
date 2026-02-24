# Notion 견적서 웹 뷰어 개발 로드맵

노션으로 관리하는 견적서를 전문적인 웹 페이지에서 열람하고 PDF로 다운로드할 수 있는 서비스

## 개요

**Notion 견적서 웹 뷰어**는 프리랜서/소규모 사업자(관리자)와 견적서 수신 클라이언트(열람자)를 위한 서비스로 다음 기능을 제공합니다:

- **노션 견적서 동기화 (F001)**: Notion 데이터베이스에서 견적서 데이터를 실시간 조회
- **견적서 목록 관리 (F002, F004)**: 관리자 대시보드에서 목록 확인 및 공유 링크 생성
- **견적서 웹 열람 (F003)**: 클라이언트가 공유 링크로 견적서를 전문적인 웹 페이지에서 확인
- **PDF 다운로드 (F005)**: 견적서를 PDF 파일로 변환하여 다운로드
- **대시보드 접근 제어 (F010)**: URL 토큰 기반 관리자 인증

## 진행률

| Phase | 상태 | 진행률 |
|-------|------|--------|
| Phase 1: 애플리케이션 골격 구축 | 진행 중 | 1/3 |
| Phase 2: UI/UX 완성 (더미 데이터) | 대기 | 0/3 |
| Phase 3: 핵심 기능 구현 | 대기 | 0/4 |
| Phase 4: 완성 및 배포 | 대기 | 0/2 |
| **전체** | | **1/12** |

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-project-skeleton.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료로 표시

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

> 전체 라우트 구조, 타입 정의, 접근 제어 등 애플리케이션의 뼈대를 완성합니다.

- **Task 001: 프로젝트 구조 및 라우팅 설정** - 완료
  - See: 현재 코드베이스에 반영됨
  - 완료: Next.js App Router 기반 라우트 구조 생성 (`/`, `/dashboard`, `/quotes/[id]`)
  - 완료: 공통 레이아웃 컴포넌트 구현 (AppShell, Header, ContentArea, PageHeader)
  - 완료: middleware.ts 기반 대시보드 접근 제어 (F010)
  - 완료: 환경변수 설정 (.env.example, .env.local)

- **Task 002: 타입 정의 및 유틸리티 설계** - 우선순위
  - 관련 파일: `lib/types.ts`, `lib/constants.ts`, `lib/formatters.ts`
  - Notion API 응답을 도메인 타입으로 변환하는 매퍼 함수 타입 정의
  - 통화 포맷팅, 날짜 포맷팅 등 표시 유틸리티 함수 구현
  - Notion 데이터베이스 프로퍼티 이름 상수 정의
  - 환경변수 기반 IssuerInfo 로딩 유틸리티 구현

- **Task 003: Notion API 클라이언트 설정**
  - 관련 파일: `lib/notion.ts`, `lib/notion-mapper.ts`
  - @notionhq/client SDK 초기화 및 설정
  - Notion 데이터베이스 쿼리 함수 작성 (견적서 목록, 견적서 상세, 견적 항목)
  - Notion API 응답을 Quote/QuoteItem 타입으로 변환하는 매퍼 구현
  - 에러 핸들링 및 타입 가드 함수 작성

### Phase 2: UI/UX 완성 (더미 데이터 활용)

> 모든 페이지의 UI를 더미 데이터로 완성하여 전체 사용자 플로우를 검증합니다.

- **Task 004: 더미 데이터 및 Feature 컴포넌트 구현**
  - 관련 파일: `lib/dummy-data.ts`, `components/features/quote/QuoteListTable.tsx`, `components/features/quote/QuoteStatusBadge.tsx`, `components/features/quote/ShareLinkButton.tsx`
  - 견적서 목록/상세 더미 데이터 생성 유틸리티 작성
  - QuoteListTable: 견적서 목록 테이블 컴포넌트 (shadcn/ui Table 기반)
  - QuoteStatusBadge: 상태별 배지 컴포넌트 (Badge + 상수 매핑)
  - ShareLinkButton: 공유 링크 복사 버튼 컴포넌트 (클립보드 API)

- **Task 005: 대시보드 페이지 UI 완성**
  - 관련 파일: `app/dashboard/page.tsx`, `components/features/dashboard/DashboardStats.tsx`
  - 대시보드 상단 통계 카드 (전체/상태별 견적서 수, 총 금액)
  - 견적서 목록 테이블 렌더링 (더미 데이터 사용)
  - 공유 링크 복사 기능 (클립보드 + 토스트 알림)
  - 빈 상태(EmptyState) 및 로딩 상태(Skeleton) 처리

- **Task 006: 견적서 열람 페이지 UI 완성**
  - 관련 파일: `app/quotes/[id]/page.tsx`, `components/features/quote/QuoteDetail.tsx`, `components/features/quote/QuoteHeader.tsx`, `components/features/quote/QuoteItemsTable.tsx`
  - QuoteHeader: 발행자/수신자 정보, 견적서 메타데이터 표시
  - QuoteItemsTable: 견적 항목 테이블 (항목명, 수량, 단가, 소계)
  - 합계 금액 섹션 (소계, 부가세, 총합계)
  - 비고(note) 영역 및 유효기한 표시
  - 반응형 디자인 적용 (모바일/태블릿/데스크탑)

### Phase 3: 핵심 기능 구현

> 더미 데이터를 실제 Notion API로 교체하고 PDF 다운로드 기능을 구현합니다.

- **Task 007: API 라우트 개발** - 우선순위
  - 관련 파일: `app/api/quotes/route.ts`, `app/api/quotes/[id]/route.ts`
  - GET /api/quotes: 견적서 목록 조회 (Notion DB 쿼리 + 매퍼)
  - GET /api/quotes/[id]: 견적서 상세 조회 (견적서 + 항목 관계 조회)
  - 에러 응답 처리 (404, 500 등)
  - 응답 캐싱 전략 적용 (revalidate)
  - **Playwright MCP를 활용한 API 엔드포인트 통합 테스트**

- **Task 008: 대시보드 Notion API 연동**
  - 관련 파일: `app/dashboard/page.tsx`, `hooks/useQuotes.ts` (필요 시)
  - 대시보드 페이지에서 GET /api/quotes 호출로 더미 데이터 교체
  - Server Component에서 직접 Notion 클라이언트 호출 또는 API 라우트 사용
  - 로딩/에러 상태 처리
  - **Playwright MCP로 대시보드 목록 로딩 및 공유 링크 복사 E2E 테스트**

- **Task 009: 견적서 열람 페이지 Notion API 연동**
  - 관련 파일: `app/quotes/[id]/page.tsx`
  - 견적서 열람 페이지에서 GET /api/quotes/[id] 호출로 더미 데이터 교체
  - 존재하지 않는 견적서 ID 접근 시 404 페이지 처리
  - 로딩/에러 상태 처리
  - **Playwright MCP로 견적서 열람 플로우 E2E 테스트**

- **Task 010: PDF 다운로드 기능 구현**
  - 관련 파일: `components/features/quote/PDFDocument.tsx`, `components/features/quote/PDFDownloadButton.tsx`
  - @react-pdf/renderer 기반 PDF 문서 컴포넌트 작성
  - 견적서 레이아웃 (발행자 정보, 수신자 정보, 항목 테이블, 합계, 비고)
  - 한글 폰트 설정 (Noto Sans KR 등)
  - PDFDownloadButton: 클라이언트 컴포넌트로 다운로드 트리거
  - **Playwright MCP로 PDF 다운로드 버튼 클릭 및 파일 생성 테스트**

### Phase 4: 완성 및 배포

> 전체 통합 테스트, 성능 최적화, 배포 준비를 완료합니다.

- **Task 011: 통합 테스트 및 품질 보증**
  - Playwright MCP를 사용한 전체 사용자 플로우 E2E 테스트
    - 관리자 대시보드 접근 (토큰 유효/무효)
    - 견적서 목록 조회 및 공유 링크 복사
    - 견적서 열람 페이지 렌더링 검증
    - PDF 다운로드 기능 검증
    - 존재하지 않는 견적서 접근 시 에러 처리
  - 반응형 디자인 검증 (모바일, 태블릿, 데스크탑)
  - 접근성 기본 검증 (시맨틱 HTML, 키보드 네비게이션)

- **Task 012: 성능 최적화 및 Vercel 배포**
  - 관련 파일: `next.config.ts`, `vercel.json` (필요 시)
  - Next.js 빌드 최적화 (이미지, 폰트, 번들 사이즈)
  - Notion API 응답 캐싱 전략 최종 조정
  - Vercel 환경변수 설정 및 배포
  - 프로덕션 환경 동작 검증

---

## 기술 의존성 관계

```
Task 001 (라우팅/레이아웃) ── 완료
    |
Task 002 (타입/유틸리티) ──> Task 003 (Notion 클라이언트)
    |                            |
Task 004 (더미 데이터/컴포넌트)  |
    |                            |
    +---> Task 005 (대시보드 UI) |
    |                            |
    +---> Task 006 (열람 UI)     |
              |                  |
              +---> Task 007 (API 라우트) <--- Task 003
              |         |
              |    Task 008 (대시보드 API 연동)
              |    Task 009 (열람 API 연동)
              |
              +---> Task 010 (PDF 다운로드)
                        |
                   Task 011 (통합 테스트)
                        |
                   Task 012 (배포)
```

## 현재 코드베이스 상태

### 이미 구현된 항목

| 항목 | 파일 | 상태 |
|------|------|------|
| 라우트 구조 | `app/page.tsx`, `app/dashboard/page.tsx`, `app/quotes/[id]/page.tsx` | 빈 껍데기 완성 |
| 미들웨어 | `middleware.ts` | ADMIN_TOKEN 기반 접근 제어 구현 |
| 레이아웃 컴포넌트 | `components/layout/*` | AppShell, Header, ContentArea, PageHeader |
| 공통 컴포넌트 | `components/composite/*` | MetricCard, EmptyState, LoadingOverlay |
| shadcn/ui | `components/ui/*` | button, card, badge, table, dialog 등 16개 설치 |
| 타입 정의 | `lib/types.ts` | Quote, QuoteItem, QuoteSummary, IssuerInfo 정의 |
| 상수 | `lib/constants.ts` | 상태 레이블, API 경로, 페이지네이션 |
| 환경변수 | `.env.example` | ADMIN_TOKEN, Notion API, 발행자 정보 템플릿 |
| 패키지 | `package.json` | @notionhq/client, @react-pdf/renderer 설치 완료 |

### 미구현 항목

| 항목 | 상태 |
|------|------|
| 포맷팅 유틸리티 (`lib/formatters.ts`) | 미구현 |
| Notion API 클라이언트 (`lib/notion.ts`) | 미구현 |
| API 라우트 (`app/api/quotes/*`) | 미구현 |
| Feature 컴포넌트 (`components/features/*`) | 미구현 |
| PDF 문서 컴포넌트 | 미구현 |
| 더미 데이터 | 미구현 |
