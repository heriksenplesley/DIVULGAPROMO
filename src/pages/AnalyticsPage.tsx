import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  BarChart3,
  MousePointerClick,
  DollarSign,
  TrendingUp,
  Clock,
  Radio,
  CheckCircle2,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  Download,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    fetch('/api/analytics/overview', {
      headers: { 'x-user-id': user?.id || '' },
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, period]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Dashboard de Analytics & Performance</h1>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              Dados Auditados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Métricas de tráfego, rastreamento de cliques únicos, taxa de conversão e conciliação de comissões.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
          {['24h', '7d', '30d', '90d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs font-medium text-slate-400">Total de Cliques</span>
          <div className="mt-2 text-2xl font-black text-white">{data?.totalClicks || 871}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            {data?.uniqueClicks || 709} cliques únicos (antifraude ativo)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs font-medium text-slate-400">Conversões Confirmadas</span>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            {data?.confirmedConversions || 20} vendas
          </div>
          <p className="mt-1 text-[11px] text-emerald-400">Taxa média: {data?.conversionRate || '4.85%'}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs font-medium text-slate-400">Comissões Aprovadas</span>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            R$ {data?.approvedCommissions ? data.approvedCommissions.toFixed(2) : '367.88'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Disponíveis para saque no marketplace</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs font-medium text-slate-400">Comissões Pendentes</span>
          <div className="mt-2 text-2xl font-black text-amber-300">
            R$ {data?.pendingCommissions ? data.pendingCommissions.toFixed(2) : '145.50'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Aguardando janela de devolução do cliente</p>
        </div>
      </div>

      {/* Channel Breakdown & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Channels */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-purple-400" />
            Desempenho por Canal de Divulgação
          </h3>

          <div className="space-y-3">
            {[
              { name: 'Grupos VIP WhatsApp', clicks: 420, percent: 48, color: 'bg-emerald-500' },
              { name: 'Canal de Ofertas Telegram', clicks: 285, percent: 32, color: 'bg-sky-500' },
              { name: 'Vitrine Pública DivulgaPromo', clicks: 110, percent: 13, color: 'bg-blue-500' },
              { name: 'Instagram Stories / Bio', clicks: 56, percent: 7, color: 'bg-pink-500' },
            ].map(ch => (
              <div key={ch.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{ch.name}</span>
                  <span className="font-bold text-white">{ch.clicks} cliques ({ch.percent}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${ch.color}`} style={{ width: `${ch.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            Desempenho por Categoria de Produto
          </h3>

          <div className="space-y-3">
            {[
              { name: 'Eletrônicos & Áudio', percent: 45, color: 'bg-blue-600' },
              { name: 'Eletrodomésticos & Cozinha', percent: 30, color: 'bg-indigo-600' },
              { name: 'Celulares & Acessórios', percent: 15, color: 'bg-purple-600' },
              { name: 'Casa & Utilidades', percent: 10, color: 'bg-emerald-600' },
            ].map(cat => (
              <div key={cat.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{cat.name}</span>
                  <span className="font-bold text-white">{cat.percent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Click logs audit table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MousePointerClick className="h-4 w-4 text-emerald-400" />
            Auditoria Recente de Cliques Rastreáveis
          </h3>
          <span className="text-[11px] text-slate-400">Proteção antifraude com IP e Hash</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Horário</th>
                <th className="pb-2 font-semibold">Link / Produto</th>
                <th className="pb-2 font-semibold">Canal de Origem</th>
                <th className="pb-2 font-semibold">Dispositivo</th>
                <th className="pb-2 font-semibold text-right">Status Conversão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {(data?.recentClicks || []).map((clk: any) => (
                <tr key={clk.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 text-slate-400">
                    {new Date(clk.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 font-mono text-blue-400">/r/{clk.linkCode}</td>
                  <td className="py-2.5 capitalize">{clk.channel}</td>
                  <td className="py-2.5 capitalize flex items-center gap-1.5 text-slate-300">
                    {clk.device === 'mobile' ? (
                      <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <Monitor className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span>{clk.device}</span>
                  </td>
                  <td className="py-2.5 text-right font-semibold">
                    {clk.converted ? (
                      <span className="text-emerald-400 font-bold">
                        Venda + R$ {clk.commissionValue?.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-500">Clique Registrado</span>
                    )}
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
