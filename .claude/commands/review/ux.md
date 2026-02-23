---
description: 'UI/UX 관점에서 컴포넌트 상태 처리, 접근성, 모바일 대응을 리뷰합니다'
allowed-tools: ['Read(*)', 'Grep(*)', 'Glob(*)']
---

# Claude 명령어: Review UX

UI/UX 관점에서 컴포넌트의 로딩/에러/빈 상태 처리, 메트릭 표시 일관성, 모바일 레이아웃, 접근성을 점검합니다.

## 사용법

```
/review:ux
```

## 체크 항목

### 1. 로딩 / 에러 / 빈 상태 처리

- 모든 차트·패널에 `isLoading`, `error`, `data.length === 0` 분기가 존재하는지
- `error.message` 직접 접근 여부 → `error instanceof Error ? error.message : '알 수 없는 오류'` 패턴 필요
- Skeleton 컴포넌트 높이가 실제 콘텐츠 높이와 일치하는지

### 2. 메트릭 표시 일관성

- 데이터 없을 때 `0` vs `"-"` 표시가 컴포넌트 간 통일되어 있는지
- `BacktestMetricsGrid` vs `StockMetricsGrid` 폴백 값 비교

### 3. 모바일 레이아웃

- `hidden sm:block`으로 숨겨진 정보가 모바일 사용자에게 대체 UI 없이 완전히 사라지는지
- 컨트롤 바(`flex-wrap`)에서 버튼이 모바일에서 잘리거나 줄바꿈 시 의도대로 동작하는지

### 4. 접근성

- 아이콘만 있는 버튼에 `aria-label` 누락 여부
- 기간 선택 버튼 그룹에 `role="group"` + `aria-label` 여부
- 차트 컨테이너에 시각 장애인을 위한 대체 텍스트 존재 여부

## 프로세스

1. `components/` 하위 전체 `.tsx` 파일 목록 확인
2. 각 체크 항목별로 관련 파일 읽기 및 패턴 탐색
3. 문제 발견 시 **파일명:라인번호** 형태로 기록
4. 심각도 분류 (🔴 높음 / 🟡 중간 / 🟢 낮음)
5. 리뷰 보고서 출력

## 출력 형식

```
## UI/UX 리뷰 결과

### 🔴 즉시 수정 필요
- BacktestPanel.tsx:81 — error.message 타입 미확인 접근

### 🟡 개선 권장
- BacktestMetricsGrid.tsx:10 — 데이터 없을 때 "0" 표시, StockMetricsGrid는 "-" 사용 (불일치)
- BacktestPanel.tsx:58 — SMA 정보가 모바일에서 숨겨짐 (hidden sm:block), 대체 UI 없음

### 🟢 참고 사항
- CandlestickChart — 차트에 접근성 대체 텍스트 없음 (aria-label 추가 권장)

총 X건 발견 (🔴 X건 / 🟡 X건 / 🟢 X건)
```

## 참고사항

- 리뷰만 수행하며 코드는 수정하지 않음
- 수정이 필요한 경우 별도로 사용자에게 확인 후 진행
- 이 프로젝트의 컴포넌트 계층은 `CLAUDE.md` 5계층 구조를 기준으로 함
