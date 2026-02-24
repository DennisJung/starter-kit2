import { NextResponse } from 'next/server'
import { fetchQuotes } from '@/lib/notion'

// 60초마다 ISR 재검증
export const revalidate = 60

/**
 * GET /api/quotes
 * 견적서 목록을 Notion DB에서 조회하여 반환합니다.
 */
export async function GET() {
  try {
    const quotes = await fetchQuotes()
    return NextResponse.json({ data: quotes }, { status: 200 })
  } catch (error) {
    console.error('[GET /api/quotes] 견적서 목록 조회 실패:', error)
    return NextResponse.json(
      { error: '견적서 목록을 불러오는 데 실패했습니다.' },
      { status: 500 }
    )
  }
}
