---
description: '성능 관점에서 React Query 캐시, useEffect 의존성, 불필요한 연산을 분석하고 최적화 방안을 제안합니다'
allowed-tools: ['Read(*)', 'Grep(*)', 'Glob(*)']
---

# Claude 명령어: Review Optimize

성능 관점에서 React Query 캐시 설정, useEffect 의존성 배열, 불필요한 연산, API 호출 효율성을 점검하고 최적화 방안을 제안합니다.

## 사용법

```
/review:optimize
```

## 체크 항목

### 1. React Query 캐시 설정

- `useBacktest.ts` vs `useStockData.ts`의 `staleTime` 불일치 여부
  - 동일 ticker/period로 두 훅을 동시 사용할 때 캐시 만료 시점이 달라 데이터 불일치 가능
- `gcTime` (구 `cacheTime`) 설정 여부 확인
- `enabled` 조건이 누락되어 불필요한 초기 요청이 발생하는지

### 2. useEffect 의존성 배열

- `CandlestickChart.tsx:123` — `signals` 객체 참조 변경 시 차트 전체 재생성 위험
  - 상위 컴포넌트에서 `signals` 배열이 매 렌더링마다 새 참조로 전달되는지 확인
  - `EquityCurveChart.tsx:77`도 동일한 `data` 의존성 문제
- `useEffect` 내부에서 chart 전체를 생성/제거하는 패턴 → `theme` 변경만으로도 전체 리마운트 발생 가능

### 3. 불필요한 연산 탐지

- `StockMetricsGrid.tsx:18-23` — `Math.max(...data.map(...))`, `reduce` 계산이 매 렌더링마다 실행
  - `useMemo` 적용 대상
- `BacktestMetricsGrid.tsx` — 메트릭 포맷팅 계산이 렌더링마다 반복되는지 확인

### 4. API 호출 효율성

- `BacktestPanel.tsx:30-31` — `useBacktest`와 `useStockData`를 동일 ticker/period로 동시 호출
  - 백엔드가 OHLCV 데이터를 포함해 응답하는지 확인 → 중복 호출 제거 가능성
- 워터폴 요청 패턴 탐지 (결과를 받아야 다음 요청을 보내는 순차 의존 구조)

### 5. 번들 사이즈

- `lightweight-charts` import 방식 확인 (`import * as` vs named import)
  - 현재: `import { CandlestickSeries, HistogramSeries, ... }` → named import이면 tree-shaking 가능
- 불필요한 전체 라이브러리 import 여부

## 프로세스

1. `hooks/` 하위 파일 읽기 → `staleTime`, `gcTime`, `enabled` 설정 비교
2. `CandlestickChart.tsx`, `EquityCurveChart.tsx` useEffect 의존성 배열 분석
3. `StockMetricsGrid.tsx`, `BacktestMetricsGrid.tsx` 연산 패턴 분석
4. `BacktestPanel.tsx` API 호출 구조 분석
5. `lightweight-charts` import 방식 확인
6. 문제 발견 시 **파일명:라인번호** + 최적화 방안 함께 제시
7. 예상 성능 임팩트 순위로 정렬하여 보고서 출력

## 출력 형식

```
## 성능 최적화 리뷰 결과

### 🔴 임팩트 높음 (즉시 적용 권장)
- CandlestickChart.tsx:123 — signals 의존성으로 매 렌더링마다 차트 전체 재생성
  → 상위에서 useMemo로 signals 안정화 또는 useRef로 이전 값과 비교 후 업데이트

### 🟡 임팩트 중간 (다음 이터레이션 권장)
- StockMetricsGrid.tsx:18-23 — Math.max, reduce 매 렌더링 실행
  → useMemo(() => ({ high, low, volume }), [data]) 로 래핑
- useBacktest.ts vs useStockData.ts — staleTime 불일치 (10분 vs 5분)
  → 두 훅의 staleTime을 동일하게 맞추거나 lib/constants.ts에 CACHE_TIME 상수 추출

### 🟢 임팩트 낮음 (참고)
- BacktestPanel.tsx:30-31 — 동일 데이터를 2개 API로 중복 요청 가능성 검토

총 X건 발견 (🔴 X건 / 🟡 X건 / 🟢 X건)
```

## 참고사항

- 리뷰만 수행하며 코드는 수정하지 않음
- 수정이 필요한 경우 별도로 사용자에게 확인 후 진행
- React 18 + Next.js 16 App Router 환경 기준으로 분석
- TanStack Query v5 API 기준 (`staleTime`, `gcTime`)
