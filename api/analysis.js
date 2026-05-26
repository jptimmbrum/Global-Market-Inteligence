import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowLeft, TrendingUp, Search, Loader2, Globe, AlertCircle, ExternalLink, Sparkles, RefreshCw, Briefcase, X, BarChart3 } from 'lucide-react';

const CONTINENTS = {
  americas: { name: 'Américas', color: '#378ADD', countries: [
    { code: 'br', numericId: 76,  name: 'Brasil',          wbCode: 'BRA', gnews: 'br', newsdata: 'br' },
    { code: 'us', numericId: 840, name: 'Estados Unidos',   wbCode: 'USA', gnews: 'us', newsdata: 'us' },
    { code: 'mx', numericId: 484, name: 'México',           wbCode: 'MEX', gnews: 'mx', newsdata: 'mx' },
    { code: 'ar', numericId: 32,  name: 'Argentina',        wbCode: 'ARG', gnews: 'ar', newsdata: 'ar' },
    { code: 'ca', numericId: 124, name: 'Canadá',           wbCode: 'CAN', gnews: 'ca', newsdata: 'ca' },
  ]},
  europe: { name: 'Europa', color: '#1D9E75', countries: [
    { code: 'de', numericId: 276, name: 'Alemanha',    wbCode: 'DEU', gnews: 'de', newsdata: 'de' },
    { code: 'fr', numericId: 250, name: 'França',      wbCode: 'FRA', gnews: 'fr', newsdata: 'fr' },
    { code: 'gb', numericId: 826, name: 'Reino Unido', wbCode: 'GBR', gnews: 'gb', newsdata: 'gb' },
    { code: 'it', numericId: 380, name: 'Itália',      wbCode: 'ITA', gnews: 'it', newsdata: 'it' },
    { code: 'es', numericId: 724, name: 'Espanha',     wbCode: 'ESP', gnews: 'es', newsdata: 'es' },
  ]},
  asia: { name: 'Ásia', color: '#D85A30', countries: [
    { code: 'cn', numericId: 156, name: 'China',         wbCode: 'CHN', gnews: 'cn', newsdata: 'cn' },
    { code: 'jp', numericId: 392, name: 'Japão',         wbCode: 'JPN', gnews: 'jp', newsdata: 'jp' },
    { code: 'in', numericId: 356, name: 'Índia',         wbCode: 'IND', gnews: 'in', newsdata: 'in' },
    { code: 'kr', numericId: 410, name: 'Coreia do Sul', wbCode: 'KOR', gnews: 'kr', newsdata: 'kr' },
    { code: 'id', numericId: 360, name: 'Indonésia',     wbCode: 'IDN', gnews: 'id', newsdata: 'id' },
  ]},
  africa: { name: 'África', color: '#7F77DD', countries: [
    { code: 'za', numericId: 710, name: 'África do Sul', wbCode: 'ZAF', gnews: 'za', newsdata: 'za' },
    { code: 'ng', numericId: 566, name: 'Nigéria',       wbCode: 'NGA', gnews: 'ng', newsdata: 'ng' },
    { code: 'eg', numericId: 818, name: 'Egito',         wbCode: 'EGY', gnews: 'eg', newsdata: 'eg' },
    { code: 'et', numericId: 231, name: 'Etiópia',       wbCode: 'ETH', gnews: null, newsdata: 'et' },
    { code: 'ke', numericId: 404, name: 'Quênia',        wbCode: 'KEN', gnews: null, newsdata: 'ke' },
  ]},
  oceania: { name: 'Oceania', color: '#EF9F27', countries: [
    { code: 'au', numericId: 36,  name: 'Austrália',        wbCode: 'AUS', gnews: 'au', newsdata: 'au' },
    { code: 'nz', numericId: 554, name: 'Nova Zelândia',    wbCode: 'NZL', gnews: null, newsdata: 'nz' },
    { code: 'pg', numericId: 598, name: 'Papua Nova Guiné', wbCode: 'PNG', gnews: null, newsdata: 'pg' },
    { code: 'fj', numericId: 242, name: 'Fiji',             wbCode: 'FJI', gnews: null, newsdata: 'fj' },
    { code: 'nc', numericId: 540, name: 'Nova Caledônia',   wbCode: 'NCL', gnews: null, newsdata: null },
  ]},
  middleeast: { name: 'Oriente Médio', color: '#D4537E', countries: [
    { code: 'sa', numericId: 682, name: 'Arábia Saudita',  wbCode: 'SAU', gnews: null, newsdata: 'sa' },
    { code: 'ae', numericId: 784, name: 'Emirados Árabes', wbCode: 'ARE', gnews: null, newsdata: 'ae' },
    { code: 'il', numericId: 376, name: 'Israel',          wbCode: 'ISR', gnews: null, newsdata: 'il' },
    { code: 'tr', numericId: 792, name: 'Turquia',         wbCode: 'TUR', gnews: null, newsdata: 'tr' },
    { code: 'ir', numericId: 364, name: 'Irã',             wbCode: 'IRN', gnews: null, newsdata: null },
  ]},
};

const NUMERIC_TO_COUNTRY = {};
const NAME_TO_COUNTRY = {};
const EN_NAMES = {
  br:['Brazil'], us:['United States of America','United States'], mx:['Mexico'],
  ar:['Argentina'], ca:['Canada'], de:['Germany'], fr:['France'],
  gb:['United Kingdom'], it:['Italy'], es:['Spain'], cn:['China'],
  jp:['Japan'], in:['India'], kr:['South Korea','Republic of Korea'],
  id:['Indonesia'], za:['South Africa'], ng:['Nigeria'], eg:['Egypt'],
  et:['Ethiopia'], ke:['Kenya'], au:['Australia'], nz:['New Zealand'],
  pg:['Papua New Guinea'], fj:['Fiji'], nc:['New Caledonia'],
  sa:['Saudi Arabia'], ae:['United Arab Emirates'], il:['Israel'],
  tr:['Turkey'], ir:['Iran'],
};
Object.entries(CONTINENTS).forEach(([cKey, c]) => {
  c.countries.forEach(country => {
    NUMERIC_TO_COUNTRY[country.numericId] = { continentKey: cKey, country };
    NUMERIC_TO_COUNTRY[String(country.numericId)] = { continentKey: cKey, country };
    (EN_NAMES[country.code] || []).forEach(n => { NAME_TO_COUNTRY[n.toLowerCase()] = { continentKey: cKey, country }; });
  });
});

const WB_INDICATORS = {
  'NY.GDP.MKTP.CD':    { label: 'PIB (US$)',       format: 'currency_b', color: '#378ADD' },
  'NY.GDP.MKTP.KD.ZG': { label: 'Crescimento PIB', format: 'percent',    color: '#1D9E75' },
  'FP.CPI.TOTL.ZG':    { label: 'Inflação',        format: 'percent',    color: '#D85A30' },
  'FR.INR.RINR':       { label: 'Taxa de juros',   format: 'percent',    color: '#7F77DD' },
  'PA.NUS.FCRF':       { label: 'Câmbio vs USD',   format: 'number',     color: '#14B8A6' },
  'NY.GDP.PCAP.CD':    { label: 'PIB per capita',  format: 'currency',   color: '#EF9F27' },
  'SL.UEM.TOTL.ZS':    { label: 'Desemprego',      format: 'percent',    color: '#D4537E' },
};

const SECTORS = ['Tecnologia','Energia','Agronegócio','Saúde','Finanças','Varejo','Indústria','Imobiliário','Mineração','Telecomunicações','Automotivo','Petróleo e Gás'];
const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const fmt = (value, format) => {
  if (value === null || value === undefined) return 'N/D';
  const n = parseFloat(value);
  if (isNaN(n)) return 'N/D';
  switch (format) {
    case 'currency_b': return Math.abs(n)>=1e12?`US$ ${(n/1e12).toFixed(2)} tri`:Math.abs(n)>=1e9?`US$ ${(n/1e9).toFixed(2)} bi`:`US$ ${(n/1e6).toFixed(2)} mi`;
    case 'currency': return `US$ ${n.toLocaleString('pt-BR',{maximumFractionDigits:0})}`;
    case 'percent': return `${n.toFixed(2)}%`;
    default: return n.toFixed(2);
  }
};
const fmtAxis = (v, format) => {
  if (format==='currency_b') return Math.abs(v)>=1e12?`${(v/1e12).toFixed(1)}T`:Math.abs(v)>=1e9?`${(v/1e9).toFixed(0)}B`:`${(v/1e6).toFixed(0)}M`;
  if (format==='currency') return v>=1000?`${(v/1000).toFixed(0)}k`:v.toFixed(0);
  return v.toFixed(1);
};

const WorldMapView = ({ onSelectCountry }) => {
  const svgRef = useRef(null);
  const [worldData, setWorldData] = useState(null);
  const [topoLib, setTopoLib] = useState(null);
  const [tooltip, setTooltip] = useState({ visible:false, x:0, y:0, text:'' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!window.topojson) {
          await new Promise((res,rej) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';
            s.onload=res; s.onerror=rej; document.head.appendChild(s);
          });
        }
        setTopoLib(window.topojson);
        const r = await fetch(WORLD_TOPO_URL);
        setWorldData(await r.json());
      } catch(e){ console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const findCountry = f => {
    const byId = NUMERIC_TO_COUNTRY[f.id] || NUMERIC_TO_COUNTRY[String(f.id)];
    if (byId) return byId;
    const name = f.properties?.name?.toLowerCase();
    return name ? NAME_TO_COUNTRY[name] : null;
  };

  useEffect(() => {
    if (!worldData || !topoLib || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const W=900, H=480;
    const proj = d3.geoNaturalEarth1().scale(165).translate([W/2, H/2+10]);
    const path = d3.geoPath().projection(proj);
    const countries = topoLib.feature(worldData, worldData.objects.countries);
    svg.append('rect').attr('width',W).attr('height',H).attr('fill','#EAF4FB').attr('rx',12);
    svg.append('g').selectAll('path').data(countries.features).enter().append('path')
      .attr('d', path)
      .attr('fill', d => { const i=findCountry(d); return i?CONTINENTS[i.continentKey].color:'#D6D9DE'; })
      .attr('fill-opacity', d => findCountry(d)?0.85:0.4)
      .attr('stroke','#FFF').attr('stroke-width',0.5)
      .attr('cursor', d => findCountry(d)?'pointer':'default')
      .on('mouseenter', function(event,d) {
        const i=findCountry(d); if(!i) return;
        d3.select(this).attr('fill-opacity',1).attr('stroke-width',1.5);
        const r=svgRef.current.getBoundingClientRect();
        setTooltip({visible:true, x:event.clientX-r.left+10, y:event.clientY-r.top+10, text:i.country.name});
      })
      .on('mousemove', function(event) {
        const r=svgRef.current.getBoundingClientRect();
        setTooltip(p=>({...p, x:event.clientX-r.left+10, y:event.clientY-r.top+10}));
      })
      .on('mouseleave', function(event,d) {
        const i=findCountry(d);
        if(i) d3.select(this).attr('fill-opacity',0.85).attr('stroke-width',0.5);
        setTooltip(p=>({...p,visible:false}));
      })
      .on('click', function(event,d) {
        const i=findCountry(d); if(i) onSelectCountry(i.country, i.continentKey);
      });
  }, [worldData, topoLib]);

  return (
    <div className="w-full bg-slate-50 rounded-xl p-4 md:p-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Mapa Mundial Interativo</h2>
        <p className="text-sm text-slate-500 mt-1">Clique em um país para ver indicadores, notícias e análise setorial</p>
      </div>
      <div className="relative bg-white rounded-lg overflow-hidden">
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-white z-10"><Loader2 className="animate-spin text-slate-400" size={28}/></div>}
        <svg ref={svgRef} viewBox="0 0 900 480" className="w-full h-auto" style={{display:'block'}}/>
        {tooltip.visible && (
          <div className="absolute pointer-events-none bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-20" style={{left:tooltip.x,top:tooltip.y}}>
            {tooltip.text}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6">
        {Object.entries(CONTINENTS).map(([k,c]) => (
          <div key={k} className="flex items-center gap-2 p-2 rounded-lg bg-white">
            <div className="w-4 h-4 rounded" style={{backgroundColor:c.color}}></div>
            <span className="text-sm font-medium text-slate-700">{c.name}</span>
            <span className="text-xs text-slate-400 ml-auto">{c.countries.length} países</span>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-lg p-4 border border-slate-100">
        <p className="text-sm font-semibold text-slate-700 mb-3">Acesso rápido:</p>
        <div className="space-y-3">
          {Object.entries(CONTINENTS).map(([k,c]) => (
            <div key={k}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor:c.color}}></div>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{c.name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.countries.map(country => (
                  <button key={country.code} onClick={() => onSelectCountry(country,k)}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all">
                    {country.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HistoricalModal = ({ country, indicatorCode, onClose }) => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ind = WB_INDICATORS[indicatorCode];

  useEffect(() => {
    (async () => {
      const cacheKey = `${country.wbCode}_${indicatorCode}`;
      if (window.__seriesCache?.[cacheKey]) { setSeries(window.__seriesCache[cacheKey]); setLoading(false); return; }
      try {
        const r = await fetch(`/api/series?country=${country.wbCode}&indicator=${indicatorCode}`);
        const data = await r.json();
        if (data.error || !data.series?.length) throw new Error(data.error || 'Sem dados');
        if (!window.__seriesCache) window.__seriesCache = {};
        window.__seriesCache[cacheKey] = data.series;
        setSeries(data.series);
      } catch(e) { setError(e.message); } finally { setLoading(false); }
    })();
  }, []);

  const latest = series[series.length-1];
  const oldest = series[0];
  const variation = latest&&oldest&&oldest.value!==0 ? ((latest.value-oldest.value)/Math.abs(oldest.value))*100 : null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-200">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{country.name}</p>
            <h3 className="text-xl font-semibold text-slate-900 mt-1">{ind.label}</h3>
            <p className="text-xs text-slate-500 mt-1">Série histórica · Fonte: World Bank</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={24}/></button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-16 text-slate-500">
              <Loader2 className="animate-spin" size={28}/><span className="text-sm">Carregando série histórica...</span>
            </div>
          ) : error ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-2">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0"/>
              <p className="text-sm text-amber-800">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {label:'Mais recente', val:latest?fmt(latest.value,ind.format):'-', sub:latest?.year},
                  {label:'Mais antigo',  val:oldest?fmt(oldest.value,ind.format):'-', sub:oldest?.year},
                  {label:'Variação total', val:variation!==null?`${variation>0?'+':''}${variation.toFixed(1)}%`:'-', sub:`${series.length} anos`, color:variation>0?'text-emerald-600':variation<0?'text-red-600':''},
                ].map((s,i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className={`text-base font-semibold ${s.color||'text-slate-900'}`}>{s.val}</p>
                    <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={series} margin={{top:10,right:10,left:10,bottom:0}}>
                    <defs>
                      <linearGradient id={`g-${indicatorCode}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={ind.color} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={ind.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0"/>
                    <XAxis dataKey="year" stroke="#64748B" fontSize={11}/>
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={v=>fmtAxis(v,ind.format)}/>
                    <Tooltip formatter={v=>fmt(v,ind.format)} labelFormatter={l=>`Ano: ${l}`}
                      contentStyle={{backgroundColor:'white',border:'1px solid #E2E8F0',borderRadius:8}}/>
                    <Area type="monotone" dataKey="value" stroke={ind.color} strokeWidth={2} fill={`url(#g-${indicatorCode})`}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <details className="border border-slate-200 rounded-lg">
                <summary className="cursor-pointer p-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Ver tabela ({series.length} pontos)</summary>
                <div className="border-t border-slate-200 max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr><th className="text-left p-2 text-xs font-semibold text-slate-600">Ano</th><th className="text-right p-2 text-xs font-semibold text-slate-600">Valor</th></tr>
                    </thead>
                    <tbody>
                      {series.slice().reverse().map((d,i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="p-2 text-slate-700">{d.year}</td>
                          <td className="p-2 text-right font-medium text-slate-900">{fmt(d.value,ind.format)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CountryDashboard = ({ country, continentKey, onBack }) => {
  const continent = CONTINENTS[continentKey];
  const [indicators, setIndicators] = useState([]);
  const [news, setNews] = useState([]);
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState({indicators:true, news:true, market:true});
  const [errors, setErrors] = useState({});
  const [openIndicator, setOpenIndicator] = useState(null);
  const [selectedSector, setSelectedSector] = useState('');
  const [customSector, setCustomSector] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [analyzingLoading, setAnalyzingLoading] = useState(false);

  useEffect(() => {
    setIndicators([]); setNews([]); setMarket([]);
    setLoading({indicators:true,news:true,market:true});
    setErrors({}); setAnalysis(''); setSelectedSector(''); setCustomSector('');
    fetchAll();
  }, [country.code]);

  const fetchAll = () => {
    fetch(`/api/indicators?country=${country.wbCode}`)
      .then(r=>r.json()).then(d=>{ if(d.error) throw new Error(d.error); setIndicators(d.indicators||[]); })
      .catch(e=>setErrors(p=>({...p,indicators:e.message})))
      .finally(()=>setLoading(p=>({...p,indicators:false})));

    if (country.newsdata) {
      fetch(`/api/news?country=${country.newsdata}`)
        .then(r=>r.json()).then(d=>{ if(d.error) throw new Error(d.error); setNews(d.news||[]); })
        .catch(e=>setErrors(p=>({...p,news:e.message})))
        .finally(()=>setLoading(p=>({...p,news:false})));
    } else { setLoading(p=>({...p,news:false})); }

    if (country.gnews) {
      fetch(`/api/market?country=${country.gnews}`)
        .then(r=>r.json()).then(d=>{ if(d.error) throw new Error(d.error); setMarket(d.news||[]); })
        .catch(e=>setErrors(p=>({...p,market:e.message})))
        .finally(()=>setLoading(p=>({...p,market:false})));
    } else { setLoading(p=>({...p,market:false})); }
  };

  const runAnalysis = async () => {
    const sector = customSector.trim() || selectedSector;
    if (!sector) return;
    setAnalyzingLoading(true); setAnalysis('');
    try {
      const r = await fetch('/api/analysis', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          country: country.name, sector,
          indicators: indicators.map(i=>({label:i.label, value:fmt(i.value, WB_INDICATORS[i.code]?.format||'number')})),
          news: [...news,...market].slice(0,8).map(n=>({title:n.title})),
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setAnalysis(d.analysis||'Análise indisponível.');
    } catch(e) { setAnalysis(`❌ Erro: ${e.message}`); }
    finally { setAnalyzingLoading(false); }
  };

  const renderMarkdown = text => {
    if (!text) return null;
    return text.split('\n').map((line,i) => {
      const t = line.trim();
      if (t.startsWith('## ')) return <h3 key={i} className="text-base font-semibold text-slate-900 mt-4 mb-2">{t.slice(3)}</h3>;
      if (t.startsWith('# '))  return <h2 key={i} className="text-lg font-bold text-slate-900 mt-4 mb-2">{t.slice(2)}</h2>;
      if (t.startsWith('- ')||t.startsWith('* ')) return <li key={i} className="text-sm text-slate-700 ml-4 my-1">{t.slice(2)}</li>;
      if (!t) return null;
      const parts = t.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-sm text-slate-700 leading-relaxed my-1.5">
          {parts.map((p,j) => p.startsWith('**')&&p.endsWith('**') ? <strong key={j} className="font-semibold text-slate-900">{p.slice(2,-2)}</strong> : p)}
        </p>
      );
    });
  };

  const indicatorToWBCode = label => {
    const l = label.toLowerCase();
    if (l.includes('pib')&&l.includes('per capita')) return 'NY.GDP.PCAP.CD';
    if (l.includes('crescimento')) return 'NY.GDP.MKTP.KD.ZG';
    if (l.includes('pib')) return 'NY.GDP.MKTP.CD';
    if (l.includes('infla')) return 'FP.CPI.TOTL.ZG';
    if (l.includes('juro')) return 'FR.INR.RINR';
    if (l.includes('câmbio')||l.includes('cambio')) return 'PA.NUS.FCRF';
    if (l.includes('desemprego')) return 'SL.UEM.TOTL.ZS';
    return null;
  };

  const isLoading = Object.values(loading).some(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16}/> Voltar ao mapa
        </button>
        <button onClick={fetchAll} disabled={isLoading} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50">
          <RefreshCw size={14} className={isLoading?'animate-spin':''}/> Atualizar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-4 h-4 rounded-full" style={{backgroundColor:continent.color}}></div>
          <span className="text-xs text-slate-500 uppercase tracking-wide">{continent.name}</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{country.name}</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold mb-1 text-slate-800 flex items-center gap-2">
          <TrendingUp size={16}/> Indicadores econômicos
          <span className="text-xs text-slate-400 font-normal ml-auto">World Bank · clique para histórico</span>
        </h3>
        {loading.indicators ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-6 justify-center"><Loader2 className="animate-spin" size={16}/> Carregando...</div>
        ) : errors.indicators ? (
          <div className="bg-amber-50 rounded-lg p-3 text-amber-700 text-sm flex gap-2"><AlertCircle size={16} className="mt-0.5 flex-shrink-0"/>{errors.indicators}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {indicators.map((ind,i) => {
              const wbCode = indicatorToWBCode(ind.label);
              return (
                <button key={i} onClick={()=>wbCode&&setOpenIndicator(wbCode)} disabled={!wbCode}
                  className={`bg-slate-50 rounded-lg p-3 text-left transition-all ${wbCode?'hover:bg-indigo-50 hover:ring-2 hover:ring-indigo-200 cursor-pointer':'cursor-default'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-500">{ind.label}</p>
                    {wbCode&&<BarChart3 size={12} className="text-slate-400"/>}
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{ind.value!==null?fmt(ind.value,WB_INDICATORS[ind.code]?.format||'number'):'N/D'}</p>
                  {ind.year&&<p className="text-xs text-slate-400 mt-1">{ind.year}</p>}
                  {wbCode&&<p className="text-xs text-indigo-600 mt-1">Ver histórico →</p>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold mb-3 text-slate-800 flex items-center gap-2">
          <Briefcase size={16}/> Finanças & Mercado
          <span className="text-xs text-slate-400 font-normal ml-auto">GNews + NewsData</span>
        </h3>
        {loading.news&&loading.market ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-6 justify-center"><Loader2 className="animate-spin" size={16}/> Buscando notícias...</div>
        ) : [...news,...market].length===0 ? (
          <p className="text-sm text-slate-500 py-4">Sem notícias disponíveis para este país.</p>
        ) : (
          <div className="space-y-3">
            {[...market,...news].slice(0,10).map((article,i) => (
              <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group">
                <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-700">{article.title}</p>
                {article.summary&&<p className="text-xs text-slate-600 mt-1 line-clamp-2">{article.summary}</p>}
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span>{article.source}</span>
                  {article.date&&<span>· {new Date(article.date).toLocaleDateString('pt-BR')}</span>}
                  <ExternalLink size={10}/>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
        <h3 className="text-base font-semibold mb-1 text-slate-800 flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600"/> Análise setorial aprofundada
        </h3>
        <p className="text-xs text-slate-600 mb-4">Equity research em tempo real · única chamada à IA</p>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {SECTORS.map(s => (
              <button key={s} onClick={()=>{setSelectedSector(s);setCustomSector('');}}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${selectedSector===s&&!customSector?'bg-indigo-600 text-white':'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={customSector}
              onChange={e=>{setCustomSector(e.target.value);setSelectedSector('');}}
              onKeyDown={e=>e.key==='Enter'&&runAnalysis()}
              placeholder="Ou digite um setor específico..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"/>
            <button onClick={runAnalysis} disabled={(!selectedSector&&!customSector.trim())||analyzingLoading}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2">
              {analyzingLoading?<Loader2 className="animate-spin" size={16}/>:<Search size={16}/>} Analisar
            </button>
          </div>
        </div>
        {analyzingLoading&&(
          <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-100 flex items-center gap-2 text-indigo-700 text-sm">
            <Loader2 className="animate-spin" size={16}/> Gerando análise... (~20-30s)
          </div>
        )}
        {analysis&&!analyzingLoading&&(
          <div className="mt-4 p-5 bg-white rounded-lg border border-indigo-100">{renderMarkdown(analysis)}</div>
        )}
      </div>

      {openIndicator&&<HistoricalModal country={country} indicatorCode={openIndicator} onClose={()=>setOpenIndicator(null)}/>}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('map');
  const [selContinent, setSelContinent] = useState(null);
  const [selCountry, setSelCountry] = useState(null);

  const handleSelect = (country, continentKey) => {
    setSelCountry(country); setSelContinent(continentKey); setView('country');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Globe className="text-indigo-600" size={32}/> Global Market Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1">Indicadores, M&A e análise setorial em tempo real</p>
        </div>
        {view==='map'&&<WorldMapView onSelectCountry={handleSelect}/>}
        {view==='country'&&selCountry&&selContinent&&(
          <CountryDashboard country={selCountry} continentKey={selContinent} onBack={()=>setView('map')}/>
        )}
      </div>
    </div>
  );
}
