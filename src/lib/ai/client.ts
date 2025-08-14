interface GenerateOptions {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface HFResponse {
  generated_text: string;
}

class AIClient {
  private provider: string;
  private ollamaUrl: string;
  private ollamaModel: string;
  private hfApiUrl: string;
  private hfToken: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'ollama';
    this.ollamaUrl = 'http://127.0.0.1:11434/api/generate';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    this.hfApiUrl = process.env.HF_API_URL || '';
    this.hfToken = process.env.HF_TOKEN || '';
  }

  async generate(options: GenerateOptions): Promise<string> {
    const { system, prompt, maxTokens = 500, temperature = 0.7 } = options;
    
    if (this.provider === 'ollama') {
      return this.generateWithOllama(system, prompt, maxTokens, temperature);
    } else {
      return this.generateWithHF(system, prompt, maxTokens, temperature);
    }
  }

  private async generateWithOllama(
    system: string, 
    prompt: string, 
    maxTokens: number, 
    temperature: number
  ): Promise<string> {
    try {
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt: `<|system|>${system}<|end|>\n<|user|>${prompt}<|end|>\n<|assistant|>`,
          stream: false,
          options: {
            num_predict: maxTokens,
            temperature: temperature,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response.trim();
    } catch (error) {
      console.error('Ollama generation failed:', error);
      
      // Fallback to mock responses for testing
      return this.generateMockResponse(system, prompt);
    }
  }

  private generateMockResponse(system: string, prompt: string): string {
    // Simple mock responses for testing when AI is not available
    if (system.includes('rewrite') || system.includes('Rewrite')) {
      return '- Developed and maintained scalable software applications using modern technologies\n- Collaborated with cross-functional teams to deliver high-quality solutions\n- Implemented best practices for code quality and performance optimization';
    } else if (system.includes('Extract') || system.includes('extract')) {
      return '- Led development of critical software features and system improvements\n- Mentored junior developers and conducted code reviews\n- Optimized application performance resulting in 25% faster load times';
    } else if (system.includes('summary') || system.includes('Summary')) {
      return 'Experienced software engineer with expertise in full-stack development, system architecture, and team leadership. Proven track record of delivering high-quality software solutions and mentoring development teams.';
    } else if (system.includes('cover') || system.includes('Cover')) {
      return 'Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position. With my experience in software development and passion for creating innovative solutions, I believe I would be a valuable addition to your team.\n\nBest regards,\n[Your Name]';
    }
    
    return 'Generated content based on your input. Please configure AI provider for full functionality.';
  }

  private async generateWithHF(
    system: string, 
    prompt: string, 
    maxTokens: number, 
    temperature: number
  ): Promise<string> {
    if (!this.hfApiUrl || !this.hfToken) {
      throw new Error('HF_API_URL and HF_TOKEN must be set for Hugging Face provider');
    }

    try {
      const response = await fetch(this.hfApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<|system|>${system}<|end|>\n<|user|>${prompt}<|end|>\n<|assistant|>`,
          parameters: {
            max_new_tokens: maxTokens,
            temperature: temperature,
            do_sample: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HF API error: ${response.status}`);
      }

      const data: HFResponse[] = await response.json();
      return data[0]?.generated_text?.trim() || '';
    } catch (error) {
      console.error('HF generation failed:', error);
      throw new Error('Failed to generate with Hugging Face');
    }
  }
}

// Export singleton instance
export const aiClient = new AIClient();

// Export the generate function for convenience
export const generate = (options: GenerateOptions) => aiClient.generate(options);
