// api/analysis.js — Claude Sonnet (única chamada IA)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { country, sector, indicators, news } = req.body;
  if (!country || !sector) return res.status(400).json({ error: 'Missing params' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const indicatorsContext = indicators?.length
    ? indicators.map(i => `${i.label}: ${i.value}`).join(', ')
    : 'Não disponível';

  const newsContext = news?.length
    ? news.slice(0, 8).map(n => `- ${n.title}`).join('\n')
    : 'Não disponível';

  const prompt = `Você é analista sênior de investment banking. Análise setorial APROFUNDADA em PORTUGUÊS BRASILEIRO sobre **${sector}** em **${country}**.

INDICADORES ATUAIS: ${indicatorsContext}

NOTÍCIAS RECENTES:
${newsContext}

Use busca web para informações ATUAIS de 2026. Estruture com seções ##:
## Panorama Atual
## Principais Players
## M&A e Movimentações
## Tendências
## Riscos
## Oportunidades
## Perspectivas 2026-2027

Específico, com nomes de empresas e números. 700-900 palavras.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }],
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const text = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n\n');

    res.status(200).json({ analysis: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
