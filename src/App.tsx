import { useState, useCallback } from "react";
import type { Device, DeviceGroup, ActiveTab, AIReport } from "./types";
import { DEVICES } from "./data/devices";
import { analyzeHTML } from "./utils/analyzeHTML";
import { stripAmpScript } from "./utils/stripAmpScript";
import { ScoreRing } from "./components/ScoreRing";
import { DeviceSidebar } from "./components/DeviceSidebar";
import { EmptyState } from "./components/EmptyState";
import { PreviewTab } from "./components/PreviewTab";
import { IssuesTab } from "./components/IssuesTab";
import { AITab } from "./components/AITab";
import { DeviceStatsPanel } from "./components/DeviceStatsPanel";

// ── Types ────────────────────────────────────────────────────────────────────

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content?: AnthropicContentBlock[];
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [html, setHtml] = useState("");
  const [filename, setFilename] = useState("");
  const [activeDevice, setActiveDevice] = useState<Device>(DEVICES[0]!);
  const [activeGroup, setActiveGroup] = useState<DeviceGroup>("desktop");
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.6);
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");

  const analysis = html ? analyzeHTML(html, activeDevice) : null;
  const processedHtml = html ? stripAmpScript(html) : "";

  // ── File handling ──────────────────────────────────────────────────────────

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setHtml(e.target?.result as string);
      setFilename(file.name);
      setAiReport(null);
      setActiveTab("preview");
    };
    reader.readAsText(file, "utf-8");
  }, []);

  // ── AI Analysis ────────────────────────────────────────────────────────────

  const runAIAnalysis = async () => {
    if (!html || aiLoading) return;
    setAiLoading(true);
    setAiReport(null);
    setActiveTab("ai");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY as string,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `Você é um especialista em email marketing e compatibilidade de clients de email.
Analise o template HTML fornecido e retorne APENAS um JSON válido (sem markdown, sem backticks) com esta estrutura exata:
{
  "resumo": "string de 2 frases sobre o template",
  "critico": ["lista de problemas críticos"],
  "outlook": ["problemas específicos Outlook Classic/New"],
  "gmail": ["problemas específicos Gmail"],
  "mobile": ["problemas mobile"],
  "acessibilidade": ["problemas de acessibilidade WCAG"],
  "ampscript": ["observações sobre blocos AmpScript se houver"],
  "boas_praticas": ["sugestões de boas práticas não aplicadas"],
  "pontos_positivos": ["o que está bem implementado"]
}`,
          messages: [
            {
              role: "user",
              content: `Analise este template de email marketing:\n\n${html.slice(0, 8000)}`,
            },
          ],
        }),
      });
      const data = (await resp.json()) as AnthropicResponse;
      const text = data.content?.map((b) => b.text ?? "").join("") ?? "";
      const clean = text.replace(/```json|```/g, "").trim();
      try {
        setAiReport(JSON.parse(clean) as AIReport);
      } catch {
        setAiReport({ resumo: text });
      }
    } catch {
      setAiReport({ resumo: "Erro ao conectar com a API. Verifique sua conexão e a chave VITE_ANTHROPIC_API_KEY." });
    } finally {
      setAiLoading(false);
    }
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDeviceSelect = (device: Device, group: DeviceGroup) => {
    setActiveDevice(device);
    setActiveGroup(group);
    setActiveTab("issues");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        background: "#060a10",
        minHeight: "100vh",
        color: "#e6edf3",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0d1117",
          borderBottom: "1px solid #21262d",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #22d3a0, #0078d4)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            📧
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              MailScope<span style={{ color: "#22d3a0" }}>.</span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#8b949e",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Email Template Tester
            </div>
          </div>
        </div>
        {filename && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                color: "#8b949e",
              }}
            >
              <span style={{ color: "#22d3a0" }}>📄</span> {filename}
            </div>
            {analysis && <ScoreRing score={analysis.score} size={52} />}
          </div>
        )}
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>
        {/* Left Sidebar */}
        <DeviceSidebar
          html={html}
          activeDevice={activeDevice}
          activeGroup={activeGroup}
          onDeviceChange={setActiveDevice}
          onGroupChange={setActiveGroup}
          onFile={loadFile}
        />

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar – tabs & controls */}
          {html && (
            <div
              style={{
                background: "#0d1117",
                borderBottom: "1px solid #21262d",
                padding: "8px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {/* Tabs */}
              <div style={{ display: "flex", gap: 2 }}>
                {[
                  { id: "preview" as ActiveTab, label: "👁 Preview" },
                  {
                    id: "issues" as ActiveTab,
                    label: `🔍 Issues ${analysis ? `(${analysis.issues.length + analysis.warnings.length})` : ""}`,
                  },
                  { id: "ai" as ActiveTab, label: "🤖 Análise IA" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className="tab-btn"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: activeTab === tab.id ? "#161b22" : "transparent",
                      border: `1px solid ${activeTab === tab.id ? "#30363d" : "transparent"}`,
                      borderRadius: 6,
                      padding: "6px 14px",
                      color: activeTab === tab.id ? "#e6edf3" : "#8b949e",
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1 }} />

              {/* Preview scale */}
              {activeTab === "preview" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#8b949e", fontSize: 11 }}>Zoom:</span>
                  {[0.4, 0.6, 0.8, 1].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPreviewScale(s)}
                      style={{
                        background: previewScale === s ? "#22d3a0" : "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: 4,
                        padding: "3px 8px",
                        color: previewScale === s ? "#060a10" : "#8b949e",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: previewScale === s ? 700 : 400,
                      }}
                    >
                      {Math.round(s * 100)}%
                    </button>
                  ))}
                </div>
              )}

              {/* AI run button */}
              {activeTab === "ai" && (
                <button
                  className="action-btn"
                  onClick={runAIAnalysis}
                  disabled={aiLoading}
                  style={{
                    background: aiLoading ? "#30363d" : "linear-gradient(135deg, #0078d4, #22d3a0)",
                    border: "none",
                    borderRadius: 6,
                    padding: "7px 16px",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: aiLoading ? "default" : "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {aiLoading ? "⏳ Analisando..." : "▶ Executar Análise IA"}
                </button>
              )}

              {/* Device info pill */}
              <div
                style={{
                  background: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: 6,
                  padding: "5px 12px",
                  fontSize: 11,
                  color: "#8b949e",
                  display: "flex",
                  gap: 10,
                }}
              >
                <span>
                  {activeDevice.icon} {activeDevice.label}
                </span>
                <span style={{ color: "#30363d" }}>|</span>
                <span>{activeDevice.viewportW}px</span>
                <span style={{ color: "#30363d" }}>|</span>
                <span>{activeDevice.engine}</span>
              </div>
            </div>
          )}

          {/* Content area */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: html ? 0 : 24,
              background: "#080c12",
            }}
          >
            {!html && <EmptyState onFile={loadFile} />}

            {html && activeTab === "preview" && (
              <PreviewTab processedHtml={processedHtml} activeDevice={activeDevice} previewScale={previewScale} />
            )}

            {html && activeTab === "issues" && analysis && (
              <IssuesTab analysis={analysis} activeDevice={activeDevice} />
            )}

            {html && activeTab === "ai" && (
              <AITab aiReport={aiReport} aiLoading={aiLoading} onRunAnalysis={runAIAnalysis} />
            )}
          </div>
        </div>

        {/* Right panel – all devices overview */}
        {html && (
          <DeviceStatsPanel html={html} activeDevice={activeDevice} onDeviceSelect={handleDeviceSelect} />
        )}
      </div>
    </div>
  );
}
