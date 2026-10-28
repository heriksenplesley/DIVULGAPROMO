import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { X, Search, Sparkles, Check, AlertCircle, ShoppingBag, Link as LinkIcon, DollarSign } from 'lucide-react';

interface NewOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOfferCreated: () => void;
}

export const NewOfferModal: React.FC<NewOfferModalProps> = ({ isOpen, onClose, onOfferCreated }) => {
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [inspecting, setInspecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Eletrônicos',
    marketplace: 'amazon',
    originalPrice: '',
    promoPrice: '',
    couponCode: '',
    couponDiscount: '',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    originalUrl: '',
    affiliateUrl: '',
    freeShipping: true,
    rating: '4.8',
    reviewsCount: '250',
    featuredInStorefront: true,
  });

  if (!isOpen) return null;

  const handleInspectUrl = async () => {
    if (!urlInput.trim()) return;
    setInspecting(true);
    setError(null);
    try {
      const res = await fetch('/api/offers/inspect-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao inspecionar link');

      const insp = data.inspection;
      setFormData(prev => ({
        ...prev,
        title: insp.title || prev.title,
        marketplace: insp.marketplace || prev.marketplace,
        category: insp.category || prev.category,
        originalPrice: String(insp.originalPrice || ''),
        promoPrice: String(insp.promoPrice || ''),
        imageUrl: insp.imageUrl || prev.imageUrl,
        originalUrl: urlInput,
        affiliateUrl: urlInput, // will get tagged
        freeShipping: insp.freeShipping,
        rating: String(insp.rating || '4.8'),
        reviewsCount: String(insp.reviewsCount || '150'),
      }));
    } catch (err: any) {
      setError(err.message || 'Falha ao processar link.');
    } finally {
      setInspecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.promoPrice) {
      setError('Por favor preencha ao menos o título e o preço promocional.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao cadastrar oferta');

      onOfferCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar oferta');
    } finally {
      setSubmitting(false);
    }
  };

  const discount =
    Number(formData.originalPrice) > Number(formData.promoPrice) && Number(formData.originalPrice) > 0
      ? Math.round(
          ((Number(formData.originalPrice) - Number(formData.promoPrice)) / Number(formData.originalPrice)) * 100
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cadastrar Nova Oferta</h3>
              <p className="text-[11px] text-slate-400">Insira manualmente ou auto-importe colando o link do produto</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-950/50 border border-rose-800 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick inspect URL bar */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5 space-y-2">
            <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Auto-Preencher por Link de Produto (Shopee, Amazon, ML, etc.)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Cole o link do produto aqui (ex: https://shopee.com.br/produto...)"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleInspectUrl}
                disabled={inspecting || !urlInput.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {inspecting ? 'Buscando...' : 'Preencher'}
              </button>
            </div>
          </div>

          <form id="new-offer-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block font-medium text-slate-300 mb-1">Título da Oferta *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Fone Sem Fio Bluetooth com Cancelamento de Ruído"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Marketplace & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Marketplace Parceiro</label>
                <select
                  value={formData.marketplace}
                  onChange={e => setFormData({ ...formData, marketplace: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="amazon">Amazon Brasil</option>
                  <option value="shopee">Shopee</option>
                  <option value="mercadolivre">Mercado Livre</option>
                  <option value="aliexpress">AliExpress</option>
                  <option value="magalu">Magazine Luiza</option>
                  <option value="hotmart">Hotmart</option>
                  <option value="outros">Outro Marketplace</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Categoria de Nicho</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Celulares e acessórios">Celulares e acessórios</option>
                  <option value="Informática">Informática</option>
                  <option value="Casa e decoração">Casa e decoração</option>
                  <option value="Eletrodomésticos">Eletrodomésticos</option>
                  <option value="Moda e beleza">Moda e beleza</option>
                  <option value="Esporte e lazer">Esporte e lazer</option>
                  <option value="Ferramentas">Ferramentas</option>
                  <option value="Produtos para pets">Produtos para pets</option>
                  <option value="Cursos e produtos digitais">Cursos e produtos digitais</option>
                </select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Preço Original (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="Ex: 499.00"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Preço Promocional (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.promoPrice}
                  onChange={e => setFormData({ ...formData, promoPrice: e.target.value })}
                  placeholder="Ex: 289.90"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Desconto Calculado</label>
                <div className="flex h-[38px] items-center rounded-lg border border-slate-800 bg-slate-900/60 px-3 font-bold text-emerald-400">
                  {discount > 0 ? `${discount}% OFF` : 'Sem desconto'}
                </div>
              </div>
            </div>

            {/* Coupons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Código do Cupom (opcional)</label>
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={e => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                  placeholder="Ex: PROMO10, TECH25"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Valor/Regra do Cupom</label>
                <input
                  type="text"
                  value={formData.couponDiscount}
                  onChange={e => setFormData({ ...formData, couponDiscount: e.target.value })}
                  placeholder="Ex: 10% OFF extra, R$ 20 no Pix"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Image URL & Description */}
            <div>
              <label className="block font-medium text-slate-300 mb-1">URL da Imagem Autorizada do Produto</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Descrição / Benefícios Reais</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Destaque características verificadas sem inventar dados (ex: bateria de 40h, cancelamento de ruído)..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.freeShipping}
                  onChange={e => setFormData({ ...formData, freeShipping: e.target.checked })}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Frete Grátis Disponível</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.featuredInStorefront}
                  onChange={e => setFormData({ ...formData, featuredInStorefront: e.target.checked })}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Destacar na Minha Vitrine Pública</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-5 py-3">
          <span className="text-[11px] text-slate-400">
            Link curto rastreável será gerado automaticamente.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="new-offer-form"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Salvar Oferta'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
