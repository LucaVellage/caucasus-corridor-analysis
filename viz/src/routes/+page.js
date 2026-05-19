import { csvParse, autoType } from 'd3-dsv'
import { group } from 'd3-array'
import { feature } from 'topojson-client'


export async function load({ fetch }) {
  const [csvRes, topoRes, corridorRes, nagornoRes] = await Promise.all([
    fetch('/data/corridors.csv'),
    fetch('/data/world-110m.json'),
    fetch('/data/gnss_weekly.csv'), 
    fetch('/data/nagorno.geojson')
  ])
  const rows = csvParse(await csvRes.text(), autoType)
  const topo = await topoRes.json()
  const nagorno = await nagornoRes.json()

  // DEBUG
  console.log(topo.objects.countries.geometries.slice(0, 10))

  const grouped = group(rows, d => d.route_id)

  const features = []

  function isoDate(value) {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10)
    }

    return String(value).slice(0, 10)
  }

  for (const [route_id, pts] of grouped) {
    const sorted = [...pts].sort(
      (a, b) => a.waypoint_index - b.waypoint_index
    )

    const coordinates = sorted
      .map(d => [Number(d.lon), Number(d.lat)])
      .filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat))

    if (coordinates.length < 2) continue

    features.push({
      type: 'Feature',
      properties: {
        route_id,
        date: isoDate(sorted[0].query_date),
        route_pair: sorted[0].route_pair,
        n_flights: sorted[0].n_flights,
        corridor_id: sorted[0].corridor_id
      },
      geometry: {
        type: 'LineString',
        coordinates
      }
    })
  }

  const corrRows = csvParse(await corridorRes.text(), autoType)

  return {
    corridors: { type: 'FeatureCollection', features },
    countries: feature(topo, topo.objects.countries),
    corridor: corrRows, 
    nagorno
  }
}  
