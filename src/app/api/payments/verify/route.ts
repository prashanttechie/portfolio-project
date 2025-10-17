import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      enrollmentId,
    } = await request.json();

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get enrollment details
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Update enrollment status
    await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: { paymentStatus: 'COMPLETED' },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        enrollmentId,
        stripePaymentId: razorpay_payment_id,
        stripeCustomerId: razorpay_order_id,
        amount: enrollment.course.price,
        currency: 'INR',
        status: 'COMPLETED',
        paymentMethod: 'razorpay',
        metadata: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
