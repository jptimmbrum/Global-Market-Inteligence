// api/news.js — NewsData.io
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { country } = req.query;
  if (!country) return res.status(400).json({ error: 'Missing country' });

  const API_KEY = process.env.NEWSDATA_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'NEWSDATA_API_KEY not set' });

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=${country}&category=business,politics&size=8`;
    const r = await fetch(url);
    const data = await r.json();
    if (!data.results) return res.status(200).json({ news: [] });

    const news = data.results.map(a => ({
      title: a.title,
      summary: a.description?.substring(0, 200) || '',
      url: a.link,
      source: a.source_id,
      date: a.pubDate,
    }));
    res.status(200).json({ news });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
