<!-- +page.svelte -->
<script>
  import StoryScroller from '$lib/Scroller.svelte'
  let { data } = $props()
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&display=swap" rel="stylesheet">
</svelte:head>

<div class="container">
  <section class="intro">
    <span class="eyebrow">Aviation & Geopolitics</span>
    <h1>Through the Eye of the Needle</h1>
    <p class="lede">Regional conflicts have funneled the world's busiest air corridor into a single narrow passage. Nearly all flights between Europe and Asia now thread through the Caucasus - a geographic chokepoint located between war zones.</p>
    <p class="byline">Luca Vellage · May 19, 2026</p>
    <p class="paragraph">The closure of Russian airspace after the invasion of Ukraine in 2022, and the subsequent intensification of conflict across the Middle East and Levant, pushed airlines onto a new path east: the Caucasus Corridor, threading above the Black Sea, Georgia and Azerbaijan. Despite remaining the safest corridor to cross from Europe to Asia, it is not without risk: The same conflicts that pushed traffic southward have also turned the region into one of the most GPS-disrupted airspaces.</p>
    <p class="paragraph">Sampled flight records from January 2022, January 2024, and March 2026 illustrate how European carriers progressively rerouted their Asia traffic as the airspace landscape changed. Read more about the methodology <a href="#methodology">here.</a></p>
  </section>
</div>

<StoryScroller
  countries={data.countries}
  corridors={data.corridors}
  corridor={data.corridor}

/>

<div class="container">
  <section class="body-section">
    <p class="paragraph">GPS jamming has established itself as a standard instrument of modern electronic warfare, routinely deployed in and around active conflict zones to disrupt drone and missile navigation. By overpowering satellite navigation signals with radio frequency interference, jammers feed aircraft receivers false position data, causing sudden, erroneous shifts in an aircraft's transmitted GPS location. Its effects extend well beyond the battlefield to civilian airspace in conflict-adjacent regions, as <a href="https://lucavellage.github.io/gnss-interference-analysis/" target="_blank">previously reported</a>. The sustained interference patterns observed in Georgia are another case in point. Situated directly south of Russia and bordering NATO-aligned states, Georgia sits at a geopolitical hotspot, making it susceptible for military-driven GPS jamming.</p>
    <p class="paragraph">What makes interference particularly dangerous in the Caucasus Corridor is the combination of high traffic density, narrow airspace, and limited diversion options. A flight entering Georgian airspace with a fully functional navigation system may encounter interference mid-route with limited ability to divert, as the corridor offers fewer alternate airfields than most comparable routes. With no viable alternative corridor available, the question for airlines and air traffic controllers is no longer whether interference will occur, but how to manage it when it does..</p>
  </section>
</div>

<div class="container">
  <section class="outro">
    <details id="methodology" class="methodology">
      <summary>Methodology</summary>
      <div class="methodology-body">
        <p>Flight corridor data was sampled from ADS-B records for three representative weeks in January 2022, January 2024, and March 2026, illustrating how European carriers progressively rerouted Asia-bound traffic as the airspace landscape changed. GPS interference data is sourced from <a href="https://gpsjam.org" target="_blank">GPSJam.org</a>, which aggregates aircraft reporting medium to high GPS interference per week.</p>
        <p>Regional breakdowns were produced by assigning each flight record to a country based on its geographic coordinates. All analysis covers the Caucasus corridor countries: Georgia, Azerbaijan, and Armenia.</p>
      </div>
    </details>
  </section>
</div>

<style>
  :global(:root) {
    --bg: rgb(255, 255, 255);
    --text: #181818;
    --muted: #5f5f5f;
    --border: #e6ddd5;
    --accent: #c8642a;
  }

  :global(body) {
    background: var(--bg);
    margin: 0;
    font-family: 'Source Serif 4', Georgia, serif;
    color: var(--text);
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(.svelte-scroller-container) {
    margin-top: 0;
  }

  .container {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .intro {
    padding: 5.5rem 0 2.5rem;
  }

  .eyebrow {
    display: inline-block;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1rem;
  }

  h1 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: clamp(2.2rem, 4.8vw, 3.4rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.04em;
    margin: 0 0 1.5rem;
    color: var(--text);
  }

  .lede {
    display: block;
    font-size: 1.15rem;
    line-height: 2.15;
    color: #1f1f1f;
    font-weight: 400;
    margin: 0 0 0;
    hyphens: auto;
  }

  .lede::after {
    content: '';
    display: block;
    width: 96px;
    height: 3px;
    background: var(--accent);
    margin-top: 1.25rem;
    border-radius: 999px;
  }

  .byline {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.8rem;
    color: #999;
    font-weight: 400;
    letter-spacing: 0.02em;
    margin: 0.75rem 0 1.75rem;
  }

  .paragraph {
    font-size: 1rem;
    line-height: 1.9;
    color: var(--muted);
    font-weight: 400;
    hyphens: auto;
    margin: 0 0 1.35rem;
  }

  .paragraph a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid rgba(200, 100, 42, 0.28);
  }

  .paragraph a:hover {
    border-bottom-color: var(--accent);
  }

  .outro {
    padding: 3rem 0 5rem;
    border-top: 1px solid var(--border);
    margin-top: 2.5rem;
  }

  .methodology {
    margin-top: 1rem;
  }

  .methodology summary {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .methodology summary::after {
    content: '▸';
    font-size: 0.7rem;
    transition: transform 0.2s ease;
    color: var(--accent);
  }

  .methodology[open] summary::after {
    transform: rotate(90deg);
  }

  .methodology-body {
    padding-top: 1.25rem;
    font-size: 0.92rem;
    line-height: 1.85;
    color: var(--muted);
  }

  .methodology-body p {
    hyphens: auto;
    margin: 0 0 1rem;
  }

  .methodology-body a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid rgba(200, 100, 42, 0.28);
  }

  .body-section {
    padding-top: 20rem;
  }

  :global(.svelte-scroller-background) {
    background: rgb(255, 255, 255);
  }
</style>