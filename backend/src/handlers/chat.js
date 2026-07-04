const { LLMService } = require('../services/llm');
const { LoggingService } = require('../services/logging');

class ChatHandler {
  constructor() {
    this.llmService = new LLMService();
    this.loggingService = new LoggingService();
  }

  async handleChat(event) {
    try {
      const body = JSON.parse(event.body || '{}');
      
      if (!body.message) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          },
          body: JSON.stringify({
            error: 'Message is required'
          })
        };
      }

      // Log the incoming request
      await this.loggingService.logUserQuery({
        message: body.message,
        timestamp: new Date().toISOString(),
        userId: body.userId || 'anonymous'
      });

      // Process with LLM
      const response = await this.llmService.processMessage(body.message);

      // Log the response
      await this.loggingService.logChatbotResponse({
        response: response.message,
        timestamp: new Date().toISOString(),
        userId: body.userId || 'anonymous'
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
          message: response.message,
          timestamp: new Date().toISOString()
        })
      };
    } catch (error) {
      console.error('Chat handler error:', error);
      
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
          error: 'Internal server error'
        })
      };
    }
  }

  async handleHealth(event) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString()
      })
    };
  }
}

module.exports = { ChatHandler };