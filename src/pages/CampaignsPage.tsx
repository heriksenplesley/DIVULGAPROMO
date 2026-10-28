import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  CalendarClock,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Send,
  Trash2,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { Campaign, Offer } from '../types/index.js';

interface CampaignsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    offerId: '',
    title: '',
    copyType: 'oferta_relampago',
    copyText: '',
    channels: ['whatsapp', 'telegram'] as ('whatsapp' | 'telegram' | 'instagram' | 'facebook' | 'web_store' | 'email')[],
    scheduledFor: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resC, resO] = await Promise.all([
        fetch('/api/campaigns', { headers: { 'x-user-id': user?.id || '' } }),
        fetch('/api/offers'),
      ]);
      const [dataC, dataO] = await Promise.all([resC.json(), resO.json()]);
      setCampaigns(dataC.campaigns || []);
      setOffers(dataO.offers || []);
      if (dataO.offers && dataO.offers.length > 0) {
        setForm(prev => ({
          ...prev,
          offerId: dataO.offers[0].id,
          title: `Disparo ${dataO.offers[0].title.substring(0, 30)}`,
          copyText: `🔥 OFERTA RELÂMPAGO!\n${dataO.offers[0].title}\nPor R$ ${dataO.offers[0].promoPrice.toFixed(2)}\nLink: https://divulgapromo.com.br/r/${dataO.offers[0].shortCode}`,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishNow = async (id: string) => {
    try {
      await fetch(`/api/campaigns/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Agendador & Distribuidor de Campanhas</h1>
            <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
              Modo Seguro
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Programe disparos de ofertas em massa para canais e grupos autorizados de WhatsApp, Telegram e redes sociais.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Agendar Nova Campanha</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-bold text-white">Política de Automação Responsável & Antispam</p>
          <p className="text-slate-400">
            O DivulgaPromo opera com filas de tarefas idempotentes, pausas automáticas de frequência e integrações oficiais (WhatsApp Business Cloud API e Telegram Bot). Nenhuma automação invasiva é permitida.
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Carregando campanhas...</div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <CalendarClock className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-3 text-sm font-bold text-white">Nenhuma campanha agendada</h3>
            <p className="mt-1 text-xs text-slate-400">Programe disparos para seus grupos VIP de ofertas.</p>
          </div>
        ) : (
          campaigns.map(camp => (
            <div
              key={camp.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                      camp.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : camp.status === 'scheduled'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {camp.status === 'published' ? 'Concluída / Publicada' : camp.status === 'scheduled' ? 'Agendada' : 'Rascunho'}
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(camp.scheduledFor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{camp.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 font-mono whitespace-pre-wrap">
                  {camp.copyText}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-purple-400 font-semibold">
                    <Radio className="h-3.5 w-3.5" />
                    Destinos: {camp.channels.join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {camp.status !== 'published' && (
                  <button
                    onClick={() => handlePublishNow(camp.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Disparar Agora</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for New Campaign */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Programar Nova Campanha</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Título Interno</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Oferta Associada</label>
                <select
                  value={form.offerId}
                  onChange={e => {
                    const o = offers.find(off => off.id === e.target.value);
                    setForm({
                      ...form,
                      offerId: e.target.value,
                      title: o ? `Disparo ${o.title.substring(0, 30)}` : form.title,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none"
                >
                  {offers.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.title.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Texto da Mensagem</label>
                <textarea
                  rows={4}
                  required
                  value={form.copyText}
                  onChange={e => setForm({ ...form, copyText: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Data e Horário do Disparo</label>
                <input
                  type="datetime-local"
                  required
                  value={form.scheduledFor}
                  onChange={e => setForm({ ...form, scheduledFor: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-1.5 font-bold text-white hover:bg-blue-500"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
