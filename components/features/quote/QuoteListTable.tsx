'use client'

import { Fragment, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDateShort } from '@/lib/formatters'
import type { QuoteItem, QuoteSummary } from '@/lib/types'
import { QuoteStatusBadge } from './QuoteStatusBadge'
import { ShareLinkButton } from './ShareLinkButton'

interface QuoteListTableProps {
  quotes: QuoteSummary[]
}

/** 견적서 목록 테이블 컴포넌트 — 대시보드에서 견적서 목록을 표 형태로 표시, 행 클릭 시 항목 확장 */
export function QuoteListTable({ quotes }: QuoteListTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [itemsCache, setItemsCache] = useState<Record<string, QuoteItem[]>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleRowClick(id: string) {
    // 같은 행 클릭 시 접기
    if (expandedId === id) {
      setExpandedId(null)
      return
    }

    // 캐시에 없으면 API 호출
    if (!itemsCache[id]) {
      setLoadingId(id)
      try {
        const res = await fetch(`/api/quotes/${id}`)
        const data = await res.json()
        // API 응답 구조: { data: Quote } — data.data.items 접근
        setItemsCache(prev => ({ ...prev, [id]: data.data?.items ?? [] }))
      } finally {
        setLoadingId(null)
      }
    }

    setExpandedId(id)
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[120px]'>견적서 번호</TableHead>
            <TableHead>클라이언트</TableHead>
            <TableHead className='text-right'>금액</TableHead>
            <TableHead className='w-[110px]'>발행일</TableHead>
            <TableHead className='w-[90px]'>상태</TableHead>
            <TableHead className='w-[110px] text-right'>액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <Fragment key={quote.id}>
              {/* 메인 행 — 클릭 시 항목 확장/축소 */}
              <TableRow
                className='cursor-pointer hover:bg-muted/50'
                onClick={() => handleRowClick(quote.id)}
              >
                {/* 견적서 번호 */}
                <TableCell className='font-medium'>{quote.title}</TableCell>

                {/* 클라이언트 정보 */}
                <TableCell>
                  <div>
                    <p className='font-medium'>{quote.clientName}</p>
                    {quote.clientEmail && (
                      <p className='text-xs text-muted-foreground'>{quote.clientEmail}</p>
                    )}
                  </div>
                </TableCell>

                {/* 금액 */}
                <TableCell className='text-right font-medium'>
                  {formatCurrency(quote.totalAmount)}
                </TableCell>

                {/* 발행일 */}
                <TableCell className='text-muted-foreground'>
                  {formatDateShort(quote.issueDate)}
                </TableCell>

                {/* 상태 배지 */}
                <TableCell>
                  <QuoteStatusBadge status={quote.status} />
                </TableCell>

                {/* 공유 링크 액션 — 이벤트 전파 차단으로 행 클릭 방지 */}
                <TableCell
                  className='text-right'
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShareLinkButton quoteId={quote.id} />
                </TableCell>
              </TableRow>

              {/* 확장 행 — 견적 항목 슬라이드 애니메이션 */}
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={6} className='p-0 border-0'>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      expandedId === quote.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className='overflow-hidden'>
                      <div className='px-4 py-3 bg-muted/30'>
                        {loadingId === quote.id ? (
                          <p className='text-sm text-muted-foreground py-2'>항목 불러오는 중...</p>
                        ) : (
                          <QuoteItemsSubTable items={itemsCache[quote.id] ?? []} />
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/** 확장 영역 내 견적 항목 서브 테이블 */
function QuoteItemsSubTable({ items }: { items: QuoteItem[] }) {
  if (items.length === 0) {
    return <p className='text-sm text-muted-foreground py-2'>견적 항목이 없습니다.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='h-8 text-xs'>항목명</TableHead>
          <TableHead className='h-8 text-xs w-[80px] text-right'>수량</TableHead>
          <TableHead className='h-8 text-xs w-[120px] text-right'>단가</TableHead>
          <TableHead className='h-8 text-xs w-[130px] text-right'>소계</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id} className='hover:bg-transparent'>
            <TableCell className='py-2 text-sm'>{item.itemName}</TableCell>
            <TableCell className='py-2 text-sm text-right'>{item.quantity}</TableCell>
            <TableCell className='py-2 text-sm text-right'>{formatCurrency(item.unitPrice)}</TableCell>
            <TableCell className='py-2 text-sm text-right font-medium'>
              {formatCurrency(item.quantity * item.unitPrice)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
