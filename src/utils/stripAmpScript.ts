export function stripAmpScript(html: string): string {
  return html
    .replace(/%%\[[\s\S]*?]%%/g, "<!-- AmpScript block removed for preview -->")
    .replace(
      /%%=([\s\S]*?)=%%/g,
      (_match, expr: string) =>
        `<span style="background:#ffe066;color:#333;font-size:11px;padding:1px 4px;border-radius:3px" title="AmpScript: ${expr.trim()}">[AmpScript]</span>`,
    );
}
