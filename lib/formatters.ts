import type { QuoteItem, IssuerInfo } from './types'

// ─── 통화 포맷팅 ─────────────────────────────────────────────────────────────

/** 숫자를 한국 원화 형식으로 포맷팅 (예: 1234567 → '1,234,567원') */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

// ─── 날짜 포맷팅 ─────────────────────────────────────────────────────────────

/** YYYY-MM-DD 날짜 문자열을 한국어 형식으로 포맷팅 (예: '2024-01-01' → '2024년 1월 1일') */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/** YYYY-MM-DD 날짜 문자열을 짧은 형식으로 반환 (예: '2024-01-01' → '2024. 01. 01.') */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// ─── 금액 계산 ────────────────────────────────────────────────────────────────

/** 견적 항목 목록의 소계 계산 (수량 × 단가 합산) */
export function calcSubtotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}

/** 부가세 계산 (기본 10%) */
export function calcTax(subtotal: number, rate = 0.1): number {
  return Math.round(subtotal * rate)
}

/** 총합계 계산 (소계 + 부가세) */
export function calcTotal(subtotal: number, tax: number): number {
  return subtotal + tax
}

// ─── 발행자 정보 ──────────────────────────────────────────────────────────────

/** 환경변수에서 발행자(회사) 정보를 로드하여 반환 */
export function getIssuerInfo(): IssuerInfo {
  const companyName = process.env.ISSUER_COMPANY_NAME
  const representative = process.env.ISSUER_REPRESENTATIVE
  const businessNumber = process.env.ISSUER_BUSINESS_NUMBER
  const address = process.env.ISSUER_ADDRESS
  const contact = process.env.ISSUER_CONTACT

  if (!companyName || !representative || !businessNumber || !address || !contact) {
    throw new Error(
      '발행자 정보 환경변수가 설정되지 않았습니다. ' +
      'ISSUER_COMPANY_NAME, ISSUER_REPRESENTATIVE, ISSUER_BUSINESS_NUMBER, ' +
      'ISSUER_ADDRESS, ISSUER_CONTACT를 .env.local에 설정하세요.'
    )
  }

  return {
    companyName,
    representative,
    businessNumber,
    address,
    contact,
  }
}
