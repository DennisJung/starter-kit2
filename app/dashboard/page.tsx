import { AppShell } from '@/components/layout/AppShell'
import { ContentArea } from '@/components/layout/ContentArea'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/composite/EmptyState'
import { FileText } from 'lucide-react'

/**
 * 관리자 대시보드 페이지
 * - 접근 제어: middleware.ts에서 ADMIN_TOKEN으로 보호
 * - 견적서 목록 조회, 공유 링크 생성
 */
export default function DashboardPage() {
  return (
    <AppShell>
      <ContentArea>
        <PageHeader
          title="견적서 대시보드"
          description="노션에서 동기화된 견적서 목록을 관리하고 공유 링크를 생성합니다."
        />

        {/* TODO: 견적서 목록 컴포넌트 (F001, F002 구현 후 교체) */}
        <EmptyState
          icon={FileText}
          title="견적서가 없습니다"
          description="노션 데이터베이스와 연동하면 견적서 목록이 여기에 표시됩니다."
        />
      </ContentArea>
    </AppShell>
  )
}
