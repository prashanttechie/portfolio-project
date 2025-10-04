import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('admin_session');

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // In production, validate the session token properly
  return NextResponse.json({ authenticated: true });
}

