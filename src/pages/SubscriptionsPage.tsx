import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  CreditCard,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  QrCode,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Plan } from '../types/index.js';

export const SubscriptionsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('pix');
  const [promoCoupon, setPromoCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any>(null);

  useEffect(() => {
    fetch('/api/subscriptions/plans')
      .then(res => res.json())
      .then(data => setPlans(data.plans || []));
  }, []);

  const handleOpenCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
    setSuccessReceipt(null);
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
          paymentMethod,
          coupon: promoCoupon,
        }),
      });
      const data = await res.json();
      setSuccessReceipt(data);
      await refreshUser();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
          Planos Transparentes Sem Surpresas
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Escale sua Operação de Divulgação
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Escolha a potência ideal para seus grupos, vitrines e automações com inteligência artificial.
        </p>

        {/* Billing Toggle */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
            Mensal
          </span>
          <button
            onClick={() => setBillingCycle(prev => (prev === 'monthly' ? 'yearly' : 'monthly'))}
            className="relative h-6 w-12 rounded-full bg-slate-800 p-0.5 transition-colors"
          >
            <div
              className={`h-5 w-5 rounded-full bg-blue-600 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
            <span>Anual</span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300 font-bold">
              2 Meses Grátis
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {plans.map(plan => {
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.price;
          const isCurrent = user?.plan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                plan.popular
                  ? 'border-blue-500 bg-gradient-to-b from-blue-950/60 to-slate-900 shadow-xl shadow-blue-950/50 ring-1 ring-blue-500/30'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                  Mais Escolhido
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">R$ {price}</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <p className="mt-1 text-[11px] text-purple-300 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {plan.aiCredits} créditos de IA inclusos
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-800 pt-4 text-xs">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  disabled={isCurrent}
                  onClick={() => handleOpenCheckout(plan)}
                  className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40'
                      : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {isCurrent ? 'Plano Atual Ativo' : 'Escolher Este Plano'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Recurrent Billing Terms */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white">Pagamentos 100% Seguros com Webhook Autenticado</p>
            <p>Cobrança recorrente transparente via Mercado Pago / Stripe. Cancele com 1 clique a qualquer momento.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-800 px-2 py-1 font-mono text-[11px]">PIX Instantâneo</span>
          <span className="rounded bg-slate-800 px-2 py-1 font-mono text-[11px]">Cartão de Crédito</span>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-xs space-y-4">
            
            {!successReceipt ? (
              <form onSubmit={handleCompletePayment} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Confirmar Assinatura</h3>
                    <p className="text-[11px] text-slate-400">Plano {selectedPlan.name} • {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-xl bg-slate-900 p-3.5 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Valor da mensalidade:</span>
                    <span className="font-bold text-white">
                      R$ {billingCycle === 'yearly' ? selectedPlan.priceYearly : selectedPlan.price},00
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Desconto cupom BEMVINDO:</span>
                      <span>- R$ 20,00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <span>Créditos de IA liberados:</span>
                    <span className="text-purple-300 font-bold">{selectedPlan.aiCredits} cr/mês</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block font-bold text-slate-200 mb-1.5">Método de Pagamento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`flex items-center justify-center gap-2 rounded-xl p-2.5 border font-semibold transition-all ${
                        paymentMethod === 'pix'
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <QrCode className="h-4 w-4" />
                      <span>PIX (Aprovação 2s)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`flex items-center justify-center gap-2 rounded-xl p-2.5 border font-semibold transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="block font-bold text-slate-200 mb-1">Cupom Promocional</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCoupon}
                      onChange={e => setPromoCoupon(e.target.value.toUpperCase())}
                      placeholder="Ex: PROMO20"
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (promoCoupon) setCouponApplied(true);
                      }}
                      className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-slate-200 font-semibold"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{submitting ? 'Processando Webhook...' : 'Pagar e Ativar Plano Agora'}</span>
                  </button>
                  <p className="mt-1.5 text-center text-[10px] text-slate-500">
                    Transação simulada com sucesso pelo gateway de produção DivulgaPromo.
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">{successReceipt.message}</h3>
                <div className="rounded-xl bg-slate-900 p-3 text-left font-mono text-[11px] text-slate-300 space-y-1">
                  <p>Transação ID: {successReceipt.transactionId}</p>
                  <p>Plano: {selectedPlan.name.toUpperCase()}</p>
                  <p>Status: CONFIRMADO VIA WEBHOOK</p>
                  <p>Créditos IA: +{selectedPlan.aiCredits} creditados</p>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Continuar usando a plataforma
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
