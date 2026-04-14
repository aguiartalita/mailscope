import { useRef } from "react";
import { DEVICES } from "../data/devices";

interface EmptyStateProps {
  onFile: (file: File) => void;
}

export function EmptyState({ onFile }: EmptyStateProps) {
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".html") || file.name.endsWith(".htm"))) onFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add("drag-over");
  };

  const handleDragLeave = () => dropRef.current?.classList.remove("drag-over");

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileRef.current?.click()}
      style={{
        height: "100%",
        border: "2px dashed #21262d",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        transition: "all 0.2s",
        cursor: "pointer",
        margin: "0 auto",
        maxWidth: 600,
      }}
    >
      <div style={{ fontSize: 64 }}>📧</div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
        }}
      >
        Arraste seu template HTML aqui
      </div>
      <div style={{ color: "#8b949e", fontSize: 14, textAlign: "center", maxWidth: 380, lineHeight: 1.6 }}>
        Suporte a HTML, AmpScript, templates responsivos.
        <br />
        Testamos contra {DEVICES.length} clients e dispositivos.
      </div>
      <button
        className="action-btn"
        style={{
          background: "#22d3a0",
          border: "none",
          borderRadius: 10,
          padding: "12px 28px",
          color: "#060a10",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s",
        }}
      >
        ↑ Selecionar arquivo .html
      </button>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
        {DEVICES.map((d) => (
          <span
            key={d.id}
            style={{
              background: "#0d1117",
              border: "1px solid #21262d",
              borderRadius: 20,
              padding: "4px 10px",
              fontSize: 11,
              color: "#8b949e",
            }}
          >
            {d.icon} {d.label}
          </span>
        ))}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".html,.htm"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </div>
  );
}
