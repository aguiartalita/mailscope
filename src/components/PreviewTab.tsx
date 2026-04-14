import type { Device } from "../types";

interface PreviewTabProps {
  processedHtml: string;
  activeDevice: Device;
  previewScale: number;
}

export function PreviewTab({ processedHtml, activeDevice, previewScale }: PreviewTabProps) {
  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <div
        className="preview-frame"
        style={{
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 0 0 1px #30363d, 0 20px 60px rgba(0,0,0,0.5)",
          width: activeDevice.viewportW * previewScale,
          position: "relative",
        }}
      >
        {/* Device chrome header */}
        <div
          style={{
            background: "#f0f0f0",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderBottom: "1px solid #ddd",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: 8, fontSize: 10, color: "#888", fontFamily: "inherit" }}>
            {activeDevice.icon} {activeDevice.label} – {activeDevice.viewportW}px
          </span>
        </div>
        <div
          style={{
            width: activeDevice.viewportW,
            transformOrigin: "top left",
            transform: `scale(${previewScale})`,
            height: `calc(100% / ${previewScale})`,
            overflow: "hidden",
          }}
        >
          <iframe
            srcDoc={processedHtml}
            sandbox="allow-same-origin allow-scripts"
            style={{ width: activeDevice.viewportW, height: 800, border: "none", display: "block" }}
            title={`Preview – ${activeDevice.label}`}
          />
        </div>
      </div>
    </div>
  );
}
