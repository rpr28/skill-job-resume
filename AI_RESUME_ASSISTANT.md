# AI Resume Assistant

A privacy-friendly, cost-effective AI assistant for resume building and optimization, supporting both HTML and LaTeX formats.

## Features

- **Bullet Point Extraction**: Convert raw experience text into professional STAR-style bullet points
- **Bullet Point Rewriting**: Polish existing bullet points with multiple variants
- **Summary Generation**: Create professional executive summaries
- **ATS Score Matching**: Calculate resume-job description similarity and keyword coverage
- **Cover Letter Generation**: Generate tailored cover letters
- **LaTeX Support**: Generate LaTeX code for RenderCV format resumes

## Setup

### 1. Dependencies

The required dependencies are already installed:
- `ollama` - Local LLM inference
- `zod` - Input validation

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```bash
# AI Configuration
AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.1:8b

# Optional: Hugging Face Inference API (fallback)
# HF_API_URL=https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1
# HF_TOKEN=your_hf_token_here
```

### 3. Local Ollama Setup (Recommended)

1. Install Ollama:
   ```bash
   brew install ollama
   ```

2. Pull the model:
   ```bash
   ollama pull llama3.1:8b
   ```

3. Start the Ollama daemon:
   ```bash
   ollama serve
   ```

4. Test the model:
   ```bash
   ollama run llama3.1:8b "Hello, world!"
   ```

### 4. Alternative: Hugging Face Setup

If you prefer to use Hugging Face Inference API:

1. Get a Hugging Face token from https://huggingface.co/settings/tokens
2. Set `AI_PROVIDER=hf` in your `.env.local`
3. Add your `HF_API_URL` and `HF_TOKEN`

## Usage

### API Endpoints

All endpoints are available under `/api/ai/`:

- `POST /api/ai/rewrite-bullets` - Rewrite bullet points
- `POST /api/ai/extract-bullets` - Extract bullets from raw text
- `POST /api/ai/summary` - Generate professional summary
- `POST /api/ai/cover-letter` - Generate cover letter
- `POST /api/ai/ats-score` - Calculate ATS match score

### Frontend Integration

The AI Assistant is available in two formats:

#### 1. HTML Resume Builder (`/resume`)
- **Collapsible Panel**: Right-side panel that can be expanded/collapsed
- **Extract Bullets**: Paste raw experience and get professional bullet points
- **Polish Bullets**: Rewrite existing bullet points with AI suggestions
- **Generate Summary**: Create professional summaries
- **ATS Scoring**: Calculate match scores and keyword coverage
- **Cover Letters**: Generate tailored cover letters

#### 2. LaTeX Resume Builder (`/latex-resume`)
- **LaTeX Editor**: Full LaTeX editor with syntax highlighting
- **AI Content Generation**: Generate LaTeX code for:
  - Bullet points (`\begin{highlights}...\end{highlights}`)
  - Experience entries (`\begin{twocolentry}...\end{twocolentry}`)
  - Project entries with proper formatting
- **Copy & Paste**: Easy copying of generated LaTeX code
- **Preview Mode**: Visual preview of resume structure
- **RenderCV Compatible**: Works with RenderCV LaTeX templates

### React Hooks

Custom hooks for easy integration:

- `useAIRewrite()` - Bullet point rewriting
- `useAIExtract()` - Bullet extraction from raw text
- `useAISummary()` - Summary generation
- `useAICover()` - Cover letter generation
- `useATSScore()` - ATS scoring

## Architecture

### AI Client (`lib/ai/client.ts`)
- Provider-agnostic client supporting Ollama and Hugging Face
- Automatic fallback handling
- Configurable models and parameters

### Embeddings (`lib/ai/embeddings-server.ts`)
- Uses TF-IDF based similarity scoring
- Server-side only implementation
- Provides cosine similarity scoring

### Prompts (`lib/ai/prompts.ts`)
- Strict prompt templates to prevent hallucinations
- Context-aware prompt builders
- Consistent formatting and constraints

### Rate Limiting (`lib/ai/rate-limit.ts`)
- In-memory token bucket rate limiting
- Per-endpoint rate limits
- IP-based tracking

## LaTeX Integration

### Supported LaTeX Elements

The AI Assistant can generate LaTeX code for:

1. **Bullet Points**:
   ```latex
   \begin{highlights}
   \item Developed React application with 10,000+ users
   \item Implemented REST API reducing response time by 40%
   \item Led team of 5 developers in agile environment
   \end{highlights}
   ```

2. **Experience Entries**:
   ```latex
   \begin{twocolentry}{
       San Francisco, CA

   June 2020 – Present
   }
       \textbf{Google}, Senior Software Engineer
       \begin{highlights}
       \item Led development of cloud infrastructure serving 1M+ users
       \item Mentored 3 junior engineers and conducted code reviews
       \item Reduced deployment time by 60% through CI/CD optimization
       \end{highlights}
   \end{twocolentry}
   ```

3. **Project Entries**:
   ```latex
   \begin{twocolentry}{
       \href{https://github.com/username/project}{github.com/username/project}
   }
       \textbf{Machine Learning Dashboard}
       \begin{highlights}
       \item Built real-time ML model monitoring dashboard using React and Python
       \item Integrated with TensorFlow and scikit-learn for model evaluation
       \item Deployed on AWS with Docker containerization
       \end{highlights}
   \end{twocolentry}
   ```

### Workflow

1. **Generate Content**: Use AI Assistant to create LaTeX code
2. **Copy Code**: Copy the generated LaTeX code
3. **Paste in Editor**: Paste into your LaTeX editor or RenderCV YAML
4. **Customize**: Edit company names, dates, and details
5. **Compile**: Use LaTeX compiler to generate PDF

## Performance

- **Embeddings**: ~100ms TF-IDF calculation
- **Text Generation**: 2-5 seconds depending on input length
- **Rate Limits**: Prevents accidental flooding during development

## Privacy & Security

- **Local Processing**: Ollama runs entirely on your machine
- **No Data Storage**: No user data is stored or logged
- **Input Validation**: All inputs validated with Zod schemas
- **Rate Limiting**: Prevents abuse and excessive API calls

## Troubleshooting

### Ollama Issues
1. Ensure Ollama daemon is running: `ollama serve`
2. Check model is downloaded: `ollama list`
3. Test model: `ollama run llama3.1:8b "test"`

### Embedding Issues
1. TF-IDF scoring is fast and doesn't require model downloads
2. Check server logs for any calculation errors
3. Ensure text inputs are properly formatted

### API Errors
1. Check environment variables are set correctly
2. Verify rate limits aren't exceeded
3. Check network connectivity for Hugging Face API

### LaTeX Issues
1. Ensure LaTeX code is properly formatted
2. Use a LaTeX compiler like Overleaf or TeXstudio
3. Check for missing packages or syntax errors

## Development Notes

- All AI code is server-side only (tree-shake friendly)
- Embeddings use TF-IDF for fast, privacy-friendly scoring
- Rate limiting is in-memory (resets on server restart)
- Timeouts set to 20 seconds for all AI operations
- LaTeX generation preserves RenderCV format compatibility
