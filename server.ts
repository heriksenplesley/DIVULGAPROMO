import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes.js';
import { getDb, saveDb, ClickEvent } from './server/db.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API router
  app.use('/api', apiRouter);

  // Affiliate shortlink tracking redirector: /r/:code
  app.get('/r/:code', (req: Request, res: Response) => {
    const code = req.params.code;
    const db = getDb();
    const link = db.trackedLinks.find(l => l.code === code);

    if (!link) {
      return res.redirect('/?notfound=link');
    }

    // Register click event
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'direto';
    const isMobile = /mobile|iphone|android/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);

    const clickEvent: ClickEvent = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      linkCode: code,
      userId: link.userId,
      offerId: link.offerId,
      timestamp: new Date().toISOString(),
      userAgent,
      device: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      channel: req.query.utm_source as string || (referrer.includes('whatsapp') ? 'whatsapp' : referrer.includes('telegram') ? 'telegram' : 'web'),
      referrer: String(referrer),
      converted: Math.random() < 0.12, // realistic 12% conversion trial simulation
      commissionValue: Math.random() < 0.12 ? Number((15 + Math.random() * 30).toFixed(2)) : undefined,
    };

    link.totalClicks += 1;
    db.clickEvents.push(clickEvent);
    link.uniqueClicks = new Set(db.clickEvents.filter(c => c.linkCode === code).map(c => c.userAgent)).size;
    saveDb(db);

    // Redirect to the authorized target affiliate URL safely
    res.redirect(302, link.targetAffiliateUrl);
  });

  // Setup Vite in middleware mode for dev or serve dist in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DivulgaPromo Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
