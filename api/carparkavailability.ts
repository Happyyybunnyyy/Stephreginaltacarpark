import type { IncomingMessage, ServerResponse } from 'http';

const LTA_DATAMALL_ENDPOINT = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

export interface LtaCarparkRecord {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // Space-delimited lat lng string e.g. "1.29375 103.85718"
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string; // C = Cars, H = Heavy vehicles, Y = Motorcycles
  Agency: 'HDB' | 'LTA' | 'URA' | string;
}

export interface LtaApiResponse {
  'odata.metadata'?: string;
  value: LtaCarparkRecord[];
}

/**
 * Serverless Carpark Availability Endpoint
 * Pulls live lots from LTA DataMall (HDB, LTA, URA)
 * Endpoint: /api/carparkavailability
 */
export default async function handler(
  req: IncomingMessage & { query?: Record<string, any>; url?: string },
  res: ServerResponse & {
    status?: (code: number) => any;
    json?: (body: any) => any;
    setHeader?: (name: string, value: string) => any;
  }
) {
  // CORS & Header handling
  const sendResponse = (statusCode: number, data: any) => {
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(statusCode).json(data);
    }
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
    res.end(JSON.stringify(data, null, 2));
  };

  // Preflight OPTIONS check
  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(204).end();
    }
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
    return res.end();
  }

  // 1. Check for LTA AccountKey in Environment Variables
  const ltaAccountKey =
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_API_KEY ||
    process.env.ACCOUNT_KEY ||
    (req.headers && (req.headers['accountkey'] as string));

  if (!ltaAccountKey || ltaAccountKey.trim().length === 0) {
    return sendResponse(401, {
      success: false,
      error: 'LTA_ACCOUNT_KEY is missing.',
      message:
        'Please define LTA_ACCOUNT_KEY in your environment secrets or .env file to pull live data from LTA DataMall.',
      endpoint: LTA_DATAMALL_ENDPOINT,
      documentation: 'https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html',
    });
  }

  // 2. Extract query parameters (such as $skip pagination)
  let skipValue = '';
  if (req.url && req.url.includes('?')) {
    const urlObj = new URL(req.url, 'http://localhost');
    const skipParam = urlObj.searchParams.get('$skip') || urlObj.searchParams.get('skip');
    if (skipParam) {
      skipValue = `?$skip=${encodeURIComponent(skipParam)}`;
    }
  } else if (req.query) {
    const skipParam = req.query['$skip'] || req.query['skip'];
    if (skipParam) {
      skipValue = `?$skip=${encodeURIComponent(skipParam)}`;
    }
  }

  const targetUrl = `${LTA_DATAMALL_ENDPOINT}${skipValue}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const ltaResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        AccountKey: ltaAccountKey.trim(),
        accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!ltaResponse.ok) {
      const errorText = await ltaResponse.text().catch(() => '');
      return sendResponse(ltaResponse.status, {
        success: false,
        error: `LTA DataMall responded with status: ${ltaResponse.status} ${ltaResponse.statusText}`,
        details: errorText || undefined,
        endpoint: targetUrl,
      });
    }

    const data: LtaApiResponse = await ltaResponse.json();

    return sendResponse(200, {
      success: true,
      timestamp: new Date().toISOString(),
      source: 'LTA DataMall (CarParkAvailabilityv2)',
      agencies: ['HDB', 'LTA', 'URA'],
      totalRecordsReturned: data.value?.length || 0,
      value: data.value || [],
      metadata: data['odata.metadata'],
    });
  } catch (error: any) {
    const isAbort = error.name === 'AbortError';
    return sendResponse(502, {
      success: false,
      error: isAbort ? 'Request to LTA DataMall timed out (10s limit).' : 'Failed to connect to LTA DataMall.',
      details: error?.message || String(error),
    });
  }
}
