import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Send,
  MessageCircle,
  FileText,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setTicketSent(false), 4000);
  };

  const faqs = [
    {
      q: 'Como funcionam os links curtos do DivulgaPromo?',
      a: 'Cada link curto (/r/:code) preserva seu ID ou tag de afiliado do marketplace correspondente, redireciona o usuário com rapidez e registra em segundo plano o clique, dispositivo e horário para auditoria de métricas.',
    },
    {
      q: 'O que o Promo IA pode e não pode fazer?',
      a: 'O Promo IA analisa ofertas do catálogo, gera anúncios nos 10 formatos configurados, calcula descontos reais e recomenda melhores horários com base no nicho. Ele é estritamente proibido de inventar preços, comissões ou estoques não verificados.',
    },
    {
      q: 'Como funciona a aprovação de comissões?',
      a: 'O DivulgaPromo registra os cliques imediatamente no seu painel. A conciliação de vendas e o pagamento das comissões dependem do prazo de aprovação e da janela de garantia de cada marketplace parceiro (Shopee, Amazon, ML, etc.).',
    },
    {
      q: 'Posso usar minha vitrine pública na bio do Instagram?',
      a: 'Sim! Sua vitrine pública fica disponível em divulgapromo.com.br/ofertas/seu-slug e já conta com links rastreáveis, botão de entrada no seu grupo VIP e avisos de transparência comercial exigidos pela legislação.',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Ajuda, Suporte & Diretrizes de Compliance</h1>
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
            Base de Conhecimento
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Orientações para operar com segurança, respeitando as regras dos marketplaces e as melhores práticas de afiliados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): FAQs & Guidelines */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Marketplace Rules Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Diretrizes Oficiais dos Principais Marketplaces
            </h3>

            <div className="space-y-2 text-slate-300 leading-relaxed">
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <p className="font-bold text-white">Amazon Associates:</p>
                <p className="text-[11px] text-slate-400">
                  É obrigatório informar publicamente que você é associado e pode receber comissão por compras qualificadas. Nunca divulgue preços em e-mails estáticos que possam desatualizar sem aviso.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <p className="font-bold text-white">Shopee Afiliados:</p>
                <p className="text-[11px] text-slate-400">
                  Utilize links com parâmetro af oficial. Não realize cloaking enganoso nem prometa cupons que não estejam ativos na plataforma.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                <p className="font-bold text-white">Mercado Livre Afiliados:</p>
                <p className="text-[11px] text-slate-400">
                  Preserve os parâmetros matt_tool e garanta que o tráfego originado venha de canais ou perfis com conteúdo real e público orgânico.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-400" />
              Perguntas Frequentes (FAQ)
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1 text-xs">
                  <p className="font-bold text-white">{faq.q}</p>
                  <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Ticket Form */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <MessageCircle className="h-4 w-4 text-purple-400" />
            Abrir Chamado com Suporte Técnico
          </h3>

          {ticketSent && (
            <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Chamado registrado com sucesso! Nossa equipe responderá em até 24h.</span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Assunto do Chamado</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                placeholder="Ex: Dúvida sobre conexão do WhatsApp Cloud..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Descrição Detalhada</label>
              <textarea
                rows={5}
                required
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                placeholder="Descreva o que ocorreu, links afetados ou dúvida técnica..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Enviar Chamado</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <p>Atendimento comercial e técnico: Segunda a Sexta, das 08h às 18h (America/Campo_Grande).</p>
          </div>
        </div>

      </div>

    </div>
  );
};
