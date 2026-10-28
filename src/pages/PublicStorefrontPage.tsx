import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Store,
  Search,
  ExternalLink,
  Copy,
  Check,
  Tag,
  MessageSquare,
  Send,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Offer, StorefrontSettings } from '../types/index.js';

interface PublicStorefrontProps {
  slug?: string;
  onBackToApp?: () => void;
}

export const PublicStorefrontPage: React.FC<PublicStorefrontProps> = ({ slug = 'achadinhos-do-carlos', onBackToApp }) => {
  const { user } = useAuth();
  const [storefront, setStorefront] = useState<StorefrontSettings | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/storefronts/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.storefront) {
          setStorefront(data.storefront);
          setOffers(data.offers || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const filteredOffers = offers.filter(o => {
    const matchCat = selectedCategory === 'todas' || o.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = !searchTerm || o.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar for Logged in User to go back to admin */}
      {onBackToApp && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Você está visualizando a vitrine pública como um visitante comum.
          </span>
          <button
            onClick={onBackToApp}
            className="rounded bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-500"
          >
            ← Voltar ao Painel
          </button>
        </div>
      )}

      {/* Hero Header */}
      <header
        style={{ backgroundColor: storefront?.primaryColor || '#0B1E36' }}
        className="border-b border-slate-800 py-10 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="mx-auto max-w-5xl text-center space-y-3 relative z-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-xl text-white">
            <Store className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {storefront?.storeName || 'Vitrine de Ofertas Verificadas'}
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            {storefront?.tagline || 'Seleção das melhores promoções e achadinhos verificados com preços reais.'}
          </p>

          {/* Community Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {storefront?.whatsappGroupUrl && (
              <a
                href={storefront.whatsappGroupUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Entrar no Grupo VIP WhatsApp</span>
              </a>
            )}

            {storefront?.telegramChannelUrl && (
              <a
                href={storefront.telegramChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-950/50 hover:bg-sky-500 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Canal no Telegram</span>
              </a>
            )}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90"></div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 flex-1 space-y-6">
        
        {/* Search & Categories Bar */}
        <div className="space-y-3">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos nesta vitrine..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {['todas', 'Eletrônicos', 'Eletrodomésticos', 'Celulares e acessórios', 'Casa e decoração'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === c
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {c === 'todas' ? 'Todos os Produtos' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Carregando promoções da vitrine...</div>
        ) : filteredOffers.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">Nenhum produto encontrado nesta busca.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOffers.map(offer => (
              <div
                key={offer.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg hover:border-slate-700 transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="rounded bg-slate-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase border border-slate-700">
                      {offer.marketplace}
                    </span>
                    <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                      {offer.discountPercent}% OFF
                    </span>
                  </div>
                  {offer.freeShipping && (
                    <div className="absolute bottom-2.5 left-2.5 rounded bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      🚚 Frete Grátis
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10.5px] text-slate-400">{offer.category}</span>
                    <h3 className="text-xs font-bold text-white line-clamp-2 mt-0.5 leading-snug">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="rounded-xl bg-slate-950 p-3 border border-slate-800/80">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-500 line-through">
                          R$ {offer.originalPrice.toFixed(2)}
                        </span>
                        <div className="text-lg font-black text-emerald-400">
                          R$ {offer.promoPrice.toFixed(2)}
                        </div>
                      </div>

                      {offer.couponCode && (
                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Cupom</span>
                          <button
                            onClick={() => handleCopyCoupon(offer.couponCode!)}
                            className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                          >
                            <span>{offer.couponCode}</span>
                            {copiedCoupon === offer.couponCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA button leading to /r/:shortCode */}
                  <a
                    href={`/r/${offer.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/30 transition-colors"
                  >
                    <span>Pegar Promoção Oficial</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Transparency Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-400 space-y-2">
        <p className="max-w-xl mx-auto leading-relaxed">
          <strong>Aviso de Transparência:</strong> Os preços, cupons e estoque são de inteira responsabilidade das lojas parceiras e podem variar a qualquer momento. Como participantes de programas de afiliados, podemos receber comissões pelas compras qualificadas realizadas através dos links, sem nenhum acréscimo para você.
        </p>
        <p className="text-[11px] text-slate-400">
          Powered by <strong>DivulgaPromo</strong> • Inteligência de Ofertas
        </p>
      </footer>

    </div>
  );
};
