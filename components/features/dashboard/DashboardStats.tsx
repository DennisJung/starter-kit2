import { MetricCard } from '@/components/composite/MetricCard'
import { formatCurrency } from '@/lib/formatters'
import type { QuoteSummary } from '@/lib/types'

interface DashboardStatsProps {
  quotes: QuoteSummary[]
}

/** 대시보드 상단 통계 카드 섹션 — 전체/발송됨/수락됨/총 금액 표시 */
export function DashboardStats({ quotes }: DashboardStatsProps) {
  // 상태별 견적서 수 계산
  const totalCount = quotes.length
  const sentCount = quotes.filter((q) => q.status === 'sent').length
  const acceptedCount = quotes.filter((q) => q.status === 'accepted').length

  // 전체 견적서 금액 합산
  const totalAmount = quotes.reduce((sum, q) => sum + q.totalAmount, 0)

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4 mb-6'>
      {/* 전체 견적서 수 */}
      <MetricCard
        title='전체 견적서'
        value={`${totalCount}건`}
      />

      {/* 발송됨 견적서 수 */}
      <MetricCard
        title='발송됨'
        value={`${sentCount}건`}
      />

      {/* 수락됨 견적서 수 */}
      <MetricCard
        title='수락됨'
        value={`${acceptedCount}건`}
      />

      {/* 전체 견적 총 금액 */}
      <MetricCard
        title='총 견적 금액'
        value={formatCurrency(totalAmount)}
      />
    </div>
  )
}
