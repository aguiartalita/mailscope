import type { Device, DeviceGroup } from "../types";
import { DEVICES } from "../data/devices";
import { analyzeHTML } from "../utils/analyzeHTML";
import { ScoreRing } from "./ScoreRing";

interface DeviceStatsPanelProps {
  html: string;
  activeDevice: Device;
  onDeviceSelect: (device: Device, group: DeviceGroup) => void;
}

export function DeviceStatsPanel({ html, activeDevice, onDeviceSelect }: DeviceStatsPanelProps) {
  return (
    <div
      style={{
        width: 220,
        background: "#0d1117",
        borderLeft: "1px solid #21262d",
        padding: 16,
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          color: "#8b949e",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 12,
        }}
      >
        Todos os Devices
      </div>
      {DEVICES.map((dev) => {
        const a = analyzeHTML(html, dev);
        const isActive = activeDevice.id === dev.id;
        return (
          <div
            key={dev.id}
            onClick={() => onDeviceSelect(dev, dev.group)}
            style={{
              background: isActive ? "#161b22" : "#0a0e14",
              border: `1px solid ${isActive ? "#30363d" : "#161b22"}`,
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 8,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "#e6edf3", fontWeight: 600 }}>
                  {dev.icon} {dev.label}
                </div>
                <div style={{ fontSize: 10, color: "#484f58", marginTop: 2 }}>
                  <span style={{ color: "#ff4757" }}>✕{a.issues.length}</span>{" "}
                  <span style={{ color: "#f5a623" }}>⚠{a.warnings.length}</span>
                </div>
              </div>
              <ScoreRing score={a.score} size={36} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
