'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  // SSR 환경에서는 false로 초기화, 브라우저 환경에서는 즉시 실제 값으로 초기화
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    // query 변경 시 최신 값으로 업데이트
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
