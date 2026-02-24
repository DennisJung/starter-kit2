import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/formatters'
import type { IssuerInfo, Quote } from '@/lib/types'
import { Building2, User, Calendar, CalendarClock } from 'lucide-react'

interface QuoteHeaderProps {
  quote: Quote
  issuer: IssuerInfo
}

/** 견적서 헤더 — 발행자(좌측)/수신자(우측) 2단 레이아웃 및 견적서 메타데이터 표시 */
export function QuoteHeader({ quote, issuer }: QuoteHeaderProps) {
  return (
    <div className='space-y-6'>
      {/* 견적서 제목 및 메타데이터 */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-3xl font-bold tracking-tight'>견적서</h1>
        <p className='text-muted-foreground text-sm'>No. {quote.title}</p>
      </div>

      {/* 발행일 / 유효기한 메타데이터 */}
      <div className='flex flex-wrap gap-4 text-sm'>
        <div className='flex items-center gap-1.5 text-muted-foreground'>
          <Calendar className='h-4 w-4' />
          <span>발행일:</span>
          <span className='font-medium text-foreground'>{formatDate(quote.issueDate)}</span>
        </div>
        {quote.validUntil && (
          <div className='flex items-center gap-1.5 text-muted-foreground'>
            <CalendarClock className='h-4 w-4' />
            <span>유효기한:</span>
            <span className='font-medium text-foreground'>{formatDate(quote.validUntil)}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* 발행자 / 수신자 2단 레이아웃 */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        {/* 발행자 정보 (좌측) */}
        <div className='space-y-2'>
          <div className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            <Building2 className='h-3.5 w-3.5' />
            발행자
          </div>
          <div className='space-y-1 text-sm'>
            <p className='font-semibold text-base'>{issuer.companyName}</p>
            <p className='text-muted-foreground'>대표: {issuer.representative}</p>
            <p className='text-muted-foreground'>사업자: {issuer.businessNumber}</p>
            <p className='text-muted-foreground'>{issuer.address}</p>
            <p className='text-muted-foreground'>{issuer.contact}</p>
          </div>
        </div>

        {/* 수신자 정보 (우측) */}
        <div className='space-y-2'>
          <div className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            <User className='h-3.5 w-3.5' />
            수신자
          </div>
          <div className='space-y-1 text-sm'>
            <p className='font-semibold text-base'>{quote.clientName}</p>
            {quote.clientEmail && (
              <p className='text-muted-foreground'>{quote.clientEmail}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />
    </div>
  )
}
