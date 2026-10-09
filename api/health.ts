import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Vercel Serverless Function: Health Check & System Info
 * Endpoint: /api/health
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  const responsePayload = {
    status: 'healthy',
    platform: 'Vercel Serverless (Node.js)',
    nodeVersion: process.version,
    institute: 'معهد الشيخ محمد صديق المنشاوي الإعدادي الثانوي بنين بالأزهر الشريف',
    storageEngine: 'GitHub REST API (ke754/-5)',
    timestamp: new Date().toISOString(),
  };

  res.end(JSON.stringify(responsePayload, null, 2));
}
