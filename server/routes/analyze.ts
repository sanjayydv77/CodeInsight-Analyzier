import { RequestHandler } from "express";
import {
  AnalyzeRequest,
  AnalyzeResponse,
  AnalysisIssue,
  ComplexityMetrics,
} from "@shared/api";

function countMatches(src: string, re: RegExp): number {
  const m = src.match(re);
  return m ? m.length : 0;
}

function estimateCyclomatic(code: string): number {
  const patterns: RegExp[] = [
    /\bif\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\?\s*[^:]/g, // ternary start
    /\&\&/g,
    /\|\|/g,
    /\bwhen\b/g, // kotlin-like
    /\belif\b/g, // python
    /\bswitch\b/g,
  ];
  let total = 1; // base complexity
  for (const re of patterns) total += countMatches(code, re);
  return total;
}

function estimateFunctions(code: string): number {
  const patterns: RegExp[] = [
    /\bfunction\b/g,
    /=>/g,
    /\bdef\b/g,
    /\bfunc\b/g,
    /\bfn\b/g,
    /\bclass\b/g,
    /\binterface\b/g,
  ];
  let total = 0;
  for (const re of patterns) total += countMatches(code, re);
  return total;
}

function checkBalance(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const pairs: [string, string, string][] = [
    ["(", ")", "parentheses"],
    ["[", "]", "brackets"],
    ["{", "}", "braces"],
  ];
  for (const [open, close, name] of pairs) {
    const openCount = countMatches(code, new RegExp(`\\${open}`, "g"));
    const closeCount = countMatches(code, new RegExp(`\\${close}`, "g"));
    if (openCount !== closeCount) {
      issues.push({
        message: `Unbalanced ${name}: ${openCount} '${open}' and ${closeCount} '${close}'`,
        severity: "error",
      });
    }
  }
  return issues;
}

function lineIssues(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const lines = code.split(/\r?\n/);
  lines.forEach((ln, i) => {
    const lineNo = i + 1;
    if (ln.length > 120) {
      issues.push({
        message: `Line ${lineNo} exceeds 120 characters (${ln.length})`,
        severity: "warn",
        line: lineNo,
      });
    }
    if (/\s+$/.test(ln)) {
      issues.push({
        message: `Trailing whitespace on line ${lineNo}`,
        severity: "info",
        line: lineNo,
      });
    }
    if (/\t/.test(ln)) {
      issues.push({
        message: `Tab character found on line ${lineNo}; prefer spaces for consistency`,
        severity: "info",
        line: lineNo,
      });
    }
  });
  return issues;
}

function suggestFromMetrics(metrics: ComplexityMetrics): string[] {
  const s: string[] = [];
  if (metrics.cyclomatic > 20) s.push("Refactor to reduce cyclomatic complexity; extract smaller functions and simplify conditionals.");
  if (metrics.lines > 400) s.push("File is large; consider splitting into cohesive modules.");
  if (metrics.functions > 50) s.push("High function count; group related logic and remove dead code.");
  if (metrics.maintainability < 60) s.push("Improve maintainability by adding documentation and consistent naming.");
  if (metrics.score < 70) s.push("Apply early returns and guard clauses to reduce nesting.");
  return s;
}

function computeMetrics(code: string): ComplexityMetrics {
  const lines = code.split(/\r?\n/).length;
  const cyclomatic = estimateCyclomatic(code);
  const functions = estimateFunctions(code);
  // Simple maintainability model (0..100)
  const maintainabilityRaw = 100 - Math.min(100, Math.log2(Math.max(1, cyclomatic)) * 12 + Math.log2(Math.max(1, lines)) * 6);
  const maintainability = Math.max(0, Math.min(100, Math.round(maintainabilityRaw)));
  // Overall score biased by both size and complexity
  const penalty = Math.min(60, Math.log2(Math.max(1, cyclomatic)) * 10 + Math.log2(Math.max(1, lines)) * 5);
  const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  return { score, cyclomatic, lines, functions, maintainability };
}

export const handleAnalyze: RequestHandler = (req, res) => {
  const started = Date.now();
  const { code, language } = req.body as AnalyzeRequest;

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "Code is required" });
  }

  // Heuristic static checks
  const issues: AnalysisIssue[] = [];
  issues.push(...checkBalance(code));
  issues.push(...lineIssues(code));

  // Language-specific quick checks
  const lang = (language || "javascript").toLowerCase();
  if (["javascript", "typescript"].includes(lang)) {
    if (/console\.log\(/.test(code)) {
      issues.push({
        message: "Avoid leaving console.log in production code.",
        severity: "info",
      });
    }
  }
  if (["python"].includes(lang)) {
    const tabs = code.split(/\r?\n/).filter((l) => /^\t+/.test(l)).length;
    if (tabs > 0) {
      issues.push({ message: "Use spaces instead of tabs for Python indentation.", severity: "warn" });
    }
  }

  const metrics = computeMetrics(code);
  const suggestions = suggestFromMetrics(metrics);

  const response: AnalyzeResponse = {
    issues,
    metrics,
    suggestions,
    ai: {
      enabled: false,
    },
    timings: { analysisMs: Date.now() - started },
  };

  res.json(response);
};
