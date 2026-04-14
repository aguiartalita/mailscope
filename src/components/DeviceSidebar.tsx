import { useRef } from "react";
import type { Device, DeviceGroup } from "../types";
import { DEVICES } from "../data/devices";
import { analyzeHTML } from "../utils/analyzeHTML";
import { ScoreRing } from "./ScoreRing";

interface DeviceSidebarProps {
  html: string;
  activeDevice: Device;
  activeGroup: DeviceGroup;
  onDeviceChange: (device: Device) => void;
  onGroupChange: (group: DeviceGroup) => void;
  onFile: (file: File) => void;
}

export function DeviceSidebar({
  html,
  activeDevice,
  activeGroup,
  onDeviceChange,
  onGroupChange,
  onFile,
}: DeviceSidebarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const deviceList = DEVICES.filter((d) => d.group === activeGroup);

  return (
    <div
      style={{
        width: 200,
        background: "#0d1117",
        borderRight: "1px solid #21262d",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Group tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d" }}>
        {(["desktop", "mobile"] as DeviceGroup[]).map((g) => (
          <button
            key={g}
            onClick={() => {
              onGroupChange(g);
              const first = DEVICES.find((d) => d.group === g);
              if (first) onDeviceChange(first);
            }}
            style={{
              flex: 1,
              padding: "10px 0",
              background: activeGroup === g ? "#161b22" : "transparent",
              border: "none",
              color: activeGroup === g ? "#22d3a0" : "#8b949e",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {g === "desktop" ? "🖥 Desktop" : "📱 Mobile"}
          </button>
        ))}
      </div>

      {/* Device list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {deviceList.map((dev) => {
          const a = html ? analyzeHTML(html, dev) : null;
          const isActive = activeDevice.id === dev.id;
          return (
            <button
              key={dev.id}
              className="device-btn"
              onClick={() => onDeviceChange(dev)}
              style={{
                width: "100%",
                background: isActive ? "#161b22" : "transparent",
                border: "none",
                borderLeft: `3px solid ${isActive ? dev.color : "transparent"}`,
                padding: "12px 16px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                opacity: isActive ? 1 : 0.7,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>{dev.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: isActive ? "#fff" : "#8b949e", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                  {dev.label}
                </div>
                <div style={{ color: "#484f58", fontSize: 10, marginTop: 2 }}>
                  {dev.viewportW}px · {dev.engine}
                </div>
              </div>
              {a && <ScoreRing score={a.score} size={30} />}
            </button>
          );
        })}
      </div>

      {/* Upload button */}
      <div style={{ padding: 12, borderTop: "1px solid #21262d" }}>
        <button
          className="action-btn"
          onClick={() => fileRef.current?.click()}
          style={{
            width: "100%",
            background: "#22d3a0",
            border: "none",
            borderRadius: 8,
            padding: "10px 0",
            color: "#060a10",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          ↑ Upload HTML
        </button>
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
    </div>
  );
}
