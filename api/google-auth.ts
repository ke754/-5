import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Vercel Serverless Function: Google Authentication Verification
 * Endpoint: /api/google-auth
 */
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || '970804063138-q1kede8kkfemrvg0n9cgsno4kv8kt6mk.apps.googleusercontent.com';

  // GET: Returns OAuth public configuration & status
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      status: 'active',
      provider: 'Google Identity Services & OAuth 2.0',
      clientId: clientId ? `${clientId.slice(0, 15)}...${clientId.slice(-20)}` : null,
      isConfigured: Boolean(clientId),
      scopes: ['openid', 'email', 'profile'],
    }));
    return;
  }

  // POST: Verify Google ID token or exchange token
  if (req.method === 'POST') {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const rawBody = Buffer.concat(chunks).toString('utf-8');
      const body = JSON.parse(rawBody || '{}');
      const token = body.token || body.credential;

      if (!token) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Token is required' }));
        return;
      }

      // Verify token with Google's tokeninfo endpoint
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      if (!verifyRes.ok) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Invalid or expired Google token' }));
        return;
      }

      const payload = await verifyRes.json();
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
        },
      }));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || 'Verification failed' }));
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method Not Allowed' }));
}
