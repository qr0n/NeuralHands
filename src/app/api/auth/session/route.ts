import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ authenticated: false });
    }
    
    const result = validateSession(sessionId);
    
    if (!result.valid) {
      // Clear invalid session cookie
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete('session');
      return response;
    }
    
    return NextResponse.json({
      authenticated: true,
      user: result.user
    });
  } catch (error) {
    console.error('Session validation API error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
