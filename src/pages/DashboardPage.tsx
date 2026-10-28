import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  TrendingUp,
  MousePointerClick,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Calendar,
  Share2,
  Store,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Radio,
  ExternalLink,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import { Offer, Campaign } from '../types/index.js';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
  openAiModal: () => void;
  openNewOfferModal: () => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  setCurrentTab,
  openAiModal,
  openNewOfferModal,
}) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resAnalytics, resOffers, resCampaigns] = await Promise.all([
        fetch('/api/analytics/overview', { headers: { 'x-user-id': user?.id || '' } }),
        fetch('/api/offers'),
        fetch('/api/campaigns', { headers: { 'x-user-id': user?.id || '' } }),
      ]);
      const [dataAna, dataOff, dataCamp] = await Promise.all([
        resAnalytics.json(),
        resOffers.json(),
        resCampaigns.json(),
      ]);
      setAnalytics(dataAna);
      setOffers(dataOff.offers || []);
      setCampaigns(dataCamp.campaigns || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome with Quick Action triggers */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-semibold text-blue-300 border border-blue-500/30">
                Painel Comercial
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Olá, {user?.name.split(' ')[0]}! 🚀
            </h1>
            <p className="mt-1 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sua máquina de divulgação está ativa. Encontre ofertas quentes, automatize anúncios com o <strong>Promo IA</strong> e monitore cliques e comissões auditadas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openAiModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/40 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Pedir ao Promo IA</span>
            </button>
            <button
              onClick={openNewOfferModal}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-blue-400" />
              <span>Cadastrar Oferta</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl"></div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Clicks */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Cliques Registrados</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <MousePointerClick className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{analytics?.totalClicks || 871}</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
              +18.4%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {analytics?.uniqueClicks || 709} cliques únicos auditados
          </p>
        </div>

        {/* Comissões Confirmadas */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Comissões Aprovadas</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">
              R$ {analytics?.approvedCommissions ? analytics.approvedCommissions.toFixed(2) : '367.88'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {analytics?.confirmedConversions || 20} vendas confirmadas
          </p>
        </div>

        {/* Comissões Pendentes */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Comissões em Validação</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300">
              R$ {analytics?.pendingCommissions ? analytics.pendingCommissions.toFixed(2) : '145.50'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Aguardando período de garantia do marketplace</p>
        </div>

        {/* Taxa de Conversão */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Taxa de Conversão</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{analytics?.conversionRate || '4.85%'}</span>
            <span className="text-[10px] text-slate-400">Benchmark: 2.5%</span>
          </div>
          <p className="mt-1 text-[11px] text-purple-300">Alta eficácia em canais fechados</p>
        </div>

      </div>

      {/* Main Grid: Recommended Actions & Next Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Quick Offer Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-blue-400" />
                Ofertas Quentes em Destaque
              </h2>
              <p className="text-[11px] text-slate-400">Produtos verificados com alto apelo comercial e descontos reais</p>
            </div>
            <button
              onClick={() => setCurrentTab('offers')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Ver todas ({offers.length})</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {offers.slice(0, 3).map(offer => (
              <div
                key={offer.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="h-14 w-14 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300 uppercase">
                        {offer.marketplace}
                      </span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                        {offer.discountPercent}% OFF
                      </span>
                      {offer.freeShipping && (
                        <span className="text-[10px] text-slate-400">🚚 Frete Grátis</span>
                      )}
                    </div>
                    <h3 className="mt-1 text-xs font-semibold text-white line-clamp-1 max-w-md">
                      {offer.title}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-emerald-400">
                        R$ {offer.promoPrice.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-500 line-through">
                        R$ {offer.originalPrice.toFixed(2)}
                      </span>
                      {offer.couponCode && (
                        <span className="text-[10px] text-amber-400 font-mono">
                          Cupom: {offer.couponCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setCurrentTab('ad-generator')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Criar Anúncio</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('art-studio')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors"
                  >
                    <span>Gerar Arte</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Banner: Vitrine Pública do Usuário */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sua Vitrine Pública de Ofertas</h4>
                <p className="text-[11px] text-slate-400">
                  Compartilhe seu link público na bio do Instagram ou TikTok para gerar vendas no automático.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('storefront')}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                Personalizar
              </button>
              <button
                onClick={() => setCurrentTab('storefront-public')}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <span>Acessar</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Scheduled Campaigns & Strategy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              Fila de Disparos
            </h2>
            <button
              onClick={() => setCurrentTab('campaigns')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              Ver agenda
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.map(camp => (
              <div
                key={camp.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      camp.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : camp.status === 'scheduled'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {camp.status === 'published' ? 'Publicado' : camp.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(camp.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs font-semibold text-white line-clamp-1">{camp.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{camp.copyText}</p>

                <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Radio className="h-3 w-3 text-purple-400" />
                    {camp.channels.join(', ')}
                  </span>
                  <span className="font-semibold text-slate-300">Modo Seguro</span>
                </div>
              </div>
            ))}
          </div>

          {/* Strategy Tip Box */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Dica de Horário Inteligente</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              O pico de conversão no nicho de <strong>Eletrônicos</strong> ocorre entre <strong>19:45 e 21:30</strong>. Programe um disparo de ofertas relâmpago antes das 20h para capturar o maior volume de vendas.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
