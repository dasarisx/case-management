import { NextRequest } from 'next/server';

const API_BASE =
  process.env.INTERNAL_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://api:3001';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(request, params.path);
}

async function proxy(request: NextRequest, pathSegments: string[]) {
  const url = new URL(request.url);
  const base = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
  const targetUrl = `${base}/${pathSegments.join('/')}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.arrayBuffer();
    init.body = body.byteLength ? Buffer.from(body) : undefined;
  }

  const res = await fetch(targetUrl, init);

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
