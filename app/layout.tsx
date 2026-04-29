import type { Metadata } from 'next'
import { DM_Sans, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-num',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://drip-guide.vercel.app'),
  title: 'Drip Guide | ハンドドリップ計算機',
  description:
    'コーヒー豆のグラム数を入れるだけ。お湯の量・温度・蒸らし時間・挽き目が即座にわかる無料ハンドドリップ計算機。ホット・アイスコーヒーに対応。',
  keywords: ['ハンドドリップ', 'コーヒー計算機', 'ドリップ計算', 'アイスコーヒー', 'お湯の量', '挽き目'],
  openGraph: {
    title: 'Drip Guide | ハンドドリップ計算機',
    description:
      'コーヒー豆のグラム数を入れるだけ。お湯の量・温度・蒸らし時間・挽き目が即座にわかる無料ハンドドリップ計算機。',
    type: 'website',
    locale: 'ja_JP',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Drip Guide - Hand Drip Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drip Guide | ハンドドリップ計算機',
    description: 'コーヒー豆のグラム数を入れるだけでドリップレシピが即計算。',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Drip Guide',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${dmSans.variable} ${notoSansJP.variable}`}>
      <body>{children}</body>
    </html>
  )
}
