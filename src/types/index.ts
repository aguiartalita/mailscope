export interface DeviceRules {
  noFlex?: boolean;
  noGrid?: boolean;
  noBorderRadius?: boolean;
  noBackgroundImage?: boolean;
  requireTableLayout?: boolean;
  requireInlineStyles?: boolean;
  requireWidthAttr?: boolean;
  noPositionFixed?: boolean;
  noWebFonts?: boolean;
  maxFileKB?: number;
  noExternalCSS?: boolean;
  noHeadStyles?: boolean;
  requireMediaQueries?: boolean;
}

export interface Device {
  id: string;
  label: string;
  icon: string;
  group: "desktop" | "mobile";
  viewportW: number;
  maxWidth: number;
  minFontSize: number;
  engine: string;
  rules: DeviceRules;
  color: string;
}

export interface Issue {
  code: string;
  msg: string;
  fix?: string;
}

export interface AnalysisResult {
  issues: Issue[];
  warnings: Issue[];
  info: Issue[];
  score: number;
  ampscriptBlocks: string[];
}

export interface AIReport {
  resumo?: string;
  critico?: string[];
  outlook?: string[];
  gmail?: string[];
  mobile?: string[];
  acessibilidade?: string[];
  ampscript?: string[];
  boas_praticas?: string[];
  pontos_positivos?: string[];
}

export type ActiveTab = "preview" | "issues" | "ai";
export type DeviceGroup = "desktop" | "mobile";
