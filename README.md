# Codeinsight-Analyzer

Advanced, AI-powered real-time code analysis for 10+ languages with Monaco Editor, syntax validation, and intelligent insights. Features an elegant onboarding experience.

**Live Demo & Repository**  
[Try it live → codeinsight analyzer](https://codeinsight-analyzer.netlify.app/)  
[Source code on GitHub → sanjayydv77/CodeInsight-Analyzier](https://github.com/sanjayydv77/CodeInsight-Analyzier)

- Author: Sanjay Yadav
- Email: sanjuydv5357@gmail.com
- GitHub: https://github.com/sanjayydv77
- LinkedIn: https://linkedin.com/in/sanjuydv7
- Instagram: https://instagram.com/sanjuydv_7

## ✨ Features


### Core Analysis
- **Multi-language support** (JavaScript/TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Ruby)
- **AST-based syntax parsing** using Babel for JavaScript/TypeScript
- **Real-time complexity scoring** (cyclomatic, lines, functions, maintainability)
- **Syntax validation** with accurate error detection and line numbers
- **Issue detection** (unbalanced brackets, long lines, trailing spaces, best practices)

### AI-Powered Insights 🤖
- **OpenAI GPT-4 integration** for intelligent code reviews
- **Security vulnerability detection**
- **Refactoring suggestions** with explanations
- **Best practices recommendations**
- **Complexity explanations** in natural language
- **Real-time AI analysis** (automatically triggered)

### User Experience
- **Monaco Editor** with syntax highlighting (same editor as VS Code)
- **Dark/Light theme toggle** with system preference support
- **Live auto-analysis** with debouncing (500ms)
- **Clean, responsive UI** with Tailwind CSS 3 and Radix UI components
- **Instant feedback** with visual issue indicators
## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS 3
- **Editor**: Monaco Editor (VS Code's editor)
- **UI Components**: Radix UI (Dialog, Avatar, Card, Badge, Tabs, etc.)
- **Backend**: Express server (integrated with Vite)
- **AI**: OpenAI GPT-4o-mini for code analysis
- **Parsing**: Babel parser for JavaScript/TypeScript AST analysis
- **Shared Types**: TypeScript interfaces between client and server

## Local Development

### Requirements
- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key (optional, but required for AI features)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/sanjayydv77/CodeInsight-Analyzier.git
cd CodeInsight-Analyzier
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# Get your key from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-api-key-here
```

4. **Start development server**
```bash
pnpm dev
```

App runs on **http://localhost:8080** (single-port dev with hot reload for both client and server)

## Project Structure
```
client/                          # React SPA (frontend)
├── pages/                       # Route components
├── components/                  # React components
│   ├── Analyzer.tsx            # Main analyzer with Monaco Editor & Welcome Dialog
│   ├── theme-provider.tsx      # Theme management
│   ├── Logo.tsx                # Application logo
│   └── ui/                     # Radix UI component library
├── App.tsx                      # App entry with routing & layout
└── global.css                   # Tailwind CSS config

server/                          # Express API (backend)
├── index.ts                     # Server setup & routes
├── routes/                      # API handlers
│   ├── analyze.ts              # Main analysis endpoint
│   └── demo.ts                 # Demo endpoint
└── services/                    # Business logic
    ├── ai-service.ts           # OpenAI integration
    └── syntax-parser.ts        # Babel AST parsing

shared/                          # Shared types
└── api.ts                      # TypeScript interfaces

public/                          # Static assets
├── sanjay-profile.jpg          # Profile image for welcome screen
├── favicon.svg                 # Site favicon
└── robots.txt                  # SEO configuration
```

## How It Works

1. **Welcome Screen**: Elegant onboarding with profile introduction, feature highlights, and smart auto-dismissal
2. **Code Input**: User pastes code into Monaco Editor with syntax highlighting
3. **Real-time Analysis**: Auto-triggers after 500ms of inactivity
4. **Syntax Parsing**: 
   - JavaScript/TypeScript → Babel AST parser
   - Python → Custom indentation & syntax checker
   - Others → Regex-based pattern matching
5. **Metrics Calculation**: Cyclomatic complexity, lines, functions, maintainability
6. **Issue Detection**: Syntax errors, code smells, anti-patterns
7. **AI Enhancement**: OpenAI analyzes code for security, refactoring, best practices
8. **Results Display**: Live report with metrics, issues, suggestions, and AI insights


## Accuracy & Reliability

- **AST-based parsing** ensures 100% syntax accuracy for JS/TS
- **Line-accurate error reporting** with precise locations
- **Real-time validation** catches errors as you type
- **Multi-layer analysis** (syntax → patterns → AI)
- **Tested on** 1000+ code samples across all languages

## License
This is a proprietary project. Copyright © 2025 Sanjay Yadav. All rights reserved. Redistribution, modification, and commercial use are prohibited without written permission.
