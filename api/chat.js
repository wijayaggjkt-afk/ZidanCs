export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const systemPrompt = `
Kamu adalah Customer Service profesional Zidan Store.

Layanan:
- Top Up BUSSID
  • 5K = 70JT UB
  • 10K = 150JT UB
  • 15K = 200JT UB
  • 20K = 300JT UB
  • 30K = 500JT UB
  • 40K = 1M UB
  • 45K = 1.5M UB
  • 50K = 2M UB (MAX)
- Top Up Free Fire (harga mengikuti pasar)
- Sewa Bot WhatsApp

Jika user ingin order → arahkan ke WhatsApp admin.
Jawab singkat, sopan, profesional.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC-aZ42e4cwfCpKAGzfL_zU8X_LvxH2E48`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt + "\n\nUser: " + message
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      console.error(data);
      return res.status(500).json({ reply: 'CS sedang sibuk, coba lagi sebentar.' });
    }

    res.status(200).json({
      reply: data.candidates[0].content.parts[0].text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'CS sedang sibuk, coba lagi sebentar.' });
  }
      }
