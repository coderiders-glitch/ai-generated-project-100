class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async processMessage(message) {
    try {
      if (!this.apiKey) {
        // Fallback response when no API key is configured
        return {
          message: `Echo: ${message}`,
          model: 'fallback',
          timestamp: new Date().toISOString()
        };
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.choices[0].message.content.trim(),
        model: data.model,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('LLM service error:', error);
      
      // Return fallback response on error
      return {
        message: 'I apologize, but I am currently unable to process your request. Please try again later.',
        model: 'fallback',
        timestamp: new Date().toISOString(),
        error: true
      };
    }
  }

  async validateApiKey() {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

module.exports = { LLMService };