import { AppShell } from '@/components/layout/AppShell'
import { ContentArea } from '@/components/layout/ContentArea'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/composite/EmptyState'
import { DashboardStats } from '@/components/features/dashboard/DashboardStats'
import { QuoteListTable } from '@/components/features/quote/QuoteListTable'
import { fetchQuotes } from '@/lib/notion'
import type { QuoteSummary } from '@/lib/types'
import { FileText } from 'lucide-react'

/** 페이지 캐시 재검증 주기: 60초마다 Notion 데이터를 새로 가져옴 */
export const revalidate = 60

/**
 * 관리자 대시보드 페이지
 * - 접근 제어: middleware.ts에서 ADMIN_TOKEN으로 보호
 * - Notion API에서 견적서 목록을 직접 조회하여 표시
 */
export default async function DashboardPage() {
  // Notion API에서 견적서 목록 조회 — 실패 시 빈 배열로 처리
  let quotes: QuoteSummary[] = []
  try {
    quotes = await fetchQuotes()
  } catch (error) {
    console.error('[DashboardPage] 견적서 목록 조회 실패:', error)
  }

  return (
    <AppShell>
      <ContentArea>
        <PageHeader
          title='견적서 대시보드'
          description='노션에서 동기화된 견적서 목록을 관리하고 공유 링크를 생성합니다.'
        />

        {quotes.length > 0 ? (
          <>
            {/* 상단 통계 카드 섹션 */}
            <DashboardStats quotes={quotes} />

            {/* 견적서 목록 테이블 */}
            <QuoteListTable quotes={quotes} />
          </>
        ) : (
          /* 견적서가 없을 경우 빈 상태 표시 */
          <EmptyState
            icon={FileText}
            title='견적서가 없습니다'
            description='노션 데이터베이스와 연동하면 견적서 목록이 여기에 표시됩니다.'
          />
        )}
      </ContentArea>
    </AppShell>
  )
}
