# AI Setup Instructions

## Getting Your OpenAI API Key

1. **Sign up for OpenAI**
   - Go to https://platform.openai.com/signup
   - Create an account or sign in

2. **Get API Key**
   - Navigate to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "CodeInsight Analyzer")
   - Copy the key immediately (you won't see it again!)

3. **Add Credits** (if needed)
   - Go to https://platform.openai.com/account/billing
   - Add payment method
   - Most analyses cost $0.001-0.01 per request
   - $5 credit is enough for thousands of analyses

## Configure the Project

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Restart the dev server**
   ```bash
   pnpm dev
   ```

## Testing AI Features

1. Start the app
2. Paste some code in the editor
3. Click "Analyze Now"
4. You should see an "AI Insights" card with:
   - Summary
   - Security concerns
   - Refactoring suggestions
   - Best practices
   - Complexity explanation

## Troubleshooting

### "AI Insights" not appearing
- Check that OPENAI_API_KEY is set in .env
- Restart the dev server after adding the key
- Check browser console for errors
- Verify API key is valid at https://platform.openai.com/api-keys

### "Rate limit exceeded"
- You've used up your free credits
- Add payment method at https://platform.openai.com/account/billing
- Or wait for the rate limit to reset (usually 1 minute)

### "Invalid API key"
- Make sure you copied the entire key
- Check for extra spaces in .env file
- Generate a new key if needed

## Cost Estimation

- **Per analysis**: ~$0.001 - $0.01 (depends on code size)
- **1000 analyses**: ~$1 - $10
- **Monthly (active development)**: ~$5 - $20

Tips to reduce costs:
- AI only triggers when you click "Analyze Now"
- Smaller code samples = lower cost
- Use free syntax checking (works without AI)

## Alternative: Run Without AI

The analyzer works perfectly without AI! You'll still get:
- ✅ Syntax validation
- ✅ Code metrics
- ✅ Issue detection
- ✅ Monaco Editor
- ✅ All standard features

Just skip the .env setup and the AI Insights card won't appear.

## Production Deployment

For production (Netlify/Vercel):
1. Add OPENAI_API_KEY to environment variables in your hosting dashboard
2. Never commit .env file to git
3. Use separate API keys for dev and production
4. Monitor usage at https://platform.openai.com/usage
