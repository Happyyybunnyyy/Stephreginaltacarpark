import type { IncomingMessage, ServerResponse } from 'http';

interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  environment: {
    ltaKeyConfigured: boolean;
    nodeEnv: string;
  };
  service: string;
  endpoints: {
    health: string;
    carparkAvailability: string;
  };
}

/**
 * Serverless Health Endpoint
 * Accessible at: /api/health
 */
export default async function handler(
  req: IncomingMessage & { query?: Record<string, any>; body?: any },
  res: ServerResponse & {
    status?: (code: number) => any;
    json?: (body: any) => any;
    setHeader?: (name: string, value: string) => any;
  }
) {
  const ltaKey = process.env.LTA_ACCOUNT_KEY || process.env.LTA_API_KEY || process.env.ACCOUNT_KEY;
  const isKeyConfigured = Boolean(ltaKey && ltaKey.trim().length > 0);

  const payload: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: {
      ltaKeyConfigured: isKeyConfigured,
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    service: 'Singapore Carpark Live API',
    endpoints: {
      health: '/api/health',
      carparkAvailability: '/api/carparkavailability',
    },
  };

  // Helper to handle both standard Node ServerResponse and Express/Vercel response wrappers
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(payload);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.end(JSON.stringify(payload, null, 2));
}
