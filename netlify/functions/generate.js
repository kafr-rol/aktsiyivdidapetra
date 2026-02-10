const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Сгенерируй для мема "цель ТЦК":
      - Одно случайное русское мемное слово (типа пельмень, таракан, доширак, skibidi, ohio)
      - Абсурдное объяснение, почему он провинился (1-2 предложения, чёрный юмор)
      - Куда его хотят отправить (например "на ноль", "в мясной штурм на Донбасс", "в окопы", "на передовую", "в расход" — одно мемное)
      - Промпт для картинки на английском: cursed meme art, evil [слово] as enemy of Ukraine 2026, ugly propaganda poster, glitch, balaclava, running from ТЦК bus, dark humor

      Ответ ТОЛЬКО JSON:
      {"word":"...", "explanation":"...", "destination":"...", "prompt":"..."}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};