// In-memory sync relay for Vercel Serverless deployments
// Allows devices on the internet (e.g. phone on 4G/different Wi-Fi or behind NAT)
// to exchange discovery, pairing requests, and presentation slide events in real time.

interface SyncEvent {
  id: number;
  data: any;
  timestamp: number;
}

// Global cache persisting across warm lambdas
declare global {
  var __presentlySyncEvents: SyncEvent[] | undefined;
  var __presentlyNextId: number | undefined;
}

if (!globalThis.__presentlySyncEvents) {
  globalThis.__presentlySyncEvents = [];
}
if (!globalThis.__presentlyNextId) {
  globalThis.__presentlyNextId = 1;
}

export default function handler(req: any, res: any) {
  // Enable permissive CORS so phone and laptop can communicate freely
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const events = globalThis.__presentlySyncEvents!;
  const now = Date.now();

  // Prune events older than 5 minutes
  if (events.length > 500) {
    globalThis.__presentlySyncEvents = events.filter((e) => now - e.timestamp < 300000);
  }

  const url = req.url || '';

  // 1. POST /api/sync/send
  if (req.method === 'POST' || url.includes('/send')) {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const eventId = globalThis.__presentlyNextId!++;
      events.push({
        id: eventId,
        data: body,
        timestamp: now,
      });

      return res.status(200).json({ ok: true, id: eventId });
    } catch (err: any) {
      return res.status(400).json({ error: 'Invalid JSON body', details: err?.message });
    }
  }

  // 2. GET /api/sync/poll?since=...
  if (req.method === 'GET' || url.includes('/poll')) {
    const query = req.query || {};
    const sinceParam = query.since ?? 0;
    const since = parseInt(String(sinceParam), 10) || 0;

    const newMessages = events.filter((e) => e.id > since);
    const latestId = events.length > 0 ? events[events.length - 1].id : 0;

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).json({
      messages: newMessages,
      latestId,
    });
  }

  return res.status(404).json({ error: 'Not found' });
}
