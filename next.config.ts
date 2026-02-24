import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // lucide-react 트리쉐이킹 최적화 — 번들 사이즈 감소
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
