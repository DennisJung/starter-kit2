import { Header } from './Header'

interface AppShellProps {
  children: React.ReactNode
}

/** 헤더 + 콘텐츠 영역으로 구성된 기본 레이아웃 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
