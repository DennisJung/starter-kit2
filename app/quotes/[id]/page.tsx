import { notFound } from 'next/navigation'
import { QuoteDetail } from '@/components/features/quote/QuoteDetail'
import { PDFDownloadButtonWrapper } from '@/components/features/quote/PDFDownloadButtonWrapper'
import { fetchQuote } from '@/lib/notion'
import { getIssuerInfo } from '@/lib/formatters'
import type { IssuerInfo } from '@/lib/types'

interface QuotePageProps {
  params: Promise<{ id: string }>
}

/** 발행자 정보 기본값 — 환경변수 미설정 시 대체 */
const FALLBACK_ISSUER: IssuerInfo = {
  companyName: '회사명 미설정',
  representative: '대표자 미설정',
  businessNumber: '000-00-00000',
  address: '주소 미설정',
  contact: '연락처 미설정',
}

/**
 * 견적서 열람 페이지
 * - 공개 접근 가능 (인증 불필요)
 * - Notion API에서 견적서 데이터를 조회하여 렌더링
 * - PDFDownloadButton을 통해 클라이언트 측 PDF 다운로드 지원
 */
export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params

  // Notion API에서 견적서 조회 — 없으면 404 처리
  const quote = await fetchQuote(id)
  if (!quote) {
    notFound()
  }

  // 발행자 정보 로드 — 환경변수 미설정 시 기본값 사용
  let issuer: IssuerInfo
  try {
    issuer = getIssuerInfo()
  } catch {
    issuer = FALLBACK_ISSUER
  }

  return (
    <main className='min-h-screen bg-background'>
      {/* 상단 액션 바 — PDF 다운로드 버튼 */}
      <div className='border-b bg-background/95 backdrop-blur sticky top-0 z-10'>
        <div className='container mx-auto max-w-4xl px-6 py-3 flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            견적서 <span className='font-medium text-foreground'>No. {quote.title}</span>
          </p>

          {/* PDF 다운로드 버튼 — SSR 비활성화 래퍼로 감싼 클라이언트 전용 컴포넌트 */}
          <PDFDownloadButtonWrapper quote={quote} issuer={issuer} />
        </div>
      </div>

      {/* 견적서 본문 — max-w-4xl 반응형 레이아웃 */}
      <div className='container mx-auto max-w-4xl px-6 py-10'>
        <QuoteDetail quote={quote} issuer={issuer} />
      </div>
    </main>
  )
}

/** 페이지 캐시 재검증 주기: 60초마다 Notion 데이터를 새로 가져옴 */
export const revalidate = 60
