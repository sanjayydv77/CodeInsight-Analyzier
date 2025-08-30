import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <LogoMark className="h-6 w-6" />
          <span>Codeinsight-Analyzer</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#analyze" className="hover:text-foreground">Analyze</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#analyze"
            className="hidden sm:inline-flex"
            aria-label="Start analyzing"
          >
            <Button size="sm">Start Now</Button>
          </a>
        </div>
      </div>
    </header>
    <main className="flex-1">{children}</main>
    <footer className="border-t bg-secondary/30">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg">
            <LogoMark className="h-5 w-5" />
            Codeinsight-Analyzer
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Advanced AI-powered analyzer for modern codebases. Built for clarity,
            speed, and developer excellence.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">© {new Date().getFullYear()} Codeinsight-Analyzer • Sanjay Yadav. All rights reserved.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Owner & Author</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Owner & Developer: Sanjay Yadav</li>
            <li>Project: CodeInsight Analyzer</li>
            <li>Ownership: 100% held by Sanjay Yadav</li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://instagram.com/sanjuydv_7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group"
            >
              <span className="icon icon-instagram" />
            </a>
            <a
              href="https://github.com/sanjayydv77"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group"
            >
              <span className="icon icon-github bg-primary" />
            </a>
            <a
              href="https://linkedin.com/in/sanjuydv7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-7 w-7 text-primary transition-transform duration-200 group-hover:scale-110 group-hover:text-[#0A66C2]"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.352V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.6 0 4.266 2.37 4.266 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.561 20.452h3.554V9H3.561v11.452z"/>
              </svg>
            </a>
            <a href="mailto:sanjuydv5357@gmail.com" aria-label="Email" className="group">
              <Mail className="h-7 w-7 text-primary transition-transform duration-200 group-hover:scale-110" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Project</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#how" className="hover:text-foreground">How it works</a></li>
            <li><a href="#analyze" className="hover:text-foreground">Analyze</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
