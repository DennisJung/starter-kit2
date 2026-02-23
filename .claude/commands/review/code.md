---
description: '코드 품질 관점에서 타입 안전성, 중복 코드, 레이어 의존성을 리뷰합니다'
allowed-tools: ['Read(*)', 'Grep(*)', 'Glob(*)']
---

# Claude 명령어: Review Code

코드 품질 관점에서 `as any` 사용, 중복 로직, 레이어 의존성 규칙 위반, 타입 안전성 문제를 점검합니다.

## 사용법

```
/review:code
```

## 체크 항목

### 1. `as any` 사용 탐지

- 프로젝트 전체에서 `as any` 패턴 검색
- 현재 알려진 위치: `CandlestickChart.tsx:75,87,101`, `EquityCurveChart.tsx:62`
- lightweight-charts v5 타입 불완전으로 인한 경우 → 커스텀 타입 정의로 해결 가능 여부 제안

### 2. 중복 코드 탐지

- `BacktestPanel.tsx` vs `StockDemoPanel.tsx` 날짜 계산 로직 비교
  - `subDays(today, days)` + `format()` 패턴이 두 파일에 동일하게 존재
  - 공통 훅 (`useDateRange`) 또는 유틸 함수로 추출 가능
- `useStockData.ts` vs `useBacktest.ts` 훅 구조 비교
  - `queryKey`, `enabled` 조건, `staleTime` 설정 패턴 유사성 확인

### 3. 5계층 의존성 규칙 검증

CLAUDE.md 기준:
```
Layer 1: layout / Layer 2: ui / Layer 3: composite / Layer 4: features / Layer 5: pages
```
- Layer 4 → Layer 4 직접 import 여부 확인
- 상위 레이어가 하위 레이어에만 의존하는지 import 경로 분석

### 4. 타입 안전성 체크

- 배열 인덱싱 전 길이 체크 누락 확인 (`data[data.length - 1]` 패턴)
- Optional chaining (`?.`) 미사용으로 런타임 에러 가능성 있는 위치
- `error.message` 직접 접근 (Error 타입 미확인)

## 프로세스

1. `as any` 전체 탐색 (`Grep`)
2. 날짜 계산 패턴 중복 탐색 (`subDays`, `format` 키워드)
3. 모든 `.tsx`, `.ts` 파일의 import 경로 분석 → 계층 위반 탐지
4. 배열 인덱싱 패턴 (`\[.*length.*-.*1\]`) 탐색 후 길이 체크 여부 확인
5. 문제 발견 시 **파일명:라인번호** 형태로 기록
6. 심각도 분류 + 리팩토링 방향 제안

## 출력 형식

```
## 코드 품질 리뷰 결과

### 🔴 즉시 수정 필요
- StockDemoPanel.tsx:32 — 배열 길이 체크 없이 ohlcv[ohlcv.length - 1] 접근

### 🟡 개선 권장
- CandlestickChart.tsx:75,87,101 — as any 사용 3건 (lightweight-charts v5 타입 문제)
- BacktestPanel.tsx:25-28 — StockDemoPanel.tsx:24-27 날짜 계산 로직 중복 → useDateRange 훅 추출 권장

### 🟢 참고 사항
- useStockData.ts, useBacktest.ts — 훅 구조 유사, 제네릭 훅으로 통합 가능

총 X건 발견 (🔴 X건 / 🟡 X건 / 🟢 X건)
```

## 참고사항

- 리뷰만 수행하며 코드는 수정하지 않음
- 수정이 필요한 경우 별도로 사용자에게 확인 후 진행
- 계층 구조 기준은 `CLAUDE.md` 및 `README.md`의 5계층 컴포넌트 구조를 따름
