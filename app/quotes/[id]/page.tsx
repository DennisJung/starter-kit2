import { FileText } from 'lucide-react'
import { EmptyState } from '@/components/composite/EmptyState'

interface QuotePageProps {
  params: Promise<{ id: string }>
}

/**
 * 견적서 열람 페이지
 * - 공개 접근 가능 (인증 불필요)
 * - Notion에서 견적서 데이터를 조회하여 렌더링
 * - PDF 다운로드 기능 제공 (F005)
 */
export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      {/* TODO: 견적서 헤더 (회사 로고, PDF 다운로드 버튼) */}
      {/* TODO: 견적서 본문 컴포넌트 (F003 구현 후 교체) */}
      <div className="container mx-auto max-w-4xl py-12 px-6">
        <EmptyState
          icon={FileText}
          title="견적서를 불러오는 중입니다"
          description={`견적서 ID: ${id}`}
        />
      </div>
    </main>
  )
}

/** 동적 경로이므로 정적 생성 비활성화 */
export const dynamic = 'force-dynamic'
