/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "cpp"
  | "go"
  | "rust"
  | "php"
  | "ruby";

export interface AnalyzeRequest {
  code: string;
  language: SupportedLanguage;
}

export interface AnalysisIssue {
  message: string;
  line?: number;
  severity: "info" | "warn" | "error";
}

export interface ComplexityMetrics {
  score: number; // 0-100 (100 = simplest/best)
  cyclomatic: number;
  lines: number;
  functions: number;
  maintainability: number; // 0-100 (higher is better)
}

export interface AIAnalysis {
  enabled: boolean;
  model?: string;
  summary?: string;
  securityIssues?: string[];
  refactoringSuggestions?: string[];
  bestPractices?: string[];
  explanation?: string;
}

export interface AnalyzeResponse {
  issues: AnalysisIssue[];
  metrics: ComplexityMetrics;
  suggestions: string[];
  ai?: AIAnalysis;
  syntaxValid: boolean;
  timings: {
    analysisMs: number;
    aiMs?: number;
  };
}
