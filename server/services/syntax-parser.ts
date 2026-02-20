import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

export interface ParseResult {
  success: boolean;
  errors: Array<{
    message: string;
    line: number;
    column: number;
    severity: "error";
  }>;
  warnings: Array<{
    message: string;
    line?: number;
    severity: "warn" | "info";
  }>;
}

export function parseJavaScript(code: string, isTypeScript: boolean = false): ParseResult {
  const errors: ParseResult["errors"] = [];
  const warnings: ParseResult["warnings"] = [];

  try {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: isTypeScript
        ? ["typescript", "jsx"]
        : ["jsx", "flow", "classProperties", "decorators-legacy"],
      errorRecovery: true,
    });

    // Traverse AST to find issues
    traverse(ast, {
      VariableDeclaration(path) {
        if (path.node.kind === "var") {
          warnings.push({
            message: "Avoid using 'var'; use 'let' or 'const' instead",
            line: path.node.loc?.start.line,
            severity: "warn",
          });
        }
      },
      BinaryExpression(path) {
        if (path.node.operator === "==" || path.node.operator === "!=") {
          warnings.push({
            message: `Use '===' instead of '${path.node.operator}' for strict equality`,
            line: path.node.loc?.start.line,
            severity: "warn",
          });
        }
      },
      CallExpression(path) {
        // @ts-ignore
        if (path.node.callee.object?.name === "console") {
          warnings.push({
            message: "Remove console.log statements before production",
            line: path.node.loc?.start.line,
            severity: "info",
          });
        }
      },
      FunctionDeclaration(path) {
        const params = path.node.params.length;
        if (params > 5) {
          warnings.push({
            message: `Function has ${params} parameters; consider refactoring (max recommended: 5)`,
            line: path.node.loc?.start.line,
            severity: "warn",
          });
        }
      },
    });

    return { success: true, errors, warnings };
  } catch (error: any) {
    // Parse syntax errors
    if (error.loc) {
      errors.push({
        message: error.message.replace(/\s*\(\d+:\d+\)$/, ""),
        line: error.loc.line,
        column: error.loc.column,
        severity: "error",
      });
    } else {
      errors.push({
        message: error.message || "Syntax error",
        line: 1,
        column: 0,
        severity: "error",
      });
    }
    return { success: false, errors, warnings };
  }
}

export function parsePython(code: string): ParseResult {
  const errors: ParseResult["errors"] = [];
  const warnings: ParseResult["warnings"] = [];

  // Basic Python syntax checks
  const lines = code.split("\n");
  let indentStack = [0];
  let expectedIndent = false;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) return;

    // Check for common syntax errors
    if (trimmed.match(/^(def|class|if|elif|else|for|while|try|except|finally|with)\s/)) {
      if (!trimmed.endsWith(":")) {
        errors.push({
          message: `Missing ':' at end of ${trimmed.split(/\s+/)[0]} statement`,
          line: lineNum,
          column: line.length,
          severity: "error",
        });
      }
      expectedIndent = true;
    }

    // Check indentation
    const leadingSpaces = line.match(/^ */)?.[0].length || 0;
    if (line.includes("\t")) {
      warnings.push({
        message: "Use spaces instead of tabs for indentation",
        line: lineNum,
        severity: "warn",
      });
    }

    // Check for mixed indentation
    if (line.match(/^ *\t| *\t /)) {
      errors.push({
        message: "Mixed spaces and tabs in indentation",
        line: lineNum,
        column: 0,
        severity: "error",
      });
    }
  });

  // Check for unclosed strings
  let inString = false;
  let stringChar = "";
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if ((char === '"' || char === "'") && code[i - 1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
  }

  if (inString) {
    errors.push({
      message: "Unterminated string literal",
      line: lines.length,
      column: 0,
      severity: "error",
    });
  }

  return { success: errors.length === 0, errors, warnings };
}
