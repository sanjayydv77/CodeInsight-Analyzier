import Analyzer from "@/components/Analyzer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, Workflow } from "lucide-react";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_-10%,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center animate-fadein">
            <Badge className="mb-4" variant="secondary">
              AI • Multi-language • Live Reporting
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Codeinsight-Analyzer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Analyze your code in real-time, across 10+ languages. Get error detection, complexity scoring, and instant AI-grade suggestions to improve quality and maintainability.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <a href="#analyze">
                <Button size="lg" className="px-8">Start Analyzing</Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline" className="px-8">Explore Features</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-10 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">AI-assisted Analysis</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Intelligent checks provide meaningful, actionable insights—complexity, risks, and improvements.
            </p>
          </div>
          <div className="rounded-xl border p-6">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Error Detection</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Detect unbalanced brackets, long lines, and language-specific pitfalls instantly.
            </p>
          </div>
          <div className="rounded-xl border p-6">
            <Workflow className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Live Suggestions</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Improve as you type with real-time scoring and best-practice recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Analyzer */}
      <section id="analyze" className="container py-12 md:py-16">
        <Analyzer />
      </section>

      {/* How it works */}
      <section id="how" className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="mt-4 text-muted-foreground">
            Paste or type your code, select the language, and watch the live report update. We compute complexity metrics and highlight issues so you can ship better software, faster.
          </p>
        </div>
      </section>
    </div>
  );
}
