// api/series.js — World Bank historical series
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { country, indicator } = req.query;
  if (!country || !indicator) return res.status(400).json({ error: 'Missing params' });

  try {
    const url = `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=20&date=2005:2024`;
    const r = await fetch(url);
    const data = await r.json();
    if (!Array.isArray(data[1])) return res.status(404).json({ error: 'No data found' });

    const series = data[1]
      .filter(d => d.value !== null)
      .map(d => ({ year: d.date, value: parseFloat(d.value) }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    res.status(200).json({ series });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
