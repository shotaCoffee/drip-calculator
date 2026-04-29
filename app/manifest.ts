import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Drip Guide - ハンドドリップ計算機',
    short_name: 'Drip Guide',
    description: 'コーヒー豆のグラム数を入れるだけでドリップレシピが即計算',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f0e8',
    theme_color: '#8b5c2a',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
