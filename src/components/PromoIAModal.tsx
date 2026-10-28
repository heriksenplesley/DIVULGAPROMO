import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User as UserIcon,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface PromoIAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: {
    tool: string;
    args: any;
    result: any;
  }[];
  timestamp: string;
}

export const PromoIAModal: React.FC<PromoIAModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Olá, **${user?.name || 'Afiliado'}**! Sou o **PROMO IA**, seu assistente comercial autônomo.\n\nEstou conectado ao seu banco de dados, às suas afiliações autorizadas (Shopee, Amazon, Mercado Livre, Magalu) e aos seus canais de divulgação.\n\nO que você gostaria de fazer agora?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Encontre as melhores oportunidades com >40% de desconto',
    'Crie um anúncio persuasivo para o Fone Anker Soundcore Q30',
    'Calcule a comissão estimada para um produto de R$ 289 na Amazon',
    'Quais são os melhores horários para divulgar no WhatsApp?',
    'Audite minhas métricas e cliques desta semana',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: query,
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
          message: query,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.message || 'Processado com sucesso.',
        toolCalls: data.toolCalls,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Desculpe, ocorreu uma instabilidade temporária ao conectar com a inteligência. Suas regras de negócio locais permanecem preservadas.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-purple-500/30 bg-slate-950 text-slate-100 shadow-2xl shadow-purple-950/50 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-900/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white">PROMO IA</h3>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">
                  Agente Autônomo com Tools
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Assistente comercial • Sem dados falsos • Validação estrita
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([messages[0]]);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Limpar histórico"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
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
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-line font-sans">
                  {msg.content}
                </div>

                {/* If tool calls occurred, show audit badge */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-slate-800 pt-2.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      <Wrench className="h-3 w-3" />
                      Ferramentas Executadas ({msg.toolCalls.length})
                    </p>
                    {msg.toolCalls.map((tc, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-slate-950/70 p-2 border border-purple-500/20 text-[11px]"
                      >
                        <div className="flex items-center justify-between font-mono text-purple-300">
                          <span>{tc.tool}()</span>
                          <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Executada
                          </span>
                        </div>
                        {tc.result && tc.result.ofertas && (
                          <div className="mt-1.5 space-y-1">
                            {tc.result.ofertas.map((o: any) => (
                              <div
                                key={o.id}
                                className="flex items-center justify-between rounded bg-slate-900 px-2 py-1 text-[10.5px]"
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

                <div className="mt-1 text-right text-[9.5px] opacity-60">
                  {msg.timestamp}
                </div>
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
              <div className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs text-purple-300 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
                <span>Promo IA consultando ferramentas e analisando dados...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="border-t border-slate-900 bg-slate-950/80 px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">Sugestões:</span>
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

        {/* Input area */}
        <div className="border-t border-slate-800 bg-slate-900 p-3.5">
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
              placeholder="Pergunte ao Promo IA (ex: crie 3 copies para a Air Fryer, compare métricas...)"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-900/40 hover:bg-purple-500 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-slate-400">
            <span>Modelo: Gemini 3.8 Flash • Fuso: America/Campo_Grande</span>
            <span>Créditos restantes: {user?.aiCredits || 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
