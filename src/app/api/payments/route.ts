import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = status ? { status: status.toUpperCase() as 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' } : {};

    const payments = await prisma.payment.findMany({
      where,
      include: {
        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Calculate statistics
    const stats = await prisma.payment.groupBy({
      by: ['status'],
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      payments,
      stats,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
