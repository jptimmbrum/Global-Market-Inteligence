// api/market.js — GNews
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { country } = req.query;
  if (!country) return res.status(400).json({ error: 'Missing country' });

  const API_KEY = process.env.GNEWS_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'GNEWS_API_KEY not set' });

  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=business&country=${country}&max=8&apikey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    if (!data.articles) return res.status(200).json({ news: [] });

    const news = data.articles.map(a => ({
      title: a.title,
      summary: a.description?.substring(0, 200) || '',
      url: a.url,
      source: a.source?.name || '',
      date: a.publishedAt,
    }));
    res.status(200).json({ news });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
