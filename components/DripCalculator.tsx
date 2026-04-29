'use client'

import { useState, useRef, useCallback } from 'react'

type Mode = 'hot' | 'ice'
type Strength = 'strong' | 'balance' | 'light'

interface HotRecipe {
  waterRatio: number
  bloom: number
  grind: string
  temp: number
}

interface IceRecipe {
  waterRatio: number
  iceRatio: number
  bloom: number
  grind: string
  temp: number
}

const RECIPES = {
  hot: {
    strong:  { waterRatio: 13, bloom: 40, grind: 'やや細挽き', temp: 91 } satisfies HotRecipe,
    balance: { waterRatio: 15, bloom: 30, grind: '中挽き',     temp: 92 } satisfies HotRecipe,
    light:   { waterRatio: 17, bloom: 25, grind: 'やや粗挽き', temp: 93 } satisfies HotRecipe,
  },
  ice: {
    strong:  { waterRatio: 8,  iceRatio: 0.8, bloom: 30, grind: '細挽き',     temp: 95 } satisfies IceRecipe,
    balance: { waterRatio: 9,  iceRatio: 1.0, bloom: 25, grind: 'やや細挽き', temp: 95 } satisfies IceRecipe,
    light:   { waterRatio: 10, iceRatio: 1.2, bloom: 20, grind: '中挽き',     temp: 96 } satisfies IceRecipe,
  },
} as const

const GRIND_PCT: Record<string, number> = {
  '細挽き': 15,
  'やや細挽き': 35,
  '中挽き': 55,
  'やや粗挽き': 75,
  '粗挽き': 95,
}

const MAX_WATER = 100 * 17
const MAX_ICE   = 100 * 10 * 1.5
const STRENGTH_KEYS = ['strong', 'balance', 'light'] as const

function clampPct(n: number) {
  return Math.min(100, Math.max(2, n))
}

interface ResultRowProps {
  icon: string
  label: string
  value: number
  unit: string
  pct: number
  sub?: string
}

function ResultRow({ icon, label, value, unit, pct, sub }: ResultRowProps) {
  return (
    <div className="result-item result-item-full">
      <div className="result-left">
        <span className="result-icon" aria-hidden="true">{icon}</span>
        <div>
          <span className="result-label">{label}</span>
          {sub && <span className="result-sub">{sub}</span>}
        </div>
        <div className="result-value-wrap">
          <span className="result-value">{value}</span>
          <span className="result-unit"> {unit}</span>
        </div>
      </div>
      <div className="gauge-wrap" role="presentation">
        <div className="gauge-bar" style={{ width: `${clampPct(pct)}%` }} />
      </div>
    </div>
  )
}

interface GrindRowProps {
  grind: string
}

function GrindRow({ grind }: GrindRowProps) {
  const pct = GRIND_PCT[grind] ?? 50
  return (
    <div className="result-item result-item-full">
      <div className="result-left">
        <span className="result-icon" aria-hidden="true">⚙️</span>
        <div>
          <span className="result-label">挽き目の目安</span>
        </div>
        <div className="result-value-wrap">
          <span className="grind-value">{grind}</span>
        </div>
      </div>
      <div className="gauge-wrap" role="presentation">
        <div className="gauge-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function DripCalculator() {
  const [mode, setMode] = useState<Mode>('hot')
  const [strength, setStrength] = useState<Strength>('balance')
  const [grams, setGrams] = useState<string>('')
  const strengthRef = useRef<HTMLDivElement>(null)

  const g = parseFloat(grams)
  const hasValue = !isNaN(g) && g > 0
  const outOfRange = grams !== '' && !isNaN(parseFloat(grams)) && (parseFloat(grams) < 1 || parseFloat(grams) > 100)
  const r = RECIPES[mode][strength]

  const handleStrengthKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = STRENGTH_KEYS
    const idx = items.indexOf(strength)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = items[(idx + 1) % items.length]
      setStrength(next)
      const btns = strengthRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      btns?.[(idx + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = items[(idx - 1 + items.length) % items.length]
      setStrength(prev)
      const btns = strengthRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      btns?.[(idx - 1 + items.length) % items.length]?.focus()
    }
  }, [strength])

  return (
    <div className="app">
      <header className="header">
        <div className="header-icon" aria-hidden="true">☕</div>
        <h1>Drip Guide</h1>
        <p>Hand Drip Calculator</p>
      </header>

      <main>
        <div className={`card mode-${mode}`} id="card">
          {/* Mode Tabs */}
          <div className="mode-tabs" role="tablist" aria-label="抽出モード">
            {(['hot', 'ice'] as const).map((m) => (
              <button
                key={m}
                id={`tab-${m}`}
                role="tab"
                aria-selected={mode === m}
                aria-controls="tabpanel-results"
                data-mode={m}
                className={`mode-tab${mode === m ? ' active' : ''}`}
                onClick={() => setMode(m)}
              >
                <span className="tab-emoji" aria-hidden="true">
                  {m === 'hot' ? '☕' : '🧊'}
                </span>
                {m === 'hot' ? 'ホット' : 'アイス'}
              </button>
            ))}
          </div>

          {/* Bean input */}
          <section className="input-section">
            <label className="input-label" htmlFor="beanInput">
              豆の量
            </label>
            <div className="input-row">
              <span className="bean-icon" aria-hidden="true">🫘</span>
              <input
                id="beanInput"
                type="number"
                inputMode="numeric"
                enterKeyHint="done"
                autoComplete="off"
                placeholder="15"
                min={1}
                max={100}
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                aria-label="コーヒー豆のグラム数"
                aria-describedby={outOfRange ? 'input-error' : undefined}
              />
              <span className="input-unit">グラム</span>
            </div>
            {outOfRange && (
              <p id="input-error" className="input-error" role="alert">
                1〜100gで入力してください
              </p>
            )}
          </section>

          {/* Strength */}
          <section className="strength-section">
            <span className="strength-label" id="strength-label">強さ</span>
            <div
              className="strength-tabs"
              role="radiogroup"
              aria-labelledby="strength-label"
              ref={strengthRef}
              onKeyDown={handleStrengthKeyDown}
            >
              {([
                { key: 'strong',  emoji: '🔥', label: '濃いめ' },
                { key: 'balance', emoji: '✨', label: 'バランス' },
                { key: 'light',   emoji: '💧', label: 'すっきり' },
              ] as const).map(({ key, emoji, label }) => (
                <button
                  key={key}
                  data-strength={key}
                  className={`strength-tab${strength === key ? ' active' : ''}`}
                  onClick={() => setStrength(key)}
                  role="radio"
                  aria-checked={strength === key}
                  tabIndex={strength === key ? 0 : -1}
                >
                  <span className="strength-emoji" aria-hidden="true">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </section>

          <div className="divider" />

          {/* Results */}
          <section
            id="tabpanel-results"
            role="tabpanel"
            aria-labelledby={`tab-${mode}`}
            className={`results${!hasValue ? ' empty' : ''}`}
            aria-live="polite"
          >
            {!hasValue ? (
              <p className="empty-hint">豆のグラム数を入力してください</p>
            ) : mode === 'hot' ? (
              <>
                <ResultRow
                  icon="💧"
                  label="お湯の量"
                  value={Math.round(g * r.waterRatio)}
                  unit="ml"
                  pct={(Math.round(g * r.waterRatio) / MAX_WATER) * 100}
                />
                <ResultRow
                  icon="🌡️"
                  label="お湯の温度"
                  value={r.temp}
                  unit="°C"
                  pct={((r.temp - 85) / 15) * 100}
                />
                <ResultRow
                  icon="⏱️"
                  label="蒸らし時間"
                  value={r.bloom}
                  unit="秒"
                  pct={(r.bloom / 45) * 100}
                  sub={`蒸らしお湯 約${Math.round(g * 2.5)}ml`}
                />
                <GrindRow grind={r.grind} />
              </>
            ) : (
              <>
                {(() => {
                  const iceR = r as IceRecipe
                  const water = Math.round(g * iceR.waterRatio)
                  const ice   = Math.round(water * iceR.iceRatio)
                  return (
                    <>
                      <ResultRow
                        icon="💧"
                        label="お湯の量"
                        value={water}
                        unit="ml"
                        pct={(water / MAX_WATER) * 100}
                      />
                      <ResultRow
                        icon="🧊"
                        label="氷の量"
                        value={ice}
                        unit="g"
                        pct={(ice / MAX_ICE) * 100}
                        sub={`合計液量 約${water + ice}ml`}
                      />
                      <ResultRow
                        icon="🌡️"
                        label="お湯の温度"
                        value={iceR.temp}
                        unit="°C"
                        pct={((iceR.temp - 85) / 15) * 100}
                      />
                      <ResultRow
                        icon="⏱️"
                        label="蒸らし時間"
                        value={iceR.bloom}
                        unit="秒"
                        pct={(iceR.bloom / 45) * 100}
                      />
                      <GrindRow grind={iceR.grind} />
                    </>
                  )
                })()}
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">HAND DRIP GUIDE · ベストプラクティス計算機</footer>
    </div>
  )
}
