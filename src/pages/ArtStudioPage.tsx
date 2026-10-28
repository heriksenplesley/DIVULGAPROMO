import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Palette,
  Download,
  Save,
  Sparkles,
  Sliders,
  Type,
  QrCode,
  Image as ImageIcon,
  Check,
  Tag,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { Offer } from '../types/index.js';

interface ArtStudioProps {
  initialOffer?: Offer | null;
  setCurrentTab: (tab: string) => void;
}

export const ArtStudioPage: React.FC<ArtStudioProps> = ({ initialOffer, setCurrentTab }) => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');

  const [format, setFormat] = useState<'1:1' | '9:16' | '4:5' | 'banner'>('1:1');
  const [template, setTemplate] = useState('tech_neon');
  const [headline, setHeadline] = useState('SUPER DESCONTO EXCLUSIVO');
  const [badgeText, setBadgeText] = useState('MENOR PREÇO DO ANO');
  const [primaryColor, setPrimaryColor] = useState('#0B1E36');
  const [accentColor, setAccentColor] = useState('#2563EB');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [originalPrice, setOriginalPrice] = useState('499.00');
  const [promoPrice, setPromoPrice] = useState('289.90');
  const [coupon, setCoupon] = useState('SOUNDCORE10');
  const [shortCode, setShortCode] = useState('anker-q30');
  const [showQrCode, setShowQrCode] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        if (data.offers && data.offers.length > 0) {
          setOffers(data.offers);
          const current = initialOffer || data.offers[0];
          setSelectedOfferId(current.id);
          applyOfferToCanvas(current);
        }
      });
  }, [initialOffer]);

  const applyOfferToCanvas = (o: Offer) => {
    setProductImageUrl(o.imageUrl);
    setOriginalPrice(o.originalPrice.toFixed(2));
    setPromoPrice(o.promoPrice.toFixed(2));
    setCoupon(o.couponCode || '');
    setShortCode(o.shortCode);
    setHeadline(o.title.substring(0, 36).toUpperCase());
    setBadgeText(`${o.discountPercent}% DE DESCONTO REAL`);
  };

  const handleOfferChange = (id: string) => {
    setSelectedOfferId(id);
    const found = offers.find(o => o.id === id);
    if (found) applyOfferToCanvas(found);
  };

  // Canvas dimension according to selected format
  const getCanvasDimensions = () => {
    switch (format) {
      case '9:16':
        return { width: 1080, height: 1920, aspect: 'aspect-[9/16]' };
      case '4:5':
        return { width: 1080, height: 1350, aspect: 'aspect-[4/5]' };
      case 'banner':
        return { width: 1200, height: 630, aspect: 'aspect-[12/6.3]' };
      case '1:1':
      default:
        return { width: 1080, height: 1080, aspect: 'aspect-square' };
    }
  };

  // Draw high-resolution canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, primaryColor);
    bgGrad.addColorStop(1, '#050B14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Tech grid or particles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Header Brand Tag
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('⚡ DIVULGAPROMO OFERTAS', 60, 90);

    // 3. Discount Badge Ribbon
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(width - 420, 60, 360, 60, 16);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'black 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, width - 240, 102);
    ctx.textAlign = 'left';

    // 4. Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px sans-serif';
    ctx.fillText(headline, 60, 180);

    // 5. Product Image Card Container
    const imgY = 220;
    const imgH = format === '9:16' ? 900 : format === '4:5' ? 620 : 520;
    const imgW = width - 120;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(60, imgY, imgW, imgH, 28);
    ctx.fill();
    ctx.stroke();

    // Load and draw product image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = productImageUrl;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(70, imgY + 10, imgW - 20, imgH - 20, 20);
      ctx.clip();
      ctx.drawImage(img, 70, imgY + 10, imgW - 20, imgH - 20);
      ctx.restore();

      // Price Tag Box in overlay
      const priceBoxY = imgY + imgH + 40;
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(60, priceBoxY, imgW - (showQrCode ? 260 : 0), 160, 24);
      ctx.fill();
      ctx.stroke();

      // Original price
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(`De: R$ ${originalPrice}`, 90, priceBoxY + 55);

      // Promo Price
      ctx.fillStyle = '#10B981';
      ctx.font = '900 56px sans-serif';
      ctx.fillText(`POR: R$ ${promoPrice}`, 90, priceBoxY + 125);

      // Cupom badge if available
      if (coupon) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(imgW - 320, priceBoxY + 30, 240, 50, 12);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`CUPOM: ${coupon}`, imgW - 200, priceBoxY + 63);
        ctx.textAlign = 'left';
      }

      // QR Code Box if enabled
      if (showQrCode) {
        const qrX = width - 280;
        const qrY = priceBoxY;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(qrX, qrY, 220, 160, 20);
        ctx.fill();

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ESCANEIE AQUI', qrX + 110, qrY + 35);
        ctx.font = '14px monospace';
        ctx.fillText(`/r/${shortCode}`, qrX + 110, qrY + 140);

        // Simple vector QR simulation on canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(qrX + 30, qrY + 50, 20, 20);
        ctx.fillRect(qrX + 170, qrY + 50, 20, 20);
        ctx.fillRect(qrX + 30, qrY + 95, 20, 20);
        ctx.fillRect(qrX + 80, qrY + 70, 60, 25);
        ctx.fillRect(qrX + 150, qrY + 90, 25, 25);
        ctx.textAlign = 'left';
      }

      // Footer disclaimer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '18px sans-serif';
      ctx.fillText('Oferta verificada • Preço sujeito a alteração sem aviso prévio', 60, height - 35);
    };
  }, [format, primaryColor, accentColor, headline, badgeText, productImageUrl, originalPrice, promoPrice, coupon, shortCode, showQrCode]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `arte-promocional-${shortCode}-${format}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveToLibrary = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    try {
      const dataUrl = canvas.toDataURL('image/png', 0.85);
      await fetch('/api/creatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'usr_affiliate_demo',
        },
        body: JSON.stringify({
          title: headline,
          format,
          templateId: template,
          headline,
          promoBadge: badgeText,
          primaryColor,
          accentColor,
          productImageUrl,
          originalPrice: Number(originalPrice),
          promoPrice: Number(promoPrice),
          couponCode: coupon,
          previewDataUrl: dataUrl,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Estúdio de Artes Promocionais com IA</h1>
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
              Exportação HD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gere banners e artes profissionais para Instagram, Stories, WhatsApp e Status com badges reais e QR Code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToLibrary}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {savedSuccess ? <Check className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
            <span>{savedSuccess ? 'Salvo na Biblioteca!' : 'Salvar na Biblioteca'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Baixar PNG HD</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Format Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <label className="text-xs font-bold text-slate-200">Formato da Arte</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormat('1:1')}
                className={`rounded-lg p-2 text-xs font-semibold text-center border transition-all ${
                  format === '1:1'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                Feed 1:1
              </button>
              <button
                onClick={() => setFormat('9:16')}
                className={`rounded-lg p-2 text-xs font-semibold text-center border transition-all ${
                  format === '9:16'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                Stories 9:16
              </button>
              <button
                onClick={() => setFormat('4:5')}
                className={`rounded-lg p-2 text-xs font-semibold text-center border transition-all ${
                  format === '4:5'
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                Insta 4:5
              </button>
            </div>
          </div>

          {/* Product and Headlines */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-200 mb-1">Oferta Base</label>
              <select
                value={selectedOfferId}
                onChange={e => handleOfferChange(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.title.substring(0, 45)}... (R$ {o.promoPrice.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Título em Destaque (Headline)</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Badge de Desconto (Faixa Superior)</label>
              <input
                type="text"
                value={badgeText}
                onChange={e => setBadgeText(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1">Preço Original (R$)</label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-200 mb-1">Preço Promo (R$)</label>
                <input
                  type="text"
                  value={promoPrice}
                  onChange={e => setPromoPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1">Cupom de Desconto</label>
              <input
                type="text"
                value={coupon}
                onChange={e => setCoupon(e.target.value.toUpperCase())}
                placeholder="Ex: SOUNDCORE10"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Color Palette & Elements */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3 text-xs">
            <label className="block font-bold text-slate-200">Identidade Visual & Cores</label>
            <div className="flex items-center gap-4">
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Cor Primária</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="h-8 w-12 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Cor de Destaque</span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  className="h-8 w-12 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
              </div>
              <div className="pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showQrCode}
                    onChange={e => setShowQrCode(e.target.checked)}
                    className="rounded border-slate-700 text-blue-600"
                  />
                  <span>Incluir QR Code</span>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Preview Canvas Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 p-6 min-h-[500px]">
          <div className="text-center mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pré-Visualização em Tempo Real ({format})
            </span>
          </div>

          {/* Dynamic Canvas Container */}
          <div className="max-w-[420px] w-full shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60 bg-black">
            <canvas ref={canvasRef} className="w-full h-auto object-contain block" />
          </div>

          <p className="mt-4 text-[11px] text-slate-400 text-center max-w-sm">
            Arte renderizada em alta definição pronta para postagem direta no WhatsApp, Instagram Stories e Telegram.
          </p>
        </div>

      </div>

    </div>
  );
};
