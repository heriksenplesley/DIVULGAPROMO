import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  ShoppingBag,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  PlusCircle,
  TrendingUp,
  Tag,
  ShieldCheck,
  Trash2,
  Share2,
} from 'lucide-react';
import { Offer } from '../types/index.js';

interface OffersPageProps {
  setCurrentTab: (tab: string) => void;
  openNewOfferModal: () => void;
  onSelectOfferForAd?: (offer: Offer) => void;
  onSelectOfferForArt?: (offer: Offer) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  setCurrentTab,
  openNewOfferModal,
  onSelectOfferForAd,
  onSelectOfferForArt,
}) => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedMarketplace, setSelectedMarketplace] = useState('todos');
  const [selectedPotential, setSelectedPotential] = useState('todos');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'todas') params.append('category', selectedCategory);
      if (selectedMarketplace !== 'todos') params.append('marketplace', selectedMarketplace);
      if (selectedPotential !== 'todos') params.append('commercialPotential', selectedPotential);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/offers?${params.toString()}`);
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [selectedCategory, selectedMarketplace, selectedPotential, searchTerm]);

  const handleCopyLink = (shortCode: string) => {
    const fullUrl = `https://divulgapromo.com.br/r/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Deseja realmente remover esta oferta?')) return;
    try {
      await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Central Inteligente de Ofertas</h1>
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
              {offers.length} produtos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Catálogo verificado com monitoramento de preços, cálculo de desconto real e potencial de conversão.
          </p>
        </div>

        <button
          onClick={openNewOfferModal}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-colors cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Cadastrar / Importar Oferta</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do produto, marca ou modelo..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="todas">Todas as Categorias</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Celulares e acessórios">Celulares e acessórios</option>
            <option value="Informática">Informática</option>
            <option value="Casa e decoração">Casa e decoração</option>
            <option value="Eletrodomésticos">Eletrodomésticos</option>
            <option value="Moda e beleza">Moda e beleza</option>
          </select>

          {/* Marketplace Filter */}
          <select
            value={selectedMarketplace}
            onChange={e => setSelectedMarketplace(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="todos">Todos os Marketplaces</option>
            <option value="amazon">Amazon Brasil</option>
            <option value="shopee">Shopee</option>
            <option value="mercadolivre">Mercado Livre</option>
            <option value="aliexpress">AliExpress</option>
            <option value="magalu">Magazine Luiza</option>
            <option value="hotmart">Hotmart</option>
          </select>

          {/* Potential Filter */}
          <select
            value={selectedPotential}
            onChange={e => setSelectedPotential(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="todos">Todo Potencial</option>
            <option value="alta">Potencial Alto (Score &gt; 85)</option>
            <option value="media">Potencial Médio (Score 65-84)</option>
            <option value="moderada">Potencial Moderado</option>
          </select>

        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Carregando catálogo inteligente...
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-3 text-sm font-bold text-white">Nenhuma oferta encontrada</h3>
          <p className="mt-1 text-xs text-slate-400">Tente ajustar os filtros ou adicione uma nova oferta colando o link do produto.</p>
          <button
            onClick={openNewOfferModal}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Adicionar Oferta Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map(offer => (
            <div
              key={offer.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm hover:border-slate-700 hover:shadow-md transition-all group"
            >
              {/* Card Image Header */}
              <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded bg-slate-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase border border-slate-700">
                    {offer.marketplace}
                  </span>
                  <span className="rounded bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-white">
                    {offer.discountPercent}% OFF
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      offer.potentialScore >= 90
                        ? 'bg-purple-600 text-white'
                        : offer.potentialScore >= 75
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                    title="Score de Potencial Comercial calculado por desconto, frete e avaliação"
                  >
                    Score {offer.potentialScore}
                  </span>
                </div>

                {offer.freeShipping && (
                  <div className="absolute bottom-2 left-2.5 rounded bg-black/75 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-400">
                    🚚 Frete Grátis
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{offer.category}</span>
                    <span>★ {offer.rating.toFixed(1)} ({offer.reviewsCount})</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {offer.title}
                  </h3>
                </div>

                {/* Price block */}
                <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 line-through">
                        R$ {offer.originalPrice.toFixed(2)}
                      </span>
                      <div className="text-base font-black text-emerald-400">
                        R$ {offer.promoPrice.toFixed(2)}
                      </div>
                    </div>
                    {offer.couponCode && (
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Cupom</span>
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                          {offer.couponCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tracking short link row */}
                <div className="flex items-center justify-between rounded bg-slate-950 px-2 py-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="truncate max-w-[170px]">/r/{offer.shortCode}</span>
                  <button
                    onClick={() => handleCopyLink(offer.shortCode)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-sans font-semibold"
                  >
                    {copiedCode === offer.shortCode ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="border-t border-slate-800 bg-slate-950/40 p-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (onSelectOfferForAd) onSelectOfferForAd(offer);
                    setCurrentTab('ad-generator');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Anúncio IA</span>
                </button>

                <button
                  onClick={() => {
                    if (onSelectOfferForArt) onSelectOfferForArt(offer);
                    setCurrentTab('art-studio');
                  }}
                  className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 p-1.5 text-slate-300 transition-colors"
                  title="Criar Arte Promocional no Estúdio"
                >
                  <Tag className="h-4 w-4 text-purple-400" />
                </button>

                <button
                  onClick={() => handleDeleteOffer(offer.id)}
                  className="flex items-center justify-center rounded-lg border border-slate-800 hover:bg-rose-950/30 p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Excluir Oferta"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
