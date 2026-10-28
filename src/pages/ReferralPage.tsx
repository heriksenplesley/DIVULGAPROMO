import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Gift,
  Copy,
  Check,
  Users,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/referrals/stats', {
      headers: { 'x-user-id': user?.id || '' },
    })
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [user]);

  const copyRefLink = () => {
    if (!data?.referralUrl) return;
    navigator.clipboard.writeText(data.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Programa de Indicação DivulgaPromo</h1>
          <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
            20% Recorrente
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Indique outros afiliados e criadores de conteúdo e receba 20% de comissão sobre cada mensalidade paga de forma contínua.
        </p>
      </div>

      {/* Referral Link Box */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-purple-300">Seu Link Exclusivo de Indicação:</span>
            <p className="text-xs font-mono text-white mt-1 select-all truncate">
              {data?.referralUrl || `https://divulgapromo.com.br/cadastro?ref=${user?.referralCode}`}
            </p>
          </div>
          <button
            onClick={copyRefLink}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shrink-0 shadow-lg shadow-purple-950/50 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Link Copiado!' : 'Copiar Link de Indicação'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-purple-300">
          <span>Seu código de referência:</span>
          <span className="rounded bg-black/40 px-2 py-0.5 font-mono font-bold text-white border border-purple-500/30">
            {data?.referralCode || user?.referralCode}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs text-slate-400 font-medium">Usuários Indicados</span>
          <div className="mt-2 text-2xl font-black text-white">{data?.totalReferrals || 2}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cadastros através do seu link</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs text-slate-400 font-medium">Assinaturas Qualificadas</span>
          <div className="mt-2 text-2xl font-black text-purple-400">{data?.qualifiedReferrals || 1}</div>
          <p className="text-[11px] text-purple-300 mt-1">Assinantes ativos pagando mensalidade</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs text-slate-400 font-medium">Comissões Acumuladas</span>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            R$ {data?.totalEarned ? data.totalEarned.toFixed(2) : '59.60'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Disponível para saque mensal</p>
        </div>
      </div>

      {/* Anti-fraud rules card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">Regras Antifraude e Conformidade do Programa</p>
          <p>
            Não é permitida a autorreferência (criar contas para si mesmo com seu próprio link). As comissões são apuradas estritamente sobre receitas elegíveis efetivamente liquidadas após a confirmação do meio de pagamento.
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-400" />
          Extrato Detalhado de Assinantes Indicados
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Assinante Indicado</th>
                <th className="pb-2 font-semibold">Plano Contratado</th>
                <th className="pb-2 font-semibold">Data do Cadastro</th>
                <th className="pb-2 font-semibold text-center">Status</th>
                <th className="pb-2 font-semibold text-right">Comissão Mensal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {(data?.records || []).map((rec: any) => (
                <tr key={rec.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-medium text-white">{rec.referredUserName}</td>
                  <td className="py-2.5 text-slate-300">{rec.subscriptionPlan}</td>
                  <td className="py-2.5 text-slate-400">
                    {new Date(rec.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        rec.status === 'qualified'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {rec.status === 'qualified' ? 'Qualificado / Ativo' : 'Em Análise'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-emerald-400">
                    R$ {rec.commissionAmount.toFixed(2)} / mês
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
