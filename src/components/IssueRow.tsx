import type { Issue } from "../types";

type IssueType = "issue" | "warning" | "info";

interface IssueRowProps {
  item: Issue;
  type: IssueType;
}

const COLORS: Record<IssueType, string> = {
  issue: "#ff4757",
  warning: "#f5a623",
  info: "#22d3a0",
};

const ICONS: Record<IssueType, string> = {
  issue: "✕",
  warning: "⚠",
  info: "✓",
};

export function IssueRow({ item, type }: IssueRowProps) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${COLORS[type]}`,
        background: "#0d1117",
        borderRadius: "0 8px 8px 0",
        padding: "10px 14px",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ color: COLORS[type], fontWeight: 700, fontSize: 13, minWidth: 16 }}>{ICONS[type]}</span>
        <div>
          <div style={{ color: "#e6edf3", fontSize: 13, fontWeight: 600 }}>{item.msg}</div>
          {item.fix && <div style={{ color: "#8b949e", fontSize: 12, marginTop: 4 }}>{item.fix}</div>}
        </div>
      </div>
    </div>
  );
}
