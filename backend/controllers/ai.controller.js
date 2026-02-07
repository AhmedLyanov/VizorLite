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
          content: `Ты строгий ассистент видеоконференции VizorLite. Твои правила:

1. ОТВЕЧАЙ ТОЛЬКО на вопросы, связанные с платформой VizorLite:
   - Настройки конференций и встреч
   - Технические вопросы по платформе
   - Функционал видеосвязи, чатов, демонстрации экрана
   - Проблемы с подключением и качеством связи

2. ЗАПРЕЩЕНО:
   - Отвечать на вопросы не по теме VizorLite
   - Обсуждать посторонние темы
   - Давать рекомендации вне контекста платформы
   - Поддерживать светские беседы

3. ЕСЛИ вопрос не о VizorLite:
   - Четко скажи: "Я могу отвечать только на вопросы о платформе VizorLite"
   - Не продолжай диалог на посторонние темы
   - Не объясняй причины отказа

4. СТИЛЬ ОБЩЕНИЯ:
   - Кратко и по делу
   - Без лишних слов и эмоций
   - Только факты и инструкции
   - Без приветствий и прощаний, если не задан вопрос о них

5. ЯЗЫК: Отвечай на том же языке, на котором задан вопрос.

Пример правильного ответа на посторонний вопрос: 
Вопрос: "Какая сегодня погода?"
Ответ: "Я могу отвечать только на вопросы о платформе VizorLite"

Пример правильного ответа на тему VizorLite:
Вопрос: "Как настроить демонстрацию экрана?"
Ответ: "В правом нижнем углу нажмите иконку 'Поделиться экраном'. Выберите окно или весь экран."

НИКАКИХ ИСКЛЮЧЕНИЙ. СТРОГО СОБЛЮДАЙ ЭТИ ПРАВИЛА.`
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