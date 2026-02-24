import { Badge } from '@/components/ui/badge'
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_VARIANTS } from '@/lib/constants'
import type { QuoteStatus } from '@/lib/types'

interface QuoteStatusBadgeProps {
  status: QuoteStatus
}

/** 견적서 상태 배지 컴포넌트 — 상태별 색상과 한국어 레이블 표시 */
export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  return (
    <Badge variant={QUOTE_STATUS_VARIANTS[status]}>
      {QUOTE_STATUS_LABELS[status]}
    </Badge>
  )
}
