# Codeinsight-Analyzer

Advanced, real‑time code analysis for 10+ languages with live reports, issue detection, and actionable suggestions.

- Author: Sanjay Yadav
- Email: sanjuydv5357@gmail.com
- GitHub: https://github.com/sanjayydv77
- LinkedIn: https://linkedin.com/in/sanjuydv7
- Instagram: https://instagram.com/sanjuydv_7

## Features
- Multi-language static analysis (JS/TS, Python, Java, C#, C++, Go, Rust, PHP, Ruby)
- Live complexity scoring (cyclomatic, lines, functions, maintainability)
- Issue detection (unbalanced brackets, long lines, trailing spaces, etc.)
- Real-time suggestions to improve readability and maintainability
- Clean, responsive UI with dark purple theme

## Tech Stack
- React 18 + Vite + TypeScript + Tailwind CSS 3
- Express server (integrated with Vite) for API endpoints
- Shared TypeScript types between client and server

## Local Development
Requirements: Node 18+ and pnpm

```bash
pnpm install
pnpm dev
```
App runs on http://localhost:8080 (single-port dev). Hot reload for client and server.

## Scripts
- pnpm dev – start dev server
- pnpm build – build client and server
- pnpm start – run production build
- pnpm test – run tests
- pnpm typecheck – TypeScript checks

## Project Structure
- client/ – React SPA (pages, components, UI library)
- server/ – Express routes (e.g., POST /api/analyze)
- shared/ – Types shared by client and server

## Deployment
Connect to Netlify or Vercel and deploy from your GitHub repo. The app builds with `pnpm build`.

## License
This is a proprietary project. Copyright © 2025 Sanjay Yadav. All rights reserved. Redistribution, modification, and commercial use are prohibited without written permission.
