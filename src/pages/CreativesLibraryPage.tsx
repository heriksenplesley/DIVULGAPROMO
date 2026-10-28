import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  FolderOpen,
  Palette,
  Download,
  Trash2,
  ExternalLink,
  PlusCircle,
  Tag,
  Check,
} from 'lucide-react';
import { CreativeArt } from '../types/index.js';

interface CreativesLibraryProps {
  setCurrentTab: (tab: string) => void;
}

export const CreativesLibraryPage: React.FC<CreativesLibraryProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [creatives, setCreatives] = useState<CreativeArt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreatives = async () => {
    try {
      const res = await fetch('/api/creatives', {
        headers: { 'x-user-id': user?.id || '' },
      });
      const data = await res.json();
      setCreatives(data.creatives || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatives();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta arte da biblioteca?')) return;
    try {
      await fetch(`/api/creatives/${id}`, { method: 'DELETE' });
      setCreatives(prev => prev.filter(c => c.id !== id));
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
            <h1 className="text-xl sm:text-2xl font-black text-white">Biblioteca de Conteúdo & Criativos</h1>
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
              {creatives.length} artes salvas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Histórico das suas artes promocionais geradas no Estúdio Visual, prontas para reutilizar ou baixar.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('art-studio')}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
        >
          <Palette className="h-4 w-4" />
          <span>Abrir Estúdio de Artes</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Carregando criativos...</div>
      ) : creatives.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-3 text-sm font-bold text-white">Nenhuma arte salva ainda</h3>
          <p className="mt-1 text-xs text-slate-400">Crie artes promocionais personalizadas no Estúdio de Artes.</p>
          <button
            onClick={() => setCurrentTab('art-studio')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Criar Minha Primeira Arte
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {creatives.map(art => (
            <div
              key={art.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg group hover:border-slate-700 transition-all"
            >
              <div className="relative h-56 bg-slate-950 flex items-center justify-center p-2">
                {art.previewDataUrl ? (
                  <img
                    src={art.previewDataUrl}
                    alt={art.title}
                    className="h-full w-full object-contain rounded-lg"
                  />
                ) : (
                  <img
                    src={art.productImageUrl}
                    alt={art.title}
                    className="h-full w-full object-cover rounded-lg"
                  />
                )}
                <span className="absolute top-3 left-3 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white border border-slate-700">
                  {art.format}
                </span>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <h3 className="font-bold text-white line-clamp-1">{art.title}</h3>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Preço Promo: R$ {art.promoPrice.toFixed(2)}</span>
                  <span>{new Date(art.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (art.previewDataUrl) {
                      const link = document.createElement('a');
                      link.download = `arte-${art.id}.png`;
                      link.href = art.previewDataUrl;
                      link.click();
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Baixar</span>
                </button>

                <button
                  onClick={() => handleDelete(art.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
