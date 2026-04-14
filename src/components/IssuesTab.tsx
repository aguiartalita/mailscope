import type { AnalysisResult, Device } from "../types";
import { ScoreRing } from "./ScoreRing";
import { IssueRow } from "./IssueRow";

interface IssuesTabProps {
  analysis: AnalysisResult;
  activeDevice: Device;
}

export function IssuesTab({ analysis, activeDevice }: IssuesTabProps) {
  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      {/* Score summary */}
      <div
        style={{
          background: "#0d1117",
          border: "1px solid #21262d",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <ScoreRing score={analysis.score} size={72} />
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>
            Score de Compatibilidade
          </div>
          <div style={{ color: "#8b949e", fontSize: 13, marginTop: 4 }}>
            {activeDevice.icon} {activeDevice.label} · {activeDevice.viewportW}px
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <span style={{ color: "#ff4757", fontSize: 13 }}>✕ {analysis.issues.length} críticos</span>
            <span style={{ color: "#f5a623", fontSize: 13 }}>⚠ {analysis.warnings.length} avisos</span>
            <span style={{ color: "#22d3a0", fontSize: 13 }}>✓ {analysis.info.length} aprovados</span>
          </div>
        </div>
      </div>

      {/* AmpScript notice */}
      {analysis.ampscriptBlocks.length > 0 && (
        <div
          style={{
            background: "#1a1200",
            border: "1px solid #4a3400",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 16,
            fontSize: 13,
            color: "#f5a623",
          }}
        >
          ⚡ {analysis.ampscriptBlocks.length} bloco(s) AmpScript detectado(s) – renderizados como placeholder na
          pré-visualização.
        </div>
      )}

      {analysis.issues.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              color: "#ff4757",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 10,
            }}
          >
            ● Problemas Críticos
          </div>
          {analysis.issues.map((item, i) => (
            <IssueRow key={i} item={item} type="issue" />
          ))}
        </div>
      )}

      {analysis.warnings.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              color: "#f5a623",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 10,
            }}
          >
            ▲ Avisos
          </div>
          {analysis.warnings.map((item, i) => (
            <IssueRow key={i} item={item} type="warning" />
          ))}
        </div>
      )}

      {analysis.info.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              color: "#22d3a0",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 10,
            }}
          >
            ✓ Aprovados
          </div>
          {analysis.info.map((item, i) => (
            <IssueRow key={i} item={item} type="info" />
          ))}
        </div>
      )}
    </div>
  );
}
