const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });  // ← изменил на актуальную модель!

    const prompt = `
      Сгенерируй для мема "цель ТЦК":
      - Одно случайное русское мемное слово (типа пельмень, таракан, доширак, skibidi, ohio)
      - Абсурдное объяснение, почему он провинился (1-2 предложения, чёрный юмор)
      - Куда его хотят отправить (например "на ноль", "в мясной штурм на Донбасс", "в окопы", "на передовую", "в расход" — одно мемное)
      - Промпт для картинки на английском: cursed meme art, evil [слово] as enemy of Ukraine 2026, ugly propaganda poster, glitch, balaclava, running from ТЦК bus, dark humor

      Ответ ТОЛЬКО JSON без лишнего текста:
      {"word":"...", "explanation":"...", "destination":"...", "prompt":"..."}
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // На всякий случай чистим, если Gemini добавил лишнее
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("Gemini не вернул JSON");
    }
    text = text.substring(jsonStart, jsonEnd);

    const data = JSON.parse(text);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error(error);  // ← это попадёт в логи Netlify

    // Fallback — если Gemini упал, возвращаем рандом без API
    const fallbackWords = ["пельмень", "таракан", "доширак", "skibidi", "ohio", "борщ", "балаклава", "бус"];
    const word = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];

    const fallback = {
      word: word,
      explanation: `Провинился тем, что плодит ${word} среди уклонистов и делает кринжовые мемы против ТЦК`,
      destination: "на ноль в Донбасс, в мясной штурм",
      prompt: `cursed absurd meme art, evil ${word} as enemy of nation Ukraine 2026, funny ugly propaganda poster style, brainrot glitch effect, wearing balaclava, running from military bus, dark humor creepy ridiculous, high detail`
    };

    return {
      statusCode: 200,
      body: JSON.stringify(fallback)
    };
  }
};
