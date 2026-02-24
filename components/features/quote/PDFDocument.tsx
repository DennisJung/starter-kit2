'use client'

import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'
import type { Quote, IssuerInfo } from '@/lib/types'
import { formatCurrency, formatDate, calcSubtotal, calcTax, calcTotal } from '@/lib/formatters'

// ─── 한글 폰트 등록 ───────────────────────────────────────────────────────────

// TTF 폰트 파일을 public/fonts에 저장하여 사용 (woff2는 react-pdf 미지원)
Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src: '/fonts/NotoSansKR-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: '/fonts/NotoSansKR-Regular.ttf',
      fontWeight: 700,
    },
  ],
})

// ─── 스타일 정의 ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansKR',
    fontSize: 10,
    padding: 48,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  // 견적서 제목 섹션
  titleSection: {
    marginBottom: 24,
    borderBottom: '2px solid #1a1a1a',
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaLabel: {
    color: '#666666',
    marginRight: 4,
  },
  metaValue: {
    fontWeight: 700,
  },
  // 2단 정보 레이아웃 (발행자 / 수신자)
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 4,
  },
  infoBoxTitle: {
    fontSize: 9,
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    color: '#666666',
    width: 72,
  },
  infoValue: {
    flex: 1,
  },
  companyName: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
  },
  // 항목 테이블
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '8 10',
    fontWeight: 700,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '7 10',
    borderBottom: '1px solid #eeeeee',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  colName: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colUnit: { flex: 2, textAlign: 'right' },
  colSub: { flex: 2, textAlign: 'right' },
  // 합계 섹션
  summarySection: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    width: 240,
    justifyContent: 'space-between',
    marginBottom: 4,
    padding: '4 0',
  },
  summaryLabel: {
    color: '#666666',
  },
  summaryValue: {
    fontWeight: 700,
  },
  totalRow: {
    flexDirection: 'row',
    width: 240,
    justifyContent: 'space-between',
    borderTop: '2px solid #1a1a1a',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 700,
  },
  // 비고 섹션
  noteSection: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  noteSectionTitle: {
    fontSize: 9,
    color: '#888888',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  noteText: {
    color: '#444444',
    lineHeight: 1.6,
  },
})

// ─── PDF 문서 컴포넌트 ────────────────────────────────────────────────────────

interface PDFDocumentProps {
  quote: Quote
  issuer: IssuerInfo
}

export function PDFDocument({ quote, issuer }: PDFDocumentProps) {
  // 금액 계산
  const subtotal = calcSubtotal(quote.items)
  const tax = calcTax(subtotal)
  const total = calcTotal(subtotal, tax)

  return (
    <Document
      title={quote.title}
      author={issuer.companyName}
      subject='견적서'
    >
      <Page size='A4' style={styles.page}>

        {/* 견적서 제목 및 기본 정보 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{quote.title}</Text>
          <View style={styles.metaRow}>
            <Text>
              <Text style={styles.metaLabel}>발행일  </Text>
              <Text style={styles.metaValue}>{formatDate(quote.issueDate)}</Text>
            </Text>
            {quote.validUntil && (
              <Text>
                <Text style={styles.metaLabel}>  유효기한  </Text>
                <Text style={styles.metaValue}>{formatDate(quote.validUntil)}</Text>
              </Text>
            )}
          </View>
        </View>

        {/* 발행자 / 수신자 2단 정보 */}
        <View style={styles.infoGrid}>
          {/* 발행자 정보 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>발행자</Text>
            <Text style={styles.companyName}>{issuer.companyName}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>대표자</Text>
              <Text style={styles.infoValue}>{issuer.representative}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>사업자번호</Text>
              <Text style={styles.infoValue}>{issuer.businessNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주소</Text>
              <Text style={styles.infoValue}>{issuer.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>연락처</Text>
              <Text style={styles.infoValue}>{issuer.contact}</Text>
            </View>
          </View>

          {/* 수신자(클라이언트) 정보 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>수신자</Text>
            <Text style={styles.companyName}>{quote.clientName}</Text>
            {quote.clientEmail && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>이메일</Text>
                <Text style={styles.infoValue}>{quote.clientEmail}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 견적 항목 테이블 */}
        <View style={styles.table}>
          {/* 테이블 헤더 */}
          <View style={styles.tableHeader}>
            <Text style={styles.colName}>항목명</Text>
            <Text style={styles.colQty}>수량</Text>
            <Text style={styles.colUnit}>단가</Text>
            <Text style={styles.colSub}>소계</Text>
          </View>

          {/* 테이블 행 */}
          {quote.items.map((item, index) => (
            <View
              key={item.id}
              style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <Text style={styles.colName}>{item.itemName}</Text>
              <Text style={styles.colQty}>{item.quantity.toLocaleString()}</Text>
              <Text style={styles.colUnit}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.colSub}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>

        {/* 합계 섹션 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>소계</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>부가세 (10%)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>총합계</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* 비고 섹션 (있을 경우만 표시) */}
        {quote.note && (
          <View style={styles.noteSection}>
            <Text style={styles.noteSectionTitle}>비고</Text>
            <Text style={styles.noteText}>{quote.note}</Text>
          </View>
        )}

      </Page>
    </Document>
  )
}
