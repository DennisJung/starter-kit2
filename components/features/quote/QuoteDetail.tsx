import { Separator } from '@/components/ui/separator'
import { calcSubtotal, calcTax, calcTotal, formatCurrency } from '@/lib/formatters'
import type { IssuerInfo, Quote } from '@/lib/types'
import { QuoteHeader } from './QuoteHeader'
import { QuoteItemsTable } from './QuoteItemsTable'

interface QuoteDetailProps {
  quote: Quote
  issuer: IssuerInfo
}

/** 견적서 전체 상세 컴포넌트 — 헤더, 항목 테이블, 합계, 비고 조합 */
export function QuoteDetail({ quote, issuer }: QuoteDetailProps) {
  // 금액 계산
  const subtotal = calcSubtotal(quote.items)
  const tax = calcTax(subtotal)
  const total = calcTotal(subtotal, tax)

  return (
    <div className='space-y-8'>
      {/* 견적서 헤더 (발행자/수신자 정보 + 메타데이터) */}
      <QuoteHeader quote={quote} issuer={issuer} />

      {/* 견적 항목 테이블 */}
      <section>
        <h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
          견적 항목
        </h2>
        <QuoteItemsTable items={quote.items} />
      </section>

      {/* 합계 금액 섹션 */}
      <div className='flex justify-end'>
        <div className='w-full max-w-xs space-y-2'>
          {/* 소계 */}
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>소계</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {/* 부가세 (10%) */}
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>부가세 (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <Separator />

          {/* 총합계 */}
          <div className='flex justify-between font-semibold text-base'>
            <span>총합계</span>
            <span className='text-lg'>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* 비고 섹션 — note가 있을 때만 표시 */}
      {quote.note && (
        <section>
          <Separator className='mb-6' />
          <h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
            비고
          </h2>
          <p className='text-sm text-muted-foreground whitespace-pre-line leading-relaxed'>
            {quote.note}
          </p>
        </section>
      )}
    </div>
  )
}
