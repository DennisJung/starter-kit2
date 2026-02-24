import { Skeleton } from '@/components/ui/skeleton'

interface LoadingOverlayProps {
  rows?: number
}

/** 목록 로딩 스켈레톤 */
export function LoadingOverlay({ rows = 4 }: LoadingOverlayProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
