// Decorative PCB traces behind the hero. Pure SVG, colored by tokens.
export function PcbBackground() {
  const traces = [
    "M0 60 H180 L220 100 H420",
    "M0 140 H120 L160 180 H360 L400 140 H620",
    "M60 260 H260 L300 220 H520",
    "M420 100 V40 H700",
    "M620 140 H760 L800 180 H1000",
    "M520 220 H680 L720 260 H1000",
    "M760 40 H1000",
    "M880 100 V300",
  ];
  const vias = [
    [420, 100],
    [620, 140],
    [520, 220],
    [700, 40],
    [360, 180],
    [880, 100],
    [180, 60],
    [260, 260],
  ];
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      viewBox="0 0 1000 300"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="var(--trace)" strokeWidth="1.5" strokeLinecap="round" opacity="0.45">
        {traces.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g>
        {vias.map(([cx, cy], i) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="6" fill="var(--bg)" stroke="var(--trace)" strokeWidth="1.5" opacity="0.7" />
            <circle cx={cx} cy={cy} r="2.5" fill={i % 3 === 0 ? "var(--spring)" : "var(--accent)"} />
          </g>
        ))}
      </g>
    </svg>
  );
}
