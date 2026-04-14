import type { AnalysisResult, Device, Issue } from "../types";

export function analyzeHTML(html: string, device: Device): AnalysisResult {
  const issues: Issue[] = [];
  const warnings: Issue[] = [];
  const info: Issue[] = [];

  if (!html || html.trim() === "") return { issues, warnings, info, score: 0, ampscriptBlocks: [] };

  const lower = html.toLowerCase();
  const byteSize = new Blob([html]).size / 1024;

  // File size
  if (device.rules.maxFileKB && byteSize > device.rules.maxFileKB) {
    issues.push({
      code: "SIZE_EXCEEDED",
      msg: `Tamanho ${byteSize.toFixed(1)}KB excede o limite de ${device.rules.maxFileKB}KB para ${device.label}`,
      fix: "Reduza imagens inline (base64), simplifique estilos e remova comentários.",
    });
  } else if (device.rules.maxFileKB) {
    info.push({ code: "SIZE_OK", msg: `Tamanho: ${byteSize.toFixed(1)}KB (limite: ${device.rules.maxFileKB}KB)` });
  }

  // Flexbox
  if (device.rules.noFlex && (lower.includes("display:flex") || lower.includes("display: flex"))) {
    issues.push({
      code: "FLEX_UNSUPPORTED",
      msg: "display:flex não suportado no " + device.label,
      fix: "Substitua por layouts com <table>, <tr>, <td>.",
    });
  }

  // Grid
  if (device.rules.noGrid && (lower.includes("display:grid") || lower.includes("display: grid"))) {
    issues.push({
      code: "GRID_UNSUPPORTED",
      msg: "display:grid não suportado no " + device.label,
      fix: "Substitua por tabelas HTML.",
    });
  }

  // Border radius
  if (device.rules.noBorderRadius && lower.includes("border-radius")) {
    warnings.push({
      code: "BORDER_RADIUS",
      msg: "border-radius ignorado no " + device.label,
      fix: "Use imagens com bordas arredondadas ou aceite cantos retos.",
    });
  }

  // Background images
  if (device.rules.noBackgroundImage && (lower.includes("background-image") || lower.includes("background:"))) {
    warnings.push({
      code: "BG_IMAGE",
      msg: "background-image pode não renderizar no " + device.label,
      fix: "Use VML como fallback: <!--[if gte mso 9]><v:rect>...</v:rect><![endif]-->",
    });
  }

  // Table layout
  if (device.rules.requireTableLayout) {
    const hasTables = lower.includes("<table");
    if (!hasTables) {
      issues.push({
        code: "NO_TABLE_LAYOUT",
        msg: "Layout baseado em tabelas é obrigatório para " + device.label,
        fix: "Reestruture usando <table role='presentation'>.",
      });
    } else {
      info.push({ code: "TABLE_OK", msg: "Layout com tabelas detectado ✓" });
    }
  }

  // Inline styles
  if (device.rules.requireInlineStyles) {
    const styleTagContent = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) ?? []).join("");
    const hasStyleTag = styleTagContent.length > 20;
    const hasInlineStyle = lower.includes('style="');
    if (hasStyleTag && !hasInlineStyle) {
      warnings.push({
        code: "NOT_INLINED",
        msg: device.label + " requer estilos inline",
        fix: "Use uma ferramenta como Mailchimp CSS Inliner ou o pacote npm 'juice'.",
      });
    } else if (hasInlineStyle) {
      info.push({ code: "INLINE_OK", msg: "Estilos inline detectados ✓" });
    }
  }

  // External CSS
  if (device.rules.noExternalCSS && lower.includes("<link") && lower.includes("stylesheet")) {
    issues.push({
      code: "EXTERNAL_CSS",
      msg: device.label + " remove folhas de estilo externas",
      fix: "Inline todos os estilos e remova <link rel='stylesheet'>.",
    });
  }

  // Head styles stripped (Gmail)
  if (device.rules.noHeadStyles) {
    const hasHeadStyle = /<head[\s\S]*?<style/i.test(html);
    if (hasHeadStyle) {
      warnings.push({
        code: "HEAD_STYLE_STRIPPED",
        msg: "Gmail Web remove <style> do <head>",
        fix: "Inline os estilos críticos. Use <style> dentro do <body> como fallback.",
      });
    }
  }

  // Media queries (mobile)
  if (device.rules.requireMediaQueries) {
    const hasMediaQuery = lower.includes("@media");
    if (!hasMediaQuery) {
      warnings.push({
        code: "NO_MEDIA_QUERY",
        msg: "Sem @media queries – layout pode quebrar em " + device.label,
        fix: "Adicione @media (max-width: 600px) com ajustes de largura e fonte.",
      });
    } else {
      info.push({ code: "MEDIA_OK", msg: "@media queries detectadas ✓" });
    }
  }

  // Width attribute on tables
  if (device.rules.requireWidthAttr) {
    const tables = html.match(/<table[^>]*>/gi) ?? [];
    const noWidthTables = tables.filter((t) => !t.includes("width=") && !t.includes("width:"));
    if (noWidthTables.length > 0) {
      warnings.push({
        code: "MISSING_WIDTH_ATTR",
        msg: `${noWidthTables.length} tabela(s) sem atributo width=""`,
        fix: "Adicione width='600' diretamente na tag <table> para Outlook.",
      });
    }
  }

  // Web fonts
  if (device.rules.noWebFonts && (lower.includes("fonts.googleapis.com") || lower.includes("@font-face"))) {
    warnings.push({
      code: "WEB_FONTS",
      msg: "Web fonts podem não carregar no " + device.label,
      fix: "Sempre defina fallbacks: font-family: 'Sua Fonte', Arial, sans-serif.",
    });
  }

  // position: fixed
  if (device.rules.noPositionFixed && (lower.includes("position:fixed") || lower.includes("position: fixed"))) {
    issues.push({
      code: "POSITION_FIXED",
      msg: "position:fixed não suportado em clients de email",
      fix: "Remova ou substitua por position:relative.",
    });
  }

  // Accessibility – alt attributes
  const imgTags = html.match(/<img[^>]*>/gi) ?? [];
  const imgsWithoutAlt = imgTags.filter((img) => !img.includes("alt="));
  if (imgsWithoutAlt.length > 0) {
    warnings.push({
      code: "A11Y_ALT",
      msg: `${imgsWithoutAlt.length} imagem(ns) sem atributo alt=""`,
      fix: 'Adicione alt="" descritivo em todas as imagens. Use alt="" em imagens decorativas.',
    });
  } else if (imgTags.length > 0) {
    info.push({ code: "A11Y_ALT_OK", msg: "Todas as imagens possuem alt ✓" });
  }

  // Accessibility – lang attribute
  const hasLang = lower.includes("<html lang=") || lower.includes("<html xml:lang=");
  if (!hasLang) {
    warnings.push({
      code: "A11Y_LANG",
      msg: "Atributo lang ausente no <html>",
      fix: 'Adicione lang="pt-BR" na tag <html> para leitores de tela.',
    });
  }

  // Accessibility – role="presentation" on layout tables
  const hasRole = lower.includes('role="presentation"');
  if (device.rules.requireTableLayout && !hasRole) {
    warnings.push({
      code: "A11Y_ROLE",
      msg: 'Tabelas de layout sem role="presentation"',
      fix: 'Adicione role="presentation" em todas as <table> usadas para layout.',
    });
  }

  // AmpScript detection
  const ampscriptBlocks = html.match(/%%\[[\s\S]*?]%%|%%=[\s\S]*?=%%/g) ?? [];
  if (ampscriptBlocks.length > 0) {
    info.push({
      code: "AMPSCRIPT_DETECTED",
      msg: `${ampscriptBlocks.length} bloco(s) AmpScript detectado(s) – serão ignorados na pré-visualização`,
    });
  }

  // Max width check
  const hasMaxWidth600 =
    lower.includes("max-width:600") ||
    lower.includes("max-width: 600") ||
    lower.includes('width="600"') ||
    lower.includes("max-width:620") ||
    lower.includes("max-width: 620");
  if (!hasMaxWidth600) {
    warnings.push({
      code: "NO_MAX_WIDTH",
      msg: `Sem max-width definido para ${device.maxWidth}px`,
      fix: `Envolva o conteúdo em um <table width="${device.maxWidth}" style="max-width:${device.maxWidth}px; margin:0 auto;">.`,
    });
  } else {
    info.push({ code: "MAX_WIDTH_OK", msg: `max-width/width ${device.maxWidth}px detectado ✓` });
  }

  // Score calculation
  const total = issues.length * 3 + warnings.length * 1;
  const maxPenalty = 30;
  const score = Math.max(0, Math.round(100 - (total / maxPenalty) * 100));

  return { issues, warnings, info, score, ampscriptBlocks };
}
