const WIDTH = 84;
const HEIGHT = 26;
const PAD = 2;

export function sparkPaths(values: number[], width = WIDTH, height = HEIGHT) {
  const max = Math.max(...values);
  const min = Math.min(...values, 0);
  const w = width - PAD * 2;
  const h = height - PAD * 2;
  const x = (i: number) => PAD + (i / Math.max(values.length - 1, 1)) * w;
  const y = (v: number) => PAD + h - ((v - min) / (max - min || 1)) * h;

  let line = `M${x(0).toFixed(1)} ${y(values[0]).toFixed(1)}`;
  for (let i = 1; i < values.length; i++) {
    const cx = ((x(i - 1) + x(i)) / 2).toFixed(1);
    line += ` Q${cx} ${y(values[i - 1]).toFixed(1)} ${x(i).toFixed(1)} ${y(values[i]).toFixed(1)}`;
  }
  const area = `${line} L${x(values.length - 1).toFixed(1)} ${PAD + h} L${PAD} ${PAD + h} Z`;
  return { line, area };
}

export default function Sparkline({
  values,
  color = "var(--chart-1)",
}: {
  values: number[];
  color?: string;
}) {
  if (values.length < 2) return null;
  const { line, area } = sparkPaths(values);

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <path d={area} fill={color} fillOpacity={0.12} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
