import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/formatters'
import type { QuoteItem } from '@/lib/types'

interface QuoteItemsTableProps {
  items: QuoteItem[]
}

/** 견적 항목 테이블 — 항목명/수량/단가/소계 표시 */
export function QuoteItemsTable({ items }: QuoteItemsTableProps) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>항목명</TableHead>
            <TableHead className='w-[80px] text-right'>수량</TableHead>
            <TableHead className='w-[140px] text-right'>단가</TableHead>
            <TableHead className='w-[140px] text-right'>소계</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {/* 항목명 */}
              <TableCell className='font-medium'>{item.itemName}</TableCell>

              {/* 수량 */}
              <TableCell className='text-right text-muted-foreground'>
                {item.quantity}
              </TableCell>

              {/* 단가 */}
              <TableCell className='text-right text-muted-foreground'>
                {formatCurrency(item.unitPrice)}
              </TableCell>

              {/* 소계 (수량 × 단가) */}
              <TableCell className='text-right font-medium'>
                {formatCurrency(item.quantity * item.unitPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
