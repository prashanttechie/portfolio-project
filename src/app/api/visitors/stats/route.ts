import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total visitors
    const totalVisitors = await prisma.visitor.count();

    // Get visitors in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const visitorsLast24h = await prisma.visitor.count({
      where: {
        visitedAt: {
          gte: yesterday,
        },
      },
    });

    // Get visitors by page
    const visitorsByPage = await prisma.visitor.groupBy({
      by: ['page'],
      _count: {
        page: true,
      },
      orderBy: {
        _count: {
          page: 'desc',
        },
      },
      take: 10,
    });

    // Get visitors by device
    const visitorsByDevice = await prisma.visitor.groupBy({
      by: ['device'],
      _count: {
        device: true,
      },
    });

    // Get visitors by browser
    const visitorsByBrowser = await prisma.visitor.groupBy({
      by: ['browser'],
      _count: {
        browser: true,
      },
      orderBy: {
        _count: {
          browser: 'desc',
        },
      },
    });

    // Get visitors by OS
    const visitorsByOS = await prisma.visitor.groupBy({
      by: ['os'],
      _count: {
        os: true,
      },
      orderBy: {
        _count: {
          os: 'desc',
        },
      },
    });

    // Get visitors by Country
    const visitorsByCountry = await prisma.visitor.groupBy({
      by: ['country'],
      _count: {
        country: true,
      },
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 10,
    });

    // Get recent visitors
    const recentVisitors = await prisma.visitor.findMany({
      take: 20,
      orderBy: { visitedAt: 'desc' },
      select: {
        id: true,
        page: true,
        device: true,
        browser: true,
        os: true,
        country: true,
        city: true,
        referrer: true,
        visitedAt: true,
      },
    });

    return NextResponse.json({
      totalVisitors,
      visitorsLast24h,
      visitorsByPage: visitorsByPage.map(v => ({ page: v.page, count: v._count.page })),
      visitorsByDevice: visitorsByDevice.map(v => ({ device: v.device, count: v._count.device })),
      visitorsByBrowser: visitorsByBrowser.map(v => ({ browser: v.browser, count: v._count.browser })),
      visitorsByOS: visitorsByOS.map(v => ({ os: v.os, count: v._count.os })),
      visitorsByCountry: visitorsByCountry.map(v => ({ country: v.country || 'Unknown', count: v._count.country })),
      recentVisitors,
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor stats' }, { status: 500 });
  }
}

