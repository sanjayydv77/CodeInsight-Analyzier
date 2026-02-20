import Analyzer from "@/components/Analyzer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, Workflow, Brain, Zap, Code2 } from "lucide-react";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_-10%,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center animate-fadein">
            <Badge className="mb-4" variant="secondary">
              🤖 AI-Powered • Multi-language • Monaco Editor • Real-time
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Codeinsight-Analyzer
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Analyze your code with AI-powered insights, syntax highlighting, and real-time error detection. 
              Get intelligent refactoring suggestions, security analysis, and best practices—across 10+ languages.
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Powerful Features</h2>
          <p className="text-muted-foreground">Everything you need for perfect code quality</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6 hover:border-primary transition-colors">
            <Brain className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">AI Code Review</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              GPT-4 powered analysis detects security flaws, suggests refactorings, and explains complexity issues in plain English.
            </p>
          </div>
          <div className="rounded-xl border p-6 hover:border-primary transition-colors">
            <Code2 className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Monaco Editor</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Same editor as VS Code with syntax highlighting, auto-complete, and intelligent error markers for 10+ languages.
            </p>
          </div>
          <div className="rounded-xl border p-6 hover:border-primary transition-colors">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">AST-Based Parsing</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              100% accurate syntax validation using Babel parser for JavaScript/TypeScript with line-precise error reporting.
            </p>
          </div>
          <div className="rounded-xl border p-6 hover:border-primary transition-colors">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Smart Suggestions</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get actionable refactoring advice, security warnings, and best practice recommendations tailored to your code.
            </p>
          </div>
          <div className="rounded-xl border p-6 hover:border-primary transition-colors">
            <Workflow className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Complexity Metrics</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Track cyclomatic complexity, maintainability score, and code quality with real-time scoring from 0-100.
            </p>
          </div>
          <div className="rounded-xl border p-6 hover:border-primary transition-colors">
            <Zap className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Instant Analysis</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-time feedback with 500ms debounce. See issues, metrics, and AI insights appear as you type.
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
            Paste or type your code in Monaco Editor, select the language, and watch live analysis appear instantly. 
            Our AST parser catches syntax errors with precision, while AI examines your code for security, 
            refactoring opportunities, and best practices. Get complexity metrics, issue reports, and intelligent 
            suggestions—all in real-time.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
            <div className="p-4 rounded-lg border">
              <div className="font-semibold mb-2">1. Write Code</div>
              <p className="text-sm text-muted-foreground">Use Monaco Editor with syntax highlighting</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="font-semibold mb-2">2. Auto-Analyze</div>
              <p className="text-sm text-muted-foreground">Get instant syntax validation & metrics</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="font-semibold mb-2">3. AI Insights</div>
              <p className="text-sm text-muted-foreground">Receive intelligent suggestions & fixes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
