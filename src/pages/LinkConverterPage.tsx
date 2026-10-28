import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Link2,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Share2,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { TrackedLink } from '../types/index.js';

interface LinkConverterProps {
  setCurrentTab: (tab: string) => void;
}

export const LinkConverterPage: React.FC<LinkConverterProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState('amazon');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentLinks, setRecentLinks] = useState<TrackedLink[]>([]);
  const [copied, setCopied] = useState(false);

  const fetchRecentLinks = async () => {
    try {
      const res = await fetch('/api/links', {
        headers: { 'x-user-id': user?.id || '' },
      });
      const data = await res.json();
      setRecentLinks(data.links || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecentLinks();
  }, [user]);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/links/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          url: urlInput,
          marketplace: selectedMarketplace,
          customCode: customSlug || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Falha ao converter link');

      setResult(data);
      fetchRecentLinks();
    } catch (err: any) {
      setError(err.message || 'Erro durante a conversão do link.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Conversor & Gerenciador de Links</h1>
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
            Rastreamento Seguro
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Transforme qualquer link de produto em uma URL rastreável com sua tag oficial de afiliado e métricas em tempo real.
        </p>
      </div>

      {/* Main Conversion Form Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-5">
        <form onSubmit={handleConvert} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Cole o Link Original do Produto
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={urlInput}
                onChange={e => {
                  setUrlInput(e.target.value);
                  const lower = e.target.value.toLowerCase();
                  if (lower.includes('amazon')) setSelectedMarketplace('amazon');
                  else if (lower.includes('shopee')) setSelectedMarketplace('shopee');
                  else if (lower.includes('mercadolivre') || lower.includes('meli')) setSelectedMarketplace('mercadolivre');
                  else if (lower.includes('aliexpress')) setSelectedMarketplace('aliexpress');
                  else if (lower.includes('magazineluiza') || lower.includes('magalu')) setSelectedMarketplace('magalu');
                  else if (lower.includes('hotmart')) setSelectedMarketplace('hotmart');
                }}
                placeholder="https://www.amazon.com.br/dp/B08HMWZBXC..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Marketplace Detectado / Programa de Afiliado
              </label>
              <select
                value={selectedMarketplace}
                onChange={e => setSelectedMarketplace(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="amazon">Amazon Associates (Tag ativa)</option>
                <option value="shopee">Shopee Afiliados (Parâmetro af)</option>
                <option value="mercadolivre">Mercado Livre Afiliados (matt_tool)</option>
                <option value="aliexpress">AliExpress Portals</option>
                <option value="magalu">Magazine Você (Magalu)</option>
                <option value="hotmart">Hotmart Hotlink</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Código Personalizado (Slug Opcional)
              </label>
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-400">
                <span className="text-slate-500 font-mono">/r/</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="meu-produto-top"
                  className="w-full bg-transparent pl-1 text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Proteção anti-SSRF e preservação rigorosa de comissões ativas.</span>
            </div>

            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Convertendo...' : 'Gerar Link Rastreável'}</span>
            </button>
          </div>
        </form>

        {/* Result Box */}
        {result && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Check className="h-4 w-4" /> Link Convertido com Sucesso!
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                Tag: {result.tagAfiliadoUtilizada}
              </span>
            </div>

            <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-xs text-blue-300 select-all truncate">
                https://divulgapromo.com.br{result.linkCurtoRastreavel}
              </span>
              <button
                onClick={() => copyToClipboard(`https://divulgapromo.com.br${result.linkCurtoRastreavel}`)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setCurrentTab('ad-generator')}
                className="flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Gerar Anúncio para Este Link</span>
              </button>
              <button
                onClick={() => setCurrentTab('art-studio')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors"
              >
                <span>Criar Arte Promocional</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History of Tracked Links Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Link2 className="h-4 w-4 text-blue-400" />
          Seus Links Rastreáveis Ativos ({recentLinks.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Identificação</th>
                <th className="pb-2 font-semibold">Marketplace</th>
                <th className="pb-2 font-semibold">Link Curto</th>
                <th className="pb-2 font-semibold text-center">Cliques Totais</th>
                <th className="pb-2 font-semibold text-center">Cliques Únicos</th>
                <th className="pb-2 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {recentLinks.map(link => (
                <tr key={link.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-medium text-white max-w-[200px] truncate">
                    {link.title}
                  </td>
                  <td className="py-2.5 uppercase text-[11px] font-bold text-slate-400">
                    {link.marketplace}
                  </td>
                  <td className="py-2.5 font-mono text-blue-400">
                    /r/{link.code}
                  </td>
                  <td className="py-2.5 text-center font-bold text-white">
                    {link.totalClicks}
                  </td>
                  <td className="py-2.5 text-center font-medium text-emerald-400">
                    {link.uniqueClicks}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => copyToClipboard(`https://divulgapromo.com.br/r/${link.code}`)}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copiar"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
