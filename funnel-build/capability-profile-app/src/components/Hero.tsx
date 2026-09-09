import { BookingLink } from './SiteHeader';

function HeroInstrument() {
  return (
    <svg className="hero-instrument" viewBox="0 0 660 420" role="img" aria-labelledby="hero-visual-title hero-visual-desc">
      <title id="hero-visual-title">Wire and cable production capability map</title>
      <desc id="hero-visual-desc">Example line capabilities include preheating, extrusion, diameter measurement, spark testing and tension management. Laboratory testing is a separate path. Equipment and sequence depend on the application.</desc>
      <rect x="20" y="40" width="620" height="320" rx="8" className="instrument-frame" />
      <path d="M62 214H598" className="wire-path" />
      {[[84, 'PREHEAT'], [184, 'EXTRUSION'], [294, 'MEASURE'], [404, 'SPARK TEST'], [536, 'TENSION']].map(([x, label]) => (
        <g key={String(label)} transform={`translate(${x} 214)`}><circle r="22" className="stage-node" /><circle r="7" className="stage-core" /><text y="52" textAnchor="middle" className="stage-label">{label}</text></g>
      ))}
      <g className="measurement-callout"><circle cx="294" cy="214" r="50" className="measurement-ring" /><path d="M330 176L390 116" className="leader-line" /><rect x="378" y="64" width="202" height="72" rx="3" className="spec-plate" /><text x="396" y="90" className="spec-kicker">INLINE DIMENSION</text><text x="396" y="119" className="spec-value">Ø 0.10—150 mm*</text></g>
      <g transform="translate(548 318)"><rect x="-52" y="-20" width="104" height="40" rx="3" className="offline-node" /><text textAnchor="middle" y="5" className="offline-label">OFFLINE TEST</text></g>
      <text x="44" y="82" className="diagram-label">WIRE AND CABLE CAPABILITIES</text><text x="44" y="318" className="diagram-note">*Across product series; model-specific limits apply.</text><text x="44" y="342" className="diagram-note">Illustrative sequence. Laboratory testing is independent.</text>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Puretronics Wire and Cable Industry Capabilities</p>
          <h1>Find the Right Capability for Your Wire and Cable Production or Testing Requirement.</h1>
          <p className="lead">Explore where Puretronics can support inline measurement, insulation-fault detection, cable testing, conductor preparation, tension measurement, line control and pneumatic braking—then prepare for a focused technical conversation.</p>
          <div className="hero-actions"><BookingLink location="hero">Book a Wire and Cable Application Review</BookingLink><a className="text-link" href="#explore">Explore Puretronics Capabilities <span aria-hidden="true">↓</span></a></div>
          <div className="start-note"><strong>Start with what you know</strong><p>You do not need to begin with a model number. Start with a production problem, a line stage, a test requirement, an existing product—or simply tell us that you are not sure yet.</p></div>
        </div>
        <HeroInstrument />
      </div>
      <div className="container proof-strip" aria-label="Puretronics capability facts">{['Established in 1990', '5 Wire and Cable Product Families', '13 Products', 'Inline, offline and process-control equipment'].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div>
      <p className="container audience">For wire and cable manufacturers, production and process teams, QA and testing laboratories, maintenance and automation teams, machine builders, OEMs and project partners.</p>
    </section>
  );
}
