import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calculator,
  PieChart,
  ShieldCheck,
  Percent,
  Sliders,
  HelpCircle,
} from 'lucide-react';

export const FinancialPage: React.FC = () => {
  // Configurable parameters
  const [activeSubscribers, setActiveSubscribers] = useState(250);
  const [averageTicket, setAverageTicket] = useState(175); // BRL
  const [churnRate, setChurnRate] = useState(3.5); // %
  const [aiCostPerUser, setAiCostPerUser] = useState(6.5); // BRL/month
  const [serverInfraCost, setServerInfraCost] = useState(380); // BRL/month fixed
  const [paymentGatewayFeePercent, setPaymentGatewayFeePercent] = useState(3.99); // %
  const [supportCost, setSupportCost] = useState(1200); // BRL fixed

  // Calculations
  const grossMRR = activeSubscribers * averageTicket;
  const grossARR = grossMRR * 12;

  const paymentGatewayTotal = grossMRR * (paymentGatewayFeePercent / 100);
  const aiTotalCost = activeSubscribers * aiCostPerUser;
  const operationalCosts = paymentGatewayTotal + aiTotalCost + serverInfraCost + supportCost;

  const netMonthlyProfit = grossMRR - operationalCosts;
  const contributionMarginPercent = grossMRR > 0 ? (netMonthlyProfit / grossMRR) * 100 : 0;
  const projectedAnnualProfit = netMonthlyProfit * 12;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Calculadora de Rentabilidade da Plataforma</h1>
          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            Modelo SaaS Recorrente
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Simule projeções financeiras, custos de infraestrutura e inteligência artificial, taxa de churn e margem de contribuição líquida.
        </p>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sliders className="h-4 w-4 text-blue-400" />
            Variáveis de Crescimento & Custos
          </h3>

          <div>
            <label className="flex items-center justify-between font-semibold text-slate-300 mb-1">
              <span>Assinantes Ativos Pagantes:</span>
              <span className="font-bold text-blue-400">{activeSubscribers} clientes</span>
            </label>
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={activeSubscribers}
              onChange={e => setActiveSubscribers(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="flex items-center justify-between font-semibold text-slate-300 mb-1">
              <span>Ticket Médio por Assinante:</span>
              <span className="font-bold text-emerald-400">R$ {averageTicket},00 / mês</span>
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="5"
              value={averageTicket}
              onChange={e => setAverageTicket(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="flex items-center justify-between font-semibold text-slate-300 mb-1">
              <span>Taxa de Cancelamento Mensal (Churn):</span>
              <span className="font-bold text-amber-400">{churnRate}%</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.5"
              value={churnRate}
              onChange={e => setChurnRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Custo Médio de IA por Usuário (R$)</label>
              <input
                type="number"
                step="0.5"
                value={aiCostPerUser}
                onChange={e => setAiCostPerUser(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Custo de Servidor & Infraestrutura Fixa (R$)</label>
              <input
                type="number"
                value={serverInfraCost}
                onChange={e => setServerInfraCost(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Taxa do Gateway de Pagamento (%)</label>
              <input
                type="number"
                step="0.1"
                value={paymentGatewayFeePercent}
                onChange={e => setPaymentGatewayFeePercent(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Financial Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Top Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-lg">
              <span className="text-xs font-semibold text-slate-400">Faturamento Bruto Mensal (MRR)</span>
              <div className="mt-2 text-3xl font-black text-white">
                R$ {grossMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="mt-1 text-xs text-blue-400 font-semibold">
                ARR Anualizado: R$ {grossARR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-5 shadow-lg">
              <span className="text-xs font-semibold text-emerald-400">Lucro Líquido Operacional Mensal</span>
              <div className="mt-2 text-3xl font-black text-emerald-400">
                R$ {netMonthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="mt-1 text-xs text-emerald-300 font-bold">
                Margem de Contribuição: {contributionMarginPercent.toFixed(1)}%
              </p>
            </div>

          </div>

          {/* Cost Breakdown */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 text-xs">
            <h4 className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Demonstrativo de Custos Operacionais</span>
              <span className="text-slate-400">
                Total: R$ {operationalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </h4>

            <div className="space-y-2.5">
              <div className="flex justify-between text-slate-300">
                <span>Taxas de Processamento de Pagamento ({paymentGatewayFeePercent}%):</span>
                <span className="font-semibold text-white">R$ {paymentGatewayTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Consumo de API de Inteligência Artificial ({activeSubscribers} usuários):</span>
                <span className="font-semibold text-purple-300">R$ {aiTotalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Servidores de Produção & Banco de Dados:</span>
                <span className="font-semibold text-white">R$ {serverInfraCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Suporte ao Cliente e Despesas Gerais:</span>
                <span className="font-semibold text-white">R$ {supportCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Explanatory Accounting Distinction */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <HelpCircle className="h-4 w-4" />
              <span>Diferenciação Financeira Obrigatória</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              O DivulgaPromo não confunde <strong>Faturamento</strong> com <strong>Caixa Realizado</strong>. A receita recorrente reportada considera apenas transações liquidadas via webhook com desconto das taxas bancárias e provisão de estornos.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
