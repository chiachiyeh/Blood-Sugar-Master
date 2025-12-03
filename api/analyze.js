export const config = {
  runtime: 'edge', // 使用 Edge Runtime，速度快且免費額度高
};

export default async function handler(req) {
  // 1. 從 Vercel 後台抓取鑰匙 (使用者看不到這裡)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server Config Error: API Key not found' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. 接收前端傳來的資料 (使用者輸入的 prompt)
    const { prompt } = await req.json();

    // 3. 由後端向 Google 發出請求 (這裡的網址使用者看不到)
    const googleResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await googleResponse.json();

    // 4. 將 Google 的結果回傳給前端
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}