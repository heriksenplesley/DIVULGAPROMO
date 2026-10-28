import React from 'react';
import {
  Zap,
  Sparkles,
  ShoppingBag,
  Share2,
  Calendar,
  Store,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Lock,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-900/40">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-lg text-white">
              DIVULGA<span className="text-blue-400 font-black">PROMO</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
          >
            <span>Acessar Painel</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-4xl space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Sua Inteligência de Ofertas. Sua Máquina de Divulgação.</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            A Plataforma Definitiva para Afiliados e Criadores{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Venderem Mais Todos os Dias.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Descubra produtos em alta na Shopee, Amazon, Mercado Livre e Magalu, crie anúncios e artes com inteligência artificial, gerencie links rastreáveis e automatize divulgações autorizadas sem complicação.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-900/40 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Entrar no Sistema Agora</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Sem dados inventados
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Links 100% seguros com suas tags
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Conformidade LGPD
            </span>
          </div>
        </div>

        {/* Ambient Lights */}
        <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl"></div>
        <div className="pointer-events-none absolute right-10 top-40 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl"></div>
      </section>

      {/* 6 Core Modules Grid */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="mx-auto max-w-6xl space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tudo o que você precisa em uma única plataforma
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Projetado por especialistas em marketing de afiliados para maximizar a conversão de canais e redes sociais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Promo IA Autônomo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assistente comercial conectado a ferramentas reais: busca de ofertas, cálculo de desconto, análise de horários e geração de copys sem alucinação.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Central de Ofertas com Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Catálogo inteligente com pontuação de potencial comercial (0 a 100) calculada por desconto real, frete grátis e avaliações confirmadas.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Conversor de Links de Afiliado</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cole o link original da Amazon, Shopee ou ML. O sistema identifica o marketplace, aplica sua tag oficial e gera o link curto com métricas.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Vitrine Pública com Domínio Próprio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Página de vendas própria pronta para bio do Instagram e TikTok, com botão para seu grupo VIP e catálogo completo pesquisável.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Agendador em Modo Seguro</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fila de postagens idempotente com controle de frequência antispam e publicação via APIs oficiais de WhatsApp e Telegram.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Métricas & Comissões Auditadas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diferencie cliques de conversões confirmadas e comissões pendentes de valores liquidados, sem números ilusórios.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-12 px-4 text-center text-xs text-slate-400 space-y-4 border-t border-slate-800">
        <p className="font-semibold text-slate-300">
          DIVULGAPROMO • Plataforma SaaS de Inteligência de Ofertas
        </p>
        <p className="max-w-md mx-auto text-[11px] text-slate-400">
          Desenvolvido com arquitetura moderna full-stack, segurança em camadas, controle de acesso granular e inteligência com Gemini 3.8 Flash.
        </p>
        <button
          onClick={onEnterApp}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 font-bold text-white transition-colors"
        >
          Acessar a Plataforma Agora
        </button>
      </footer>

    </div>
  );
};
