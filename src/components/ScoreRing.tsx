interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 56 }: ScoreRingProps) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#22d3a0" : score >= 50 ? "#f5a623" : "#ff4757";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Score: ${score}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2535" strokeWidth="7" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size < 50 ? 10 : 12}
        fontWeight="700"
        fill={color}
        fontFamily="monospace"
      >
        {score}
      </text>
    </svg>
  );
}
