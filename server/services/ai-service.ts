import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface AIAnalysisResult {
  summary: string;
  securityIssues: string[];
  refactoringSuggestions: string[];
  bestPractices: string[];
  explanation: string;
}

export async function analyzeCodeWithAI(
  code: string,
  language: string,
  issues: Array<{ message: string; severity: string; line?: number }>,
  metrics: { cyclomatic: number; lines: number; functions: number; maintainability: number }
): Promise<AIAnalysisResult | null> {
  // Skip if no API key
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const prompt = `You are an expert code reviewer. Analyze this ${language} code and provide detailed insights.

Code:
\`\`\`${language}
${code}
\`\`\`

Current Analysis:
- Issues detected: ${issues.length}
- Cyclomatic complexity: ${metrics.cyclomatic}
- Lines of code: ${metrics.lines}
- Maintainability score: ${metrics.maintainability}/100

Please provide:
1. A brief summary (2-3 sentences) of the code quality
2. Any security vulnerabilities or concerns
3. Specific refactoring suggestions with code examples
4. Best practices that should be followed
5. An explanation of the main complexity issues

Format your response as JSON with these keys:
{
  "summary": "...",
  "securityIssues": ["...", "..."],
  "refactoringSuggestions": ["...", "..."],
  "bestPractices": ["...", "..."],
  "explanation": "..."
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer who provides constructive, actionable feedback. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) return null;

    const aiResult = JSON.parse(content) as AIAnalysisResult;
    return aiResult;
  } catch (error) {
    console.error("AI analysis error:", error);
    return null;
  }
}

export async function explainIssue(
  issue: string,
  code: string,
  language: string,
  line?: number
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return "AI explanation unavailable (API key not configured)";
  }

  try {
    const lineContext = line ? `on line ${line}` : "";
    const prompt = `Explain this code issue in simple terms and provide a fix:

Language: ${language}
Issue: ${issue} ${lineContext}

Code snippet:
\`\`\`${language}
${code}
\`\`\`

Provide a clear explanation and suggested fix in 2-3 sentences.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful coding tutor who explains issues clearly and concisely.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    return response.choices[0].message.content || "Unable to generate explanation";
  } catch (error) {
    console.error("Issue explanation error:", error);
    return "Unable to generate explanation";
  }
}
