import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  SupportedLanguage,
} from "@shared/api";
import { Loader2, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

const LANGUAGES: SupportedLanguage[] = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "cpp",
  "go",
  "rust",
  "php",
  "ruby",
];

function useDebouncedCallback(cb: () => void, delay: number) {
  const timeout = useRef<number | undefined>();
  return () => {
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(cb, delay);
  };
}

export function Analyzer() {
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState<string>(
    `function greet(name) {\n  if (!name) {\n    console.log('Missing name');\n    return;\n  }\n  for (let i = 0; i < 3; i++) {\n    console.log('Hello, ' + name + '!');\n  }\n}`,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const analyze = async () => {
    const trimmed = code.trim();
    if (trimmed.length === 0) {
      setResult(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: AnalyzeRequest = { code: trimmed, language };
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Analyze failed (${res.status})`);
      const data = (await res.json()) as AnalyzeResponse;
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const debounced = useDebouncedCallback(analyze, 500);

  useEffect(() => {
    debounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, language]);

  const scoreColor = useMemo(() => {
    const s = result?.metrics.score ?? 0;
    if (s >= 85) return "text-emerald-600";
    if (s >= 70) return "text-lime-600";
    if (s >= 50) return "text-amber-600";
    return "text-rose-600";
  }, [result?.metrics.score]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Code Input</span>
            <div className="w-56">
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as SupportedLanguage)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-[380px] font-mono text-sm leading-6"
            spellCheck={false}
            placeholder={`Paste your ${language} code here...`}
          />
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={analyze} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Now
            </Button>
            <Button
              variant="outline"
              onClick={() => setCode("")}
              disabled={loading || code.length === 0}
            >
              Clear
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Report</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-sm text-muted-foreground">
                Start typing or click Analyze to see results.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className={`text-4xl font-extrabold ${scoreColor}`}>
                    {result.metrics.score}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">Cyclomatic</div>
                  <div className="text-3xl font-semibold">
                    {result.metrics.cyclomatic}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">Lines</div>
                  <div className="text-3xl font-semibold">
                    {result.metrics.lines}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">Functions</div>
                  <div className="text-3xl font-semibold">
                    {result.metrics.functions}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result || result.issues.length === 0 ? (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> No issues detected.
              </div>
            ) : (
              <ul className="space-y-2">
                {result.issues.map((iss, i) => (
                  <li key={i} className="text-sm">
                    <span
                      className={
                        iss.severity === "error"
                          ? "text-rose-600"
                          : iss.severity === "warn"
                          ? "text-amber-600"
                          : "text-foreground"
                      }
                    >
                      {iss.severity.toUpperCase()}
                    </span>
                    : {iss.message}
                    {typeof iss.line === "number" && (
                      <span className="text-muted-foreground"> (line {iss.line})</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result || result.suggestions.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Suggestions will appear after analysis.
              </div>
            ) : (
              <ul className="list-inside list-disc space-y-2 text-sm">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Analyzer;
