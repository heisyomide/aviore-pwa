import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function handleProxy(
  request: NextRequest, 
  { params }: { params: Promise<{ proxy: string[] }> } // 🌟 FIXED: match '[...proxy]' folder name exactly
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  // 1. Resolve the parameters promise cleanly
  const resolvedParams = await params;
  
  // 🌟 FIXED: Use 'proxy' here instead of 'path' to match the folder segment name
  if (!resolvedParams || !resolvedParams.proxy) {
    return NextResponse.json({ error: 'Missing proxy target segment configuration path' }, { status: 400 });
  }
  
  const endpointPath = resolvedParams.proxy.join('/');
  const searchParams = request.nextUrl.search; // keeps filters/pagination (?page=1 etc)
  
  const targetUrl = `${BACKEND_URL}/${endpointPath}${searchParams}`;

  try {
    // 2. Setup standard pipeline forwarding headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // 3. Extract method and payloads
    const method = request.method;
    let body: any = null;

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text();
    }

    // 4. Fire server-to-server call to NestJS
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend service rejected with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(`[PROXY FAILURE ENCOUNTERED ON ${endpointPath}]:`, error);
    return NextResponse.json({ error: 'Internal Gateway Timeout Connection' }, { status: 502 });
  }
}

export { handleProxy as GET, handleProxy as POST, handleProxy as PUT, handleProxy as PATCH, handleProxy as DELETE };