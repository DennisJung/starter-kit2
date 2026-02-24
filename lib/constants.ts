import type { QuoteStatus } from './types'

// ─── 견적서 상태 레이블 ───────────────────────────────────────────────────────

/** 견적서 상태별 한국어 레이블 */
export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: '초안',
  sent: '발송됨',
  accepted: '수락됨',
  rejected: '거절됨',
  expired: '만료됨',
}

/** 견적서 상태별 배지 색상 (shadcn Badge variant 매핑) */
export const QUOTE_STATUS_VARIANTS: Record<QuoteStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  sent: 'secondary',
  accepted: 'default',
  rejected: 'destructive',
  expired: 'outline',
}

// ─── API 경로 ────────────────────────────────────────────────────────────────

/** Notion API 관련 엔드포인트 */
export const API_ROUTES = {
  quotes: '/api/quotes',
  quoteById: (id: string) => `/api/quotes/${id}`,
  sync: '/api/sync',
} as const

// ─── 페이지네이션 ─────────────────────────────────────────────────────────────

/** 대시보드 목록 페이지당 항목 수 */
export const PAGE_SIZE = 20

// ─── Notion 프로퍼티 이름 ─────────────────────────────────────────────────────

/** Notion 데이터베이스 프로퍼티 이름 매핑 */
export const NOTION_PROPERTIES = {
  /** 견적서 데이터베이스 프로퍼티 */
  ESTIMATES: {
    TITLE: '견적서 번호',
    CLIENT_NAME: '클라이언트명',
    CLIENT_EMAIL: '이메일',
    ISSUE_DATE: '발행일',
    VALID_UNTIL: '유효기간',
    STATUS: '상태',
    NOTE: '비고/메모',
  },
  /** 견적 항목 데이터베이스 프로퍼티 */
  ITEMS: {
    ITEM_NAME: '항목명',
    QUANTITY: '수량',
    UNIT_PRICE: '단가(원)',
    ESTIMATE_ID: '견적서',
  },
} as const
