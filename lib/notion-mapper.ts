import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Quote, QuoteItem, QuoteSummary, QuoteStatus } from './types'
import { NOTION_PROPERTIES } from './constants'

// ─── Notion 프로퍼티 타입 별칭 ─────────────────────────────────────────────────

type NotionProperties = PageObjectResponse['properties']

// ─── 프로퍼티 헬퍼 함수 ───────────────────────────────────────────────────────

/** title 프로퍼티에서 텍스트 추출 */
export function getTitleProp(props: NotionProperties, key: string): string {
  const prop = props[key]
  if (prop?.type !== 'title') return ''
  return prop.title.map((t) => t.plain_text).join('')
}

/** rich_text 프로퍼티에서 텍스트 추출 */
export function getTextProp(props: NotionProperties, key: string): string | undefined {
  const prop = props[key]
  if (prop?.type !== 'rich_text') return undefined
  const text = prop.rich_text.map((t) => t.plain_text).join('')
  return text || undefined
}

/** email 프로퍼티에서 이메일 추출 */
export function getEmailProp(props: NotionProperties, key: string): string | undefined {
  const prop = props[key]
  if (prop?.type !== 'email') return undefined
  return prop.email ?? undefined
}

/** date 프로퍼티에서 시작일(start) 추출 */
export function getDateProp(props: NotionProperties, key: string): string | undefined {
  const prop = props[key]
  if (prop?.type !== 'date') return undefined
  return prop.date?.start ?? undefined
}

/** number 프로퍼티에서 숫자 추출 (없으면 0 반환) */
export function getNumberProp(props: NotionProperties, key: string): number {
  const prop = props[key]
  if (prop?.type !== 'number') return 0
  return prop.number ?? 0
}

/** select 프로퍼티에서 선택값(name) 추출 */
export function getSelectProp(props: NotionProperties, key: string): string | undefined {
  const prop = props[key]
  if (prop?.type !== 'select') return undefined
  return prop.select?.name ?? undefined
}

/** relation 프로퍼티에서 연결된 페이지 ID 배열 추출 */
export function getRelationIds(props: NotionProperties, key: string): string[] {
  const prop = props[key]
  if (prop?.type !== 'relation') return []
  return prop.relation.map((r) => r.id)
}

// ─── 유효한 QuoteStatus 검증 ──────────────────────────────────────────────────

/** Notion 선택값을 QuoteStatus로 변환 (알 수 없는 값은 'draft'로 폴백) */
function toQuoteStatus(value: string | undefined): QuoteStatus {
  const validStatuses: QuoteStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'expired']
  if (value && validStatuses.includes(value as QuoteStatus)) {
    return value as QuoteStatus
  }
  return 'draft'
}

// ─── 매퍼 함수 ────────────────────────────────────────────────────────────────

/** Notion 페이지를 견적서 요약(QuoteSummary)으로 변환 */
export function mapPageToQuoteSummary(page: PageObjectResponse): QuoteSummary {
  const props = page.properties

  return {
    id: page.id,
    title: getTitleProp(props, NOTION_PROPERTIES.ESTIMATES.TITLE),
    clientName: getTextProp(props, NOTION_PROPERTIES.ESTIMATES.CLIENT_NAME) ?? '',
    clientEmail: getEmailProp(props, NOTION_PROPERTIES.ESTIMATES.CLIENT_EMAIL),
    issueDate: getDateProp(props, NOTION_PROPERTIES.ESTIMATES.ISSUE_DATE) ?? '',
    validUntil: getDateProp(props, NOTION_PROPERTIES.ESTIMATES.VALID_UNTIL),
    status: toQuoteStatus(getSelectProp(props, NOTION_PROPERTIES.ESTIMATES.STATUS)),
    // 목록 조회 시 totalAmount는 항목 조회 없이 0으로 임시 설정
    totalAmount: 0,
  }
}

/** Notion 페이지와 견적 항목 목록으로 견적서(Quote)를 생성 */
export function mapPageToQuote(page: PageObjectResponse, items: QuoteItem[]): Quote {
  const props = page.properties

  return {
    id: page.id,
    title: getTitleProp(props, NOTION_PROPERTIES.ESTIMATES.TITLE),
    clientName: getTextProp(props, NOTION_PROPERTIES.ESTIMATES.CLIENT_NAME) ?? '',
    clientEmail: getEmailProp(props, NOTION_PROPERTIES.ESTIMATES.CLIENT_EMAIL),
    issueDate: getDateProp(props, NOTION_PROPERTIES.ESTIMATES.ISSUE_DATE) ?? '',
    validUntil: getDateProp(props, NOTION_PROPERTIES.ESTIMATES.VALID_UNTIL),
    status: toQuoteStatus(getSelectProp(props, NOTION_PROPERTIES.ESTIMATES.STATUS)),
    note: getTextProp(props, NOTION_PROPERTIES.ESTIMATES.NOTE),
    items,
  }
}

/** Notion 페이지를 견적 항목(QuoteItem)으로 변환 */
export function mapPageToQuoteItem(page: PageObjectResponse): QuoteItem {
  const props = page.properties

  // 연결된 견적서 ID (첫 번째 관계만 사용)
  const estimateIds = getRelationIds(props, NOTION_PROPERTIES.ITEMS.ESTIMATE_ID)

  return {
    id: page.id,
    estimateId: estimateIds[0] ?? '',
    itemName: getTitleProp(props, NOTION_PROPERTIES.ITEMS.ITEM_NAME),
    quantity: getNumberProp(props, NOTION_PROPERTIES.ITEMS.QUANTITY),
    unitPrice: getNumberProp(props, NOTION_PROPERTIES.ITEMS.UNIT_PRICE),
  }
}
