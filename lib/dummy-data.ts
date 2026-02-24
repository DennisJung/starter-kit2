import type { Quote, QuoteSummary } from './types'
import { calcSubtotal } from './formatters'

// ─── 더미 견적 항목 ───────────────────────────────────────────────────────────

const DUMMY_ITEMS = [
  {
    id: 'item-001',
    estimateId: 'quote-001',
    itemName: '웹사이트 기획 및 설계',
    quantity: 1,
    unitPrice: 1500000,
  },
  {
    id: 'item-002',
    estimateId: 'quote-001',
    itemName: '프론트엔드 개발 (Next.js)',
    quantity: 1,
    unitPrice: 3500000,
  },
  {
    id: 'item-003',
    estimateId: 'quote-001',
    itemName: 'UI/UX 디자인',
    quantity: 1,
    unitPrice: 2000000,
  },
  {
    id: 'item-004',
    estimateId: 'quote-001',
    itemName: '유지보수 (월)',
    quantity: 3,
    unitPrice: 300000,
  },
]

// ─── 더미 견적서 상세 ─────────────────────────────────────────────────────────

/** 견적서 열람 페이지 더미 데이터 */
export const DUMMY_QUOTE: Quote = {
  id: 'quote-001',
  title: '2026-001',
  clientName: '(주)테크스타트',
  clientEmail: 'contact@techstart.kr',
  issueDate: '2026-02-01',
  validUntil: '2026-03-01',
  status: 'sent',
  note: '본 견적서는 발행일로부터 30일간 유효합니다.\n프로젝트 일정 및 세부 사항은 계약 전 협의를 통해 조정될 수 있습니다.',
  items: DUMMY_ITEMS,
}

// ─── 더미 견적서 목록 ─────────────────────────────────────────────────────────

/** 대시보드 목록용 더미 데이터 (5개 — 각 상태 포함) */
export const DUMMY_QUOTES: QuoteSummary[] = [
  {
    id: 'quote-001',
    title: '2026-001',
    clientName: '(주)테크스타트',
    clientEmail: 'contact@techstart.kr',
    issueDate: '2026-02-01',
    validUntil: '2026-03-01',
    status: 'sent',
    totalAmount: calcSubtotal(DUMMY_ITEMS),
  },
  {
    id: 'quote-002',
    title: '2026-002',
    clientName: '블루오션 마케팅',
    clientEmail: 'hello@blueocean.co.kr',
    issueDate: '2026-01-20',
    validUntil: '2026-02-20',
    status: 'accepted',
    totalAmount: 5500000,
  },
  {
    id: 'quote-003',
    title: '2026-003',
    clientName: '스마트솔루션즈',
    issueDate: '2026-02-10',
    status: 'draft',
    totalAmount: 2800000,
  },
  {
    id: 'quote-004',
    title: '2025-048',
    clientName: '그린에너지 협동조합',
    clientEmail: 'admin@greenenergy.org',
    issueDate: '2025-12-15',
    validUntil: '2026-01-15',
    status: 'rejected',
    totalAmount: 12000000,
  },
  {
    id: 'quote-005',
    title: '2025-050',
    clientName: '퓨처모빌리티',
    clientEmail: 'biz@futuremobility.kr',
    issueDate: '2025-11-01',
    validUntil: '2025-12-01',
    status: 'expired',
    totalAmount: 8750000,
  },
]
