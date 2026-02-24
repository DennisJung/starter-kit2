'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link2, Check } from 'lucide-react'

interface ShareLinkButtonProps {
  quoteId: string
}

/** 견적서 공유 링크 복사 버튼 — 클립보드에 URL 복사 후 2초간 완료 상태 표시 */
export function ShareLinkButton({ quoteId }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // TODO: 토스트 알림 추가 (Task 005에서 통합 가능)
    const url = window.location.origin + '/quotes/' + quoteId
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleCopy}
      className='gap-1.5'
    >
      {copied ? (
        <>
          <Check className='h-3.5 w-3.5' />
          복사됨!
        </>
      ) : (
        <>
          <Link2 className='h-3.5 w-3.5' />
          링크 복사
        </>
      )}
    </Button>
  )
}
