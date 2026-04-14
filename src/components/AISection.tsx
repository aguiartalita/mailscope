interface AISectionProps {
  title: string;
  items?: string[];
  color?: string;
}

export function AISection({ title, items, color }: AISectionProps) {
  if (!items?.length) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          color: color ?? "#c9d1d9",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#0d1117",
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 6,
            color: "#e6edf3",
            fontSize: 13,
            borderLeft: `3px solid ${color ?? "#30363d"}`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
