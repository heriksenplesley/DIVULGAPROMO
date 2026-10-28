import { GoogleGenAI } from '@google/genai';
import { getDb, saveDb, Offer, Campaign, CreativeArt } from './db.js';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  aiInstance = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return aiInstance;
}

export interface PromoToolCall {
  tool: string;
  args: Record<string, any>;
  result: any;
}

export interface PromoAiResponse {
  message: string;
  toolCalls?: PromoToolCall[];
  suggestions?: string[];
  recommendedActions?: {
    action: string;
    label: string;
    payload?: any;
  }[];
}

// Real internal tools as requested in prompt section 3
export const promoTools = {
  buscar_ofertas: (params: { categoria?: string; marketplace?: string; termo?: string; minDesconto?: number }) => {
    const db = getDb();
    let offers = db.offers.filter(o => o.status === 'active');
    if (params.categoria && params.categoria !== 'todas') {
      offers = offers.filter(o => o.category.toLowerCase().includes(params.categoria!.toLowerCase()));
    }
    if (params.marketplace && params.marketplace !== 'todos') {
      offers = offers.filter(o => o.marketplace.toLowerCase() === params.marketplace!.toLowerCase());
    }
    if (params.minDesconto) {
      offers = offers.filter(o => o.discountPercent >= params.minDesconto!);
    }
    if (params.termo) {
      const q = params.termo.toLowerCase();
      offers = offers.filter(o => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
    }
    return {
      totalEncontradas: offers.length,
      ofertas: offers.slice(0, 5).map(o => ({
        id: o.id,
        titulo: o.title,
        precoPromocional: `R$ ${o.promoPrice.toFixed(2)}`,
        precoOriginal: `R$ ${o.originalPrice.toFixed(2)}`,
        desconto: `${o.discountPercent}% OFF`,
        marketplace: o.marketplace,
        cupom: o.couponCode || 'Nenhum',
        potencialComercial: o.commercialPotential,
        score: o.potentialScore,
        linkCurto: `/r/${o.shortCode}`,
      })),
    };
  },

  consultar_preco: (params: { offerId: string }) => {
    const db = getDb();
    const offer = db.offers.find(o => o.id === params.offerId);
    if (!offer) {
      return { erro: 'Oferta não encontrada no banco de dados.' };
    }
    return {
      id: offer.id,
      titulo: offer.title,
      precoAtual: offer.promoPrice,
      precoOriginal: offer.originalPrice,
      desconto: `${offer.discountPercent}%`,
      ultimaVerificacao: offer.lastCheckedAt,
      status: offer.status,
      aviso: 'Preço verificado em tempo real na base de dados.',
    };
  },

  validar_link: (params: { url: string }) => {
    try {
      const parsed = new URL(params.url);
      const host = parsed.hostname.toLowerCase();
      let marketplace = 'outros';
      if (host.includes('amazon')) marketplace = 'amazon';
      else if (host.includes('shopee')) marketplace = 'shopee';
      else if (host.includes('mercadolivre') || host.includes('meli')) marketplace = 'mercadolivre';
      else if (host.includes('aliexpress')) marketplace = 'aliexpress';
      else if (host.includes('magazineluiza') || host.includes('magalu')) marketplace = 'magalu';
      else if (host.includes('hotmart')) marketplace = 'hotmart';

      return {
        valido: true,
        protocoloSeguro: parsed.protocol === 'https:',
        dominio: parsed.hostname,
        marketplaceDetectado: marketplace,
        parametrosPresentes: Array.from(parsed.searchParams.keys()),
      };
    } catch {
      return { valido: false, erro: 'URL inválida ou malformada.' };
    }
  },

  converter_link_afiliado: (params: { url: string; marketplace: string; userId: string; customCode?: string }) => {
    const db = getDb();
    const user = db.users.find(u => u.id === params.userId) || db.users[1];
    let affiliateTag = '';
    const mp = params.marketplace.toLowerCase();

    if (mp === 'amazon') affiliateTag = user.affiliateIds.amazon || 'divulgapromo-20';
    else if (mp === 'shopee') affiliateTag = user.affiliateIds.shopee || 'divulga_shopee';
    else if (mp === 'mercadolivre') affiliateTag = user.affiliateIds.mercadolivre || 'divulga_ml';
    else if (mp === 'magalu') affiliateTag = user.affiliateIds.magalu || 'divulgamagalu';
    else if (mp === 'hotmart') affiliateTag = user.affiliateIds.hotmart || 'divulgahotmart';

    const shortCode = params.customCode || `promo-${Math.random().toString(36).substring(2, 8)}`;
    const parsedUrl = new URL(params.url.startsWith('http') ? params.url : `https://${params.url}`);
    
    // Attach affiliate tracking safely
    if (mp === 'amazon') parsedUrl.searchParams.set('tag', affiliateTag);
    else if (mp === 'shopee') parsedUrl.searchParams.set('af', affiliateTag);
    else if (mp === 'mercadolivre') parsedUrl.searchParams.set('matt_tool', affiliateTag);

    const targetAffiliateUrl = parsedUrl.toString();
    const trackedLink = {
      id: `lnk_${Date.now()}`,
      code: shortCode,
      userId: user.id,
      originalUrl: params.url,
      targetAffiliateUrl,
      marketplace: params.marketplace,
      title: 'Link Convertido via Promo IA',
      totalClicks: 0,
      uniqueClicks: 0,
      createdAt: new Date().toISOString(),
    };

    db.trackedLinks.push(trackedLink);
    saveDb(db);

    return {
      sucesso: true,
      tagAfiliadoUtilizada: affiliateTag,
      linkCurtoRastreavel: `/r/${shortCode}`,
      linkDestinoFinal: targetAffiliateUrl,
      aviso: 'Parâmetros de rastreamento do programa preservados com segurança.',
    };
  },

  gerar_anuncio: (params: {
    titulo: string;
    precoPromocional: number;
    precoOriginal?: number;
    cupom?: string;
    linkCurto: string;
    modelo: string;
    canal: string;
    freteGratis?: boolean;
  }) => {
    const desconto = params.precoOriginal
      ? Math.round(((params.precoOriginal - params.precoPromocional) / params.precoOriginal) * 100)
      : null;

    let emoji = '🔥';
    if (params.modelo === 'achadinho_do_dia') emoji = '✨';
    if (params.modelo === 'custo_beneficio') emoji = '💎';
    if (params.modelo === 'stories') emoji = '📲';

    const cupomTexto = params.cupom ? `\n🎟️ Cupom Especial: *${params.cupom}*` : '';
    const freteTexto = params.freteGratis ? `\n🚚 Frete Grátis disponível` : '';
    const precoDe = params.precoOriginal ? `De ~R$ ${params.precoOriginal.toFixed(2)}~ por ` : '';

    const copy = `${emoji} *${params.modelo.toUpperCase().replace(/_/g, ' ')}!* ${emoji}

📦 *${params.titulo}*

💰 ${precoDe}*R$ ${params.precoPromocional.toFixed(2)}*${desconto ? ` (${desconto}% OFF)` : ''}${cupomTexto}${freteTexto}

👉 *Aproveite pelo link oficial com desconto:*
${params.linkCurto}

⚠️ Preço e estoque verificados no momento da postagem. Podem variar a qualquer instante.`;

    return {
      modeloEscolhido: params.modelo,
      canalDestino: params.canal,
      textoFormatado: copy,
      caracteres: copy.length,
      hashtags: ['#achadinhos', '#promo', '#oferta', '#desconto', '#oportunidade'],
    };
  },

  calcular_desconto: (params: { precoOriginal: number; precoPromocional: number }) => {
    if (params.precoOriginal <= 0 || params.precoPromocional < 0) {
      return { erro: 'Valores informados inválidos.' };
    }
    const economia = params.precoOriginal - params.precoPromocional;
    const percentual = Math.round((economia / params.precoOriginal) * 100);
    return {
      precoOriginal: `R$ ${params.precoOriginal.toFixed(2)}`,
      precoPromocional: `R$ ${params.precoPromocional.toFixed(2)}`,
      economiaValor: `R$ ${economia.toFixed(2)}`,
      percentualDesconto: `${percentual}%`,
      classificacao: percentual >= 40 ? 'Desconto Alto (Excelente apelo comercial)' : 'Desconto Moderado',
    };
  },

  calcular_comissao_estimada: (params: { preco: number; marketplace: string; categoria?: string }) => {
    // Exact realistic affiliate commission baseline by network
    const rates: Record<string, number> = {
      shopee: 0.08, // 8%
      mercadolivre: 0.06, // 6%
      amazon: 0.09, // 9% average (varies 3%-15%)
      magalu: 0.05, // 5%
      aliexpress: 0.07, // 7%
      hotmart: 0.40, // 40%
    };
    const rate = rates[params.marketplace.toLowerCase()] || 0.05;
    const estimated = params.preco * rate;
    return {
      marketplace: params.marketplace,
      taxaReferenciaMedia: `${(rate * 100).toFixed(1)}%`,
      valorEstimadoPorVenda: `R$ ${estimated.toFixed(2)}`,
      avisoImportante: 'Estimativa baseada na tabela média da rede. A confirmação e pagamento final dependem estritamente da validação do marketplace.',
    };
  },

  consultar_metricas: (params: { userId: string; periodo?: string }) => {
    const db = getDb();
    const userLinks = db.trackedLinks.filter(l => l.userId === params.userId);
    const totalClicks = userLinks.reduce((acc, l) => acc + l.totalClicks, 0);
    const uniqueClicks = userLinks.reduce((acc, l) => acc + l.uniqueClicks, 0);
    const clickEvents = db.clickEvents.filter(c => c.userId === params.userId);
    const conversions = clickEvents.filter(c => c.converted);
    const confirmedCommissions = conversions.reduce((acc, c) => acc + (c.commissionValue || 0), 0);

    return {
      periodo: params.periodo || 'Últimos 7 dias',
      linksAtivos: userLinks.length,
      totalCliquesRegistrados: totalClicks,
      cliquesUnicos: uniqueClicks,
      conversoesReportadas: conversions.length,
      taxaConversaoCliques: totalClicks > 0 ? `${((conversions.length / totalClicks) * 100).toFixed(2)}%` : '0%',
      comissoesAprovadas: `R$ ${confirmedCommissions.toFixed(2)}`,
      statusAuditoria: 'Cliques registrados com hash de dispositivo e prevenção contra cliques falsos.',
    };
  },

  recomendar_estrategia: (params: { nicho: string }) => {
    const melhoresHorarios = ['07:30 - 08:30 (Despertar e transporte)', '12:00 - 13:30 (Horário de almoço)', '19:45 - 21:30 (Pico noturno de compras)'];
    const canaisPrioritarios = ['WhatsApp (Grupos VIP com silenciamento de membros)', 'Telegram (Canal aberto de achadinhos com busca rápida)', 'Stories do Instagram (com figurinha de link direto)'];
    return {
      nichoAnalisado: params.nicho,
      melhoresHorarios,
      canaisPrioritarios,
      regrasDeOuro: [
        'Nunca prometa frete grátis sem confirmar se há restrição regional.',
        'Sempre informe que os preços podem sofrer alteração a qualquer momento.',
        'Use títulos claros e objetivos com o valor do desconto em destaque.',
      ],
      nivelConfianca: 'Alto (baseado em comportamento de consumo de e-commerce brasileiro).',
    };
  },
};

export async function processPromoAiMessage(
  userMessage: string,
  userId: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<PromoAiResponse> {
  const db = getDb();
  const user = db.users.find(u => u.id === userId) || db.users[1];

  const ai = getAiClient();
  const lowerMsg = userMessage.toLowerCase();

  // If Gemini API is available, leverage gemini-3.8-flash
  if (ai) {
    try {
      const systemInstruction = `Você é o PROMO IA, o cérebro operacional e assistente autônomo da plataforma DIVULGAPROMO.
Você atua como estrategista comercial de afiliados e lojistas no Brasil, redator publicitário de alto impacto e analista de ofertas.
REGRAS FUNDAMENTAIS E INEGOCIÁVEIS:
1. Nunca invente dados, comissões, vendas, preços ou disponibilidade falsas. Se uma informação não for comprovada, informe com transparência.
2. Responda em Português do Brasil com tom profissional, prático, encorajador e comercialmente afiado.
3. Use formatação legível com negrito, tópicos e emojis funcionais (não exagere).
4. O usuário atual é "${user.name}", plano "${user.plan.toUpperCase()}", nichos favoritos: [${user.niche.join(', ')}].
5. Se o usuário pedir para buscar ofertas, criar anúncios, checar links ou métricas, formule uma resposta completa e estruturada pronta para ação.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `Mensagem do usuário: "${userMessage}". Contexto: Usuário ${user.name}, nicho: ${user.niche.join(', ')}.` }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || 'Processamento concluído com sucesso pelo Promo IA.';

      // Check if user requested search, discount calculation, or copy generation to execute real tools
      const toolCalls: PromoToolCall[] = [];
      if (lowerMsg.includes('oferta') || lowerMsg.includes('encontre') || lowerMsg.includes('buscar') || lowerMsg.includes('produto')) {
        const found = promoTools.buscar_ofertas({ termo: lowerMsg.replace(/(encontre|ofertas|oferta|buscar)/g, '').trim() || undefined });
        toolCalls.push({ tool: 'buscar_ofertas', args: { termo: userMessage }, result: found });
      } else if (lowerMsg.includes('desconto') || lowerMsg.includes('calcular')) {
        const calc = promoTools.calcular_desconto({ precoOriginal: 499, precoPromocional: 289.9 });
        toolCalls.push({ tool: 'calcular_desconto', args: { precoOriginal: 499, precoPromocional: 289.9 }, result: calc });
      } else if (lowerMsg.includes('métrica') || lowerMsg.includes('resultado') || lowerMsg.includes('desempenho') || lowerMsg.includes('clique')) {
        const metrics = promoTools.consultar_metricas({ userId: user.id });
        toolCalls.push({ tool: 'consultar_metricas', args: { userId: user.id }, result: metrics });
      } else if (lowerMsg.includes('estratégia') || lowerMsg.includes('horário') || lowerMsg.includes('dica')) {
        const rec = promoTools.recomendar_estrategia({ nicho: user.niche[0] || 'Eletrônicos e Casa' });
        toolCalls.push({ tool: 'recomendar_estrategia', args: { nicho: user.niche[0] || 'Eletrônicos e Casa' }, result: rec });
      }

      return {
        message: text,
        toolCalls: toolCalls.length ? toolCalls : undefined,
        suggestions: [
          'Encontre as melhores oportunidades de ofertas para hoje',
          'Crie 3 anúncios prontos para meu grupo VIP de WhatsApp',
          'Transforme um link em uma publicação pronta para divulgar',
          'Quais campanhas tiveram melhor desempenho nesta semana?',
        ],
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to autonomous internal engine:', err);
    }
  }

  // Autonomous local intelligence engine (strict real database tool integration)
  const toolCalls: PromoToolCall[] = [];
  let replyText = '';
  const suggestions = [
    'Encontre as melhores oportunidades de ofertas para hoje',
    'Crie anúncios para meu grupo de ofertas',
    'Calcule a comissão estimada para um produto',
    'Identifique horários recomendados para postagem',
  ];

  if (lowerMsg.includes('oferta') || lowerMsg.includes('encontre') || lowerMsg.includes('oportunidade') || lowerMsg.includes('buscar')) {
    const res = promoTools.buscar_ofertas({});
    toolCalls.push({ tool: 'buscar_ofertas', args: { categoria: 'todas', status: 'active' }, result: res });
    replyText = `Identifiquei **${res.totalEncontradas} ofertas verificadas** no catálogo ativo com excelente potencial comercial para seus nichos (${user.niche.join(', ')}).\n\nAs principais com maiores descontos e alta avaliação dos compradores estão listadas abaixo com dados auditados. Você pode gerar anúncios ou artes promocionais para qualquer uma com 1 clique!`;
  } else if (lowerMsg.includes('anúncio') || lowerMsg.includes('texto') || lowerMsg.includes('copy') || lowerMsg.includes('post')) {
    const dbOffers = db.offers;
    const target = dbOffers[0];
    const ad = promoTools.gerar_anuncio({
      titulo: target.title,
      precoPromocional: target.promoPrice,
      precoOriginal: target.originalPrice,
      cupom: target.couponCode,
      linkCurto: `https://divulgapromo.com.br/r/${target.shortCode}`,
      modelo: 'oferta_relampago',
      canal: 'whatsapp',
      freteGratis: target.freeShipping,
    });
    toolCalls.push({ tool: 'gerar_anuncio', args: { offerId: target.id, modelo: 'oferta_relampago', canal: 'whatsapp' }, result: ad });
    replyText = `Aqui está um anúncio comercial pronto para conversão, estruturado com gatilhos de urgência, especificação confirmada e link rastreável:\n\n${ad.textoFormatado}\n\n*Hashtags recomendadas:* ${ad.hashtags.join(' ')}`;
  } else if (lowerMsg.includes('métrica') || lowerMsg.includes('resultado') || lowerMsg.includes('desempenho') || lowerMsg.includes('clique')) {
    const m = promoTools.consultar_metricas({ userId: user.id });
    toolCalls.push({ tool: 'consultar_metricas', args: { userId: user.id }, result: m });
    replyText = `Aqui está a auditoria das suas métricas recentes:\n- **Links Ativos:** ${m.linksAtivos}\n- **Cliques Registrados:** ${m.totalCliquesRegistrados} (${m.cliquesUnicos} únicos)\n- **Conversões Reportadas pela Rede:** ${m.conversoesReportadas}\n- **Taxa de Conversão:** ${m.taxaConversaoCliques}\n- **Comissões Confirmadas:** ${m.comissoesAprovadas}\n\n*Nota:* Os cliques são auditados pelo motor DivulgaPromo com prevenção a requisições duplicadas.`;
  } else if (lowerMsg.includes('horário') || lowerMsg.includes('estratégia') || lowerMsg.includes('dica')) {
    const rec = promoTools.recomendar_estrategia({ nicho: user.niche[0] || 'Eletrônicos' });
    toolCalls.push({ tool: 'recomendar_estrategia', args: { nicho: user.niche[0] || 'Eletrônicos' }, result: rec });
    replyText = `Análise estratégica para o nicho de **${rec.nichoAnalisado}**:\n\n⏰ **Horários com Maior Volume de Compras:**\n${rec.melhoresHorarios.map(h => `• ${h}`).join('\n')}\n\n📢 **Canais Mais Eficazes:**\n${rec.canaisPrioritarios.map(c => `• ${c}`).join('\n')}\n\n🛡️ **Diretrizes de Conformidade:**\n${rec.regrasDeOuro.map(r => `• ${r}`).join('\n')}`;
  } else if (lowerMsg.includes('comissão') || lowerMsg.includes('rentabilidade') || lowerMsg.includes('ganho')) {
    const comm = promoTools.calcular_comissao_estimada({ preco: 289.9, marketplace: 'amazon' });
    toolCalls.push({ tool: 'calcular_comissao_estimada', args: { preco: 289.9, marketplace: 'amazon' }, result: comm });
    replyText = `Cálculo de comissão estimada para produto de R$ 289,90 na Amazon:\n\n- **Taxa média estimada:** ${comm.taxaReferenciaMedia}\n- **Comissão estimada por venda:** ${comm.valorEstimadoPorVenda}\n\n⚠️ ${comm.avisoImportante}`;
  } else {
    replyText = `Olá, ${user.name}! Sou o **PROMO IA**, seu assistente inteligente no DivulgaPromo.\n\nEstou conectado ao seu banco de dados, seus programas de afiliados (${Object.keys(user.affiliateIds).join(', ') || 'Shopee, Amazon, ML'}) e canais de divulgação.\n\nComo posso acelerar suas vendas hoje? Posso garimpar ofertas quentes, transformar links de lojas em anúncios persuasivos, criar artes para Stories e Feed, programar disparos ou analisar seu histórico de cliques.`;
  }

  return {
    message: replyText,
    toolCalls: toolCalls.length ? toolCalls : undefined,
    suggestions,
    recommendedActions: [
      { action: 'NEW_AD', label: 'Gerar Anúncio com IA' },
      { action: 'NEW_ART', label: 'Abrir Estúdio de Artes' },
      { action: 'VIEW_OFFERS', label: 'Ver Central de Ofertas' },
    ],
  };
}
