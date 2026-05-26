// api/indicators.js — World Bank indicators (free, no key needed)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { country } = req.query;
  if (!country) return res.status(400).json({ error: 'Missing country' });

  const INDICATORS = {
    'NY.GDP.MKTP.CD':    'PIB (US$)',
    'NY.GDP.MKTP.KD.ZG': 'Crescimento PIB',
    'FP.CPI.TOTL.ZG':    'Inflação',
    'FR.INR.RINR':       'Taxa de juros',
    'PA.NUS.FCRF':       'Câmbio vs USD',
    'NY.GDP.PCAP.CD':    'PIB per capita',
    'SL.UEM.TOTL.ZS':    'Desemprego',
  };

  try {
    const results = await Promise.all(
      Object.entries(INDICATORS).map(async ([code, label]) => {
        const url = `https://api.worldbank.org/v2/country/${country}/indicator/${code}?format=json&per_page=10&date=2018:2024`;
        const r = await fetch(url);
        const data = await r.json();
        const latest = Array.isArray(data[1]) ? data[1].find(d => d.value !== null) : null;
        return { code, label, value: latest?.value ?? null, year: latest?.date ?? null };
      })
    );
    res.status(200).json({ indicators: results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
