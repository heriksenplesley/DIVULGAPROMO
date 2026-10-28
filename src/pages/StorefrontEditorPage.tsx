import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Store,
  Palette,
  ExternalLink,
  Save,
  Check,
  Share2,
  Copy,
  Sliders,
  QrCode,
} from 'lucide-react';
import { StorefrontSettings } from '../types/index.js';

interface StorefrontEditorProps {
  setCurrentTab: (tab: string) => void;
}

export const StorefrontEditorPage: React.FC<StorefrontEditorProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<StorefrontSettings>({
    userId: user?.id || 'usr_affiliate_demo',
    slug: user?.storefrontSlug || 'achadinhos-do-carlos',
    storeName: 'Achadinhos do Carlos - Ofertas Verificadas',
    tagline: 'As melhores promoções de tecnologia e casa testadas e garimpadas diariamente.',
    primaryColor: '#0B1E36',
    accentColor: '#2563EB',
    whatsappGroupUrl: 'https://chat.whatsapp.com/demo-vip-carlos',
    telegramChannelUrl: 'https://t.me/achadinhos_carlos_oficial',
    showDisclaimers: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.storefrontSlug) {
      fetch(`/api/storefronts/${user.storefrontSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.storefront) {
            setSettings(data.storefront);
          }
        });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/storefronts/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `https://divulgapromo.com.br/ofertas/${settings.slug}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Minha Vitrine Pública de Promoções</h1>
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
              Página de Vendas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sua página de ofertas personalizada com domínio próprio ou subdomínio para colocar na Bio das redes sociais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('storefront-public')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span>Ver Vitrine como Visitante</span>
            <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Public Link Bar */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Store className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white">Link Público da sua Vitrine:</p>
            <p className="text-xs text-blue-300 font-mono truncate">{publicUrl}</p>
          </div>
        </div>

        <button
          onClick={copyUrl}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 shrink-0 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Link Copiado!' : 'Copiar Link da Vitrine'}</span>
        </button>
      </div>

      {/* Editor Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Nome da Vitrine</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Slug da URL (Endereço)</label>
              <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-400">
                <span className="font-mono">/ofertas/</span>
                <input
                  type="text"
                  required
                  value={settings.slug}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    })
                  }
                  className="w-full bg-transparent text-white font-mono focus:outline-none pl-1"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Slogan / Descrição Curta da Loja</label>
            <textarea
              rows={2}
              value={settings.tagline}
              onChange={e => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
            />
          </div>

          {/* Social Community Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Link de Convite do Grupo VIP WhatsApp</label>
              <input
                type="url"
                value={settings.whatsappGroupUrl || ''}
                onChange={e => setSettings({ ...settings, whatsappGroupUrl: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Link do Canal Telegram de Ofertas</label>
              <input
                type="url"
                value={settings.telegramChannelUrl || ''}
                onChange={e => setSettings({ ...settings, telegramChannelUrl: e.target.value })}
                placeholder="https://t.me/meu_canal"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Cor Primária do Cabeçalho</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="h-9 w-14 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-slate-400">{settings.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Cor de Acento dos Botões</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={e => setSettings({ ...settings, accentColor: e.target.value })}
                  className="h-9 w-14 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-slate-400">{settings.accentColor}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={settings.showDisclaimers}
                onChange={e => setSettings({ ...settings, showDisclaimers: e.target.checked })}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Exibir rodapé de transparência de afiliados e aviso de variação de preços (Recomendado)</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>{saved ? 'Configurações Salvas!' : 'Salvar Alterações'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
