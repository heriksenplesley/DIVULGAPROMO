import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Calendar,
  RefreshCw,
  Sliders,
  Smartphone,
  Share2,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { Offer } from '../types/index.js';

interface AdGeneratorProps {
  initialOffer?: Offer | null;
  setCurrentTab: (tab: string) => void;
}

export const AdGeneratorPage: React.FC<AdGeneratorProps> = ({ initialOffer, setCurrentTab }) => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState('oferta_relampago');
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');
  const [tone, setTone] = useState('persuasivo');
  const [includeDisclaimers, setIncludeDisclaimers] = useState(true);
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyModels = [
    { id: 'oferta_relampago', name: '🔥 Oferta Relâmpago', desc: 'Gatilho de urgência imediata e preço imperdível' },
    { id: 'achadinho_do_dia', name: '✨ Achadinho do Dia', desc: 'Tom descontraído, perfeito para garimpos virais' },
    { id: 'custo_beneficio', name: '💎 Melhor Custo-Benefício', desc: 'Foco em especificações, durabilidade e economia' },
    { id: 'presente_ideal', name: '🎁 Presente Ideal', desc: 'Sugestão emocional para surpreender alguém' },
    { id: 'oferta_casa', name: '🏡 Oferta para Casa', desc: 'Praticidade doméstica, conforto e limpeza' },
    { id: 'oferta_tecnologia', name: '⚡ Oferta Tecnologia', desc: 'Specs reais, conectividade e desempenho' },
    { id: 'cupom_especial', name: '🎟️ Cupom Especial', desc: 'Destaque no código e desconto adicional' },
    { id: 'ultimas_unidades', name: '⏳ Poucas Unidades', desc: 'Estoque limitado confirmado pelo vendedor' },
    { id: 'oferta_patrocinada', name: '📢 Oferta Patrocinada', desc: 'Divulgação oficial com transparência comercial' },
    { id: 'campanha_sazonal', name: '🛍️ Campanha Sazonal', desc: 'Adaptado para Black Friday, Natal e datas especiais' },
  ];

  const channels = [
    { id: 'whatsapp', name: 'WhatsApp VIP' },
    { id: 'telegram', name: 'Canal Telegram' },
    { id: 'stories', name: 'Instagram Stories' },
    { id: 'feed', name: 'Instagram Feed' },
    { id: 'twitter', name: 'X / Twitter' },
  ];

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        if (data.offers && data.offers.length > 0) {
          setOffers(data.offers);
          if (initialOffer) {
            setSelectedOfferId(initialOffer.id);
          } else {
            setSelectedOfferId(data.offers[0].id);
          }
        }
      });
  }, [initialOffer]);

  const activeOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  const generateCopy = async () => {
    if (!activeOffer) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          offerId: activeOffer.id,
          modelo: selectedModel,
          canal: selectedChannel,
          tone,
        }),
      });
      const data = await res.json();
      if (data.copy) {
        setGeneratedText(data.copy.textoFormatado);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeOffer) {
      generateCopy();
    }
  }, [selectedOfferId, selectedModel, selectedChannel, tone]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Gerador Automático de Anúncios com IA</h1>
          <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
            10 Modelos de Copy
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Gere publicações persuasivas, testadas para conversão em WhatsApp, Telegram e redes sociais, sem dados falsos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Controls & Selectors */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Offer Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <label className="text-xs font-bold text-slate-200">Selecione o Produto / Oferta</label>
            <select
              value={selectedOfferId}
              onChange={e => setSelectedOfferId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              {offers.map(o => (
                <option key={o.id} value={o.id}>
                  [{o.marketplace.toUpperCase()}] {o.title.substring(0, 50)}... (R$ {o.promoPrice.toFixed(2)})
                </option>
              ))}
            </select>

            {activeOffer && (
              <div className="mt-2 flex items-center gap-3 rounded-lg bg-slate-950 p-2 border border-slate-800 text-[11px]">
                <img
                  src={activeOffer.imageUrl}
                  alt={activeOffer.title}
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="overflow-hidden">
                  <p className="font-semibold text-white truncate">{activeOffer.title}</p>
                  <p className="text-emerald-400 font-bold">
                    R$ {activeOffer.promoPrice.toFixed(2)}{' '}
                    <span className="text-slate-500 line-through text-[10px]">
                      R$ {activeOffer.originalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Model Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2.5">
            <label className="text-xs font-bold text-slate-200">Modelo de Copy Promocional</label>
            <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {copyModels.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`flex items-start justify-between rounded-lg p-2 text-left text-xs transition-colors ${
                    selectedModel === m.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className={`text-[10px] ${selectedModel === m.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {m.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Channel and Tone */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">Canal de Destino</label>
              <div className="flex flex-wrap gap-1.5">
                {channels.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChannel(c.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedChannel === c.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">Tom de Comunicação</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="persuasivo">Persuasivo & Direto (Foco em Conversão)</option>
                <option value="descontraido">Descontraído & Achadinhos (Geração Z / Viral)</option>
                <option value="vip">Exclusivo Grupo VIP (Privilégio)</option>
                <option value="tecnico">Técnico e Confiável (Destaque em Benefícios)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Live Text Editor & Device Preview */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Texto Formatado para o Canal ({selectedChannel.toUpperCase()})
              </span>
              <span className="text-[11px] text-slate-400">
                {generatedText.length} caracteres
              </span>
            </div>

            <textarea
              rows={11}
              value={generatedText}
              onChange={e => setGeneratedText(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-sans text-xs text-slate-100 leading-relaxed focus:border-purple-500 focus:outline-none whitespace-pre-wrap"
            />

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={generateCopy}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerar Variação</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-900/30 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Texto Copiado!' : 'Copiar Texto Pronto'}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('campaigns')}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/30 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Programar Disparo</span>
                </button>
              </div>
            </div>

            {/* Compliance Warning */}
            <div className="mt-3 rounded-lg bg-slate-950/70 p-2.5 border border-slate-800 text-[10.5px] text-slate-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Conformidade: O texto gerado preserva o link curto <strong>/r/{activeOffer?.shortCode}</strong> e inclui aviso obrigatório sobre variação de preço.
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
