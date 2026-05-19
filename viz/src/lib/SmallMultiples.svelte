<script>
  import { Plot, Line, RuleY, RuleX, AreaY, Text } from 'svelteplot'
  import { tweened } from 'svelte/motion'
  import { cubicInOut } from 'svelte/easing'

  let { corridor, scrollProgress = 1, showInterference = true, zoomInterference = false } = $props()

  const REGIONS = [
    { key: 'georgia',    label: 'Georgia',    color: '#2e7d44', textColor: '#2e7d44' },
    { key: 'azerbaijan', label: 'Azerbaijan', color: '#1a6e8a', textColor: '#1a6e8a' },
    { key: 'armenia',    label: 'Armenia',    color: '#c0392b', textColor: '#c0392b' }
  ]

  function regionData(key) {
    const keys = key === 'azerbaijan' ? ['azerbaijan', 'nagorno_karabakh'] : [key]
    const raw = corridor.filter(d => keys.includes(d.region))
    const byWeek = new Map()
    for (const d of raw) {
      const week = new Date(d.week)
      const k = week.getTime()
      if (!byWeek.has(k)) byWeek.set(k, { week, good: 0, bad: 0, total: 0 })
      const e = byWeek.get(k)
      e.good  += d.good
      e.bad   += d.bad
      e.total += d.total
    }
    return Array.from(byWeek.values())
      .map(d => ({ ...d, pct_bad: (d.bad / d.total) * 100 }))
      .sort((a, b) => a.week - b.week)
  }

  function buildData(key, progress) {
    const raw = regionData(key)
    const maxTotal = zoomInterference
      ? Math.max(...raw.map(d => d.bad), 1)
      : Math.max(...raw.map(d => d.total), 1)
    const visibleCount = Math.round(progress * raw.length)
    return {
      data: raw.slice(0, visibleCount).map(d => ({ ...d, pct_scaled: d.bad })),
      maxTotal
    }
  }


  let regions = $derived(
    [zoomInterference, scrollProgress] &&
    REGIONS.map(r => {
        const { data, maxTotal } = buildData(r.key, scrollProgress)
        return { ...r, data, maxTotal }
    })
    )

  const interferenceOpacity = tweened(0, { duration: 800, easing: cubicInOut })
  $effect(() => { interferenceOpacity.set(showInterference ? 1 : 0) })

  const zoomOpacity = tweened(0, { duration: 800, easing: cubicInOut })
  $effect(() => { zoomOpacity.set(zoomInterference ? 1 : 0) })

  let lineOpacity = $derived(1 - $zoomOpacity)

  const WAR_LINE = new Date('2022-02-24')
</script>

<div class="multiples-wrap">
  <div class="legend-row">
    <span class="leg-item" style="opacity:{lineOpacity}">
      <span class="leg-swatch" style="background:#1a1a1a"></span>
      Weekly flights
    </span>
    <span class="leg-item" style="opacity:{$interferenceOpacity}">
      <span class="leg-swatch" style="background:#c70e0e"></span>
      {zoomInterference ? 'Flights affected by GPS interference' : 'GPS interference'}
    </span>
  </div>

  <div class="grid">
    {#each regions as r}
      {@const peakInterference = r.data.reduce((peak, d) =>
        (!peak || d.pct_bad > peak.pct_bad) ? d : peak, null)}
      {@const peakAnnotation = showInterference && peakInterference
        ? [{ week: peakInterference.week, pct_scaled: peakInterference.pct_scaled,
             label: `${peakInterference.pct_bad.toFixed(1)}%: ${peakInterference.week.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}` }]
        : []}

      <div class="cell">
        <div class="cell-header">
          <span class="region-dot" style="background: {r.color}"></span>
          <span class="region-label" style="color:{r.textColor}">{r.label}</span>
        </div>

        <div class="plot-container">
          <Plot
            marginLeft={44}
            marginRight={10}
            marginTop={8}
            marginBottom={30}
            height={140}
            y={{
                domain: [0, r.maxTotal * 1.18],
                axis: null
            }}
            grid={false}
            >
            <RuleY data={[0]} />
            <RuleX
              data={[{ week: WAR_LINE }]}
              x="week"
              stroke="#bbb"
              strokeWidth={1}
              strokeDasharray="3,2"
            />
            {#if !zoomInterference}
                <Line
                    data={r.data}
                    x="week"
                    y="total"
                    stroke="#1a1a1a"
                    strokeWidth={1.5}
                    opacity={lineOpacity}
                />
            {/if}
            <AreaY
              data={r.data}
              x="week"
              y="pct_scaled"
              fill="#c70e0e"
              fillOpacity={zoomInterference ? 0.6 * $zoomOpacity : 0.15 * $interferenceOpacity}
              stroke="#c70e0e"
              strokeWidth={1.2}
              strokeOpacity={zoomInterference ? $zoomOpacity : $interferenceOpacity}
            />
            <Text
                data={peakAnnotation}
                x="week"
                y="pct_scaled"
                text="label"
                fontSize={9}
                fill="white"
                fillOpacity={zoomInterference ? $zoomOpacity : $interferenceOpacity}
                stroke="white"
                strokeWidth={4}
                textAnchor="middle"
                dy={-10}
                fontFamily="Helvetica Neue, Arial, sans-serif"
            />

            <Text
                data={peakAnnotation}
                x="week"
                y="pct_scaled"
                text="label"
                fontSize={9}
                fontWeight={700}
                fill="#c70e0e"
                fillOpacity={zoomInterference ? $zoomOpacity : $interferenceOpacity}
                textAnchor="middle"
                dy={-10}
                fontFamily="Helvetica Neue, Arial, sans-serif"
        
            />
          </Plot>
        </div>
      </div>
    {/each}
  </div>

  <p class="footnote">Source: <a href="https://gpsjam.org" target="_blank">GPSJam.org</a></p>
</div>

<style>
  .multiples-wrap {
    width: 100%;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }

  .legend-row {
    display: flex;
    gap: 1.25rem;
    margin-bottom: 0.6rem;
    font-size: 0.7rem;
    color: #555;
  }

  .leg-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    transition: opacity 0.8s ease;
  }

  .leg-swatch {
    display: inline-block;
    width: 18px;
    height: 3px;
    border-radius: 2px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.6rem 1rem;
  }

  .cell {
    position: relative;
    min-width: 0;
  }

  .cell-header {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.1rem;
  }

  .region-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .region-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .plot-container {
    position: relative;
  }

  .footnote {
    font-size: 0.62rem;
    color: #bbb;
    margin: 0.4rem 0 0;
    text-align: right;
  }

  .footnote a {
    color: #bbb;
    text-decoration: none;
    border-bottom: 1px solid #ddd;
  }

  .footnote a:hover { color: #666; }
</style>