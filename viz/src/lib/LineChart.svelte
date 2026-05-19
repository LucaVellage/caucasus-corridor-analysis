<script>
  import { Plot, Line, RuleY, RuleX, AreaY, Text } from 'svelteplot'
  import { tweened } from 'svelte/motion'
  import { cubicInOut } from 'svelte/easing'

  let { corridor, showInterference = false, scrollProgress = 1 } = $props()

  const events = [
    {
      week: new Date('2022-02-24'),
      label: 'Russia closure',
      dx: 0,
      anchor: 'middle'
    },
    {
      week: new Date('2026-02-28'),
      label: 'Iran closure',
      dx: -4,
      anchor: 'end'
    }
  ]

  let allData = $derived(
    (() => {
      const byWeek = new Map()

      for (const d of corridor) {
        const week = new Date(d.week)
        const key = week.getTime()
        if (!byWeek.has(key)) {
          byWeek.set(key, { week, good: 0, bad: 0, total: 0 })
        }
        const entry = byWeek.get(key)
        entry.good  += d.good
        entry.bad   += d.bad
        entry.total += d.total
      }

      return Array.from(byWeek.values())
        .map(d => ({ ...d, pct_bad: (d.bad / d.total) * 100 }))
        .sort((a, b) => a.week - b.week)
    })()
  )

  let maxTotal = $derived(Math.max(...allData.map(d => d.total)))

  let visibleCount = $derived(Math.round(scrollProgress * allData.length))

  let data = $derived(
    allData.slice(0, visibleCount).map(d => ({
      ...d,
      pct_scaled: d.bad
    }))
  )

  let peakInterference = $derived(
    data.reduce((peak, d) => {
      if (!peak || d.pct_bad > peak.pct_bad) return d
      return peak
    }, null)
  )

  let peakAnnotation = $derived(
    showInterference && peakInterference
      ? [{
          week: peakInterference.week,
          pct_scaled: peakInterference.pct_scaled,
          label: `${peakInterference.pct_bad.toFixed(1)}% of flights affected\nweek of ${peakInterference.week.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
        }]
      : []
  )

  let visibleEndDate = $derived(data.at(-1)?.week)

  let visibleEvents = $derived(
    events.filter(event => visibleEndDate && event.week <= visibleEndDate)
  )

  const interferenceOpacity = tweened(0, { duration: 800, easing: cubicInOut })

  $effect(() => {
    interferenceOpacity.set(showInterference ? 1 : 0)
  })
</script>

<div class="chart-wrap">
  <div class="chart-block">
    <div class="axis-label left">Weekly flights</div>

    <div class="plot-container">
      <Plot marginLeft={50} marginRight={10} marginTop={26} marginBottom={40} height={280} yDomain={[0, maxTotal]} grid={false}>
        <RuleY data={[0]} />
        {#each visibleEvents as event}
          <RuleX
            data={[event]}
            x="week"
            stroke="#aaa"
            strokeWidth={1}
            strokeDasharray="4,3"
          />
          <Text
            data={[event]}
            x="week"
            y={maxTotal}
            text="label"
            fontSize={9}
            fill="#777"
            textAnchor={event.anchor}
            dx={event.dx}
            dy={-8}
            fontFamily="Helvetica Neue, Arial, sans-serif"
          />
        {/each}
        <Line
          data={data}
          x="week"
          y="total"
          stroke="#1a1a1a"
          strokeWidth={2}
        />
        <AreaY
          data={data}
          x="week"
          y="pct_scaled"
          fill="#c70e0e"
          fillOpacity={0.18 * $interferenceOpacity}
          stroke="#c70e0e"
          strokeWidth={1.5}
          strokeOpacity={$interferenceOpacity}
        />
        <Text
          data={peakAnnotation}
          x="week"
          y="pct_scaled"
          text="label"
          fontSize={10}
          fill="#c70e0e"
          fillOpacity={$interferenceOpacity}
          textAnchor="middle"
          dx={-20}
          dy={-20}
          fontFamily="Helvetica Neue, Arial, sans-serif"
        />
      </Plot>
    </div>
  </div>

  <div class="legend">
    <span class="legend-item black">
      <span class="swatch"></span> Weekly flights
    </span>
    {#if showInterference}
      <span class="legend-item pink" style="opacity: {$interferenceOpacity}">
        <span class="swatch"></span> Flights affected by GPS interference
      </span>
    {/if}
  </div>
</div>

<p class="footnote">Source: <a href="https://gpsjam.org" target="_blank">GPSJam.org</a></p>

<style>
  .chart-wrap {
    width: 100%;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }

  .chart-block {
    position: relative;
  }

  .plot-container {
    position: relative;
  }

  .axis-label {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #888;
    margin: 0 0 0.55rem;
    transform: translateY(-6px);
  }

  .axis-label.left {
    text-align: left;
    color: #1a1a1a;
  }

  .legend {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.75rem;
    font-size: 0.75rem;
    color: #555;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: opacity 0.8s ease;
  }

  .swatch {
    display: inline-block;
    width: 20px;
    height: 3px;
    border-radius: 2px;
  }

  .legend-item.black .swatch { background: #1a1a1a; }
  .legend-item.pink  .swatch { background: #c70e0e; }

  .footnote {
    font-size: 0.65rem;
    color: #aaa;
    margin: 0.5rem 0 0;
    text-align: right;
  }

  .footnote a {
    color: #aaa;
    text-decoration: none;
    border-bottom: 1px solid #ddd;
  }

  .footnote a:hover {
    color: #555;
  }
</style>