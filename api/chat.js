import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Pesan tidak boleh kosong." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Kamu adalah Customer Service profesional Zidan Store.
Jawaban harus sopan, jelas, singkat, dan meyakinkan.

Layanan Zidan Store:
- Top Up BUSSID:
  5k = 70jt UB
  10k = 150jt UB
  15k = 200jt UB
  20k = 300jt UB
  30k = 500jt UB
  40k = 1M UB
  45k = 1.5M UB
  50k = 2M / MAX

- Top Up Free Fire:
  Harga mengikuti harga pasar terbaru.

- Sewa Bot WhatsApp:
  Bot otomatis untuk store & personal.

Jika user bertanya harga, jelaskan.
Jika ingin order, arahkan ke WhatsApp admin.
Jangan menyebut dirimu AI.
          `
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Customer Service sedang sibuk. Silakan hubungi WhatsApp."
    });
  }
}
