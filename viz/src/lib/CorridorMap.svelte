<script>
  import { Plot, Geo, Graticule } from 'svelteplot'

  let { countries, corridors } = $props()

  const RESTRICTED = ['760', '643', '804', '364']
  const FOCUS = ['268', '31', '51']

  // bounding box for corridor region
  const DOMAIN = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[[22, 32], [58, 32], [58, 52], [22, 52], [22, 32]]]
    }
  }

  let normalCountries = $derived(
    countries.features.filter(d =>
      !RESTRICTED.includes(String(d.id)) &&
      !FOCUS.includes(String(d.id))
    )
  )
  let restrictedCountries = $derived(
    countries.features.filter(d => RESTRICTED.includes(String(d.id)))
  )
  let focusCountries = $derived(
    countries.features.filter(d => FOCUS.includes(String(d.id)))
  )
  let corridorLines = $derived(
    corridors.features.filter(d => d.properties.date === '2026-03-16')
  )
</script>

<div class="map-wrap">
  <Plot
    projection={{ type: 'mercator', domain: DOMAIN }}
    height={(w) => w * 2.2}>
    <Graticule opacity={0.05} stroke="#fff" />
    <Geo data={normalCountries} fill="#a0b0bf" stroke="#fff" strokeWidth={0.5} />
    <Geo data={restrictedCountries} fill="#e37373" stroke="#fff" strokeWidth={0.5} />
    <Geo data={focusCountries} fill="#ffffff" stroke="#aaa" strokeWidth={0.5} />
    <Geo data={corridorLines} fill="transparent" stroke="#be185d" strokeWidth={1.5} opacity={0.15} />
  </Plot>
</div>

<style>
  .map-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>