import type { AIReport } from "../types";
import { AISection } from "./AISection";

interface AITabProps {
  aiReport: AIReport | null;
  aiLoading: boolean;
  onRunAnalysis: () => void;
}

export function AITab({ aiReport, aiLoading, onRunAnalysis }: AITabProps) {
  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      {!aiReport && !aiLoading && (
        <div
          style={{
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Análise por Inteligência Artificial
          </div>
          <div
            style={{
              color: "#8b949e",
              fontSize: 13,
              maxWidth: 400,
              margin: "0 auto 20px",
              lineHeight: 1.7,
            }}
          >
            Claude analisa seu template em profundidade: compatibilidade cross-client, acessibilidade WCAG, AmpScript,
            boas práticas e pontos positivos.
          </div>
          <button
            className="action-btn"
            onClick={onRunAnalysis}
            style={{
              background: "linear-gradient(135deg, #0078d4, #22d3a0)",
              border: "none",
              borderRadius: 8,
              padding: "12px 28px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            ▶ Executar Análise IA
          </button>
        </div>
      )}

      {aiLoading && (
        <div
          style={{
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 40,
              marginBottom: 16,
              animation: "spin 2s linear infinite",
              display: "inline-block",
            }}
          >
            ⏳
          </div>
          <div style={{ color: "#22d3a0", fontSize: 14, fontWeight: 600 }}>Analisando template com IA...</div>
          <div style={{ color: "#8b949e", fontSize: 12, marginTop: 8 }}>
            Verificando compatibilidade, acessibilidade e boas práticas
          </div>
        </div>
      )}

      {aiReport && !aiLoading && (
        <div>
          {aiReport.resumo && (
            <div
              style={{
                background: "#0a1f1a",
                border: "1px solid #1a4a3a",
                borderRadius: 10,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  color: "#22d3a0",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 8,
                }}
              >
                📋 Resumo
              </div>
              <div style={{ color: "#e6edf3", fontSize: 14, lineHeight: 1.6 }}>{aiReport.resumo}</div>
            </div>
          )}
          <AISection title="🔴 Problemas Críticos" items={aiReport.critico} color="#ff4757" />
          <AISection title="📧 Outlook" items={aiReport.outlook} color="#0078d4" />
          <AISection title="📨 Gmail" items={aiReport.gmail} color="#ea4335" />
          <AISection title="📱 Mobile" items={aiReport.mobile} color="#30aaff" />
          <AISection title="♿ Acessibilidade WCAG" items={aiReport.acessibilidade} color="#f5a623" />
          <AISection title="⚡ AmpScript" items={aiReport.ampscript} color="#ffe066" />
          <AISection title="📐 Boas Práticas" items={aiReport.boas_praticas} color="#8b949e" />
          <AISection title="✅ Pontos Positivos" items={aiReport.pontos_positivos} color="#22d3a0" />
          <button
            className="action-btn"
            onClick={onRunAnalysis}
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: 6,
              padding: "8px 16px",
              color: "#8b949e",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              marginTop: 8,
              transition: "all 0.2s",
            }}
          >
            ↺ Reanalisar
          </button>
        </div>
      )}
    </div>
  );
}
