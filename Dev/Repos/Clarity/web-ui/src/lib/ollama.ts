// Ollama API Service for Local Inference
// This provides local model inference via Ollama HTTP API

export interface OllamaConfig {
  serverUrl: string
  modelName: string
}

export interface OllamaGenerateRequest {
  model: string
  prompt: string
  stream?: boolean
}

export interface OllamaGenerateResponse {
  response: string
  done: boolean
  context?: number[]
}

export interface OllamaTagsResponse {
  models: Array<{
    name: string
    modified_at: string
    size: number
  }>
}

export interface Suggestion {
  text: string
  confidence: string
  reasoning: string
}

export class OllamaAPI {
  private config: OllamaConfig

  constructor(config: OllamaConfig) {
    this.config = config
  }

  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return { connected: false, error: `HTTP ${response.status}: ${response.statusText}` }
      }

      await response.json()
      return { connected: true }
    } catch (error) {
      return { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Connection failed' 
      }
    }
  }

  async testModel(): Promise<{ available: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.config.serverUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.modelName,
          prompt: 'test',
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        return { 
          available: false, 
          error: `Model test failed: ${response.status} ${errorText}` 
        }
      }

      return { available: true }
    } catch (error) {
      return { 
        available: false, 
        error: error instanceof Error ? error.message : 'Model test failed' 
      }
    }
  }

  async generateSuggestions(userInput: string): Promise<Suggestion[]> {
    const prompt = `You are Clarity, a cognitive partner that helps with communication challenges. 
    
    The user said: "${userInput}"
    
    Provide 2-3 actionable suggestions in this exact JSON format (NO markdown formatting, just pure JSON):
    {
      "suggestions": [
        {
          "text": "specific actionable suggestion",
          "confidence": "high",
          "reasoning": "brief explanation of why this helps"
        }
      ]
    }
    
    Focus on practical communication strategies, word-finding techniques, or social interaction advice.
    
    IMPORTANT: Return ONLY the JSON object, no markdown formatting, no code blocks, no extra text.`

    try {
      const response = await fetch(`${this.config.serverUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.modelName,
          prompt: prompt,
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API error: ${response.status} ${errorText}`)
      }

      const data: OllamaGenerateResponse = await response.json()
      const responseText = data.response

      // Parse the JSON response
      let suggestions: Suggestion[]
      
      try {
        let jsonString = responseText
        
        // Handle markdown-wrapped JSON (```json ... ```)
        if (typeof responseText === 'string') {
          // Remove markdown code blocks if present
          const markdownMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
          if (markdownMatch) {
            jsonString = markdownMatch[1].trim()
          }
        }
        
        // Parse the JSON
        const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
        
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          suggestions = parsed.suggestions
        } else {
          throw new Error('Invalid response format')
        }
      } catch (parseError) {
        console.warn('Failed to parse Ollama response as JSON:', responseText)
        
        // Fallback: create a suggestion with warning
        suggestions = [{
          text: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
          confidence: 'medium',
          reasoning: 'AI-generated response (parsing failed)'
        }]
      }

      return suggestions
    } catch (error) {
      console.error('Ollama API call failed:', error)
      throw error
    }
  }
} 