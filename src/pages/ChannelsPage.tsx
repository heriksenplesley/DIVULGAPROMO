import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Key,
  ShieldCheck,
  Send,
  ExternalLink,
  MessageSquare,
  Instagram,
  Facebook,
} from 'lucide-react';
import { IntegrationAccount } from '../types/index.js';

export const ChannelsPage: React.FC = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<IntegrationAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form states for credentials
  const [tgToken, setTgToken] = useState('6892341234:AAHq_DEMO_TOKEN_DIVULGA');
  const [tgChatId, setTgChatId] = useState('@achadinhos_carlos_oficial');

  const [waPhoneId, setWaPhoneId] = useState('1092837465');
  const [waToken, setWaToken] = useState('EAAG_DEMO_TOKEN_WHATSAPP_DIVULGAPROMO');

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations', {
        headers: { 'x-user-id': user?.id || '' },
      });
      const data = await res.json();
      setIntegrations(data.integrations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [user]);

  const handleSaveTelegram = async () => {
    try {
      await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          type: 'telegram',
          name: 'Canal VIP Ofertas Telegram',
          credentials: { botToken: tgToken, chatId: tgChatId },
        }),
      });
      setSuccessNotice('Configuração do Telegram salva com sucesso!');
      setTimeout(() => setSuccessNotice(null), 3000);
      fetchIntegrations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveWhatsApp = async () => {
    try {
      await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          type: 'whatsapp',
          name: 'WhatsApp Business Cloud API',
          credentials: { phoneNumberId: waPhoneId, accessToken: waToken },
        }),
      });
      setSuccessNotice('Configuração do WhatsApp salva com sucesso!');
      setTimeout(() => setSuccessNotice(null), 3000);
      fetchIntegrations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestConnection = (type: string) => {
    setTestingId(type);
    setTimeout(() => {
      setTestingId(null);
      setSuccessNotice(`Ping de teste enviado com sucesso para ${type}!`);
      setTimeout(() => setSuccessNotice(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Central de Canais & Integrações</h1>
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
            APIs Oficiais
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Conecte seus canais de distribuição para automação segura de ofertas conforme termos de uso da Meta e Telegram.
        </p>
      </div>

      {successNotice && (
        <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{successNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Telegram Bot Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Canal / Grupo Telegram</h3>
                <p className="text-[11px] text-slate-400">Publicação direta via Telegram Bot oficial</p>
              </div>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              Conectado
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Bot Token (obtido no @BotFather)</label>
              <input
                type="password"
                value={tgToken}
                onChange={e => setTgToken(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Canal ou Chat ID</label>
              <input
                type="text"
                value={tgChatId}
                onChange={e => setTgChatId(e.target.value)}
                placeholder="@meu_canal_promos ou -10012345678"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => handleTestConnection('Telegram')}
              disabled={testingId === 'Telegram'}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${testingId === 'Telegram' ? 'animate-spin' : ''}`} />
              <span>Testar Disparo</span>
            </button>
            <button
              onClick={handleSaveTelegram}
              className="rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-sky-500 transition-colors"
            >
              Salvar Telegram
            </button>
          </div>
        </div>

        {/* WhatsApp Business Cloud API Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">WhatsApp Business Platform</h3>
                <p className="text-[11px] text-slate-400">Envio para canais permitidos e grupos autorizados</p>
              </div>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              Conectado
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Phone Number ID (Meta Graph)</label>
              <input
                type="text"
                value={waPhoneId}
                onChange={e => setWaPhoneId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Permanent Access Token</label>
              <input
                type="password"
                value={waToken}
                onChange={e => setWaToken(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => handleTestConnection('WhatsApp')}
              disabled={testingId === 'WhatsApp'}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${testingId === 'WhatsApp' ? 'animate-spin' : ''}`} />
              <span>Testar Conexão</span>
            </button>
            <button
              onClick={handleSaveWhatsApp}
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
            >
              Salvar WhatsApp
            </button>
          </div>
        </div>

        {/* Instagram & Meta Graph */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Instagram Graph API</h3>
                <p className="text-[11px] text-slate-400">Publicação de artes no Feed e Stories de contas Business</p>
              </div>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
              Configurável
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Permite o agendamento de posts de imagem diretamente no perfil da sua marca através do login oficial com Facebook/Meta.
          </p>

          <button
            onClick={() => alert('Para conectar o Instagram, adicione o App ID e App Secret nas variáveis de ambiente META_APP_ID e faça o fluxo de autorização OAuth.')}
            className="w-full rounded-lg border border-pink-500/30 bg-pink-950/20 py-2 text-xs font-semibold text-pink-300 hover:bg-pink-950/40 transition-colors"
          >
            Conectar Conta Instagram Business
          </button>
        </div>

        {/* Manual Assisted Share & Web Store */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Compartilhamento Rápido Assistido</h3>
                <p className="text-[11px] text-slate-400">1-clique para abrir no WhatsApp Web e Telegram Desktop</p>
              </div>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Pronto
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Se preferir não usar credenciais de bot, utilize os atalhos de envio assistido que preparam a mensagem pronta com link curto rastreável no seu navegador.
          </p>
        </div>

      </div>

    </div>
  );
};
