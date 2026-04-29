import DripCalculator from '@/components/DripCalculator'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Drip Guide',
  description: 'コーヒー豆のグラム数を入れるだけでお湯の量・温度・蒸らし時間・挽き目が即座にわかる無料ハンドドリップ計算機',
  url: 'https://drip.shota.coffee',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  inLanguage: 'ja',
  isAccessibleForFree: true,
  featureList: ['ホット/アイス対応', '強さ3段階', '蒸らし時間表示', '挽き目の目安'],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DripCalculator />
    </>
  )
}
