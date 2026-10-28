import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Save,
  Check,
  Tag,
  Clock,
  Coins,
  Download,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'America/Campo_Grande');
  const [currency, setCurrency] = useState(user?.currency || 'BRL');
  const [affiliateIds, setAffiliateIds] = useState(user?.affiliateIds || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          name,
          timezone,
          currency,
          affiliateIds,
        }),
      });
      const data = await res.json();
      if (data.user) {
        updateUser(data.user);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadMyData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `divulgapromo-dados-${user?.id}.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Configurações de Perfil & LGPD</h1>
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
            Conformidade Ativa
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Gerencie suas credenciais de afiliados, identificadores oficiais, preferências regionais e privacidade de dados.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Personal & Regional Info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <SettingsIcon className="h-4 w-4 text-blue-400" />
            Dados Cadastrais & Regionalização
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Fuso Horário Padrão</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              >
                <option value="America/Campo_Grande">America/Campo_Grande (GMT-4)</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo (Brasília GMT-3)</option>
                <option value="America/Cuiaba">America/Cuiaba (GMT-4)</option>
                <option value="America/Manaus">America/Manaus (GMT-4)</option>
                <option value="America/Belem">America/Belem (GMT-3)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Moeda de Operação</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              >
                <option value="BRL">Real Brasileiro (BRL - R$)</option>
                <option value="USD">Dólar Americano (USD - $)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Affiliate Tags Manager */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Tag className="h-4 w-4 text-emerald-400" />
            Identificadores de Programas de Afiliados
          </h3>
          <p className="text-slate-400">
            Estes identificadores serão anexados automaticamente sempre que você converter ou divulgar um link de produto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Amazon Associates Tag</label>
              <input
                type="text"
                value={affiliateIds.amazon || ''}
                onChange={e => setAffiliateIds({ ...affiliateIds, amazon: e.target.value })}
                placeholder="Ex: seunome-20"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Shopee Afiliado (Parâmetro af)</label>
              <input
                type="text"
                value={affiliateIds.shopee || ''}
                onChange={e => setAffiliateIds({ ...affiliateIds, shopee: e.target.value })}
                placeholder="Ex: seu_id_shopee"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mercado Livre (matt_tool)</label>
              <input
                type="text"
                value={affiliateIds.mercadolivre || ''}
                onChange={e => setAffiliateIds({ ...affiliateIds, mercadolivre: e.target.value })}
                placeholder="Ex: seumatt_tool"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Magazine Você (Magalu)</label>
              <input
                type="text"
                value={affiliateIds.magalu || ''}
                onChange={e => setAffiliateIds({ ...affiliateIds, magalu: e.target.value })}
                placeholder="Ex: magazinemagalu"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hotmart Hotlink Code</label>
              <input
                type="text"
                value={affiliateIds.hotmart || ''}
                onChange={e => setAffiliateIds({ ...affiliateIds, hotmart: e.target.value })}
                placeholder="Ex: A12345678B"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">AliExpress Tracking ID</label>
              <input
                type="text"
                value={affiliateIds.aliexpress || ''}
                onChange={e => setAffiliateIds({ ...affiliateIds, aliexpress: e.target.value })}
                placeholder="Ex: sub_ali_track"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saved ? 'Configurações Atualizadas!' : 'Salvar Alterações'}</span>
          </button>
        </div>

      </form>

      {/* LGPD & Privacy Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <ShieldCheck className="h-4 w-4 text-purple-400" />
          Privacidade, Consentimento & LGPD (Lei Geral de Proteção de Dados)
        </h3>

        <div className="space-y-2 text-slate-300 leading-relaxed">
          <p>
            Seus dados são armazenados com isolamento estrito de conta (RBAC). Seus cliques e parâmetros de afiliação pertencem exclusivamente a você.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleDownloadMyData}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 hover:bg-slate-700 font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exportar Meus Dados em JSON</span>
          </button>

          <button
            onClick={() => alert('Para revogar consentimentos ou solicitar exclusão definitiva da conta conforme Art. 18 da LGPD, entre em contato via canal de suporte.')}
            className="flex items-center gap-1.5 rounded-lg border border-rose-800/40 bg-rose-950/20 px-3 py-2 text-rose-300 hover:bg-rose-950/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Solicitar Exclusão de Dados (LGPD)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
