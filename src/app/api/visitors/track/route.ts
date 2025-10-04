import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

async function getLocationFromIP(ip: string) {
  try {
    // Use ipapi.co free API (up to 1000 requests/day)
    // For production, consider using a paid service or caching results
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'Portfolio-Website',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || null,
        city: data.city || null,
      };
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }
  
  return { country: null, city: null };
}

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json();
    
    if (!page) {
      return NextResponse.json({ error: 'Page is required' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    let ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    
    // Clean up IP address (in case of multiple IPs in x-forwarded-for)
    if (ipAddress.includes(',')) {
      ipAddress = ipAddress.split(',')[0].trim();
    }

    // Parse user agent for device, browser, and OS info
    const device = userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';
    let browser = 'Unknown';
    let os = 'Unknown';

    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    // Get location from IP (only if we have a valid IP)
    let country = null;
    let city = null;
    
    if (ipAddress && ipAddress !== '::1' && ipAddress !== '127.0.0.1' && !ipAddress.startsWith('192.168.')) {
      const location = await getLocationFromIP(ipAddress);
      country = location.country;
      city = location.city;
    }

    await prisma.visitor.create({
      data: {
        page,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
        device,
        browser,
        os,
        country,
        city,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 });
  }
}

