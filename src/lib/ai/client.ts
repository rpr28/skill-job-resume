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
      throw new Error('Failed to generate with Ollama');
    }
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
