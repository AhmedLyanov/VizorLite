import axios from 'axios';

class AIController {
  async chat(req, res) {
    try {
      const { message, messages } = req.body;
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'API key not configured' 
        });
      }

      if (!message || typeof message !== 'string' || !Array.isArray(messages)) {
        return res.status(400).json({
          error: 'Invalid request format: message must be string and messages must be array',
          success: false
        });
      }

      const contextMessages = [
        { 
          role: "system", 
          content: "Ты добрый и щедрый ассистент для видеоконференций. Отвечай на русском языке. Помогай пользователям с вопросами о конференциях, встречами, планированием. Будь кратким и полезным." 
        },
        ...messages,
        { role: "user", content: message.trim() }
      ];


      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "tngtech/deepseek-r1t2-chimera:free",
          messages: contextMessages
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
            'X-Title': 'VizorLite'
          },
          timeout: 30000 
        }
      );

      
      const assistantReply = response.data.choices?.[0]?.message?.content?.trim() || '';
      
      if (!assistantReply) {
        console.warn('⚠️ Empty response from AI');
        return res.status(502).json({
          error: 'AI returned empty response',
          success: false
        });
      }      
      res.json({ 
        reply: assistantReply,
        success: true 
      });

    } catch (error) {
      console.error('❌ AI API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        res.status(error.response.status).json({
          error: error.response.data.error?.message || `AI service error (${error.response.status})`,
          success: false
        });
      } else if (error.code === 'ECONNABORTED') {
        res.status(504).json({
          error: 'Request timeout. Please try again.',
          success: false
        });
      } else {
        res.status(500).json({
          error: 'Internal server error: ' + error.message,
          success: false
        });
      }
    }
  }

  async status(req, res) {
    res.json({ 
      status: 'ok', 
      service: 'AI Assistant',
      connected: !!process.env.OPENROUTER_API_KEY 
    });
  }
}

export default new AIController();