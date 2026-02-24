'use client'

// @react-pdf/renderer는 SSR 미지원 → 클라이언트 컴포넌트에서 dynamic import
import dynamic from 'next/dynamic'
import type { Quote, IssuerInfo } from '@/lib/types'

const PDFDownloadButton = dynamic(
  () => import('./PDFDownloadButton').then((m) => m.PDFDownloadButton),
  { ssr: false, loading: () => <span className='text-sm text-muted-foreground'>PDF 준비 중...</span> }
)

interface PDFDownloadButtonWrapperProps {
  quote: Quote
  issuer: IssuerInfo
}

export function PDFDownloadButtonWrapper({ quote, issuer }: PDFDownloadButtonWrapperProps) {
  return <PDFDownloadButton quote={quote} issuer={issuer} />
}
