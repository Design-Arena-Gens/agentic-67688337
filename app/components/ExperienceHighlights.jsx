const highlights = [
  {
    title: '8K Ultra Realism',
    detail: 'Veo 3.1 simulates physically based lighting, high dynamic range capture, and cinematic motion blur tuned for theatrical delivery.'
  },
  {
    title: 'Shot-Driven Controls',
    detail: 'Control lens length, camera rigs, and movement curves with prompt-level precision to lock in choreography.'
  },
  {
    title: 'Look LUT Library',
    detail: 'Apply LOG, ACES, and bespoke LUTs for consistent grading across sequences before conforming in your NLE.'
  },
  {
    title: 'Seamless Collaboration',
    detail: 'Share instant review links, annotate frames, and hand off EXR sequences for downstream VFX pipelines.'
  }
];

export default function ExperienceHighlights() {
  return (
    <section className="panel highlights">
      <header className="panel-header">
        <div>
          <h2>Production-ready creative control</h2>
          <p>Everything directors, cinematographers, and post teams need to iterate on cinematic storytelling with AI.</p>
        </div>
      </header>

      <div className="highlight-grid">
        {highlights.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
