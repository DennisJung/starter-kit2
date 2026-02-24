import { FileText } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'Notion 견적서 뷰어' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-6 gap-3">
      {/* 로고 + 타이틀 */}
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">{title}</span>
      </div>

      {/* 우측 액션 영역 */}
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  )
}
