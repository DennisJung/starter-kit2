'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDFDocument } from './PDFDocument'
import { Button } from '@/components/ui/button'
import type { Quote, IssuerInfo } from '@/lib/types'
import { Download } from 'lucide-react'

interface PDFDownloadButtonProps {
  quote: Quote
  issuer: IssuerInfo
}

/**
 * PDF 다운로드 버튼 컴포넌트
 * - @react-pdf/renderer의 PDFDownloadLink를 래핑하여 다운로드 트리거
 * - 생성 중(loading) 상태를 시각적으로 표시
 */
export function PDFDownloadButton({ quote, issuer }: PDFDownloadButtonProps) {
  // 다운로드 파일명: quote-{id}.pdf
  const fileName = `quote-${quote.id}.pdf`

  return (
    <PDFDownloadLink
      document={<PDFDocument quote={quote} issuer={issuer} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button
          variant='outline'
          size='sm'
          className='gap-2'
          disabled={loading}
          aria-label={loading ? 'PDF 생성 중' : 'PDF 다운로드'}
        >
          <Download className='h-4 w-4' />
          {loading ? 'PDF 생성 중...' : 'PDF 다운로드'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
