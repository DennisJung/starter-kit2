import { NextResponse } from 'next/server'
import { fetchQuote } from '@/lib/notion'

// 60초마다 ISR 재검증
export const revalidate = 60

/**
 * GET /api/quotes/[id]
 * 특정 ID의 견적서를 Notion DB에서 조회하여 반환합니다.
 * 존재하지 않는 경우 404를 반환합니다.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const quote = await fetchQuote(id)

    if (!quote) {
      return NextResponse.json(
        { error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: quote }, { status: 200 })
  } catch (error) {
    console.error(`[GET /api/quotes/${id}] 견적서 조회 실패:`, error)
    return NextResponse.json(
      { error: '견적서를 불러오는 데 실패했습니다.' },
      { status: 500 }
    )
  }
}
