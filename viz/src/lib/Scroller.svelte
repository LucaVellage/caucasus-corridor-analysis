<script>
  import Scroller from '@gka/svelte-scroller'
  import GlobeView from '$lib/GlobeView.svelte'
  import LineChart from '$lib/LineChart.svelte'
  import SmallMultiples from '$lib/SmallMultiples.svelte'

  let { countries, corridors, corridor, nagorno } = $props()

  let index    = $state(0)
  let offset   = $state(0)
  let progress = $state(0)

  const steps = [
    { globeStep: 0, title: 'January 2022', text: 'For most of aviation history, the shortest path from Europe to East Asia crossed Siberia, making Russian overflights the backbone of long-haul scheduling between the two continents. Flight records from a week in January 2022 show this corridor in use. Flights from Europe to Tokyo and Bangkok route directly across Russian territory.' },
    { globeStep: 1, title: 'January 2024', text: 'In February 2022, within days of Russia\'s invasion of Ukraine, European countries, the UK and other Western nations banned Russian aircraft from their airspace. Moscow responded accordingly and Russian airspace has remained close to Western airlines ever since. Flight records from a week in January 2024 show how traffic is rerouted through the Caucasus Corridor or around the other side of the world via the polar route.' },
    { globeStep: 2, title: 'March 2026', text: 'Intensifying conflict across the Middle East and Levant, particularly the war in Gaza and the exchanges between Iran and Israel in 2025, had already prompted temporary closures of Israeli, Lebanese and Iranian airspace in the years prior. Following American strikes on Iran in February 2026, the closure became indefinite, forcing carriers to reroute almost overnight. Flight records from a week in March 2026 show the result: traffic through the Caucasus Corridor squeezed between Russian airspace to the north and the closed Middle Eastern airspaces to the south. A secondary stream now bypasses the region entirely via Egypt and Saudi Arabia.' },
    { globeStep: 3, title: 'The Caucasus corridor', text: 'The Caucasus or Middle Corridor has remained open throughout the surrounding conflicts and is considered operationally safe by most international air traffic authorities. The term refers to a route crossing the Black Sea, continuing through Georgia and Azerbaijan, and in some routings via Armenia, before crossing the Caspian Sea toward Central Asia. At its narrowest point, the corridor measures approximately 136 km, bounded by Russian-controlled airspace to the north and Iranian airspace to the south, making it a critical chokepoint unlike any other in modern aviation history. (Source: <a href="https://big-europe.eu/publications/2026-05-05-the-caucasus-corridor-gamble" target="_blank">Brussels Institute for Geopolitics</a>)'},
    { globeStep: 4, title: 'Traffic surges', text: 'As Russian airspace closed, traffic through the Caucasus Corridor surged. The combined airspace over Georgia, Azerbaijan and Armenia handled around 30,000 flights per week on average in 2022. By 2024 that figure had nearly doubled to 55,000, and reached 57,000 in 2025. 2026 shows a decline to around 49,000 weekly flights, likely reflecting a gradual shift toward the southern route.' },
    { globeStep: 5, title: 'Interference',  text: 'As traffic through the corridor increased, so did recorded GPS interference events. In 2025 and 2026, an average of 9% of flights traversing the Caucasus Corridor reported GPS disturbances. This is three times the weekly interference rate recorded in 2024. Interference peaked in the week of January 12, 2026, when close to one in six flights over the corridor was affected by GPS interferences.' },
    { globeStep: 6, title: 'Across the region',  text: 'Each country in the corridor saw traffic grow substantially, with Georgia and Azerbaijan forming the main gateway. Weekly flights through Azerbaijani airspace more than doubled since 2022, peaking at a weekly average of 29,000 flights in 2025.', panel: 'multiples' },
    { globeStep: 7, title: 'Diverging routes', text: 'Armenian airspace, previously rather functioning as secondary route, has seen a sharp uptick this year. Weekly traffic has grown by 80% since the start of 2026, suggesting carriers are increasingly spreading across the corridor.', panel: 'multiples' },
    { globeStep: 9, title: 'Interference waves', text: 'GPS interference patterns differ across the three countries and correlate closely with the intensity of surrounding conflicts. Armenia recorded heightened GPS interferences already in 2022 and 2023, likely linked to radio jamming during the Nagorno-Karabakh conflict. Georgia and Azerbaijan saw interference rise sharply from 2024 and 2025 respectively. By 2026, Georgia records the highest sustained interference rate with a weekly average of 13.6% of flights affected. (Source: <a href="https://caucasuswatch.de/en/news/gps-interference-threatens-aviation-safety-azerbaijan-blames-russian-peacekeepers.html" target="_blank">Caucasus Watch</a>).', panel: 'multiples', zoomInterference: true },
   
  ]

  let step      = $derived(Math.min(index ?? 0, steps.length - 1))
  let fullMode  = $derived(steps[step].globeStep >= 3)
  let panelMode = $derived(steps[step].globeStep >= 4)

  let chartProgress = $derived(
    steps[step].globeStep === 4 ? offset :
    steps[step].globeStep >= 4 ? 1 : 0
  )

  let multMode = $derived(steps[step].panel === 'multiples')
  let multProgress = $derived(
    steps[step].globeStep >= 6 ? 1 : 0
  )
</script>

<Scroller top={0.1} bottom={0.9} threshold={0.5} bind:index bind:offset bind:progress>
  {#snippet background()}
    <div class="graphic" class:full={fullMode}>
      <div class="map-fill">
        <GlobeView
          {countries}
          {corridors}
          {nagorno}
          step={steps[step].globeStep}
        />
      </div>

      <!-- Single-chart side panel (steps 4–6) -->
      <div class="side-panel" class:visible={panelMode && !multMode}>
        <div class="panel-text">
          <div class="textbox active">
            <p class="step-label">0{step + 1}</p>
            <h3>{steps[step].title}</h3>
            <p>{@html steps[step].text}</p>
          </div>
        </div>
        <div class="panel-chart">
          <LineChart
            {corridor}
            showInterference={steps[step].globeStep >= 5}
            scrollProgress={chartProgress}
          />
        </div>
      </div>

      <!-- Small-multiples side panel -->
      <div class="side-panel side-panel--multiples" class:visible={multMode}>
        <div class="panel-text">
          <div class="textbox active">
            <p class="step-label">0{step + 1}</p>
            <h3>{steps[step].title}</h3>
            <p>{@html steps[step].text}</p>
          </div>
        </div>
        <div class="panel-chart panel-chart--multiples">
          <SmallMultiples
            {corridor}
            showInterference={true}
            scrollProgress={multProgress}
            zoomInterference={steps[step].zoomInterference ?? false}
          />
        </div>
      </div>


    </div>
  {/snippet}

  {#snippet foreground()}
    <div class="foreground">
      {#each steps as item, i}
        <section class="step" class:panel-step={item.globeStep >= 4}>
          <div class="textbox" class:active={i === step} class:hidden={item.globeStep >= 4}>
            <p class="step-label">0{i + 1}</p>
            <h3>{item.title}</h3>
            <p>{@html item.text}</p>
          </div>
        </section>
      {/each}
    </div>
  {/snippet}
</Scroller>

<style>
  .graphic {
    position: relative;
    height: 100vh;
    width: 55%;
    margin-left: 35%;
    overflow: hidden;
    background: #ffffff;
    transition: width 0.9s cubic-bezier(0.4, 0, 0.2, 1),
                margin-left 0.9s cubic-bezier(0.4, 0, 0.2, 1),
                transform 1.2s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .graphic.outro {
    transform: translateY(-100vh);
    opacity: 0;
  }

  .graphic.full {
    width: 100%;
    margin-left: 0;
  }

  .map-fill {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .side-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 48%;
    height: 100%;
    background: rgb(255, 255, 255);
    backdrop-filter: blur(6px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 2.5rem;
    box-sizing: border-box;
    transform: translateY(100%);
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    pointer-events: none;
  }

  .side-panel.visible {
    transform: translateY(0);
    pointer-events: auto;
  }

  .side-panel.visible {
    transform: translateX(0);
    pointer-events: auto;
  }

  .panel-text {
    flex: 0 0 auto;
    margin-bottom: 2.5rem;
  }

  .panel-chart {
    flex: 1 1 auto;
    min-height: 0;
  }

  /* textbox in panel — always active, no border needed */
  .side-panel .textbox {
    border-left: 2px solid #1a1a1a;
    padding: 1.25rem 1.5rem;
    opacity: 1;
    background: none;
    backdrop-filter: none;
    max-width: 100%;
  }


  .textbox {
    border-left: 2px solid #1a1a1a;
    padding: 1.25rem 1.5rem;
    opacity: 0.80;
    transition: opacity 0.5s ease;
    max-width: 450px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(4px);
  }

  .textbox.active { opacity: 1; }

  .textbox.hidden {
    opacity: 0;
    pointer-events: none;
  }


  .step.panel-step {
    pointer-events: none;
  }

  .step {
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 2rem 0 3rem;
  }

  .foreground {
    position: relative;
    z-index: 10;
    width: 35%;
    padding-left: 3rem;
  }

  .step-label {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: #999;
    margin: 0 0 0.5rem;
  }

  .textbox h3 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 0.75rem;
  }

  .textbox p {
    font-family: Georgia, serif;
    font-size: 0.95rem;
    line-height: 1.7;
    color: #444;
    margin: 0;
    text-align: justify;
    hyphens: auto;
  }

  .side-panel--multiples {
    width: 52%;
    padding: 2rem 2rem;
    justify-content: flex-start;
    padding-top: 2.5rem;
  }

  .panel-chart--multiples {
    overflow-y: visible;
  }


</style>