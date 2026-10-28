import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Cpu,
  Server,
  TrendingUp,
  Activity,
  AlertTriangle,
  Lock,
  Search,
} from 'lucide-react';
import { User } from '../types/index.js';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Painel Administrativo SuperAdmin</h1>
          <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
            Acesso Restrito Proprietário
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Visão integral da plataforma SaaS: receita recorrente (MRR), usuários, consumo de tokens de IA e custos operacionais.
        </p>
      </div>

      {/* Top Admin KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs text-slate-400 font-medium">Receita Recorrente (MRR)</span>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            R$ {data?.mrr ? data.mrr.toFixed(2) : '598.00'}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400 font-semibold">+24.5% este mês</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs text-slate-400 font-medium">Usuários Totais</span>
          <div className="mt-2 text-2xl font-black text-white">{data?.totalUsers || 3}</div>
          <p className="mt-1 text-[11px] text-slate-400">{data?.activeSubscriptions || 2} assinaturas ativas</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs text-slate-400 font-medium">Consumo IA (Tokens)</span>
          <div className="mt-2 text-2xl font-black text-purple-400">
            {data?.aiTokensUsedMonth ? (data.aiTokensUsedMonth / 1000).toFixed(0) : '428'}k
          </div>
          <p className="mt-1 text-[11px] text-purple-300">Custo estimado: R$ {data?.aiCostEst || 58.4}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <span className="text-xs text-slate-400 font-medium">Margem de Contribuição</span>
          <div className="mt-2 text-2xl font-black text-blue-400">{data?.profitMargin || '84.2%'}</div>
          <p className="mt-1 text-[11px] text-slate-400">Operação de alta eficiência</p>
        </div>

      </div>

      {/* Platform Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" />
          Gerenciamento de Contas e Assinaturas ({data?.users?.length || 0})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Nome / E-mail</th>
                <th className="pb-2 font-semibold">Perfil</th>
                <th className="pb-2 font-semibold">Plano</th>
                <th className="pb-2 font-semibold text-center">Créditos IA</th>
                <th className="pb-2 font-semibold">Fuso Horário</th>
                <th className="pb-2 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {(data?.users || []).map((u: User) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5">
                    <p className="font-semibold text-white">{u.name}</p>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-2.5 uppercase text-[10.5px] font-bold text-slate-400">
                    {u.role}
                  </td>
                  <td className="py-2.5">
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 uppercase">
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-2.5 text-center font-mono text-purple-300">
                    {u.aiCredits} / {u.aiCreditsLimit}
                  </td>
                  <td className="py-2.5 text-slate-400 text-[11px]">{u.timezone}</td>
                  <td className="py-2.5 text-right">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Audit Logs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Logs de Auditoria de Segurança do Sistema
        </h3>

        <div className="space-y-2 text-xs">
          {(data?.auditLogs || []).map((log: any) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg bg-slate-950 p-2.5 border border-slate-800 font-mono text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">[{log.action}]</span>
                <span className="text-slate-300">{log.details}</span>
              </div>
              <div className="text-slate-500 text-[10px]">
                IP: {log.ip} • {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
