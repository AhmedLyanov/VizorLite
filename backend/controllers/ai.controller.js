import axios from "axios";
import crypto from "crypto";
import https from "https";

let cachedToken = null;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function getAccessToken() {
  const authKey = process.env.GIGACHAT_AUTH_KEY;

  if (!authKey) {
    throw new Error("GigaChat authorization key not configured");
  }
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.value;
  }

  const response = await axios.post(
    "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    new URLSearchParams({
      scope: "GIGACHAT_API_PERS"
    }),
    {
      headers: {
        Authorization: `Basic ${authKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        RqUID: crypto.randomUUID()
      },
      httpsAgent
    }
  );

  cachedToken = {
    value: response.data.access_token,
    expiresAt: response.data.expires_at
  };

  return cachedToken.value;
}

class AIController {

  async chat(req, res) {
    try {

      const { message, messages } = req.body;

      if (!message || typeof message !== "string" || !Array.isArray(messages)) {
        return res.status(400).json({
          error: "Invalid request format",
          success: false
        });
      }

      const accessToken = await getAccessToken();

      const contextMessages = [
        {
          role: "system",
          content: `Ты строгий ассистент видеоконференции VizorLite.

Правила:

1. Отвечай только на вопросы о платформе VizorLite:
- создание комнат
- видеоконференции
- демонстрация экрана
- проблемы подключения
- микрофон и камера
- работа платформы

2. Если вопрос не о VizorLite отвечай:
"Я могу отвечать только на вопросы о платформе VizorLite"

3. Отвечай кратко и по делу.

4. Не поддерживай разговор на другие темы.

5. Язык ответа должен совпадать с языком пользователя.`
        },
        ...messages,
        {
          role: "user",
          content: message.trim()
        }
      ];

      const response = await axios.post(
        "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
        {
          model: "GigaChat",
          messages: contextMessages,
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          httpsAgent,
          timeout: 30000
        }
      );

      const assistantReply =
        response.data.choices?.[0]?.message?.content?.trim() || "";

      if (!assistantReply) {
        return res.status(502).json({
          error: "AI returned empty response",
          success: false
        });
      }

      res.json({
        reply: assistantReply,
        success: true
      });

    } catch (error) {

      console.error("❌ GigaChat error:", error.response?.data || error.message);

      if (error.response) {
        return res.status(error.response.status).json({
          error: error.response.data.message || "GigaChat API error",
          success: false
        });
      }

      if (error.code === "ECONNABORTED") {
        return res.status(504).json({
          error: "AI request timeout",
          success: false
        });
      }

      res.status(500).json({
        error: "AI service error",
        success: false
      });

    }
  }

  async status(req, res) {
    res.json({
      status: "ok",
      service: "GigaChat",
      connected: !!process.env.GIGACHAT_AUTH_KEY
    });
  }

}

export default new AIController();