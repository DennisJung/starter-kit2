// ─── 견적서 도메인 타입 정의 ─────────────────────────────────────────────────

/** 견적서 상태 */
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'

/** 견적 항목 */
export interface QuoteItem {
  id: string
  estimateId: string        // 견적서 ID (Relation)
  itemName: string          // 항목명
  quantity: number          // 수량
  unitPrice: number         // 단가 (원)
}

/** 견적서 */
export interface Quote {
  id: string
  title: string             // 견적서 제목
  clientName: string        // 클라이언트명
  clientEmail?: string      // 클라이언트 이메일
  issueDate: string         // 발행일 (YYYY-MM-DD)
  validUntil?: string       // 유효기한 (YYYY-MM-DD)
  status: QuoteStatus       // 견적서 상태
  note?: string             // 비고
  items: QuoteItem[]        // 견적 항목 목록
}

/** 견적서 목록 항목 (목록 조회용 요약 정보) */
export interface QuoteSummary {
  id: string
  title: string
  clientName: string
  clientEmail?: string
  issueDate: string
  validUntil?: string
  status: QuoteStatus
  totalAmount: number       // 합계 금액 (원)
}

/** 발행자(회사) 정보 */
export interface IssuerInfo {
  companyName: string       // 회사명
  representative: string    // 대표자명
  businessNumber: string    // 사업자등록번호
  address: string           // 주소
  contact: string           // 연락처
}

/** 견적서 공유 링크 정보 */
export interface ShareLink {
  quoteId: string
  url: string
}

/** 네비게이션 항목 */
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}
