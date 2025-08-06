// OpenRouter API Service for Demo Mode
// This provides online inference fallback when local model is not available

export interface APIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface APIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  usage?: {
    total_tokens: number
  }
}

export interface Suggestion {
  text: string
  confidence: string
  reasoning: string
}

export class OpenRouterAPI {
  private apiKey: string
  private model: string
  private url: string
  private appUrl: string

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    this.model = import.meta.env.VITE_OPENROUTER_MODEL
    this.url = import.meta.env.VITE_OPENROUTER_URL
    this.appUrl = import.meta.env.VITE_APP_URL || 'https://clarity-demo.com'
    
    console.log('OpenRouter API Config:', {
      hasApiKey: !!this.apiKey,
      hasModel: !!this.model,
      hasUrl: !!this.url,
      apiKeyLength: this.apiKey?.length || 0
    })
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.model && this.url)
  }

  async callGemma3nAPI(userMessage: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter API not configured. Check your .env file.')
    }

    if (!navigator.onLine) {
      throw new Error('No internet connection. Demo mode requires online access.')
    }

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': this.appUrl,
        'X-Title': 'Clarity',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    const data: APIResponse = await response.json()
    return data.choices[0]?.message?.content || 'No response from API'
  }

  async getSuggestions(userInput: string): Promise<Suggestion[]> {
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
      const response = await this.callGemma3nAPI(prompt)
      
      // Robust parsing: handle both string and object responses
      let suggestions: Suggestion[]
      
      try {
        let jsonString = response
        
        // Handle markdown-wrapped JSON (```json ... ```)
        if (typeof response === 'string') {
          // Remove markdown code blocks if present
          const markdownMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
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
        console.warn('Failed to parse API response as JSON:', response)
        
        // Fallback: create a suggestion with warning
        suggestions = [{
          text: response.substring(0, 200) + (response.length > 200 ? '...' : ''),
          confidence: 'medium',
          reasoning: 'AI-generated response (parsing failed)'
        }]
      }

      return suggestions
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }
}

// Singleton instance
export const openRouterAPI = new OpenRouterAPI() 