<script>
  import { Plot, Geo, Graticule, Sphere, Dot, Text } from 'svelteplot'
  import { geoOrthographic } from 'd3-geo'
  import { tweened } from 'svelte/motion'
  import { cubicInOut } from 'svelte/easing'
  import { untrack } from 'svelte'




  let { countries, corridors, step = 0, nagorno } = $props()

  const DATES = ['2022-01-17', '2024-01-15', '2026-03-16', '2026-03-16', '2026-03-16', '2026-03-16', '2026-03-16', '2026-03-16', '2026-03-16', '2026-03-16', '2026-03-16']

  const RESTRICTED = {
    0: ['760'],
    1: ['760', '643', '804'],
    2: ['760', '643', '804', '364'],
    3: ['760', '643', '804', '364'],
    4: ['760', '643', '804', '364'],
    5: ['760', '643', '804', '364'],
    6: ['760', '643', '804', '364'],
    7: ['760', '643', '804', '364'],
    8: ['760', '643', '804', '364'],
    9: ['760', '643', '804', '364'], 
    10: ['760', '643', '804', '364']
  }

  const FOCUS = {
    0: [], 1: [], 2: [],
    3: ['268', '031', '051'],
    4: ['268', '031', '051'],
    5: ['268', '031', '051'],
    6: ['268', '031', '051'],
    7: ['268', '031', '051'],
    8: ['268', '031', '051'],
    9: ['268', '031', '051'],
    10: ['268', '031', '051'] 

  }

  const VIEWS = [

    { lon: 55, lat: 45, zoom: 0.95 },
    { lon: 62, lat: 35, zoom: 0.95 },
    { lon: 62, lat: 35, zoom: 0.95 },
    { lon: 33, lat: 38, zoom: 3.0  },
    { lon: 33, lat: 38, zoom: 3.0  },
    { lon: 33, lat: 38, zoom: 3.0  },
    { lon: 33, lat: 38, zoom: 3.0  },
    { lon: 33, lat: 38, zoom: 3.0  },  
    { lon: 33, lat: 38, zoom: 3.0  },
    { lon: 33, lat: 38, zoom: 3.0 } 
  ]
  

  const AIRPORTS = [
    { iata: 'FRA', lon: 8.5706,   lat: 50.0333 },
    { iata: 'LHR', lon: -0.4543,  lat: 51.4775 },
    { iata: 'CDG', lon: 2.5479,   lat: 49.0097 },
    { iata: 'AMS', lon: 4.7634,   lat: 52.3086 },
    { iata: 'HEL', lon: 24.9633,  lat: 60.3172 },
    { iata: 'HND', lon: 139.7798, lat: 35.5494 },
    { iata: 'PVG', lon: 121.8050, lat: 31.1443 },
    { iata: 'HKG', lon: 113.9145, lat: 22.3080 },
    { iata: 'BKK', lon: 100.7501, lat: 13.6811 },
    { iata: 'SIN', lon: 103.9915, lat:  1.3644 },
    { iata: 'DEL', lon: 77.0688,  lat: 28.5562 }
  ]


  const lon     = tweened(VIEWS[0].lon,  { duration: 900,  easing: cubicInOut })
  const lat     = tweened(VIEWS[0].lat,  { duration: 900,  easing: cubicInOut })
  const zoom    = tweened(VIEWS[0].zoom, { duration: 1100, easing: cubicInOut })
  const fadeOut = tweened(0, { duration: 500, easing: cubicInOut })
  const fadeIn  = tweened(1, { duration: 500, easing: cubicInOut })

  let displayStep = $state(0)
  let fadingStep  = $state(0)

  const colorOpacity = tweened(0, { duration: 800, easing: cubicInOut })
  $effect(() => { colorOpacity.set(step >= 7 ? 1 : 0) })

  $effect(() => {
    const newStep = step
    untrack(() => {
      fadingStep  = displayStep
      displayStep = newStep
    })
    fadeOut.set(1, { duration: 0 })
    fadeOut.set(0, { duration: 500 })
    fadeIn.set(0,  { duration: 0 })
    fadeIn.set(1,  { duration: 500 })
    lon.set(VIEWS[newStep].lon)
    lat.set(VIEWS[newStep].lat)
    zoom.set(VIEWS[newStep].zoom)
  })



  let restrictedIds = $derived(RESTRICTED[displayStep] ?? [])
  let focusIds      = $derived(FOCUS[displayStep] ?? [])
  let corridorOpacity = $derived(displayStep >= 3 ? 0.15 : 1)

  let normalCountries = $derived(
    countries.features.filter(d =>
      !restrictedIds.includes(d.id) &&
      !focusIds.includes(d.id) 
    )
  )

  let restrictedCountries = $derived(
    countries.features.filter(d => restrictedIds.includes(d.id))
  )

  let focusCountries = $derived(
    countries.features.filter(d =>
      focusIds.includes(d.id) 
    )
  )

  let fadingFeatures = $derived(
    corridors.features.filter(d => d.properties.date === DATES[fadingStep])
  )
  let activeFeatures = $derived(
    corridors.features.filter(d => d.properties.date === DATES[displayStep])
  )
</script>

<div class="globe-wrap">
  <Plot
    projection={{
      type: ({ width, height }) =>
        geoOrthographic()
          .translate([width * 0.5, height * 0.5])
          .scale(Math.min(width, height) * 0.48 * $zoom)
          .rotate([-$lon, -$lat])
    }}
    height={(w) => w}>
    <Sphere fill="#c8dff0" />
    <Graticule opacity={0.1} stroke="#ffffff" />
    <Geo data={normalCountries} fill="#a0b0bf" stroke="#fff" strokeWidth={0.5} />
    <Geo data={restrictedCountries} fill="#df9797" stroke="#fff" strokeWidth={0.5} />
    <Geo data={focusCountries} fill="#ffffff" stroke="#aaa" strokeWidth={0.5} />
    <Geo data={focusCountries.filter(d => d.id === '268')} fill="#2e7d44" stroke="#fff" strokeWidth={0.5} opacity={$colorOpacity} />
    <Geo data={focusCountries.filter(d => d.id === '031')} fill="#1a6e8a" stroke="#fff" strokeWidth={0.5} opacity={$colorOpacity} />
    <Geo data={focusCountries.filter(d => d.id === '051')} fill="#c0392b" stroke="#fff" strokeWidth={0.5} opacity={$colorOpacity} />
    <Geo data={fadingFeatures} fill="transparent" stroke="#be185d" strokeWidth={2} opacity={$fadeOut * corridorOpacity} />
    <Geo data={activeFeatures} fill="transparent" stroke="#be185d" strokeWidth={2} opacity={$fadeIn * corridorOpacity} />
    <Dot data={AIRPORTS} x="lon" y="lat" fill="#1a1a1a" stroke="#fff" strokeWidth={2} r={3} />
    <Text data={AIRPORTS} x="lon" y="lat" text="iata" fontSize={11} fill="#fff" dx={6} dy={1} fontWeight={700} fontFamily="Helvetica Neue, Arial, sans-serif" />
    <Text data={AIRPORTS} x="lon" y="lat" text="iata" fontSize={11} fill="#1a1a1a" dx={6} dy={1} fontWeight={600} fontFamily="Helvetica Neue, Arial, sans-serif" />
  </Plot>
</div>

<style>
  .globe-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgb(255, 255, 255);
  }
</style>