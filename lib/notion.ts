import { Client, isFullPage } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Quote, QuoteItem, QuoteSummary } from './types'
import {
  mapPageToQuote,
  mapPageToQuoteItem,
  mapPageToQuoteSummary,
} from './notion-mapper'

// ─── Notion 클라이언트 초기화 ─────────────────────────────────────────────────

/**
 * 싱글톤 Notion 클라이언트 인스턴스
 * @notionhq/client v2.x: databases.query()로 데이터베이스를 쿼리합니다.
 * (v5.x에서는 databases.query가 제거되어 v2.3.0으로 다운그레이드)
 */
const notionClient = new Client({ auth: process.env.NOTION_API_KEY })

// ─── 견적서 목록 조회 ─────────────────────────────────────────────────────────

/**
 * 견적서 데이터베이스에서 전체 견적서 요약 목록을 조회합니다.
 * 발행일 내림차순으로 정렬하여 반환합니다.
 */
export async function fetchQuotes(): Promise<QuoteSummary[]> {
  const dbId = process.env.NOTION_ESTIMATES_DB_ID

  if (!dbId) {
    throw new Error('NOTION_ESTIMATES_DB_ID 환경변수가 설정되지 않았습니다.')
  }

  const response = await notionClient.databases.query({
    database_id: dbId,
    sorts: [
      {
        property: '발행일',
        direction: 'descending',
      },
    ],
  })

  // 완전한 페이지 응답만 필터링하여 QuoteSummary로 변환
  const summaries = response.results
    .filter(isFullPage)
    .map((page) => mapPageToQuoteSummary(page as PageObjectResponse))

  // 각 견적서의 항목을 병렬 조회하여 totalAmount 계산
  const summariesWithTotal = await Promise.all(
    summaries.map(async (summary) => {
      const items = await fetchQuoteItems(summary.id)
      const totalAmount = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      )
      return { ...summary, totalAmount }
    })
  )

  return summariesWithTotal
}

// ─── 견적서 상세 조회 ─────────────────────────────────────────────────────────

/**
 * 특정 ID의 견적서와 연결된 견적 항목을 함께 조회합니다.
 * 견적서가 존재하지 않으면 null을 반환합니다.
 */
export async function fetchQuote(id: string): Promise<Quote | null> {
  try {
    const page = await notionClient.pages.retrieve({ page_id: id })

    // 완전한 페이지 응답인지 확인
    if (!isFullPage(page)) {
      return null
    }

    // 해당 견적서에 연결된 항목 목록 조회
    const items = await fetchQuoteItems(id)

    return mapPageToQuote(page as PageObjectResponse, items)
  } catch (error) {
    // Notion API가 404를 반환하는 경우 (페이지 없음 또는 권한 없음)
    if (isNotionNotFoundError(error)) {
      return null
    }
    throw error
  }
}

// ─── 견적 항목 조회 ───────────────────────────────────────────────────────────

/**
 * 특정 견적서 ID에 연결된 견적 항목 목록을 조회합니다.
 */
export async function fetchQuoteItems(estimateId: string): Promise<QuoteItem[]> {
  const dbId = process.env.NOTION_ITEMS_DB_ID

  if (!dbId) {
    throw new Error('NOTION_ITEMS_DB_ID 환경변수가 설정되지 않았습니다.')
  }

  const response = await notionClient.databases.query({
    database_id: dbId,
    filter: {
      property: '견적서',
      relation: {
        contains: estimateId,
      },
    },
  })

  // 완전한 페이지 응답만 필터링하여 QuoteItem으로 변환
  const items = response.results
    .filter(isFullPage)
    .map((page) => mapPageToQuoteItem(page as PageObjectResponse))

  return items
}

// ─── 에러 타입 가드 ───────────────────────────────────────────────────────────

/** Notion API의 404(찾을 수 없음) 에러인지 확인 */
function isNotionNotFoundError(error: unknown): boolean {
  if (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code: string }).code === 'object_not_found'
  ) {
    return true
  }
  return false
}
