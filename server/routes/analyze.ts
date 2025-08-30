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
    /\belse\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\?\s*[^:]/g,
    /\&\&/g,
    /\|\|/g,
    /\bwhen\b/g,
    /\belif\b/g,
    /\bswitch\b/g,
  ];
  let total = 1;
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
    /^\s*[\w:\*<&>\s]+\s+[A-Za-z_]\w*\s*\([^;{]*\)\s*\{/gm, // C/C++-like function defs
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

function sanitizeCode(code: string, lang: string): string {
  const L = lang.toLowerCase();
  const cLike = ["javascript","typescript","java","csharp","cpp","go","rust","php"];
  if (L === "python") {
    let out = "";
    let i = 0;
    let state: "normal"|"lineComment"|"str"|"triStr" = "normal";
    let quote: '"'|'\''|null = null;
    let tri: '"""'|"'''"|null = null;
    while (i < code.length) {
      const ch = code[i];
      const next3 = code.slice(i, i+3);
      if (state === "normal") {
        if (next3 === '"""' || next3 === "'''") { state = "triStr"; tri = next3 as any; out += "   "; i += 3; continue; }
        if (ch === '"' || ch === "'") { state = "str"; quote = ch as any; out += " "; i++; continue; }
        if (ch === '#') { state = "lineComment"; out += " "; i++; continue; }
        out += ch; i++; continue;
      }
      if (state === "lineComment") { if (ch === "\n") { state = "normal"; out += "\n"; } else { out += " "; } i++; continue; }
      if (state === "str") { if (ch === "\\") { out += "  "; i += 2; continue; } if (ch === quote) { state = "normal"; out += " "; i++; } else { out += " "; i++; } continue; }
      if (state === "triStr") { if (code.slice(i, i+3) === tri) { state = "normal"; out += "   "; i += 3; } else { out += code[i] === "\n" ? "\n" : " "; i++; } continue; }
    }
    return out;
  }
  if (L === "ruby") {
    let out = ""; let i = 0; let state: "normal"|"lineComment"|"blockComment"|"str" = "normal"; let quote: '"'|'\''|null = null;
    while (i < code.length) {
      const ch = code[i];
      if (state === "normal") {
        if (code.startsWith("=begin", i)) { state = "blockComment"; out += "      "; i += 6; continue; }
        if (ch === '#') { state = "lineComment"; out += " "; i++; continue; }
        if (ch === '"' || ch === "'") { state = "str"; quote = ch as any; out += " "; i++; continue; }
        out += ch; i++; continue;
      }
      if (state === "lineComment") { if (ch === "\n") { state = "normal"; out += "\n"; } else { out += " "; } i++; continue; }
      if (state === "blockComment") { if (code.startsWith("=end", i)) { state = "normal"; out += "    "; i += 4; } else { out += ch === "\n" ? "\n" : " "; i++; } continue; }
      if (state === "str") { if (ch === "\\") { out += "  "; i += 2; continue; } if (ch === quote) { state = "normal"; out += " "; i++; } else { out += " "; i++; } continue; }
    }
    return out;
  }
  if (cLike.includes(L)) {
    let out = ""; let i = 0; let state: "normal"|"lineComment"|"blockComment"|"str"|"tpl" = "normal"; let quote: '"'|'\''|null = null;
    const treatBacktick = L === "javascript" || L === "typescript";
    while (i < code.length) {
      const ch = code[i];
      const two = code.slice(i, i+2);
      if (state === "normal") {
        if (two === "//") { state = "lineComment"; out += "  "; i += 2; continue; }
        if (two === "/*") { state = "blockComment"; out += "  "; i += 2; continue; }
        if (treatBacktick && ch === "`") { state = "tpl"; out += " "; i++; continue; }
        if (ch === '"' || ch === "'") { state = "str"; quote = ch as any; out += " "; i++; continue; }
        out += ch; i++; continue;
      }
      if (state === "lineComment") { if (ch === "\n") { state = "normal"; out += "\n"; } else { out += " "; } i++; continue; }
      if (state === "blockComment") { if (two === "*/") { state = "normal"; out += "  "; i += 2; } else { out += ch === "\n" ? "\n" : " "; i++; } continue; }
      if (state === "tpl") { if (ch === "`") { state = "normal"; out += " "; i++; } else { out += ch === "\n" ? "\n" : " "; i++; } continue; }
      if (state === "str") { if (ch === "\\") { out += "  "; i += 2; continue; } if (ch === quote) { state = "normal"; out += " "; i++; } else { out += " "; i++; } continue; }
    }
    return out;
  }
  return code;
}

function detectUnterminatedString(code: string, lang: string): AnalysisIssue[] {
  let i = 0;
  const n = code.length;
  let current: null | '"' | "'" | "`" | '"""' | "'''" = null;
  let escaped = false;
  while (i < n) {
    const ch = code[i];
    const next2 = code.slice(i, i + 3);
    if (current === null) {
      if (lang === "python" && (next2 === '"""' || next2 === "'''") ) {
        current = next2 as '"""' | "'''";
        i += 3;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        current = ch as '"' | "'" | "`";
        i++;
        escaped = false;
        continue;
      }
      i++;
      continue;
    } else {
      if (current === '"""' || current === "'''") {
        if (code.slice(i, i + 3) === current) {
          current = null;
          i += 3;
          continue;
        }
        i++;
        continue;
      }
      if (escaped) {
        escaped = false;
        i++;
        continue;
      }
      if (code[i] === "\\") {
        escaped = true;
        i++;
        continue;
      }
      if (code[i] === current) {
        current = null;
        i++;
        continue;
      }
      i++;
    }
  }
  if (current) {
    return [{ message: "Unterminated string literal detected", severity: "error" }];
  }
  return [];
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

function suggestFromMetrics(metrics: ComplexityMetrics, lang: string): string[] {
  const s: string[] = [];
  if (metrics.cyclomatic > 20) s.push("Refactor to reduce cyclomatic complexity; extract smaller functions and simplify conditionals.");
  if (metrics.lines > 400) s.push("File is large; consider splitting into cohesive modules.");
  if (metrics.functions > 50) s.push("High function count; group related logic and remove dead code.");
  if (metrics.maintainability < 60) s.push("Improve maintainability by adding documentation and consistent naming.");
  if (metrics.score < 70) s.push("Apply early returns and guard clauses to reduce nesting.");
  if (lang === "python") s.push("Follow PEP 8: 4-space indents, snake_case names, and module-level docstrings.");
  if (lang === "cpp") s.push("Prefer modern C++ (RAII, smart pointers, range-based loops) and avoid 'using namespace std;'.");
  return s;
}

function computeMetrics(code: string): ComplexityMetrics {
  const lines = code.split(/\r?\n/).length;
  const cyclomatic = estimateCyclomatic(code);
  const functions = estimateFunctions(code);
  const maintainabilityRaw = 100 - Math.min(100, Math.log2(Math.max(1, cyclomatic)) * 12 + Math.log2(Math.max(1, lines)) * 6);
  const maintainability = Math.max(0, Math.min(100, Math.round(maintainabilityRaw)));
  const penalty = Math.min(60, Math.log2(Math.max(1, cyclomatic)) * 10 + Math.log2(Math.max(1, lines)) * 5);
  const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  return { score, cyclomatic, lines, functions, maintainability };
}

function analyzePython(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const lines = code.split(/\r?\n/);
  let indentStack: number[] = [0];
  let prevWasHeader = false;

  function indentWidth(s: string): number {
    let count = 0;
    for (const ch of s) count += ch === "\t" ? 4 : 1;
    return count;
  }

  lines.forEach((ln, idx) => {
    const lineNo = idx + 1;
    const match = ln.match(/^(\s*)(.*)$/) as RegExpMatchArray;
    const leading = match[1];
    const content = match[2];

    // skip empty or comment-only lines
    if (!content.trim() || /^#/.test(content.trim())) {
      prevWasHeader = false;
      return;
    }

    if (/^\s*(def|class|if|elif|else|for|while|try|except|finally)\b/.test(ln)) {
      if (!/:\s*(#.*)?$/.test(ln)) {
        issues.push({ message: "Missing ':' at end of block header", severity: "error", line: lineNo });
      }
      prevWasHeader = true;
    } else {
      prevWasHeader = false;
    }

    if (/^\s*[ \t]+/.test(ln)) {
      const mixed = /^(?: *\t|\t *).*/.test(leading);
      if (mixed) {
        issues.push({ message: "Mixed tabs and spaces in indentation", severity: "warn", line: lineNo });
      }
      const width = indentWidth(leading);
      const top = indentStack[indentStack.length - 1];
      if (width > top) {
        if (!prevWasHeader && !/:\s*(#.*)?$/.test(lines[Math.max(0, idx - 1)] || "")) {
          issues.push({ message: "Unexpected indent", severity: "error", line: lineNo });
        }
        indentStack.push(width);
      } else if (width < top) {
        while (indentStack.length && width < indentStack[indentStack.length - 1]) indentStack.pop();
        if (width !== indentStack[indentStack.length - 1]) {
          issues.push({ message: "Inconsistent dedent (indentation level does not match any open block)", severity: "error", line: lineNo });
        }
      }
      if (/^ +/.test(leading) && indentWidth(leading) % 4 !== 0) {
        issues.push({ message: "Indentation is not a multiple of 4 spaces", severity: "info", line: lineNo });
      }
    }
  });

  return issues;
}

function analyzeCpp(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const lines = code.split(/\r?\n/);

  const hasIostream = /(^|\n)\s*#\s*include\s*<iostream>/.test(code);
  if (/(^|\n).*\b(std::)?(cout|cin)\b/.test(code) && !hasIostream) {
    issues.push({ message: "Uses cout/cin without including <iostream>", severity: "warn" });
  }
  if (/using\s+namespace\s+std\s*;/.test(code)) {
    issues.push({ message: "Avoid 'using namespace std;'. Prefer explicit std:: qualifiers.", severity: "info" });
  }

  lines.forEach((ln, idx) => {
    const lineNo = idx + 1;
    const trimmed = ln.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("#") || trimmed.startsWith("//")) return;
    if (/^(case\b|default\b)/.test(trimmed)) return;
    if (/^(public|private|protected)\s*:/.test(trimmed)) return;

    const endsOk = /[;{}:]\s*(\/\/.*)?$/.test(trimmed);
    const looksLikeStmt = /(=|\breturn\b|\bint\b|\blong\b|\bshort\b|\bfloat\b|\bdouble\b|\bchar\b|\bbool\b|\bauto\b|\bstring\b|\bstd::string\b)/.test(trimmed);
    const isControl = /^(if|for|while|switch|else)\b/.test(trimmed);
    const likelyFuncDecl = /\)\s*$/.test(trimmed) && !endsOk && !isControl;

    if (looksLikeStmt && !endsOk && !isControl && !likelyFuncDecl) {
      issues.push({ message: "Possible missing ';' at end of statement", severity: "error", line: lineNo });
    }
  });

  return issues;
}

function analyzeJava(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const lines = code.split(/\r?\n/);
  lines.forEach((ln, i) => {
    const t = ln.trim();
    if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) return;
    const control = /^(if|for|while|switch|else|try|catch|finally|do)\b/.test(t);
    const endsOk = /[;{}:]\s*(\/\/.*)?$/.test(t);
    const likelyDecl = /(class|interface|enum)\b/.test(t) || /\)\s*$/.test(t);
    if (!control && !endsOk && !likelyDecl) {
      issues.push({ message: "Possible missing ';' at end of statement", severity: "error", line: i + 1 });
    }
  });
  return issues;
}

function analyzeCSharp(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const lines = code.split(/\r?\n/);
  if (/Console\.Write(Line)?\s*\(/.test(code) && !/using\s+System\s*;/.test(code)) {
    issues.push({ message: "Uses Console without 'using System;'.", severity: "info" });
  }
  lines.forEach((ln, i) => {
    const t = ln.trim();
    if (!t || t.startsWith("//")) return;
    const control = /^(if|for|while|switch|else|try|catch|finally|do|using)\b/.test(t);
    const endsOk = /[;{}:]\s*(\/\/.*)?$/.test(t);
    const likelyDecl = /(class|interface|enum|struct|record)\b/.test(t) || /\)\s*$/.test(t);
    if (!control && !endsOk && !likelyDecl) {
      issues.push({ message: "Possible missing ';' at end of statement", severity: "error", line: i + 1 });
    }
  });
  return issues;
}

function analyzeGo(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  if (/\bfmt\./.test(code) && !/import\s*(\(|\s*)["']fmt["']/.test(code)) {
    issues.push({ message: "Uses fmt without importing it", severity: "warn" });
  }
  if (!/^\s*package\s+\w+/m.test(code)) {
    issues.push({ message: "Missing package declaration", severity: "info" });
  }
  return issues;
}

function analyzeRust(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const lines = code.split(/\r?\n/);
  lines.forEach((ln, i) => {
    const t = ln.trim();
    if (!t || t.startsWith("//")) return;
    const control = /^(if|for|while|loop|match|else)\b/.test(t) || /\bfn\b/.test(t);
    const endsOk = /[;{}:]\s*(\/\/.*)?$/.test(t) || /!\s*\(/.test(t);
    const letLike = /^(let\b|return\b|break\b|continue\b)/.test(t);
    if (letLike && !endsOk) {
      issues.push({ message: "Possible missing ';' in statement", severity: "error", line: i + 1 });
    }
  });
  return issues;
}

function analyzePhp(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  if (/\$\w+/.test(code) && !code.trim().startsWith("<?php")) {
    issues.push({ message: "Missing '<?php' opening tag", severity: "error" });
  }
  const lines = code.split(/\r?\n/);
  lines.forEach((ln, i) => {
    const t = ln.trim();
    if (!t || t.startsWith("//") || t.startsWith("#") || t.startsWith("/*")) return;
    const control = /^(if|for|while|switch|else|foreach|function)\b/.test(t);
    const endsOk = /[;{}:]\s*(\/\/.*)?$/.test(t);
    const likelyDecl = /\)\s*$/.test(t);
    if (!control && !endsOk && !likelyDecl) {
      issues.push({ message: "Possible missing ';' at end of statement", severity: "error", line: i + 1 });
    }
  });
  return issues;
}

function analyzeRuby(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  const tokensOpen = /\b(def|class|module|if|unless|while|until|case|begin|do)\b/g;
  const tokensEnd = /\bend\b/g;
  let opens = 0;
  let match;
  const san = sanitizeCode(code, "ruby");
  while ((match = tokensOpen.exec(san))) opens++;
  while ((match = tokensEnd.exec(san))) opens--;
  if (opens > 0) {
    issues.push({ message: "Missing 'end' for one or more blocks", severity: "error" });
  } else if (opens < 0) {
    issues.push({ message: "Too many 'end' statements", severity: "error" });
  }
  return issues;
}

function analyzeJsTs(code: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  if (/\bvar\b/.test(code)) {
    issues.push({ message: "Avoid 'var'; use let/const.", severity: "info" });
  }
  if (/[^!]=[^=]/.test(code)) {
    issues.push({ message: "Use strict equality '===' instead of '=='.", severity: "info" });
  }
  return issues;
}

export const handleAnalyze: RequestHandler = (req, res) => {
  const started = Date.now();
  const { code, language } = req.body as AnalyzeRequest;

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "Code is required" });
  }

  const lang = (language || "javascript").toLowerCase();
  const sanitized = sanitizeCode(code, lang);

  const issues: AnalysisIssue[] = [];
  issues.push(...checkBalance(sanitized));
  issues.push(...detectUnterminatedString(code, lang));
  issues.push(...lineIssues(code));

  if (lang === "javascript" || lang === "typescript") {
    if (/console\.log\(/.test(sanitized)) {
      issues.push({ message: "Avoid leaving console.log in production code.", severity: "info" });
    }
    issues.push(...analyzeJsTs(sanitized));
  } else if (lang === "python") {
    issues.push(...analyzePython(code));
  } else if (lang === "cpp") {
    issues.push(...analyzeCpp(sanitized));
  } else if (lang === "java") {
    issues.push(...analyzeJava(sanitized));
  } else if (lang === "csharp") {
    issues.push(...analyzeCSharp(sanitized));
  } else if (lang === "go") {
    issues.push(...analyzeGo(sanitized));
  } else if (lang === "rust") {
    issues.push(...analyzeRust(sanitized));
  } else if (lang === "php") {
    issues.push(...analyzePhp(code));
  } else if (lang === "ruby") {
    issues.push(...analyzeRuby(code));
  }

  const metrics = computeMetrics(sanitized);
  const suggestions = suggestFromMetrics(metrics, lang);

  const response: AnalyzeResponse = {
    issues,
    metrics,
    suggestions,
    ai: { enabled: false },
    timings: { analysisMs: Date.now() - started },
  };

  res.json(response);
};
