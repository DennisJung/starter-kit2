# CLAUDE.md

**Notion 견적서 웹 뷰어**는 노션으로 관리하는 견적서를 클라이언트가 전문적인 웹 페이지에서 확인하고 PDF로 다운로드할 수 있게 하는 서비스입니다.

상세 프로젝트 요구사항은 @/docs/PRD.md 참조

> 코드 스타일 규칙은 @.claude/rules/code-style.md, Git 규칙은 @.claude/rules/git-rules.md 를 참조하세요.

## 개발 명령어

```bash
# 개발 서버 (http://localhost:3000)
npm run dev

# 프로덕션 빌드 및 린트
npm run build
npm run lint
```

## 환경변수 설정

`.env.example`을 복사하여 `.env.local` 파일을 생성하고 값을 입력합니다.

```bash
cp .env.example .env.local
```

필수 환경변수:
- `ADMIN_TOKEN`: 대시보드 접근 토큰
- `NOTION_API_KEY`: Notion Integration Secret
- `NOTION_ESTIMATES_DB_ID`: 견적서 데이터베이스 ID
- `NOTION_ITEMS_DB_ID`: 견적 항목 데이터베이스 ID
- `ISSUER_*`: 발행자(회사) 정보

## 아키텍처

### 페이지 구조

| 경로 | 역할 | 접근 제어 |
|------|------|----------|
| `/` | `/dashboard`로 리다이렉트 | - |
| `/dashboard?token={ADMIN_TOKEN}` | 관리자 대시보드 (견적서 목록, 공유 링크 생성) | middleware.ts 토큰 검증 |
| `/quotes/[id]` | 견적서 열람 페이지 (PDF 다운로드 포함) | 공개 |

### 컴포넌트 계층 구조

```
Layer 1: components/layout/     - AppShell, Header, ContentArea, PageHeader
Layer 2: components/ui/         - shadcn/ui 원자 컴포넌트
Layer 3: components/composite/  - MetricCard, EmptyState, LoadingOverlay
Layer 4: components/features/   - QuoteList, QuoteDetail, PDFDownloadButton (구현 예정)
Layer 5: app/*/page.tsx         - Next.js 페이지
```

상위 레이어는 하위 레이어에만 의존합니다.

### 데이터 흐름

**대시보드:**
```
/dashboard?token=xxx → middleware.ts 토큰 검증
  → GET /api/quotes (Notion API 조회)
  → QuoteList 컴포넌트 렌더링
  → 공유 링크 생성 (클립보드 복사)
```

**견적서 열람:**
```
/quotes/[id] → GET /api/quotes/[id] (Notion API 조회)
  → QuoteDetail 컴포넌트 렌더링
  → PDF 다운로드 (@react-pdf/renderer)
```

### 주요 타입

```typescript
// lib/types.ts 참조
interface Quote {
  id: string
  title: string
  clientName: string
  clientEmail?: string
  issueDate: string       // "YYYY-MM-DD"
  validUntil?: string     // "YYYY-MM-DD"
  status: QuoteStatus
  note?: string
  items: QuoteItem[]
}

interface QuoteItem {
  id: string
  estimateId: string
  itemName: string
  quantity: number
  unitPrice: number       // 원
}
```

## 경로 별칭

`@/*` → 프로젝트 루트. 예: `import { cn } from '@/lib/utils'`

## 커뮤니케이션
- 코드 변경 시 무엇을 왜 바꿨는지 간단히 설명
- 파일을 새로 만들 때는 먼저 계획을 말해주고 진행
