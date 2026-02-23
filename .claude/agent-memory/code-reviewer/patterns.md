# 프로젝트 코드 패턴 상세 노트

## lightweight-charts v5 타입 패턴

### 올바른 타입 사용법
```typescript
import type { CandlestickData, SeriesMarker, LineData, Time } from 'lightweight-charts'

// setData 타입
candleSeries.setData(data as CandlestickData<Time>[])
lineSeries.setData(data as LineData<Time>[])

// createSeriesMarkers 타입
createSeriesMarkers(series, markers as SeriesMarker<Time>[])
```

### 현재 프로젝트의 as any 위치
- CandlestickChart.tsx: candleSeries.setData, createSeriesMarkers, volumeSeries.setData
- EquityCurveChart.tsx: lineSeries.setData

## React Query 설정 현황

### QueryProvider 기본값
- staleTime: 5분 (300,000ms)
- retry: 1

### 개별 훅 설정
- useStockData: staleTime 5분 (기본값과 일치)
- useBacktest: staleTime 10분 (불일치 - 개선 필요)

## 환경변수 패턴

### 현재 하드코딩된 값 (수정 필요)
- lib/constants.ts: FASTAPI_BASE_URL = 'http://localhost:8000'

### 권장 패턴
```typescript
export const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL ?? 'http://localhost:8000'
```

## 컴포넌트 레이어별 핵심 파일

### Layer 1 (layout)
- AppShell, Header, Sidebar, ThemeToggle, ContentArea, PageHeader
- Sidebar: 현재 active 경로 강조 없음 (usePathname 미사용)
- AppShell + ContentArea: overflow-auto 중복 설정

### Layer 3 (composite)
- MetricCard: subValue + trend 둘 다 있어야 하위 요소 렌더링
- EmptyState: React 명시적 import 없이 React.ComponentType 참조

### Layer 4 (features)
- CandlestickChart: signals prop으로 백테스트/데모 두 용도 겸용
- BacktestPanel: useStockData + useBacktest 동시 호출 (HTTP 요청 2개)

## 날짜 계산 중복 패턴

두 컴포넌트에서 동일한 패턴 반복:
```typescript
// StockDemoPanel.tsx:24-27
// BacktestPanel.tsx:25-28
const days = PERIODS.find((p) => p.value === period)?.days ?? fallback
const today = new Date()
const from = format(subDays(today, days), 'yyyy-MM-dd')
const to = format(today, 'yyyy-MM-dd')
```

권장: lib/dates.ts 생성 후 calcDateRange(days) 유틸로 추출

## Python backtest.py 주의사항

### 알려진 코드 불명확성
```python
# line 163: holding = 0.0 설정
holding = 0.0
# line 167: holding이 0이므로 0 * price = 0 (의도는 맞으나 불명확)
final_value = capital + holding * float(work.iloc[-1]['close'])
# 권장: final_value = capital
```

### SMA 파라미터 변경 시 워밍업 조정 필요
- 현재: SMA_LONG=60, 워밍업=timedelta(days=130)
- 규칙: 워밍업 = SMA_LONG * 2 (캘린더일 기준)
