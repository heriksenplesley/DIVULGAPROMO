import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Brain,
} from 'lucide-react';

interface PromoIAAgentPageProps {
  setCurrentTab: (tab: string) => void;
  onSelectOfferForAd?: (offer: any) => void;
}

export const PromoIAAgentPage: React.FC<PromoIAAgentPageProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Olá, **${user?.name}**! Sou o **PROMO IA**, seu cérebro comercial operacional.\n\nMinha arquitetura opera orientada a ferramentas com verificação em tempo real: busco ofertas reais no banco de dados, aplico suas credenciais oficiais de afiliado, redijo anúncios com gatilhos de conversão e calculo descontos auditados.\n\nComo posso acelerar suas vendas hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toolsList = [
    { name: 'buscar_ofertas', desc: 'Consulta catálogo de promoções ativas por categoria e marketplace' },
    { name: 'consultar_preco', desc: 'Verifica preço e desconto do produto sem alucinar valores' },
    { name: 'validar_link', desc: 'Analisa protocolo, proteção anti-SSRF e domínio da loja' },
    { name: 'converter_link_afiliado', desc: 'Anexa parâmetros oficiais do programa e gera /r/:code' },
    { name: 'gerar_anuncio', desc: 'Estrutura copy para WhatsApp e Telegram nos 10 formatos' },
    { name: 'calcular_desconto', desc: 'Calcula economia em R$ e percentual exato' },
    { name: 'calcular_comissao_estimada', desc: 'Estima ganhos com base na comissão média da rede' },
    { name: 'recomendar_estrategia', desc: 'Sugere horários ideais e canais por nicho de produto' },
  ];

  const quickPrompts = [
    'Encontre as melhores ofertas com desconto >40%',
    'Crie um anúncio de oferta relâmpago para WhatsApp',
    'Qual a comissão estimada para um produto de R$ 380 na Shopee?',
    'Quais os horários com maior volume de compras para o nicho de Casa?',
    'Identifique oportunidades quentes para divulgar hoje',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: data.message,
          toolCalls: data.toolCalls,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Promo IA • Assistente & Agente Autônomo</h1>
            <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
              Tool Calling Ativo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inteligência operacional conectada diretamente ao banco de dados e seus canais de divulgação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-purple-500/30 bg-purple-950/20 px-3 py-1.5 text-xs text-purple-300 font-semibold flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-purple-400" />
            <span>Memória Comercial Ativa</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Large Interactive Chat Stream */}
        <div className="lg:col-span-8 flex flex-col h-[650px] rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{msg.content}</div>

                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-800 pt-2.5">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                        <Wrench className="h-3 w-3" />
                        Ferramentas Executadas ({msg.toolCalls.length})
                      </p>
                      {msg.toolCalls.map((tc: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-lg bg-slate-900 p-2 border border-purple-500/20 text-[11px]"
                        >
                          <div className="flex items-center justify-between font-mono text-purple-300">
                            <span>{tc.tool}()</span>
                            <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Executada
                            </span>
                          </div>
                          {tc.result?.ofertas && (
                            <div className="mt-1.5 space-y-1">
                              {tc.result.ofertas.map((o: any) => (
                                <div
                                  key={o.id}
                                  className="flex items-center justify-between rounded bg-slate-950 px-2 py-1 text-[10.5px]"
                                >
                                  <span className="truncate max-w-[200px] text-slate-300">{o.titulo}</span>
                                  <span className="font-bold text-emerald-400">{o.precoPromocional}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 text-right text-[9.5px] opacity-60">{msg.timestamp}</div>
                </div>

                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-purple-300 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
                  <span>Promo IA executando ferramentas internas...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt chips */}
          <div className="border-t border-slate-800 bg-slate-950/80 px-4 py-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">Comandos rápidos:</span>
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 hover:border-purple-500/50 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="border-t border-slate-800 bg-slate-950 p-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Converse com o Promo IA (ex: encontre oportunidades, crie copys, calcule comissão)..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-900/40 hover:bg-purple-500 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column (4 cols): Tools & Memory Status */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Autonomous Tools Registered */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Wrench className="h-4 w-4 text-purple-400" />
              Ferramentas Internas Disponíveis ({toolsList.length})
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {toolsList.map(t => (
                <div key={t.name} className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                  <span className="font-mono font-bold text-purple-300 block">{t.name}()</span>
                  <span className="text-[10.5px] text-slate-400">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Preferences & Memory */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Brain className="h-4 w-4 text-blue-400" />
              Memória & Perfil do Afiliado
            </h3>

            <div className="space-y-2 text-slate-300">
              <p>
                <strong className="text-white">Nichos Ativos:</strong> {user?.niche.join(', ')}
              </p>
              <p>
                <strong className="text-white">Plano:</strong> {user?.plan.toUpperCase()} ({user?.aiCredits} créditos disponíveis)
              </p>
              <p>
                <strong className="text-white">Programas Autorizados:</strong> Amazon, Shopee, Mercado Livre, Magalu
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
