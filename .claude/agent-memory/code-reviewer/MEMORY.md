# 코드 리뷰어 에이전트 메모리

## 프로젝트 개요
- 경로: /Users/dennis/workspace/courses/claude-nextjs-starters
- 스택: Next.js 16.1.6 + React 19 + TypeScript 5, Tailwind CSS v4, lightweight-charts v5, TanStack Query v5, FastAPI
- 상세 패턴: patterns.md 참조

## 자주 발생하는 이슈 (리뷰 체크리스트)

### 높은 빈도 이슈
1. `as any` 캐스팅 - lightweight-charts setData, createSeriesMarkers 호출부
   - 해결: `CandlestickData<Time>`, `SeriesMarker<Time>`, `LineData<Time>` 타입 활용
2. `FASTAPI_BASE_URL` 환경변수 미처리 (`lib/constants.ts:44`)
   - 해결: `process.env.FASTAPI_BASE_URL ?? 'http://localhost:8000'`
3. useTheme 초기값 'light' 하드코딩 - 다크모드 사용자 하이드레이션 불일치
4. staleTime 불일치: useStockData(5분) vs useBacktest(10분)
5. 날짜 계산 로직 중복: StockDemoPanel, BacktestPanel 동일 패턴

### 아키텍처 확인 포인트
- 5계층 의존성: Layer 4(features)가 Layer 3(composite)만 참조하는지 확인
- 현재까지 의존성 위반 없음 확인됨

### 백엔드 (backtest.py) 주의사항
- holding = 0.0 이후 final_value 계산에서 holding 재참조 패턴 (논리는 맞으나 코드 불명확)
- trade_count = 0 시 win_rate가 0.0으로 표시되는 UX 문제 (프론트엔드 분기 필요)
