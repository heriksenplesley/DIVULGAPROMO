import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  X,
  Store,
  Tag,
  Radio,
  Share2,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Boas-vindas ao DivulgaPromo!',
      desc: 'Sua plataforma inteligente de marketing de afiliados e automação de ofertas está pronta.',
    },
    {
      num: 2,
      title: 'Seus Nichos de Atuação',
      desc: 'Escolha suas categorias de maior interesse (Eletrônicos, Casa, Moda, Celulares) para receber recomendações certeiras.',
    },
    {
      num: 3,
      title: 'Conecte seus Programas de Afiliados',
      desc: 'Insira sua Amazon Tag, Shopee af ou Mercado Livre matt_tool nas Configurações para garantir 100% das suas comissões.',
    },
    {
      num: 4,
      title: 'Personalize sua Vitrine Pública',
      desc: 'Sua loja em divulgapromo.com.br/ofertas/seu-slug já está ativa com design responsivo para colocar na Bio do Instagram.',
    },
    {
      num: 5,
      title: 'Conecte seus Canais de Mensageria',
      desc: 'Adicione seu Bot do Telegram ou WhatsApp Business para programar disparos automáticos nos seus grupos VIP.',
    },
    {
      num: 6,
      title: 'Cadastre sua Primeira Oferta',
      desc: 'Basta colar o link de qualquer produto para auto-preencher preços, desconto calculado e gerar link curto rastreável.',
    },
    {
      num: 7,
      title: 'Gere Anúncios e Artes com IA',
      desc: 'Utilize o Promo IA para criar copys persuasivas para WhatsApp e artes em alta resolução no Estúdio Visual.',
    },
    {
      num: 8,
      title: 'Agende ou Dispare no Modo Seguro',
      desc: 'Envie com 1 clique para todos os canais selecionados com controle estrito antispam.',
    },
    {
      num: 9,
      title: 'Acompanhe Cliques e Comissões',
      desc: 'Monitore no dashboard os cliques únicos, canais mais rentáveis e comissões aprovadas para saque.',
    },
  ];

  const current = steps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-blue-500/30 bg-slate-950 p-6 text-slate-100 shadow-2xl space-y-5 text-xs">
        
        {/* Top Progress */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-[11px]">
              {step}
            </span>
            <span className="font-semibold text-slate-300">Passo {step} de 9 • Onboarding</span>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
            style={{ width: `${(step / 9) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="space-y-3 py-2">
          <h3 className="text-base font-bold text-white">{current.title}</h3>
          <p className="text-slate-300 leading-relaxed text-xs">{current.desc}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 font-semibold"
          >
            Pular Tutorial
          </button>

          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-300 hover:bg-slate-800"
              >
                Anterior
              </button>
            )}

            <button
              onClick={() => {
                if (step < 9) {
                  setStep(prev => prev + 1);
                } else {
                  onComplete();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-1.5 font-bold text-white shadow-md shadow-blue-900/40 transition-colors"
            >
              <span>{step === 9 ? 'Concluir e Começar' : 'Próximo'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
