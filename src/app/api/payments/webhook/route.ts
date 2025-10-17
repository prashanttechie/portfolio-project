import { NextRequest, NextResponse } from 'next/server';
import { formatAmountFromRazorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentSuccess(event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailure(event.payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefund(event.payload.refund.entity);
        break;

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(payment: {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  method: string;
  notes: Record<string, string>;
}) {
  const enrollmentId = parseInt(payment.notes.enrollmentId);

  // Update enrollment status
  await prisma.courseEnrollment.update({
    where: { id: enrollmentId },
    data: { paymentStatus: 'COMPLETED' },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      enrollmentId,
      stripePaymentId: payment.id,
      stripeCustomerId: payment.order_id,
      amount: formatAmountFromRazorpay(payment.amount),
      currency: payment.currency,
      status: 'COMPLETED',
      paymentMethod: payment.method,
      receiptUrl: null, // Razorpay doesn't provide receipt URL in webhook
      metadata: payment.notes,
    },
  });

  console.log(`Payment succeeded for enrollment ${enrollmentId}`);
}

async function handlePaymentFailure(payment: {
  id: string;
  order_id: string;
  notes: Record<string, string>;
}) {
  const enrollmentId = parseInt(payment.notes.enrollmentId);

  // Update enrollment status
  await prisma.courseEnrollment.update({
    where: { id: enrollmentId },
    data: { paymentStatus: 'FAILED' },
  });

  console.log(`Payment failed for enrollment ${enrollmentId}`);
}

async function handleRefund(refund: {
  id: string;
  payment_id: string;
  amount: number;
}) {
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentId: refund.payment_id },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'REFUNDED',
        refundId: refund.id,
        refundAmount: formatAmountFromRazorpay(refund.amount),
      },
    });

    await prisma.courseEnrollment.update({
      where: { id: payment.enrollmentId },
      data: { paymentStatus: 'REFUNDED' },
    });

    console.log(`Refund processed for payment ${payment.id}`);
  }
}
